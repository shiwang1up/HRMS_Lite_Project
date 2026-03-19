from fastapi import APIRouter, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from app.database import employee_collection
from app.models import EmployeeSchema, UpdateEmployeeModel, ResponseModel, ErrorResponseModel
from bson.objectid import ObjectId

router = APIRouter()

def employee_helper(employee) -> dict:
    return {
        "id": str(employee["_id"]),
        "employee_id": employee["employee_id"],
        "full_name": employee["full_name"],
        "email": employee["email"],
        "department": employee["department"],
        "designation": employee["designation"],
        "date_of_joining": employee["date_of_joining"],
    }

@router.post("/", response_description="Employee added into the database")
async def add_employee(employee: EmployeeSchema = Body(...)):
    employee = jsonable_encoder(employee)
    
    # Check for duplicate email
    if await employee_collection.find_one({"email": employee["email"]}):
        raise HTTPException(status_code=400, detail="Email already exists.")
    
    # Check for duplicate employee_id
    if await employee_collection.find_one({"employee_id": employee["employee_id"]}):
        raise HTTPException(status_code=400, detail="Employee ID already exists.")
        
    new_employee = await employee_collection.insert_one(employee)
    created_employee = await employee_collection.find_one({"_id": new_employee.inserted_id})
    return ResponseModel(employee_helper(created_employee), "Employee added successfully.")

@router.get("/", response_description="Employees retrieved")
async def get_employees(name: str = None, department: str = None):
    employees = []
    query = {}
    if name:
        query["full_name"] = {"$regex": name, "$options": "i"}
    if department:
        query["department"] = {"$regex": department, "$options": "i"}
        
    async for employee in employee_collection.find(query):
        employees.append(employee_helper(employee))
    return ResponseModel(employees, "Employees data retrieved successfully")

@router.put("/{id}", response_description="Update an employee data")
async def update_employee(id: str, req: UpdateEmployeeModel = Body(...)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format.")
    
    req = {k: v for k, v in req.dict().items() if v is not None}
    
    if "email" in req:
        existing = await employee_collection.find_one({"email": req["email"]})
        if existing and str(existing["_id"]) != id:
            raise HTTPException(status_code=400, detail="Email already exists.")

    if len(req) >= 1:
        update_result = await employee_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": req}
        )

        if update_result.modified_count == 1:
            if updated_employee := await employee_collection.find_one({"_id": ObjectId(id)}):
                return ResponseModel(employee_helper(updated_employee), "Employee updated successfully")
                
    if existing_employee := await employee_collection.find_one({"_id": ObjectId(id)}):
        return ResponseModel(employee_helper(existing_employee), "Employee updated successfully")
        
    raise HTTPException(status_code=404, detail="Employee not found")

@router.delete("/{id}", response_description="Employee data deleted from the database")
async def delete_employee(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format.")
        
    employee = await employee_collection.find_one({"_id": ObjectId(id)})
    if employee:
        await employee_collection.delete_one({"_id": ObjectId(id)})
        return ResponseModel("Employee with ID: {} removed".format(id), "Employee deleted successfully")
    raise HTTPException(status_code=404, detail="Employee not found")

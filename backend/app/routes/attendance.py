from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder
from app.database import attendance_collection, employee_collection
from app.models import AttendanceSchema, ResponseModel

router = APIRouter()

def attendance_helper(attendance) -> dict:
    return {
        "id": str(attendance["_id"]),
        "employee_id": attendance["employee_id"],
        "date": attendance["date"],
        "status": attendance["status"],
    }

@router.post("/", response_description="Attendance marked successfully")
async def mark_attendance(attendance: AttendanceSchema = Body(...)):
    req = jsonable_encoder(attendance)
    
    # Check if employee exists by employee_id natively
    employee = await employee_collection.find_one({"employee_id": req["employee_id"]})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found.")
        
    # Check if attendance exists for that day
    existing = await attendance_collection.find_one({"employee_id": req["employee_id"], "date": req["date"]})
    if existing:
        # Update the existing attendance
        await attendance_collection.update_one(
            {"_id": existing["_id"]}, {"$set": {"status": req["status"]}}
        )
        updated = await attendance_collection.find_one({"_id": existing["_id"]})
        return ResponseModel(attendance_helper(updated), "Attendance updated successfully")

    # Insert new record
    new_attendance = await attendance_collection.insert_one(req)
    created_attendance = await attendance_collection.find_one({"_id": new_attendance.inserted_id})
    return ResponseModel(attendance_helper(created_attendance), "Attendance marked successfully.")

@router.get("/{employee_id}", response_description="Attendance retrieved")
async def get_attendance(employee_id: str):
    # Check if employee exists
    employee = await employee_collection.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found.")
        
    attendance_records = []
    async for att in attendance_collection.find({"employee_id": employee_id}):
        attendance_records.append(attendance_helper(att))
        
    return ResponseModel(attendance_records, "Attendance records retrieved successfully")

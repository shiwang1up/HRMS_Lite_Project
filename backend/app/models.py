from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date
from enum import Enum

class DepartmentEnum(str, Enum):
    ENGINEERING = 'Engineering'
    HR = 'HR'
    MARKETING = 'Marketing'
    SALES = 'Sales'
    FINANCE = 'Finance'
    OTHER = 'Other'

class AttendanceStatus(str, Enum):
    PRESENT = 'Present'
    ABSENT = 'Absent'

class EmployeeSchema(BaseModel):
    employee_id: str = Field(...)
    full_name: str = Field(...)
    email: EmailStr = Field(...)
    department: str = Field(...)
    designation: str = Field(...)
    date_of_joining: str = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "employee_id": "EMP001",
                "full_name": "John Doe",
                "email": "johndoe@example.com",
                "department": "Engineering",
                "designation": "Software Engineer",
                "date_of_joining": "2024-01-15"
            }
        }

class UpdateEmployeeModel(BaseModel):
    full_name: Optional[str]
    email: Optional[EmailStr]
    department: Optional[str]
    designation: Optional[str]
    date_of_joining: Optional[str]

class AttendanceSchema(BaseModel):
    employee_id: str = Field(...)
    date: str = Field(...)
    status: AttendanceStatus = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "employee_id": "EMP001",
                "date": "2024-05-20",
                "status": "Present"
            }
        }

def ResponseModel(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }

def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}

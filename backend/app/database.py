from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_DETAILS = os.getenv("MONGO_URL", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client.hrms_lite

employee_collection = database.get_collection("employees")
attendance_collection = database.get_collection("attendance")

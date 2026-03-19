from motor.motor_asyncio import AsyncIOMotorClient
import os
import certifi

MONGO_DETAILS = os.getenv("MONGO_URL", "mongodb+srv://shiwang019_db_user:wgf0lbPmXBrr9XCr@cluster0.sganlkl.mongodb.net/?appName=Cluster0")

ca = certifi.where()
client = AsyncIOMotorClient(MONGO_DETAILS, tlsCAFile=ca)

database = client.hrms_lite

employee_collection = database.get_collection("employees")
attendance_collection = database.get_collection("attendance")

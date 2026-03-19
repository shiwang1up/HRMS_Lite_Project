from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.employee import router as EmployeeRouter
from app.routes.attendance import router as AttendanceRouter

app = FastAPI(title="HRMS Lite App")

# Disable CORS restrictions for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to HRMS Lite API."}

app.include_router(EmployeeRouter, tags=["Employee"], prefix="/employees")
app.include_router(AttendanceRouter, tags=["Attendance"], prefix="/attendance")

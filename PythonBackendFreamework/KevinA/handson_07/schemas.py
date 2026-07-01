from pydantic import BaseModel, EmailStr
from typing import Optional, List

# --- Course Schemas ---
class CourseBase(BaseModel):
    name: str
    code: str
    credits: int
    department_id: int

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = None
    department_id: Optional[int] = None

class CourseResponse(CourseBase):
    id: int
    class Config:
        from_attributes = True

# --- Student Schemas ---
class StudentBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    enrollment_year: int

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int
    class Config:
        from_attributes = True

# --- Enrollment Schemas ---
class EnrollmentCreate(BaseModel):
    student_id: int
    course_id: int
    grade: Optional[str] = None

class EnrollmentResponse(EnrollmentCreate):
    id: int
    class Config:
        from_attributes = True
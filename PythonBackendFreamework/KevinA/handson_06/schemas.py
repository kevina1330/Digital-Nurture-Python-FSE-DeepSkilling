from pydantic import BaseModel
from typing import Optional, List

class CourseBase(BaseModel):
    name: str
    code: str
    credits: int
    department_id: int

class CourseCreate(CourseBase):
    """Schema for validating data when creating a course."""
    pass

class CourseUpdate(BaseModel):
    """Schema for validating data when updating a course (all fields optional)."""
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = None
    department_id: Optional[int] = None

class CourseResponse(CourseBase):
    """Schema for structuring outgoing API responses (adds the DB auto-increment ID)."""
    id: int

    class Config:
        from_attributes = True  # Tells Pydantic to read data smoothly from database models

class DepartmentResponse(BaseModel):
    id: int
    name: str
    head_of_dept: str
    budget: float
    courses: List[CourseResponse] = []  # Demonstrates nesting Pydantic model configurations

    class Config:
        from_attributes = True
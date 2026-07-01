from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, ForeignKey, select
from typing import List, Optional
import schemas

# Database Engine Configuration Mapping
DATABASE_URL = "sqlite+aiosqlite:///./university_core.db"
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# --- Database Relational Declarative Models ---
class DBDepartment(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    head_of_dept = Column(String, nullable=False)
    budget = Column(Integer, nullable=False)
    courses = relationship("DBCourse", back_populates="department")

class DBCourse(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    credits = Column(Integer, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    
    department = relationship("DBDepartment", back_populates="courses")
    enrollments = relationship("DBEnrollment", back_populates="course")

class DBStudent(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    enrollment_year = Column(Integer, nullable=False)
    
    enrollments = relationship("DBEnrollment", back_populates="student")

class DBEnrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    grade = Column(String, nullable=True)
    
    student = relationship("DBStudent", back_populates="enrollments")
    course = relationship("DBCourse", back_populates="enrollments")

# Instantiate Customized OpenAPI Metadata App Interface (Task 2)
app = FastAPI(
    title="University Course Management Engine",
    description="Automated asynchronous API architecture engine built for handling university management workflows seamlessly.",
    version="2.0.0",
    contact={"name": "Core Dev Support Team", "email": "architecture-admin@college.edu"}
)

# Async DB Session Yield Dependency Injection Hook
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

def simulate_email_notification(student_email: str):
    """Simulation worker task executing concurrently after HTTP response output."""
    print(f"Sending confirmation to {student_email}")

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# ==============================================================================
# COURSE OPERATIONS PATHS (Task 1)
# ==============================================================================

@app.post("/api/courses/", response_model=schemas.CourseResponse, status_code=status.HTTP_201_CREATED, tags=["Courses"], summary="Create Course", response_description="The created course database object layout.")
async def create_course(course: schemas.CourseCreate, db: AsyncSession = Depends(get_db)):
    db_course = DBCourse(**course.model_dump())
    db.add(db_course)
    await db.commit()
    await db.refresh(db_course)
    return db_course

@app.get("/api/courses/", response_model=List[schemas.CourseResponse], tags=["Courses"])
async def list_courses(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DBCourse).offset(skip).limit(limit))
    return result.scalars().all()

@app.get("/api/courses/{id}", response_model=schemas.CourseResponse, tags=["Courses"])
async def get_course(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DBCourse).where(DBCourse.id == id))
    course = result.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.put("/api/courses/{id}", response_model=schemas.CourseResponse, tags=["Courses"])
async def update_course(id: int, payload: schemas.CourseUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DBCourse).where(DBCourse.id == id))
    course = result.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(course, key, value)
        
    await db.commit()
    await db.refresh(course)
    return course

@app.delete("/api/courses/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Courses"])
async def delete_course(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DBCourse).where(DBCourse.id == id))
    course = result.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    await db.delete(course)
    await db.commit()
    return None

@app.get("/api/courses/{id}/students/", response_model=List[schemas.StudentResponse], tags=["Courses"])
async def get_course_students(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DBCourse).where(DBCourse.id == id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Course not found")
        
    stmt = select(DBStudent).join(DBEnrollment).where(DBEnrollment.course_id == id)
    students = await db.execute(stmt)
    return students.scalars().all()

# ==============================================================================
# STUDENT OPERATIONS PATHS (Task 1)
# ==============================================================================

@app.post("/api/students/", response_model=schemas.StudentResponse, status_code=status.HTTP_201_CREATED, tags=["Students"])
async def create_student(student: schemas.StudentCreate, db: AsyncSession = Depends(get_db)):
    db_student = DBStudent(**student.model_dump())
    db.add(db_student)
    await db.commit()
    await db.refresh(db_student)
    return db_student

# ==============================================================================
# ENROLLMENT OPERATIONS WITH BACKGROUND TASK SEEDS (Task 2)
# ==============================================================================

@app.post("/api/enrollments/", response_model=schemas.EnrollmentResponse, status_code=status.HTTP_201_CREATED, tags=["Enrollments"])
async def create_enrollment(
    payload: schemas.EnrollmentCreate, 
    background_tasks: BackgroundTasks, 
    db: AsyncSession = Depends(get_db)
):
    # Verify student identity context existence inside our relational data records layer
    student_res = await db.execute(select(DBStudent).where(DBStudent.id == payload.student_id))
    student = student_res.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record missing")

    db_enrollment = DBEnrollment(**payload.model_dump())
    db.add(db_enrollment)
    await db.commit()
    await db.refresh(db_enrollment)
    
    # Enqueue a decoupled concurrent notification background worker routine
    background_tasks.add_task(simulate_email_notification, student.email)
    return db_enrollment
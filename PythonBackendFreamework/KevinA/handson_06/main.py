from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, ForeignKey, select
from typing import List, Optional
import schemas

# Setup an Asynchronous SQLite connection database URL engine
DATABASE_URL = "sqlite+aiosqlite:///./test_fastapi.db"
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# Async Relational Models Definitions
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

app = FastAPI(title="Course Management API", version="1.0")

# Dependency injection generator logic to yield a clean async DB session per request
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@app.on_event("startup")
async def startup():
    """Build database tables automatically on system startup initialization."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "API running"}

@app.post("/api/courses/", response_model=schemas.CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(course: schemas.CourseCreate, db: AsyncSession = Depends(get_db)):
    """Creates a new course entry into the database after unique constraints verification."""
    # Check if course code is already registered inside an async execution thread loop
    existing_stmt = await db.execute(select(DBCourse).where(DBCourse.code == course.code))
    if existing_stmt.scalars().first():
        raise HTTPException(status_code=400, detail="Course code must be unique")
        
    db_course = DBCourse(**course.model_dump())
    db.add(db_course)
    await db.commit()
    await db.refresh(db_course)
    return db_course

@app.get("/api/courses/", response_model=List[schemas.CourseResponse])
async def get_courses(
    skip: int = 0, 
    limit: int = 10, 
    department_id: Optional[int] = None, 
    db: AsyncSession = Depends(get_db)
):
    """Fetches all course parameters incorporating limit and offset pagination filters."""
    stmt = select(DBCourse)
    if department_id is not None:
        stmt = stmt.where(DBCourse.department_id == department_id)
    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

@app.get("/api/courses/{course_id}", response_model=schemas.CourseResponse)
async def get_course_by_id(course_id: int, db: AsyncSession = Depends(get_db)):
    """Retrieves a unique course resource profile record or throws a clean 404 message block."""
    result = await db.execute(select(DBCourse).where(DBCourse.id == course_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Course resource not identified")
    return item
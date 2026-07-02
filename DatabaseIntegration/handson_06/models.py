# Import required SQLAlchemy classes
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    ForeignKey,
    Date,
    Numeric
)

from sqlalchemy.orm import declarative_base, relationship

# Create the base class for ORM models
Base = declarative_base()

# Connect to MySQL database
engine = create_engine(
    "mysql+pymysql://root:Vinoth@localhost/college_db_orm",
    echo=True          # Prints SQL queries in the terminal
)

# -----------------------------
# Department Table
# -----------------------------
class Department(Base):
    __tablename__ = "departments"

    department_id = Column(Integer, primary_key=True)
    dept_name = Column(String(100), nullable=False)
    hod_name = Column(String(100))
    budget = Column(Numeric(12, 2))

    # Relationships
    students = relationship("Student", back_populates="department")
    courses = relationship("Course", back_populates="department")
    professors = relationship("Professor", back_populates="department")


# -----------------------------
# Student Table
# -----------------------------
class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100))
    department_id = Column(
        Integer,
        ForeignKey("departments.department_id")
    )

    department = relationship("Department", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student")


# -----------------------------
# Course Table
# -----------------------------
class Course(Base):
    __tablename__ = "courses"

    course_code = Column(String(10), primary_key=True)
    course_name = Column(String(100))
    credits = Column(Integer)
    department_id = Column(
        Integer,
        ForeignKey("departments.department_id")
    )

    department = relationship("Department", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")


# -----------------------------
# Professor Table
# -----------------------------
class Professor(Base):
    __tablename__ = "professors"

    professor_id = Column(Integer, primary_key=True)
    professor_name = Column(String(100))
    email = Column(String(100))
    department_id = Column(
        Integer,
        ForeignKey("departments.department_id")
    )

    department = relationship("Department", back_populates="professors")


# -----------------------------
# Enrollment Table
# -----------------------------
class Enrollment(Base):
    __tablename__ = "enrollments"

    enrollment_id = Column(Integer, primary_key=True)
    student_id = Column(
        Integer,
        ForeignKey("students.student_id")
    )
    course_code = Column(
        String(10),
        ForeignKey("courses.course_code")
    )
    enrollment_date = Column(Date)
    grade = Column(String(2))

    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


# Create all tables
Base.metadata.create_all(engine)

print("All tables created successfully!")

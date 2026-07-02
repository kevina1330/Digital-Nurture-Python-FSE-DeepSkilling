from sqlalchemy import Boolean
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    ForeignKey,
    Date,
    Numeric,
    Boolean,
    Time  
)

from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


engine = create_engine(
    "mysql+pymysql://root:karu@localhost/college_db_orm",
    echo=True
)
class Department(Base):
    __tablename__ = "departments"

    department_id = Column(Integer, primary_key=True)
    dept_name = Column(String(100), nullable=False)
    hod_name = Column(String(100))
    budget = Column(Numeric(12,2))

    students = relationship("Student", back_populates="department")
    courses = relationship("Course", back_populates="department")
    professors = relationship("Professor", back_populates="department")
    
class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100))
    department_id = Column(Integer, ForeignKey("departments.department_id"))
    is_active = Column(Boolean, default=True)

    department = relationship("Department", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student")
   


class Course(Base):
    __tablename__ = "courses"

    course_code = Column(String(10), primary_key=True)
    course_name = Column(String(100))
    credits = Column(Integer)
    department_id = Column(Integer, ForeignKey("departments.department_id"))

    department = relationship("Department", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")
    
class Professor(Base):
    __tablename__ = "professors"

    professor_id = Column(Integer, primary_key=True)
    professor_name = Column(String(100))
    email = Column(String(100))
    department_id = Column(Integer, ForeignKey("departments.department_id"))

    department = relationship("Department", back_populates="professors")
    
class Enrollment(Base):
    __tablename__ = "enrollments"

    enrollment_id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.student_id"))
    course_code = Column(String(10), ForeignKey("courses.course_code"))
    enrollment_date = Column(Date)
    grade = Column(String(2))

    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

class CourseSchedule(Base):
    __tablename__ = "course_schedules"

    schedule_id = Column(Integer, primary_key=True)
    course_code = Column(String(10), ForeignKey("courses.course_code"))
    day_of_week = Column(String(20))
    start_time = Column(Time)
    end_time = Column(Time)

Base.metadata.create_all(engine)

print("All tables created successfully!")

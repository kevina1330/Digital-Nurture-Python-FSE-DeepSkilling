"""
Hands-On 6

Task 2:
CRUD Operations using SQLAlchemy ORM

Task 3:
Fix N+1 Query Problem using joinedload()

Before joinedload():
- Multiple SQL queries are executed.
- One query loads enrollments.
- Additional queries load students and courses.

After joinedload():
- SQLAlchemy loads everything using a single JOIN query.
- Performance improves by eliminating the N+1 problem.
"""

from models import *
from sqlalchemy.orm import sessionmaker, joinedload
from datetime import date

# Create session
Session = sessionmaker(bind=engine)
session = Session()

# =====================================
# INSERT DEPARTMENTS
# =====================================

dept1 = Department(
    dept_name="Computer Science",
    hod_name="Dr. Rajesh",
    budget=500000
)

dept2 = Department(
    dept_name="Mechanical",
    hod_name="Dr. Kumar",
    budget=400000
)

dept3 = Department(
    dept_name="Electronics",
    hod_name="Dr. Priya",
    budget=450000
)

session.add_all([dept1, dept2, dept3])
session.commit()

# =====================================
# INSERT STUDENTS
# =====================================

student1 = Student(
    first_name="Rahul",
    last_name="Sharma",
    email="rahul@gmail.com",
    department=dept1
)

student2 = Student(
    first_name="Anita",
    last_name="Verma",
    email="anita@gmail.com",
    department=dept2
)

student3 = Student(
    first_name="Kiran",
    last_name="Reddy",
    email="kiran@gmail.com",
    department=dept3
)

student4 = Student(
    first_name="Sneha",
    last_name="Patel",
    email="sneha@gmail.com",
    department=dept1
)

student5 = Student(
    first_name="Arjun",
    last_name="Singh",
    email="arjun@gmail.com",
    department=dept2
)

session.add_all([
    student1,
    student2,
    student3,
    student4,
    student5
])
session.commit()

# =====================================
# INSERT COURSES
# =====================================

course1 = Course(
    course_code="CS101",
    course_name="Database Management",
    credits=4,
    department=dept1
)

course2 = Course(
    course_code="ME101",
    course_name="Thermodynamics",
    credits=3,
    department=dept2
)

course3 = Course(
    course_code="EC101",
    course_name="Digital Electronics",
    credits=4,
    department=dept3
)

session.add_all([course1, course2, course3])
session.commit()

# =====================================
# INSERT PROFESSORS
# =====================================

prof1 = Professor(
    professor_name="Dr. Suresh",
    email="suresh@gmail.com",
    department=dept1
)

prof2 = Professor(
    professor_name="Dr. Ravi",
    email="ravi@gmail.com",
    department=dept2
)

prof3 = Professor(
    professor_name="Dr. Meena",
    email="meena@gmail.com",
    department=dept3
)

session.add_all([prof1, prof2, prof3])
session.commit()

# =====================================
# INSERT ENROLLMENTS
# =====================================

enroll1 = Enrollment(
    student=student1,
    course=course1,
    enrollment_date=date(2024, 1, 10),
    grade="A"
)

enroll2 = Enrollment(
    student=student2,
    course=course1,
    enrollment_date=date(2024, 1, 11),
    grade="B"
)

enroll3 = Enrollment(
    student=student3,
    course=course2,
    enrollment_date=date(2024, 1, 12),
    grade="A"
)

enroll4 = Enrollment(
    student=student4,
    course=course3,
    enrollment_date=date(2024, 1, 13),
    grade="A"
)

session.add_all([
    enroll1,
    enroll2,
    enroll3,
    enroll4
])
session.commit()

print("Data inserted successfully!")

# =====================================
# READ
# Students in Computer Science
# =====================================

print("\nStudents in Computer Science Department")

students = (
    session.query(Student)
    .join(Department)
    .filter(Department.dept_name == "Computer Science")
    .all()
)

for s in students:
    print(
        s.first_name,
        s.last_name,
        s.email
    )

# =====================================
# READ
# Eager Loading (Task 3)
# =====================================

print("\nEnrollment Details")

enrollments = (
    session.query(Enrollment)
    .options(
        joinedload(Enrollment.student),
        joinedload(Enrollment.course)
    )
    .all()
)

for e in enrollments:
    print(
        e.student.first_name,
        e.course.course_name,
        e.grade
    )

# =====================================
# UPDATE
# =====================================

student = (
    session.query(Student)
    .filter_by(email="rahul@gmail.com")
    .first()
)

if student:
    student.email = "rahul_new@gmail.com"
    session.commit()
    print("\nStudent updated successfully!")

# =====================================
# DELETE
# =====================================

enrollment = session.query(Enrollment).first()

if enrollment:
    session.delete(enrollment)
    session.commit()
    print("Enrollment deleted successfully!")

print("\nHands-On 6 Completed Successfully!")

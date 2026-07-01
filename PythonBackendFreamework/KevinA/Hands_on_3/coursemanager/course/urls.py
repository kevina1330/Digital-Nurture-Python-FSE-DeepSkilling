from django.urls import path
from .views import (
    hello_api,
    course_list,
    course_detail,
    student_list,
    student_detail,
    enrollment_list,
    department_list,
)

urlpatterns = [
    path('hello/', hello_api, name='hello_api'),
    path('courses/', course_list, name='course-list'),
    path('courses/<int:pk>/', course_detail, name='course-detail'),
    path('students/', student_list, name='student-list'),
    path('students/<int:pk>/', student_detail, name='student-detail'),
    path('enrollments/', enrollment_list, name='enrollment-list'),
    path('departments/', department_list, name='department-list'),
]
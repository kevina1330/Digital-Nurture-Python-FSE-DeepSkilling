from django.urls import path
from . import views{
    hello_api,
    course_list,
    course_details,
    student_list,
    student_details,
    enrollment_list,
    enrollment_details
}

urlpatterns = [
    path('hello/',hello_api),
    path('course/',course_list),
    path('course/<int:id>/',course_details),
    path('student/',student_list),
    path('student/<int:id>/',student_details),
    path('enrollment/',enrollment_list),
    path('enrollment/<int:id>/',enrollment_details)
]
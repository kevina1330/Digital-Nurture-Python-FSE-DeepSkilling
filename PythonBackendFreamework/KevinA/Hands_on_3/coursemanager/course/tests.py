from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Department, Course

class CourseManagerAPITests(APITestCase):
    def setUp(self):
        # Create department
        self.department = Department.objects.create(
            name="Computer Science",
            head_of_dept="Dr. Alan Turing",
            budget=100000.00
        )
        
        # Create course
        self.course = Course.objects.create(
            name="Introduction to Python",
            code="CS101",
            credits=4,
            department=self.department
        )

    def test_get_courses_list(self):
        url = reverse('course-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Introduction to Python")

    def test_create_course(self):
        url = reverse('course-list')
        data = {
            "name": "Data Structures",
            "code": "CS201",
            "credits": 4,
            "department": self.department.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 2)

    def test_get_course_detail(self):
        url = reverse('course-detail', kwargs={'pk': self.course.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Introduction to Python")

    def test_update_course(self):
        url = reverse('course-detail', kwargs={'pk': self.course.pk})
        data = {
            "name": "Introduction to Python v2",
            "code": "CS101",
            "credits": 4,
            "department": self.department.id
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Course.objects.get(pk=self.course.pk).name, "Introduction to Python v2")

    def test_delete_course(self):
        url = reverse('course-detail', kwargs={'pk': self.course.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Course.objects.count(), 0)

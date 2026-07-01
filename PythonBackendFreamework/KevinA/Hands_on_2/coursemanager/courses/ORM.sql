-- Task 17: Filter courses by department name "Computer Science"
Course.objects.filter(department__name="Computer Science")

-- Task 18: Annotate departments with course count
Department.objects.annotate(course_count=Count("course"))

-- Task 19: Select related department for students
Student.objects.select_related("department")

-- Task 20: Update department budget by multiplying by 1.1
Department.objects.update(budget=F("budget")*1.1)
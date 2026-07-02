# Hands-On 7 – Migrations & Versioning using Alembic

## Objective
Learn how to use Alembic with SQLAlchemy to manage database schema changes.

## Tools Used
- Python
- SQLAlchemy
- Alembic
- MySQL
- PyMySQL

## Task 1 - Baseline Migration

### Install Alembic

```bash
pip install alembic
```

### Initialize Alembic

```bash
python -m alembic init migrations
```

### Generate Initial Migration

```bash
python -m alembic revision --autogenerate -m "initial schema"
```

### Apply Migration

```bash
python -m alembic upgrade head
```

---

## Task 2 - Incremental Migration

### Add is_active Column

```bash
python -m alembic revision --autogenerate -m "add is_active to students"
python -m alembic upgrade head
```

### Add CourseSchedule Table

```bash
python -m alembic revision --autogenerate -m "add course_schedule table"
python -m alembic upgrade head
```

### View Migration History

```bash
python -m alembic history --verbose
```

---

## Task 3 - Rollback

### Current Version

```bash
python -m alembic current
```

### Rollback One Revision

```bash
python -m alembic downgrade -1
```

### Rollback All Revisions

```bash
python -m alembic downgrade base
```

### Apply Latest Version Again

```bash
python -m alembic upgrade head
```

---

## Outcome

- Initial migration created successfully.
- Added **is_active** column.
- Added **CourseSchedule** table.
- Successfully performed rollback and recovery.

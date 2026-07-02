// =====================================
// Task 2: CRUD Operations
// =====================================

// READ - Rating = 5
db.feedback.find({
    rating: 5
});

// READ - CS101 with challenging tag
db.feedback.find({
    course_code: "CS101",
    tags: "challenging"
});

// Projection
db.feedback.find(
{},
{
    student_id: 1,
    course_code: 1,
    rating: 1,
    _id: 0
}
);

// UPDATE - Add needs_review
db.feedback.updateMany(
{
    rating: {
        $lt: 3
    }
},
{
    $set: {
        needs_review: true
    }
}
);

// UPDATE - Add reviewed tag
db.feedback.updateMany(
{
    needs_review: true
},
{
    $push: {
        tags: "reviewed"
    }
}
);

// DELETE
db.feedback.deleteMany({
    semester: "2021-EVEN"
});

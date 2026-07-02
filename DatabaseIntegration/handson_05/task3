// =====================================
// Task 3: Aggregation Pipeline
// =====================================

// Average Rating by Course
db.feedback.aggregate([

{
    $match: {
        semester: "2022-ODD"
    }
},

{
    $group: {
        _id: "$course_code",
        avg_rating: {
            $avg: "$rating"
        },
        total_feedback: {
            $sum: 1
        }
    }
},

{
    $project: {
        _id: 0,
        course_code: "$_id",
        average_rating: {
            $round: ["$avg_rating", 1]
        },
        total_feedback: 1
    }
},

{
    $sort: {
        average_rating: -1
    }
}

]);

// Tag Frequency Leaderboard
db.feedback.aggregate([

{
    $unwind: "$tags"
},

{
    $group: {
        _id: "$tags",
        count: {
            $sum: 1
        }
    }
},

{
    $sort: {
        count: -1
    }
}

]);

// Create Index
db.feedback.createIndex({
    course_code: 1
});

// Verify Index
db.feedback.find({
    course_code: "CS101"
}).explain("executionStats");

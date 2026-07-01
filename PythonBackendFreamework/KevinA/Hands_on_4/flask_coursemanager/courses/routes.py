from flask import Blueprint, jsonify, request

courses_bp = Blueprint("courses", __name__, url_prefix="/api/courses")

courses = []


def make_response_json(data, status_code):
    return jsonify({
        "status": "success",
        "data": data
    }), status_code


@courses_bp.route("/", methods=["GET"])
def get_courses():
    return make_response_json(courses, 200)


@courses_bp.route("/", methods=["POST"])
def create_course():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    required_fields = ["name", "code", "credits"]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    course = {
        "id": len(courses) + 1,
        "name": data["name"],
        "code": data["code"],
        "credits": data["credits"]
    }

    courses.append(course)

    return make_response_json(course, 201)


@courses_bp.route("/<int:course_id>", methods=["GET"])
def get_course(course_id):
    for course in courses:
        if course["id"] == course_id:
            return make_response_json(course, 200)

    return jsonify({"error": "Course not found"}), 404


@courses_bp.route("/<int:course_id>", methods=["PUT"])
def update_course(course_id):
    data = request.get_json()

    for course in courses:
        if course["id"] == course_id:
            course["name"] = data.get("name", course["name"])
            course["code"] = data.get("code", course["code"])
            course["credits"] = data.get("credits", course["credits"])

            return make_response_json(course, 200)

    return jsonify({"error": "Course not found"}), 404


@courses_bp.route("/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    for course in courses:
        if course["id"] == course_id:
            courses.remove(course)
            return jsonify({"message": "Course deleted"}), 200

    return jsonify({"error": "Course not found"}), 404
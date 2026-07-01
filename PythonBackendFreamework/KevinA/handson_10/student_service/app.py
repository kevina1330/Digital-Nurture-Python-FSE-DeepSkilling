from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/api/students/<int:id>/enroll', methods=['POST'])
def process_student_enrollment(id):
    """Handles student enrollment after validating course existence upstream (Task 2)."""
    payload = request.get_json() or {}
    target_course_id = payload.get("course_id")
    
    if not target_course_id:
        return jsonify({"error": "Missing course_id parameter"}), 400

    # Step 100-101: Synchronous inter-service call to Course Service with circuit-break error handling
    try:
        upstream_url = f"http://127.0.0.1:5001/api/courses/{target_course_id}/"
        upstream_call = requests.get(upstream_url, timeout=2.0)
        
        if upstream_call.status_code == 404:
            return jsonify({"error": "Cannot complete enrollment: target course does not exist"}), 400
        elif upstream_call.status_code != 200:
            return jsonify({"error": "Upstream course service reported an error"}), 502
            
    except requests.exceptions.ConnectionError:
        # Handles scenario where Course Service is completely down (Step 101)
        return jsonify({"error": "Course Service is temporarily unavailable"}), 503

    # If verification passes, return a success enrollment confirmation
    return jsonify({
        "status": "success", 
        "message": f"Student {id} successfully enrolled in course {target_course_id}"
    }), 201

if __name__ == '__main__':
    # Runs independently on port 5002 (Task 1, Step 98)
    app.run(port=5002, debug=True)
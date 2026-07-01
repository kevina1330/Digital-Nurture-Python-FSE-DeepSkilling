from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Reverse-proxy configuration mapping table rules (Task 2, Step 422)
UPSTREAM_ROUTING_MAP = {
    "courses": "http://127.0.0.1:5001",
    "students": "http://127.0.0.1:5002"
}

@app.route('/api/<string:segment>/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE'])
@app.route('/api/<string:segment>/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def central_gateway_proxy_router(segment, path):
    """Intercepts incoming API traffic and proxies it to the matching target microservice."""
    target_host = UPSTREAM_ROUTING_MAP.get(segment)
    if not target_host:
        return jsonify({"error": "Target microservice route undefined"}), 404

    # Reconstruct the target path string pointing upstream
    reconstructed_url = f"{target_host}/api/{segment}/{path}"
    if request.query_string:
        reconstructed_url += f"?{request.query_string.decode('utf-8')}"

    try:
        upstream_response = requests.request(
            method=request.method,
            url=reconstructed_url,
            headers={k: v for k, v in request.headers if k.lower() != 'host'},
            data=request.get_data(),
            cookies=request.cookies,
            allow_redirects=False,
            timeout=5.0
        )
        return (upstream_response.content, upstream_response.status_code, upstream_response.headers.items())
    except requests.exceptions.RequestException:
        return jsonify({"error": "Gateway error connecting upstream"}), 502

if __name__ == '__main__':
    # Gateway listens on standard front-facing port 5000 (Task 2, Step 421)
    app.run(port=5000, debug=True)
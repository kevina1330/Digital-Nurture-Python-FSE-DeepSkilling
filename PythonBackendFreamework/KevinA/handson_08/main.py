from fastapi import FastAPI, Request, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="REST Standard Versioning Implementation Engine")

# --- Standardized Error Envelope Spec (Task 2) ---
def generate_error_response(code: str, message: str, field: Optional[str] = None, status_code: int = 400):
    """Enforces a predictable JSON error layout across all handlers."""
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {
                "code": code,
                "message": message,
                "field": field
            }
        }
    )

# Override default exception handlers to enforce our standardized error envelope format
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return generate_error_response(
        code="NOT_FOUND" if exc.status_code == 404 else "BAD_REQUEST",
        message=exc.detail,
        status_code=exc.status_code
    )

class CoursePatchSchema(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = None

# Mock database tracking set for demonstration
MOCK_DATABASE = [
    {"id": 1, "name": "Advanced Algorithms", "code": "CS-401", "credits": 4},
    {"id": 2, "name": "Distributed System Infrastructure", "code": "CS-402", "credits": 3},
    {"id": 3, "name": "Artificial Intelligence Foundations", "code": "CS-403", "credits": 4}
]

# ==============================================================================
# VERSIONED & PAGINATED ENDPOINTS (Task 1 & 2)
# ==============================================================================

@app.get("/api/v1/courses/")
async def get_versioned_paginated_courses(request: Request, page: int = 1, page_size: int = 2, search: Optional[str] = None):
    """Retrieves records using plural nouns, URI versioning, and offset pagination envelopes."""
    # Apply Filtering Mechanics via Search Parameters if requested
    filtered_dataset = MOCK_DATABASE
    if search:
        filtered_dataset = [c for c in MOCK_DATABASE if search.lower() in c["name"].lower() or search.lower() in c["code"].lower()]

    total_records = len(filtered_dataset)
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    sliced_results = filtered_dataset[start_index:end_index]

    # Calculate dynamic navigational routing links for the client
    base_uri = str(request.base_url).rstrip('/') + "/api/v1/courses/"
    next_link = f"{base_uri}?page={page+1}&page_size={page_size}" if end_index < total_records else None
    prev_link = f"{base_uri}?page={page-1}&page_size={page_size}" if page > 1 and start_index <= total_records else None

    # Return the standardized production response envelope layout
    return {
        "count": total_records,
        "next": next_link,
        "previous": prev_link,
        "results": sliced_results
    }

@app.patch("/api/v1/courses/{id}/")
async def patch_course_record(id: int, payload: CoursePatchSchema):
    """Handles partial resource updates (PATCH) rather than full row replacements (PUT)."""
    target_record = next((item for item in MOCK_DATABASE if item["id"] == id), None)
    if not target_record:
        raise HTTPException(status_code=404, detail=f"Course with id {id} does not exist")
        
    # Extract only the keys explicitly sent by the client
    update_data = payload.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        target_record[key] = val
        
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(target_record))

@app.get("/api/v1/courses/{id}/")
async def get_course_by_id(id: int):
    """Retrieves a single versioned course resource layout profile by its unique ID key."""
    target_record = next((item for item in MOCK_DATABASE if item["id"] == id), None)
    if not target_record:
        raise HTTPException(status_code=404, detail=f"Course with id {id} does not exist")
        
    return target_record
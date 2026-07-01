from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Dict
from jose import jwt, JWTError
import security

app = FastAPI(title="Secured Enterprise Authentication Architecture Gateway")

# --- CORS Security Policy Integration Setup (Task 2) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Restricts browser access to the frontend dev host
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tells FastAPI to look for a bearer token at this relative endpoint URL location
oauth2_bearer_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login/")

# In-Memory Database Map to track users
USER_REGISTRY_DATABASE: Dict[str, dict] = {}

class UserRegistrationModel(BaseModel):
    email: EmailStr
    password: str

# ==============================================================================
# SECURE CONCEPTUAL NOTE REQUIREMENT (Task 1, Step 89)
# ==============================================================================
# Why choose bcrypt over MD5 or SHA-256 for password security storage management?
# Bcrypt incorporates an adjustable work factor (calculation rounds) that forces an 
# intentional, resource-heavy processing delay during encryption evaluation. This makes 
# massive hardware brute-force or pre-calculated rainbow table attacks computationally 
# expensive. Standard hash engines like MD5 or SHA-256 are explicitly engineered for 
# raw, high-throughput speed, making them highly vulnerable to rapid modern GPU cracking.

# ==============================================================================
# IDENTITY REGISTRATION & LOGIN SYSTEM (Task 1 & 2)
# ==============================================================================

@app.post("/api/v1/auth/register/", status_code=status.HTTP_201_CREATED)
async def register_system_identity(account_payload: UserRegistrationModel):
    """Registers a clean system identity profile ensuring no email collisions occur."""
    if account_payload.email in USER_REGISTRY_DATABASE:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Identity mapping already exists")
    
    # Hash the password string securely using our security module utility
    hashed_string = security.get_password_hash(account_payload.password)
    
    USER_REGISTRY_DATABASE[account_payload.email] = {
        "email": account_payload.email,
        "hashed_password": hashed_string,
        "is_active": True
    }
    return {"message": "Identity registered successfully"}

@app.post("/api/v1/auth/login/")
async def authenticate_identity(form_input: OAuth2PasswordRequestForm = Depends()):
    """Validates user credentials and returns a secure cryptographic bearer token."""
    account = USER_REGISTRY_DATABASE.get(form_input.username)
    if not account or not security.verify_password(form_input.password, account["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credential parameters")
        
    generated_token = security.generate_access_token(payload_data={"sub": account["email"]})
    return {"access_token": generated_token, "token_type": "bearer"}

# ==============================================================================
# ROUTE PROTECTION HOOKS DEPENDENCY (Task 2)
# ==============================================================================

async def extract_authenticated_user(token: str = Depends(oauth2_bearer_scheme)):
    """Decodes, parses, and validates the incoming bearer authentication token context."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        decoded_payload = jwt.decode(token, security.SECRET_SIGNING_KEY, algorithms=[security.ALGORITHM_SPECIFICATION])
        user_identity_email: str = decoded_payload.get("sub")
        if user_identity_email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    account = USER_REGISTRY_DATABASE.get(user_identity_email)
    if account is None:
        raise credentials_exception
    return account

# --- Protected Endpoint Demonstration ---
@app.post("/api/v1/courses/", status_code=status.HTTP_201_CREATED)
async def generate_secure_course(course_name: str, identity_context: dict = Depends(extract_authenticated_user)):
    """A highly secured workspace path restricted to validated system tokens."""
    return {
        "message": f"Course securely modified under context tracking account: {identity_context['email']}"
    }
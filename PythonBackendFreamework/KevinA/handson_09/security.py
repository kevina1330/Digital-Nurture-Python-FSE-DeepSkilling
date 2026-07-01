from datetime import datetime, timedelta, timezone
from jose import jwt
import bcrypt  # Import the standard library directly

SECRET_SIGNING_KEY = "CRITICAL_SYSTEM_PRODUCTION_SIGNING_KEY_STRING_9999"
ALGORITHM_SPECIFICATION = "HS256"

def get_password_hash(password: str) -> str:
    """Hashes a plain-text password using native bcrypt."""
    # Convert string to bytes, generate salt, and hash it
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_bytes.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain-text password against a hashed string safely."""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def generate_access_token(payload_data: dict, operational_lifespan: int = 30) -> str:
    """Generates a cryptographically signed JWT token with an expiration timestamp."""
    data_blueprint = payload_data.copy()
    expiry_timestamp = datetime.now(timezone.utc) + timedelta(minutes=operational_lifespan)
    data_blueprint.update({"exp": expiry_timestamp})
    return jwt.encode(data_blueprint, SECRET_SIGNING_KEY, algorithm=ALGORITHM_SPECIFICATION)
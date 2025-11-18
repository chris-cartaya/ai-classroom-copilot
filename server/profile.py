import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# In-memory store for a single user profile to keep it simple for the prototype.
# In a real application, this would be in a database, linked to an authenticated user.
_profile_data = {
    "name": "Alex Doe",
    "email": "alex.doe@example.com",
    "role": "student",  # or "instructor"
    "preferences": {
        "theme": "dark",
        "fontSize": "medium",
        "notifications": {
            "newMaterial": True,
            "newReply": True,
        }
    }
}

def get_profile() -> Dict[str, Any]:
    """Retrieves the current user profile."""
    logger.info("Retrieving user profile.")
    return _profile_data

def update_profile(new_data: Dict[str, Any]) -> Dict[str, Any]:
    """Updates the user profile."""
    logger.info(f"Updating profile with new data: {new_data}")
    
    # Simple recursive update for nested dictionaries
    def _recursive_update(d, u):
        for k, v in u.items():
            if isinstance(v, dict):
                d[k] = _recursive_update(d.get(k, {}), v)
            else:
                d[k] = v
        return d

    global _profile_data
    _profile_data = _recursive_update(_profile_data, new_data)
    
    logger.info(f"Profile updated successfully. New profile: {_profile_data}")
    return _profile_data

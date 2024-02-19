class UserProfile:
    MANDATORY_ATTRIBUTES = ["password", "first_name", "last_name", "email"]

    def __init__(self) -> None:
        self.password = None
        self.first_name = None
        self.last_name = None
        self.email = None
        self.school_year = None # Optional
        self.school = None # Optional

    def ValidateProfile(self) -> bool:
        # Check that we have all mandatory attributes and that
        # none are None
        for attr in UserProfile.MANDATORY_ATTRIBUTES:
            if not hasattr(self, attr) and getattr(self, attr) is not None:
                return False
            
        return True

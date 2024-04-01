import re

from app.errors import ValidationError

USER_PROFILE_DEFAULT_VAL = None

class UserForm:
    MANDATORY_ATTRIBUTES = ["password", "first_name", "last_name", "email"]

    def __init__(self) -> None:
        self.password = USER_PROFILE_DEFAULT_VAL
        self.first_name = USER_PROFILE_DEFAULT_VAL
        self.last_name = USER_PROFILE_DEFAULT_VAL
        self.email = USER_PROFILE_DEFAULT_VAL
        self.school_year = USER_PROFILE_DEFAULT_VAL # Optional
        self.school_name = USER_PROFILE_DEFAULT_VAL # Optional

    def ValidatePassword(self):
        if type(self.password) is not str:
            raise ValidationError("Password type must be string")

        if len(self.password) < 8:
            raise ValidationError("Password must of atleast of length 8")

        if re.search('[0-9]', self.password) is None:
            raise ValidationError("Password needs at least 1 number")
        
        if re.search('[A-Z]', self.password) is None:
            raise ValidationError("Password needs at least 1 upper case letter")
        
        if re.search('[a-z]', self.password) is None:
            raise ValidationError("Password needs at least 1 lower case letter")
        
    def ValidateEmail(self):
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'

        if type(self.email) is not str:
            raise ValidationError("Email type must be string")
        
        if re.fullmatch(regex, self.email) is None:
            raise ValidationError("Email is not of form email")

    def ValidateFirstName(self):
        if type(self.first_name) is not str:
            raise ValidationError("First Name type must be string")

        if len(self.first_name) < 1:
            raise ValidationError("First Name cannot be empty")

    def ValidateLaseName(self):
        if type(self.last_name) is not str:
            raise ValidationError("Last Name type must be string")

        if len(self.last_name) < 1:
            raise ValidationError("Last Name cannot be empty")

    def CheckMandatoryFieldsFull(self):
        # Check that we have all mandatory attributes and that
        # none are None
        for attr in UserForm.MANDATORY_ATTRIBUTES:
            if not hasattr(self, attr) and getattr(self, attr) is not None:
                raise ValidationError("Not all mandatory fields filled in")

    def ValidateProfile(self):
        self.CheckMandatoryFieldsFull()
        self.ValidatePassword()
        self.ValidateEmail()
        self.ValidateFirstName()
        self.ValidateLaseName()

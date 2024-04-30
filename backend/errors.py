from logger import Logger

class ValidationError(Exception):
    def __init__(self, message):
        # Call the base class constructor with the parameters it needs
        super().__init__(message)
        self.message = message
        Logger.log_backend_error("ValidationError", message)

class DuplicationError(Exception):
    def __init__(self, message):
        # Call the base class constructor with the parameters it needs
        super().__init__(message)
        self.message = message
        Logger.log_backend_error("DuplicationError", message)

class AuthenticationError(Exception):
    def __init__(self, message):
        # Call the base class constructor with the parameters it needs
        super().__init__(message)
        self.message = message
        Logger.log_backend_error("AuthenticationError", message)
        
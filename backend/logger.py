import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Logger:
    @classmethod
    def log_backend(cls, service: str, message: str):
        logger.info("[BACKEND %s] %s", service, message)

    @classmethod
    def log_backend_error(cls, service: str, message: str):
        logger.info("\033[91m[BACKEND %s] %s", service, message)

    @classmethod
    def log_database(cls, service: str, message: str):
        logger.info("[DATABASE %s] %s", service, message)

    @classmethod 
    def log_database_error(cls, service: str, message: str):
        logger.info("\033[91m[DATABASE %s] %s", service, message)

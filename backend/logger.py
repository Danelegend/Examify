import datetime
import logging

# Set u logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Logger:
    @classmethod
    def _log_info(cls, domain: str, service: str, message: str):
        timestamp = datetime.datetime.now()
        
        logger.info("\033[97m[%s %s] ts=%s msg=%s", domain.upper(), service, str(timestamp), message)

    @classmethod
    def _log_error(cls, domain: str, service: str, message: str):
        timestamp = datetime.datetime.now()
        
        logger.error("\033[91m[%s %s] ts=%s msg=%s", domain.upper(), service, str(timestamp), message)

    @classmethod
    def _log_debug(cls, domain: str, service: str, message: str):
        timestamp = datetime.datetime.now()
        
        logger.error("\033[93m[%s %s] ts=%s msg=%s", domain.upper(), service, str(timestamp), message)

    @classmethod
    def log_backend(cls, service: str, message: str):
        cls._log_info("BACKEND", service, message)

    @classmethod
    def log_backend_error(cls, service: str, message: str):
        cls._log_error("BACKEND", service, message)

    @classmethod
    def log_database(cls, service: str, message: str):
        cls._log_info("DATABASE", service, message)

    @classmethod 
    def log_database_error(cls, service: str, message: str):
        cls._log_error("DATABASE", service, message)

    @classmethod
    def log_debug(cls, message: str):
        cls._log_debug("DEBUG", "", message)

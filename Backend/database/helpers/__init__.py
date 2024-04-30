import os
import sys
import psycopg2
from psycopg2 import pool

from logger import Logger

# getting credentials to access the database, default values provided if they are not set
USER = os.environ.get("POSTGRES_USER", "postgres")
PASSWORD = os.environ.get("POSTGRES_PASSWORD", "1234567890")
DB_NAME = os.environ.get("POSTGRES_DB", "dream")
DB_PORT = os.environ.get("POSTGRES_PORT", "5432")
HOST = os.environ.get("POSTGRES_HOST", "host.docker.internal")
MIN_CONN = int(os.environ.get("POSTGRES_MINCONN", "1"))
MAX_CONN = int(os.environ.get("POSTGRES_MAXCONN", "10"))

Logger.log_database("Connection", f"Connecting to database {DB_NAME} on {HOST}:{DB_PORT} with user {USER}")

connection_pool = pool.ThreadedConnectionPool(
    minconn=1,
    maxconn=10,
    user=USER,
    password=PASSWORD,
    database=DB_NAME,
    host=HOST,
    port=DB_PORT
)

def connect() -> psycopg2.extensions.connection:
    """
    Gets a database connection from pool
    """
    try:
        conn = connection_pool.getconn()
        return conn
    except psycopg2.Error as err:
        Logger.log_database_error("Connection", f"Database connection error: {err}")
        sys.exit(1)

def disconnect(conn: psycopg2.extensions.connection):
    """
    Release the database connection after use back to the pool
    """
    connection_pool.putconn(conn)

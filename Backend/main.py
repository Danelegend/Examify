from typing import Literal, List, Tuple, Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from psycopg2 import Error
 
from database.helpers import connect, disconnect
from database.linker import DatabaseSetup

from router import admin, auth, exam, exams, logo, user

@asynccontextmanager
async def lifespan(app: FastAPI): # pylint: disable=W0621
    """
    Runs startup and shutdown logic of the app
    """
    # Preload
    
    yield
    # Clean Up

app = FastAPI(
    title="Examify API",
    version="3.0.0",
    lifespan=lifespan
)

origins = [
    "http://host.docker.internal",
    "http://host.docker.internal:8080",
    "http://host.docker.internal:8000",
    "http://host.docker.internal:3000",
    "http://host.docker.internal:3001",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:3001",
]

# https://fastapi.tiangolo.com/tutorial/cors/
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(exam.router, prefix="/api/exam", tags=["exam"])
app.include_router(exams.router, prefix="/api/exams", tags=["exams"])
app.include_router(logo.router, prefix="/api/logo", tags=["logo"])
app.include_router(user.router, prefix="/api/user", tags=["user"])

@app.get("/")
async def root():
    """
    Root api, currently used for example and testing
    """
    return {"message": "Hello, welcome to Examify"}

################################################################################
#############################   Debugging Routes   #############################
################################################################################

AllTables = Literal[
  "accounts",
  "schools",
  "passwords",
  "exams",
  "sessions",
  "favourite_exams",
  "recently_viewed_exams"
]

@app.get("/db/test")
async def test_database():
    """
    Test the database connection
    """
    try:
        conn = connect()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT 100;")
                return cur.fetchone()

        except Exception as e:
            raise e
    except Error as err:
        raise err
    finally:
        disconnect(conn)

@app.get("/db/list")
async def list_all_database_tables() -> List[str]:
    """
    list all db tables
    """
    db_setup = DatabaseSetup()
    return db_setup.list_tables()

@app.delete("/db/clear")
async def clear_database_table(table: AllTables):
    """
    clear db tables
    """
    db_setup = DatabaseSetup()
    return db_setup.clear_tables([table])

@app.delete("/db/clear/all")
async def clear_all_database_tables():
    """
    clear all db tables
    """
    db_setup = DatabaseSetup()
    tables = db_setup.list_tables()
    return db_setup.clear_tables(tables)

@app.get("/table/{table_name}")
async def view_table_entries(table_name: AllTables) -> Optional[List[Tuple]]:
    """
    view the entries in table
    """
    db_setup = DatabaseSetup()
    return db_setup.view_table(table_name)

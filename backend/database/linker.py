import os
from typing import List, Tuple, Optional, Any
from psycopg2 import Error, sql

from database.helpers import connect, disconnect
from logger import Logger

class DatabaseSetup:
    def __init__(self):
        if self.__loaded:
            return

        self.__loaded = True

    def __new__(cls):
        if not hasattr(cls, "instance"):
            cls.instance = super(DatabaseSetup, cls).__new__(cls)
            cls.instance.__loaded = False
        return cls.instance

    @classmethod
    def log_success(cls, message: str):
        """
        Logs a successful database operation
        """
        Logger.log_database("DatabaseSetup", message)

    def log_error(cls, message: str):
        """
        Logs an error in database operation
        """
        Logger.log_database_error("DatabaseSetup", message)

    def inject_schema(self):
        """
        Injects the database schema into the database
        """
        try:
            conn = connect()
            with conn.cursor() as cur:
                with open(os.path.join(os.getcwd(), "database/schema.sql"), encoding="utf8") as file:
                    cur.execute(file.read())
            conn.commit()
            self.log_success("done injecting schema")
        except Error as err:
            self.log_error(f"database error while injecting schema: {err}")
            raise err
        finally:
            disconnect(conn)

    def list_tables(self) -> List[str]:
        """

        List all tables in the public schema of the database

        Returns:
            List[str]: list of all table names
        """
        try:
            conn = connect()
            with conn.cursor() as cur:
                # Get a list of tables in the public schema
                cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';")
                tables = cur.fetchall()

            self.log_success("done listing tables")
        except Error as err:
            self.log_error(f"database error: {err}")
            raise err
        finally:
            disconnect(conn)

        return [table[0] for table in tables]

    def view_table(self, table: str) -> Optional[List[Tuple[Any]]]:
        """

        Displays contents of the specified table in database

        Args:
            table (str): name of the table

        Returns:
            List[Tuple]: list of table entries as tuples
        """
        try:
            conn = connect()
            with conn.cursor() as cur:
                cur.execute(sql.SQL("SELECT * FROM {};").format(sql.Identifier(table)))
                contents = cur.fetchall()
            self.log_success(f"done displaying contents of table \"{table}\"")

            return contents
        except Error as err:
            self.log_error(f"error displaying contents of table \"{table}\": {err}")
            raise err
        finally:
            disconnect(conn)

    def clear_tables(self, tables: List[str]):
        """

        Clears out the contents of the specified tables in database

        Args:
            tables (List[str]): list of all tables that need to be cleared
        """
        for table in tables:
            try:
                conn = connect()
                with conn.cursor() as cur:
                    cur.execute(sql.SQL("TRUNCATE {} CASCADE;").format(sql.Identifier(table)))
                conn.commit()

                self.log_success(f"truncated table \"{table}\"")
            except Error as err:
                self.log_error(f"error truncating table \"{table}\": {err}")
                raise err
            finally:
                disconnect(conn)

    def main(self):
        """
        Set up a database by injecting schema, listing tables, injecting dummy data, and providing details about a specific table
        """
        self.log_success("Setting up the database")

        try:
            self.inject_schema()
            tables = self.list_tables()
            self.clear_tables(tables)
        finally:
            self.log_success("Finished with the database")

    def run_migration(self, migration_num: int):
        """
        Runs a specific migration
        """
        self.log_success("Attemping to find migration")

        migration_file = "migration_" + str(migration_num).rjust(3, '0') + ".sql"

        try:
            conn = connect()
            with conn.cursor() as cur:
                with open(os.path.join(os.getcwd(), "database/migrations/" + migration_file), encoding="utf8") as file:
                    cur.execute(file.read())
            conn.commit()
            self.log_success("done injecting schema")
        except Error as err:
            self.log_error(f"database error while injecting schema: {err}")
            raise err
        finally:
            disconnect(conn)


if __name__ == "__main__":
    db_setup = DatabaseSetup()
    db_setup.main()

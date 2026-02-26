import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))

db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("DATABASE_URL not found in environment.")
    exit(1)

# Correct the URL for psycopg2 if it uses postgresql+asyncpg
db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
if "?" in db_url:
    db_url = db_url.split("?")[0]
db_url += "?sslmode=require"

print(f"Connecting to database...")

try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()

    # Query to find all tables and columns in the public schema that are 'timestamp without time zone'
    query = """
    SELECT table_name, column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND data_type = 'timestamp without time zone';
    """
    
    cursor.execute(query)
    columns_to_update = cursor.fetchall()
    
    if not columns_to_update:
        print("No naive timestamp columns found! They might already be updated.")
    else:
        print(f"Found {len(columns_to_update)} columns to update to timestamp with time zone.")
        
        for table, column in columns_to_update:
            print(f"Updating {table}.{column}...")
            # We use AT TIME ZONE 'UTC' to ensure existing data is treated as UTC
            alter_query = f"""
            ALTER TABLE "{table}" 
            ALTER COLUMN "{column}" TYPE timestamp with time zone 
            USING "{column}" AT TIME ZONE 'UTC';
            """
            try:
                cursor.execute(alter_query)
                print(f"  -> Success.")
            except Exception as e:
                print(f"  -> Failed: {e}")
                
    cursor.close()
    conn.close()
    print("Migration script completed successfully.")

except Exception as e:
    print(f"Connection failed: {e}")

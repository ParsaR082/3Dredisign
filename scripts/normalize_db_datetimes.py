import sqlite3
import re

db_path = r'D:/Projects/UrumSima/SEO/urumsima.ir/UrumsimaWeb/db.sqlite3'
con = sqlite3.connect(db_path)
cur = con.cursor()

tables = [row[0] for row in cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").fetchall()]

modified = 0
for table in tables:
    cols = cur.execute(f"PRAGMA table_info({table})").fetchall()
    for col in cols:
        col_name = col[1]
        col_type = col[2].lower()
        if 'date' in col_type or 'time' in col_type:
            # Check if any row has microsecond format 'YYYY-MM-DD HH:MM:SS.mmmmmm'
            try:
                rows = cur.execute(f"SELECT id, {col_name} FROM {table} WHERE {col_name} LIKE '%.%'").fetchall()
                if rows:
                    print(f"Table '{table}', col '{col_name}': {len(rows)} rows with microseconds")
                    for r_id, val in rows:
                        if val and '.' in val:
                            new_val = val.split('.')[0]
                            cur.execute(f"UPDATE {table} SET {col_name}=? WHERE id=?", (new_val, r_id))
                            modified += 1
            except Exception as e:
                # Some tables might not have an 'id' column
                try:
                    cur.execute(f"UPDATE {table} SET {col_name} = substr({col_name}, 1, 19) WHERE {col_name} LIKE '%.%'")
                except Exception as e2:
                    print(f"Could not update {table}.{col_name}: {e2}")

con.commit()
print(f"Total timestamps normalized: {modified}")
con.close()

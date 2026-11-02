import sqlite3
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_path = 'prisma/production_server.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Get all tables
tables = [r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").fetchall()]

modified = 0

def clean_timestamp(val):
    if not val or not isinstance(val, str):
        return val
    # Remove timezone like +00, +00:00, +03:30, +0000, Z
    # Handle formats like '2026-08-11 14:25:42.54504+00' -> '2026-08-11T14:25:42.000Z'
    # Match date and time
    m = re.match(r'^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\.\d+)?(?:[+-]\d{2}(?::?\d{2})?|Z)?$', val)
    if m:
        return f"{m.group(1)}T{m.group(2)}.000Z"
    return val

for table in tables:
    cols = cur.execute(f'PRAGMA table_info("{table}")').fetchall()
    for col in cols:
        col_name = col[1]
        col_type = col[2].lower()
        if 'date' in col_type or 'time' in col_type or col_name.endswith('_at') or col_name.endswith('_date'):
            # Fetch all values
            try:
                rows = cur.execute(f'SELECT rowid, "{col_name}" FROM "{table}" WHERE "{col_name}" IS NOT NULL').fetchall()
                for rowid, val in rows:
                    if isinstance(val, str):
                        cleaned = clean_timestamp(val)
                        if cleaned != val:
                            cur.execute(f'UPDATE "{table}" SET "{col_name}" = ? WHERE rowid = ?', (cleaned, rowid))
                            modified += 1
            except Exception as e:
                print(f"Error checking {table}.{col_name}: {e}")

conn.commit()
print(f"Total timestamps normalized to ISO-8601: {modified}")

# Test query with Prisma
conn.close()

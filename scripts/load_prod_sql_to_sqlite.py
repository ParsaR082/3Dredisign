import sqlite3
import shutil
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Source files
sql_dump_path = 'scratch/urumsima_prod_updated.sql'
template_sqlite = 'scratch/server_db.sqlite3'
target_sqlite = 'prisma/production_server.db'

# Copy template with schema to target
shutil.copy2(template_sqlite, target_sqlite)
print(f"Copied {template_sqlite} -> {target_sqlite}")

conn = sqlite3.connect(target_sqlite)
cur = conn.cursor()

# Disable foreign keys during load
cur.execute("PRAGMA foreign_keys = OFF;")

with open(sql_dump_path, 'r', encoding='utf-8') as f:
    sql_text = f.read()

# Pattern for COPY
copy_blocks = re.findall(r'COPY public\.([a-zA-Z0-9_]+) \(([^)]+)\) FROM stdin;\n(.*?)\n\\\.', sql_text, re.DOTALL)
print(f"Found {len(copy_blocks)} COPY blocks in PostgreSQL dump.")

existing_tables = set(r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall())

imported_tables = 0
imported_rows = 0

for table_name, cols_str, body in copy_blocks:
    if table_name not in existing_tables:
        continue
    
    cols = [c.strip().strip('"') for c in cols_str.split(',')]
    
    # Clear existing data in table
    cur.execute(f'DELETE FROM "{table_name}"')
    
    lines = [l for l in body.split('\n') if l]
    if not lines or (len(lines) == 1 and not lines[0].strip()):
        continue

    placeholders = ', '.join(['?'] * len(cols))
    col_names = ', '.join([f'"{c}"' for c in cols])
    insert_sql = f'INSERT INTO "{table_name}" ({col_names}) VALUES ({placeholders})'
    
    rows_data = []
    for line_idx, line in enumerate(lines):
        if not line: continue
        parts = line.split('\t')
        if len(parts) != len(cols):
            # Probably an empty table marker or multiline text
            continue
        row = []
        for p in parts:
            if p == '\\N':
                row.append(None)
            elif p == 't':
                row.append(1)
            elif p == 'f':
                row.append(0)
            else:
                row.append(p)
        rows_data.append(row)
        
    if rows_data:
        try:
            cur.executemany(insert_sql, rows_data)
            imported_tables += 1
            imported_rows += len(rows_data)
        except Exception as e:
            print(f"Error loading {table_name}: {e}")

conn.commit()

print("\n=== VERIFYING LOADED TARGET SQLITE ===")
key_tables = [
    'portfolio_project',
    'portfolio_projectcategory',
    'portfolio_projectimage',
    'blog_post',
    'blog_blogcategory',
    'service_service',
    'websites_website',
    'websites_websitefeature',
    'websites_websitecategory',
    'pricing_pricingplan',
    'pricing_pricingfeature',
    'public_sitesettings'
]

for t in key_tables:
    count = cur.execute(f'SELECT count(*) FROM "{t}"').fetchone()[0]
    print(f"  {t:<30}: {count}")

print(f"\nTotal Imported: {imported_tables} tables, {imported_rows} rows.")
conn.close()

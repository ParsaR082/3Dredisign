import sqlite3

c = sqlite3.connect('prisma/production_server.db')
tables = [r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]
settings_tables = [t for t in tables if any(w in t.lower() for w in ['setting', 'hero', 'landing', 'about', 'contact', 'public', 'stat', 'team', 'testimonial'])]

print(f"{'Table Name':<40} {'Rows'}")
print("=" * 50)
for t in sorted(settings_tables):
    try:
        count = c.execute(f'SELECT count(*) FROM "{t}"').fetchone()[0]
        print(f"{t:<40} {count}")
    except Exception as e:
        print(f"{t:<40} (error: {e})")

import sqlite3, sys
sys.stdout.reconfigure(encoding='utf-8')

c = sqlite3.connect('prisma/production_server.db')

def show(table):
    print(f"\n=== {table} ===")
    cols = [r[1] for r in c.execute(f'PRAGMA table_info("{table}")').fetchall()]
    rows = c.execute(f'SELECT * FROM "{table}"').fetchall()
    print('Columns:', cols)
    for r in rows:
        print(dict(zip(cols, r)))

show('public_landingpage')
show('public_landinggrowthstat')
show('public_landingwhyitem')
show('public_landingprocessstep')
show('public_landingtickeritem')
show('public_landingroiconfig')
show('public_instagramreelsconfig')
show('public_instagramreel')

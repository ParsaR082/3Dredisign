import sqlite3

conn = sqlite3.connect('prisma/production_server.db')
c = conn.cursor()
c.execute("""
    UPDATE public_sitesettings 
    SET telegram_url = 'https://t.me/Urumsimaa', 
        instagram_url = 'https://instagram.com/urum_sima', 
        rubika_url = 'https://rubika.ir/urumsima' 
    WHERE id = 1
""")
conn.commit()
print('Rows updated:', c.rowcount)

c.execute("SELECT id, instagram_url, telegram_url, rubika_url FROM public_sitesettings WHERE id = 1")
print('Updated row:', c.fetchone())
conn.close()

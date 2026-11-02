import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('D:/Projects/UrumSima/SEO/urumsima.ir/UrumsimaWeb/db.sqlite3')
cur = conn.cursor()

print("--- LOCAL PRICING PLANS ---")
for r in cur.execute('SELECT id, name, monthly_price, yearly_price, is_popular, "order" FROM pricing_pricingplan ORDER BY "order"'):
    print(r)

print("\n--- LOCAL WEBSITES ---")
for r in cur.execute('SELECT id, title, slug, live_url, cover_image, category_id, "order" FROM websites_website ORDER BY "order"'):
    print(r)

print("\n--- LOCAL BLOG POSTS COUNT ---")
print(cur.execute('SELECT count(*) FROM blog_post').fetchone()[0])

print("\n--- LOCAL PORTFOLIO PROJECTS COUNT ---")
print(cur.execute('SELECT count(*) FROM portfolio_project').fetchone()[0])

conn.close()

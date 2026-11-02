import sqlite3

c = sqlite3.connect('scratch/server_db.sqlite3')
tables = [r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]
print('Total tables in server_db.sqlite3:', len(tables))
print('Has portfolio_project:', 'portfolio_project' in tables)
print('Has blog_post:', 'blog_post' in tables)
print('Has websites_website:', 'websites_website' in tables)
print('Has pricing_pricingplan:', 'pricing_pricingplan' in tables)

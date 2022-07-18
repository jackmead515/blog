from xml.dom import minidom
import yaml
import os

"""
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>http://www.example.com/sitemap1.xml.gz</loc>
		<lastmod>2004-10-01T18:23:17+00:00</lastmod>
	</sitemap>
	<sitemap>
		<loc>http://www.example.com/sitemap2.xml.gz</loc>
		<lastmod>2005-01-01</lastmod>
	</sitemap>
</sitemapindex>
"""

if __name__ == "__main__":

    url = 'https://www.speblog.org/blog/'
    folder = '../server/blogs/meta'
    save_file = './sitemap.xml'
    files = os.listdir(folder)
    results = []

    for file in files:
        with open(f'{folder}/{file}', 'r') as f:
            results.append(yaml.safe_load(f))

    root = minidom.Document()

    sitemapindex = root.createElement('sitemapindex')
    sitemapindex.setAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

    for result in results:
        sitemap = root.createElement('sitemap')
        loc = root.createElement('loc')
        loc.appendChild(root.createTextNode(f'{url}{result["link"]}'))
        sitemap.appendChild(loc)
        sitemapindex.appendChild(sitemap)

    root.appendChild(sitemapindex)

    with open(save_file, 'w') as f:
        f.write(root.toprettyxml(indent='\t'))

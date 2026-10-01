import os

# Update index page
path1 = 'app/samachar/page.tsx'
content1 = open(path1, 'r', encoding='utf-8').read()

content1 = content1.replace('<main id="main" className="directory" style={{padding: \'2rem\'}}>', '<main id="main" className="directory samachar-main">')
content1 = content1.replace('<h1 style={{fontSize: \'2rem\', fontWeight: 800, marginBottom: \'1rem\', color: \'#111\'}}>', '<h1 className="samachar-header-title">')
content1 = content1.replace('<article key={item.slug} style={{border: \'1px solid #e2e8f0\', borderRadius: \'12px\', padding: \'20px\', background: \'white\'}}>', '<article key={item.slug} className="samachar-article-card">')

open(path1, 'w', encoding='utf-8').write(content1)

# Update detail page
path2 = 'app/samachar/[slug]/page.tsx'
content2 = open(path2, 'r', encoding='utf-8').read()

content2 = content2.replace('<main id="main" className="directory" style={{padding: \'2rem\'}}>', '<main id="main" className="directory samachar-main">')
content2 = content2.replace('<article style={{background: \'white\', borderRadius: \'12px\', padding: \'30px\', border: \'1px solid #e2e8f0\'}}>', '<article className="samachar-detail-article">')
content2 = content2.replace('<h1 style={{fontSize: \'2.2rem\', fontWeight: 800, marginBottom: \'20px\', color: \'#111\', lineHeight: 1.3}}>', '<h1 className="samachar-detail-title">')
content2 = content2.replace('<div style={{position: \'relative\', width: \'100%\', height: \'400px\', marginBottom: \'30px\', borderRadius: \'12px\', overflow: \'hidden\'}}>', '<div className="samachar-cover">')
content2 = content2.replace('<div className="article-body" style={{fontSize: \'1.1rem\', color: \'#2d3748\', lineHeight: 1.7}}>', '<div className="article-body samachar-body" style={{fontSize: \'1.1rem\', color: \'#2d3748\', lineHeight: 1.7}}>')
content2 = content2.replace('<p key={idx} style={{marginBottom: \'20px\'}} dangerouslySetInnerHTML={{ __html: p }} />', '<p key={idx} dangerouslySetInnerHTML={{ __html: p }} />')

open(path2, 'w', encoding='utf-8').write(content2)

print("Updated both pages.")

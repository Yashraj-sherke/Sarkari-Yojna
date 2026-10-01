import os

path = 'app/samachar/[slug]/page.tsx'
content = open(path, 'r', encoding='utf-8').read()

content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport Image from 'next/image';")

image_block = """
          <h1 style={{fontSize: '2.2rem', fontWeight: 800, marginBottom: '20px', color: '#111', lineHeight: 1.3}}>
            {s.title}
          </h1>

          <div style={{marginBottom: '30px', color: '#4a5568', fontWeight: 500}}>
            लेखा: {s.author}
          </div>

          {s.imageUrl && (
            <div style={{position: 'relative', width: '100%', height: '400px', marginBottom: '30px', borderRadius: '12px', overflow: 'hidden'}}>
              <Image src={s.imageUrl} alt={s.title} fill style={{objectFit: 'cover'}} />
            </div>
          )}
"""

content = content.replace("""
          <h1 style={{fontSize: '2.2rem', fontWeight: 800, marginBottom: '20px', color: '#111', lineHeight: 1.3}}>
            {s.title}
          </h1>
          
          <div style={{marginBottom: '30px', color: '#4a5568', fontWeight: 500}}>
            लेखा: {s.author}
          </div>""", image_block)

content = content.replace("<p key={idx} style={{marginBottom: '20px'}}>{p}</p>", "<p key={idx} style={{marginBottom: '20px'}} dangerouslySetInnerHTML={{ __html: p }} />")

open(path, 'w', encoding='utf-8').write(content)
print("Updated page.tsx")

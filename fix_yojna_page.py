import os

path = r'app\yojna\[slug]\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """  const s=await getScheme(slug);
  if(!s) return notFound();"""
replacement = """  const s=await getScheme(slug);
  if(!s || (s.status !== 'ACTIVE' && s.status !== 'CLOSED' && s.status !== 'ARCHIVED')) return notFound();"""

if target in content:
    content = content.replace(target, replacement)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated public routing protection.")
else:
    print("Target not found. Let's try flexible replace.")
    content = content.replace('if(!s) return notFound();', "if(!s || (s.status !== 'ACTIVE' && s.status !== 'CLOSED' && s.status !== 'ARCHIVED')) return notFound();")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Forced replace public routing protection.")

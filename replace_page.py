import os

path = 'app/page.tsx'
content = open(path, 'r', encoding='utf-8').read()

content = content.replace("import { allSchemes } from '@/lib/server';", "import { allSchemes } from '@/lib/server';\nimport { getAllSamachar } from '@/lib/samachar';")
content = content.replace('<Directory schemes={schemes.map(summarizeScheme)} initialState="central" isHomePage={true} />', '<Directory schemes={schemes.map(summarizeScheme)} latestNews={latestNews} initialState="central" isHomePage={true} />')

open(path, 'w', encoding='utf-8').write(content)
print("Updated app/page.tsx")

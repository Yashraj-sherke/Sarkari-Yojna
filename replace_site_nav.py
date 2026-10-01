import os

path = 'components/site.tsx'
content = open(path, 'r', encoding='utf-8').read()

old_nav = """        {[
          {href:'/',label:t.navSearch},
          {href:'/mere-liye',label:t.navForMe},
          {href:'/guide',label:t.navGuide},
        ]"""

new_nav = """        {[
          {href:'/',label:t.navSearch},
          {href:'/mere-liye',label:t.navForMe},
          {href:'/guide',label:t.navGuide},
          {href:'/samachar',label:lang==='hi'?'समाचार':'News'},
        ]"""

if old_nav in content:
    content = content.replace(old_nav, new_nav)
    open(path, 'w', encoding='utf-8').write(content)
    print("Updated navbar in site.tsx")
else:
    print("Could not find the nav section in site.tsx")

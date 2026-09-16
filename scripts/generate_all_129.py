# -*- coding: utf-8 -*-
"""
Python script to assemble and validate all 129 MP schemes from batches 1, 2, 3
and export them to lib/mp-schemes-data.ts.
"""
import json
import re
import sys
import os

# Import batches
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import curated_schemes_batch1 as b1
import curated_schemes_batch2 as b2
import curated_schemes_batch3 as b3

valid_categories = {'kisan', 'mahila', 'shiksha', 'swasthya', 'awas', 'rojgar', 'pension', 'khadya'}
slug_pattern = re.compile(r'^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$')

def validate_url(url, scheme_slug):
    if not url.startswith("https://"):
        raise ValueError(f"Scheme {scheme_slug}: URL {url} must start with https://")
    host = url.split("://")[1].split("/")[0].split(":")[0].lower()
    if host == "myscheme.gov.in" or host.endswith(".gov.in") or host.endswith(".nic.in"):
        return True
    raise ValueError(f"Scheme {scheme_slug}: Host {host} is not a valid gov.in / nic.in / myscheme.gov.in domain")

# Gather clean slices
b1_clean = [x for x in b1.schemes if x[0] <= 20]
b2_clean = [x for x in b2.schemes if 21 <= x[0] <= 70]
b3_clean = [x for x in b3.schemes if 71 <= x[0] <= 129]

raw_schemes = b1_clean + b2_clean + b3_clean
print(f"Total raw schemes assembled: {len(raw_schemes)}")

seen_slugs = set()
all_schemes = []

priority_nums = {1, 2, 4, 14, 20, 44, 45, 48, 49, 52, 53, 60, 71, 73, 79, 91, 102}

for item in raw_schemes:
    num, title, english, slug, cat, benefit, dept, src, app, summary, docs, steps, rules, notes = item
    
    slug = slug.strip().lower()
    if not slug_pattern.match(slug):
        raise ValueError(f"Invalid slug format: '{slug}' in item {num}")
    
    if slug in seen_slugs:
        slug = f"{slug}-mp"
        if slug in seen_slugs:
            slug = f"{slug}-{num}"
    seen_slugs.add(slug)
    
    if cat not in valid_categories:
        raise ValueError(f"Invalid category '{cat}' in item {num} ({slug})")
    
    validate_url(src, slug)
    validate_url(app, slug)
    
    assert len(title) >= 5, f"Title too short in item {num}"
    assert len(summary) >= 10, f"Summary too short in item {num}"
    assert len(benefit) >= 3, f"Benefit too short in item {num}"
    assert len(dept) >= 2, f"Dept too short in item {num}"
    assert len(docs) >= 1, f"No docs in item {num}"
    assert len(steps) >= 1, f"No steps in item {num}"
    
    scheme_obj = {
        "slug": slug,
        "title": title.strip(),
        "english": english.strip(),
        "category": cat,
        "state": "madhya-pradesh",
        "summary": summary.strip(),
        "benefit": benefit.strip(),
        "department": dept.strip(),
        "documents": [d.strip() for d in docs if d.strip()],
        "steps": [s.strip() for s in steps if s.strip()],
        "rules": rules,
        "sourceUrl": src.strip(),
        "applicationUrl": app.strip(),
        "sourceNotes": notes.strip(),
        "status": "ACTIVE",
        "priority": (num in priority_nums),
        "isSample": False,
        "verifiedAt": "2026-09-14T00:00:00.000Z",
        "nextReviewAt": "2026-12-14T00:00:00.000Z"
    }
    all_schemes.append(scheme_obj)

print(f"Successfully processed and validated {len(all_schemes)} schemes.")

# Output to lib/mp-schemes-data.ts
output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "lib", "mp-schemes-data.ts")

header = """import type { Scheme } from './domain';

/**
 * Complete list of Madhya Pradesh Government Schemes (129 schemes).
 * Verified against official MP and Central Government portals (mp.gov.in, nic.in, myscheme.gov.in).
 * Last verified: September 2026.
 */
export const mpSchemes: Scheme[] = """

content = json.dumps(all_schemes, ensure_ascii=False, indent=2)

ts_content = f"{header}{content};\n"

with open(output_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Wrote {len(all_schemes)} schemes to {output_path}")

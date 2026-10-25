# Four state-scheme content updates — 11 October 2026

The content is original Hindi based on official sources. The existing GOBARdhan page is a layout/depth reference, not a source for these four schemes. Existing route slugs are preserved.

## Search intent and long-tail phrases

These are relevant editorial targets, not measured trending keywords. No keyword-volume, ranking or traffic forecast is claimed. Use real Search Console query/page data to prioritize future updates.

| Route | Primary intent | Natural long-tail phrases covered |
| --- | --- | --- |
| `/yojna/rajasthan-palanhar-yojana` | Assistance, eligibility and application | राजस्थान पालनहार योजना कितनी राशि मिलती है; पालनहार योजना आय सीमा; पालनहार योजना दस्तावेज़; Palanhar payment status; पालनहार वार्षिक सत्यापन |
| `/yojna/up-kanya-sumangala-yojana` | Six stages and application preparation | UP Kanya Sumangala Yojana 25000; कन्या सुमंगला छह किस्तें; कन्या सुमंगला जुड़वा बच्ची पात्रता; Kanya Sumangala online apply; कन्या सुमंगला login ID और status |
| `/yojna/bihar-kanya-utthan-yojana` | Identify the correct education component | Bihar Kanya Utthan graduation scholarship 50000; इंटर कन्या उत्थान 25000; MedhaSoft स्नातक विश्वविद्यालय सूची; Kanya Utthan application status; कन्या उत्थान DBT seeding |
| `/yojna/haryana-chiranjeevi-yojana` | Correct scheme identity, card and treatment | Haryana Chiranjeevi vs Chirayu; Haryana Chirayu Ayushman Yojana Family ID; Chirayu 1500 4000 5000 contribution; चिरायु कार्ड online apply; हरियाणा आयुष्मान अस्पताल लिस्ट |

## Source decisions

- Rajasthan: the department FAQ gives separate orphan/other-category rates. Do not use ₹2,500 as a universal rate. The annual ₹2,000 payment excludes widow/nata palanhar categories. Residence-document and income-document exemptions are distinct.
- Uttar Pradesh: current portal stage descriptions and the citizen manual support ₹25,000 total. The old process-flow's ₹15,000 is historical. The portal Aadhaar notice supersedes old optional-Aadhaar wording. Some scanned receipt text is inconsistent, so the current stage table is used. Maintenance does not establish closure. No universal 2026 deadline is invented.
- Bihar: inter and graduation components are separate. Current portal notices support the result cohort through 31 December 2025. Amounts are traced to the state's gender-budget policy and current education-component portals. The full INTER 2026 registration PDF could not be read; marital-status, income, marks and complete document requirements are not guessed. The article is explicitly NEEDS_VERIFICATION / DRAFT_REVIEW_REQUIRED, with runtime status REQUIRES_OFFICIAL_VERIFICATION.
- Haryana: the official name is Chirayu–Ayushman Bharat. The older department overview omits higher-income tiers; the official 22 September 2026 release supports ₹4,000/₹5,000 tiers and ₹5 lakh cover. Exact boundary classification is left to the government record because official descriptions differ at boundaries. No unsourced enrollment deadline or ten-lakh cover is used.

## Current limits

This is a repository content update, not a production deployment or database mutation. The runtime enriches existing records for these slugs, and fallback seeds include all four records. Schema checks establish data/URL format, not correctness of government facts. Government sources may change after the verification date; a 30-day review date is included.

## Artifacts

Each scheme has a citizen-facing `.md` article and structured `.json` record. JSON follows the website's actual Scheme schema. The manifest records content and verification status. `scripts/export-reviewed-state-schemes.ts` validates and regenerates these files.

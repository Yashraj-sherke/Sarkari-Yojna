# Keyword-to-page map

| Search intent | Canonical route | Status |
|---|---|---|
| सरकारी योजना सूची / Sarkari Yojana list | `/yojna` | Implemented |
| पात्रता के आधार पर योजना खोजें | `/mere-liye` | Implemented, noindex results |
| किसान सरकारी योजनाएं | `/category/kisan` | Implemented when reviewed content exists |
| मध्य प्रदेश सरकारी योजनाएं | `/state/madhya-pradesh` | Implemented when reviewed content exists |
| योजना लाभ, पात्रता, दस्तावेज़, आवेदन | `/yojna/[slug]` | Implemented for reviewed scheme pages |
| आवेदन तैयारी और दस्तावेज़ | `/guide` and `/guide/[slug]` | Implemented |
| सत्यापन और संचालन स्थिति | `/status-directory` | Implemented |

Separate eligibility, status, payment, e-KYC or beneficiary-list pages should be created only when official evidence supports a complete standalone answer; synonyms should remain consolidated on the evergreen scheme URL.

# -*- coding: utf-8 -*-
"""
Generates high-resolution, lightweight SVG banners for Government Schemes.
Includes tricolor accents, emblem badges, official typography, and theme graphics.
"""
import os

BANNERS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "banners")
os.makedirs(BANNERS_DIR, exist_ok=True)

def make_banner_svg(title, subtitle, badge_text, category_label, theme_colors, icon_svg):
    bg_start, bg_mid, bg_end, accent_color, badge_bg = theme_colors
    
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg_start}"/>
      <stop offset="50%" stop-color="{bg_mid}"/>
      <stop offset="100%" stop-color="{bg_end}"/>
    </linearGradient>
    <linearGradient id="tricolor" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF9933"/>
      <stop offset="50%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#138808"/>
    </linearGradient>
    <linearGradient id="badge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{badge_bg}"/>
      <stop offset="100%" stop-color="{accent_color}"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-10%" width="110%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000" flood-opacity="0.35"/>
    </filter>
    <pattern id="mesh" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.2" fill="#ffffff" fill-opacity="0.08"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="400" fill="url(#bg)"/>
  
  <!-- Subtle Dot Grid Overlay -->
  <rect width="1200" height="400" fill="url(#mesh)"/>

  <!-- Tricolor Top Accent Strip -->
  <rect x="0" y="0" width="1200" height="7" fill="url(#tricolor)"/>

  <!-- Background Decorative Rings / Glow -->
  <circle cx="1080" cy="200" r="220" fill="{accent_color}" fill-opacity="0.12"/>
  <circle cx="1080" cy="200" r="160" fill="none" stroke="{accent_color}" stroke-width="2" stroke-opacity="0.25" stroke-dasharray="8 6"/>
  <circle cx="1080" cy="200" r="110" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.2"/>

  <!-- Left Content Area -->
  <g transform="translate(60, 55)">
    <!-- Category & Gov Pill -->
    <rect x="0" y="0" width="280" height="34" rx="17" fill="#ffffff" fill-opacity="0.15" stroke="#ffffff" stroke-opacity="0.25"/>
    <circle cx="17" cy="17" r="6" fill="#FF9933"/>
    <text x="32" y="22" font-family="'Nirmala UI', 'Segoe UI', Arial, sans-serif" font-size="13" font-weight="700" fill="#ffffff" letter-spacing="1">
      आधिकारिक सरकारी योजना · {category_label}
    </text>

    <!-- Scheme Main Title -->
    <text x="0" y="92" font-family="'Nirmala UI', 'Noto Sans Devanagari', Arial, sans-serif" font-size="40" font-weight="800" fill="#ffffff" filter="url(#shadow)">
      {title}
    </text>

    <!-- Subtitle / Department -->
    <text x="0" y="132" font-family="'Nirmala UI', 'Segoe UI', Arial, sans-serif" font-size="17" font-weight="600" fill="#e2ede5">
      {subtitle}
    </text>

    <!-- Benefit Highlight Pill -->
    <g transform="translate(0, 165)">
      <rect x="0" y="0" width="620" height="60" rx="12" fill="url(#badge-grad)" filter="url(#shadow)"/>
      <rect x="2" y="2" width="616" height="56" rx="10" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.35"/>
      <circle cx="32" cy="30" r="15" fill="#ffffff" fill-opacity="0.25"/>
      <text x="25" y="36" font-family="Arial, sans-serif" font-size="18" fill="#ffffff">★</text>
      <text x="60" y="37" font-family="'Nirmala UI', 'Noto Sans Devanagari', Arial, sans-serif" font-size="20" font-weight="800" fill="#ffffff">
        {badge_text}
      </text>
    </g>

    <!-- Verification / Safety Footer -->
    <g transform="translate(0, 255)">
      <text x="0" y="18" font-family="'Nirmala UI', 'Segoe UI', Arial, sans-serif" font-size="13" font-weight="600" fill="#cbdad0">
        ✓ आधिकारिक पोर्टल से सत्यापित · प्रत्यक्ष लाभ अंतरण (DBT) · निःशुल्क आवेदन
      </text>
    </g>
  </g>

  <!-- Right Visual Motif -->
  <g transform="translate(1000, 120)">
    {icon_svg}
  </g>
</svg>
"""

# Theme Palettes: (bg_start, bg_mid, bg_end, accent_color, badge_bg)
PALETTES = {
    "health": ("#06232d", "#0c3b4a", "#145163", "#00d2b4", "#0a7065"),
    "housing": ("#3d1808", "#61270c", "#823612", "#ff8a43", "#a84110"),
    "ration": ("#382404", "#5c3d08", "#78510d", "#f0b832", "#946710"),
    "artisan": ("#0a1836", "#142c5c", "#1f4287", "#38b6ff", "#1861b5"),
    "solar": ("#062438", "#0f3e61", "#175685", "#ffb703", "#b56f04"),
    "loan": ("#062920", "#0c4537", "#135e4b", "#10e89b", "#0b8058"),
    "pension": ("#121938", "#1e2954", "#2c3b75", "#64b5f6", "#234d87"),
    "gas": ("#360813", "#5c0f22", "#7d1630", "#ff4d6d", "#a61234"),
    "women": ("#380824", "#5c0f3c", "#7d1753", "#ff66c4", "#a11867"),
    "kisan": ("#0d2b17", "#174a28", "#206337", "#48db6e", "#1b783b"),
    "shiksha": ("#0a2142", "#13376b", "#1d4c8f", "#4dabf7", "#195cb0"),
    "rojgar": ("#260f38", "#411a5e", "#5a2582", "#b388ff", "#65239e")
}

SCHEMES_BANNERS = [
    ("ayushman-bharat.svg", "आयुष्मान भारत PM-JAY", "स्वास्थ्य एवं परिवार कल्याण मंत्रालय, भारत सरकार",
     "₹5,00,000 / वर्ष अस्पताल में मुफ्त उपचार", "स्वास्थ्य व देखभाल", PALETTES["health"],
     """<!-- Health Cross & Shield -->
     <circle cx="80" cy="80" r="75" fill="#00d2b4" fill-opacity="0.18"/>
     <circle cx="80" cy="80" r="60" fill="#00d2b4" fill-opacity="0.25"/>
     <path d="M70 40 h20 v25 h25 v20 h-25 v25 h-20 v-25 h-25 v-20 h25 z" fill="#ffffff" filter="url(#shadow)"/>
     <path d="M40 80 Q80 120 120 80" stroke="#00d2b4" stroke-width="6" fill="none" stroke-linecap="round"/>"""),

    ("pm-awas-gramin.svg", "प्रधानमंत्री आवास योजना (ग्रामीण)", "ग्रामीण विकास मंत्रालय, भारत सरकार",
     "₹1,20,000 पक्का मकान निर्माण वित्तीय सहायता", "आवास व निर्माण", PALETTES["housing"],
     """<!-- House Silhouette -->
     <circle cx="80" cy="80" r="75" fill="#ff8a43" fill-opacity="0.18"/>
     <polygon points="80,35 30,75 45,75 45,125 115,125 115,75 130,75" fill="#ffffff" filter="url(#shadow)"/>
     <rect x="68" y="90" width="24" height="35" rx="3" fill="#a84110"/>
     <rect x="88" y="60" width="16" height="16" rx="2" fill="#ff8a43"/>"""),

    ("ration-support.svg", "राष्ट्रीय खाद्य सुरक्षा योजना (NFSA)", "खाद्य एवं सार्वजनिक वितरण विभाग, भारत सरकार",
     "5 किलो प्रति व्यक्ति/माह पूर्णतः निःशुल्क राशन", "खाद्य एवं राशन", PALETTES["ration"],
     """<!-- Wheat Sheaf Motif -->
     <circle cx="80" cy="80" r="75" fill="#f0b832" fill-opacity="0.18"/>
     <path d="M80 130 Q80 40 80 30 M80 50 Q60 40 65 30 Q80 40 80 50 M80 50 Q100 40 95 30 Q80 40 80 50 M80 75 Q55 65 60 50 Q80 65 80 75 M80 75 Q105 65 100 50 Q80 65 80 75 M80 100 Q55 90 60 75 Q80 90 80 100 M80 100 Q105 90 100 75 Q80 90 80 100" stroke="#ffffff" stroke-width="4.5" fill="#f0b832" stroke-linecap="round"/>"""),

    ("pm-vishwakarma.svg", "प्रधानमंत्री विश्वकर्मा योजना", "सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय, भारत सरकार",
     "₹15,000 टूलकिट अनुदान + ₹3 लाख रियायती ऋण", "रोज़गार व शिल्प", PALETTES["artisan"],
     """<!-- Tools & Gear -->
     <circle cx="80" cy="80" r="75" fill="#38b6ff" fill-opacity="0.18"/>
     <circle cx="80" cy="80" r="45" fill="none" stroke="#ffffff" stroke-width="8" stroke-dasharray="16 10"/>
     <circle cx="80" cy="80" r="20" fill="#38b6ff"/>
     <path d="M50 110 L110 50 M50 50 L110 110" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>"""),

    ("pm-surya-ghar.svg", "पीएम सूर्य घर: मुफ्त बिजली योजना", "नवीन एवं नवीकरणीय ऊर्जा मंत्रालय, भारत सरकार",
     "₹78,000 तक सोलर सब्सिडी · 300 यूनिट/माह मुफ्त बिजली", "आवास व ऊर्जा", PALETTES["solar"],
     """<!-- Solar Panel & Sun -->
     <circle cx="80" cy="80" r="75" fill="#ffb703" fill-opacity="0.18"/>
     <circle cx="80" cy="45" r="22" fill="#ffb703"/>
     <polygon points="40,115 120,115 105,75 55,75" fill="#ffffff" stroke="#0f3e61" stroke-width="3"/>
     <line x1="80" y1="75" x2="80" y2="115" stroke="#0f3e61" stroke-width="2"/>
     <line x1="50" y1="95" x2="110" y2="95" stroke="#0f3e61" stroke-width="2"/>"""),

    ("pm-mudra.svg", "प्रधानमंत्री मुद्रा योजना (PMMY)", "वित्तीय सेवाएं विभाग, वित्त मंत्रालय, भारत सरकार",
     "₹50,000 से ₹10 लाख बिना गारंटी व्यावसायिक ऋण", "स्वरोज़गार ऋण", PALETTES["loan"],
     """<!-- Rupee Growth Symbol -->
     <circle cx="80" cy="80" r="75" fill="#10e89b" fill-opacity="0.18"/>
     <circle cx="80" cy="80" r="55" fill="#10e89b" fill-opacity="0.25"/>
     <text x="56" y="105" font-family="'Nirmala UI', Arial" font-size="75" font-weight="900" fill="#ffffff">₹</text>
     <polyline points="40,120 70,95 95,105 125,70" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>"""),

    ("atal-pension.svg", "अटल पेंशन योजना (APY)", "पेंशन निधि विनियामक एवं विकास प्राधिकरण (PFRDA)",
     "₹1,000 से ₹5,000/माह आजीवन गारंटीड पेंशन", "पेंशन व सुरक्षा", PALETTES["pension"],
     """<!-- Umbrella / Shield of Care -->
     <circle cx="80" cy="80" r="75" fill="#64b5f6" fill-opacity="0.18"/>
     <path d="M40 75 Q80 25 120 75 Z" fill="#ffffff"/>
     <line x1="80" y1="75" x2="80" y2="115" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
     <path d="M80 115 Q80 128 70 125" stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round"/>"""),

    ("pm-ujjwala.svg", "प्रधानमंत्री उज्ज्वला योजना 2.0", "पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय, भारत सरकार",
     "निःशुल्क नया LPG गैस कनेक्शन + भरा सिलेंडर व चूल्हा", "महिला कल्याण", PALETTES["gas"],
     """<!-- Gas Cylinder & Clean Flame -->
     <circle cx="80" cy="80" r="75" fill="#ff4d6d" fill-opacity="0.18"/>
     <rect x="60" y="55" width="40" height="70" rx="10" fill="#ffffff"/>
     <rect x="70" y="45" width="20" height="12" rx="3" fill="#ffffff"/>
     <path d="M80 25 Q92 38 80 50 Q68 38 80 25 Z" fill="#ff4d6d"/>"""),

    ("ladli-laxmi.svg", "मुख्यमंत्री लाड़ली लक्ष्मी योजना", "महिला एवं बाल विकास विभाग, मध्य प्रदेश",
     "₹1,43,000 का प्रमाण पत्र · 21 वर्ष पर ₹1 लाख", "बालिका सशक्तिकरण", PALETTES["women"],
     """<!-- Girl Child & Stars -->
     <circle cx="80" cy="80" r="75" fill="#ff66c4" fill-opacity="0.18"/>
     <circle cx="80" cy="55" r="22" fill="#ffffff"/>
     <path d="M50 120 Q80 85 110 120 Z" fill="#ffffff"/>
     <polygon points="120,40 123,47 130,48 125,53 126,60 120,56 114,60 115,53 110,48 117,47" fill="#ff66c4"/>"""),
]

# Category Generic Banners (covers any scheme in that category)
CATEGORY_BANNERS = [
    ("cat-kisan.svg", "किसान कल्याण एवं कृषि विकास योजनाएं", "कृषि विभाग · प्रमाणित बीज, यंत्र व सिंचाई अनुदान",
     "75% तक सरकारी सब्सिडी व वित्तीय संबल", "कृषि एवं किसान", PALETTES["kisan"],
     """<circle cx="80" cy="80" r="75" fill="#48db6e" fill-opacity="0.18"/>
     <path d="M80 130 Q80 40 80 30 M80 60 Q50 50 55 35 Q80 50 80 60 M80 60 Q110 50 105 35 Q80 50 80 60 M80 90 Q45 80 50 60 Q80 80 80 90 M80 90 Q115 80 110 60 Q80 80 80 90" stroke="#ffffff" stroke-width="5" fill="#48db6e" stroke-linecap="round"/>"""),

    ("cat-mahila.svg", "महिला एवं बाल विकास योजनाएं", "महिला सशक्तिकरण · पोषण, शिक्षा व आर्थिक सुरक्षा",
     "लाड़ली लक्ष्मी, लाड़ली बहना व कन्या कल्याण", "महिला व बालिका", PALETTES["women"],
     """<circle cx="80" cy="80" r="75" fill="#ff66c4" fill-opacity="0.18"/>
     <circle cx="80" cy="60" r="24" fill="#ffffff"/>
     <path d="M45 125 Q80 90 115 125 Z" fill="#ffffff"/>"""),

    ("cat-shiksha.svg", "शिक्षा एवं छात्रवृत्ति योजनाएं", "स्कूल, कॉलेज, उच्च शिक्षा एवं निःशुल्क कोचिंग",
     "100% तक शिक्षण शुल्क छूट व छात्रवृत्ति", "शिक्षा व विद्यार्थी", PALETTES["shiksha"],
     """<circle cx="80" cy="80" r="75" fill="#4dabf7" fill-opacity="0.18"/>
     <polygon points="80,45 30,70 80,95 130,70" fill="#ffffff"/>
     <rect x="55" y="85" width="50" height="30" rx="3" fill="#ffffff"/>
     <line x1="125" y1="72" x2="125" y2="105" stroke="#ffffff" stroke-width="4"/>"""),

    ("cat-swasthya.svg", "स्वास्थ्य एवं चिकित्सा कल्याण योजनाएं", "निःशुल्क उपचार, जांच, दवाएं व सर्जरी सहायता",
     "आयुष्मान भारत व राज्य स्वास्थ्य सुरक्षा कवर", "स्वास्थ्य व देखभाल", PALETTES["health"],
     """<circle cx="80" cy="80" r="75" fill="#00d2b4" fill-opacity="0.18"/>
     <path d="M70 40 h20 v25 h25 v20 h-25 v25 h-20 v-25 h-25 v-20 h25 z" fill="#ffffff"/>"""),

    ("cat-awas.svg", "आवास एवं बुनियादी सुविधा योजनाएं", "पक्के मकान, ग्रामीण व शहरी आवास मिशन",
     "₹1.20 लाख से ₹2.5 लाख तक आवास अनुदान", "आवास व निर्माण", PALETTES["housing"],
     """<circle cx="80" cy="80" r="75" fill="#ff8a43" fill-opacity="0.18"/>
     <polygon points="80,35 30,75 45,75 45,125 115,125 115,75 130,75" fill="#ffffff"/>"""),

    ("cat-rojgar.svg", "रोज़गार, कौशल एवं स्वरोज़गार योजनाएं", "व्यावसायिक ऋण, कौशल विकास एवं स्टाइपेंड योजना",
     "₹8,000–10,000 स्टाइपेंड व कम ब्याज बैंक ऋण", "रोज़गार व उद्यम", PALETTES["rojgar"],
     """<circle cx="80" cy="80" r="75" fill="#b388ff" fill-opacity="0.18"/>
     <rect x="40" y="55" width="80" height="60" rx="8" fill="#ffffff"/>
     <path d="M60 55 V45 Q60 38 68 38 H92 Q100 38 100 45 V55" fill="none" stroke="#ffffff" stroke-width="5"/>"""),

    ("cat-pension.svg", "पेंशन एवं सामाजिक सुरक्षा योजनाएं", "वरिष्ठ नागरिक, दिव्यांगजन व विधवा पेंशन",
     "नियमित मासिक वित्तीय सहायता सीधे बैंक में", "पेंशन व संबल", PALETTES["pension"],
     """<circle cx="80" cy="80" r="75" fill="#64b5f6" fill-opacity="0.18"/>
     <circle cx="65" cy="55" r="16" fill="#ffffff"/>
     <circle cx="95" cy="55" r="16" fill="#ffffff"/>
     <path d="M45 120 Q65 85 85 120 Z M75 120 Q95 85 115 120 Z" fill="#ffffff"/>"""),

    ("cat-khadya.svg", "खाद्य, राशन एवं पोषण सुरक्षा योजनाएं", "निःशुल्क राशन, अन्नपूर्णा व उचित मूल्य दुकान",
     "5 किलो/व्यक्ति/माह खाद्यान्न व रियायती गैस", "राशन व पोषण", PALETTES["ration"],
     """<circle cx="80" cy="80" r="75" fill="#f0b832" fill-opacity="0.18"/>
     <path d="M80 130 Q80 40 80 30 M80 50 Q60 40 65 30 Q80 40 80 50 M80 50 Q100 40 95 30 Q80 40 80 50 M80 75 Q55 65 60 50 Q80 65 80 75 M80 75 Q105 65 100 50 Q80 65 80 75" stroke="#ffffff" stroke-width="4" fill="#f0b832"/>""")
]

total_written = 0
for fname, title, sub, badge, cat, pal, icon in SCHEMES_BANNERS + CATEGORY_BANNERS:
    content = make_banner_svg(title, sub, badge, cat, pal, icon)
    filepath = os.path.join(BANNERS_DIR, fname)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    total_written += 1

print(f"Generated {total_written} high-resolution scheme and category SVG banners in {BANNERS_DIR}")

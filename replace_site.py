import os

path = 'components/site.tsx'
content = open(path, 'r', encoding='utf-8').read()

# 1. Add Newspaper to lucide-react import
content = content.replace(
    'import {Sprout,HeartHandshake,GraduationCap,HeartPulse,House,BriefcaseBusiness,Accessibility,Wheat,ArrowUpRight,ArrowRight,ShieldCheck,MapPin,Menu,Search,Users,Bookmark,Bell,Compass,Info,Check,ChevronRight,Languages,FileText,BookOpen,AlertCircle,Mail} from \'lucide-react\';',
    'import {Sprout,HeartHandshake,GraduationCap,HeartPulse,House,BriefcaseBusiness,Accessibility,Wheat,ArrowUpRight,ArrowRight,ShieldCheck,MapPin,Menu,Search,Users,Bookmark,Bell,Compass,Info,Check,ChevronRight,Languages,FileText,BookOpen,AlertCircle,Mail,Newspaper} from \'lucide-react\';'
)

# 2. Add Samachar link in Sidebar
content = content.replace(
    '<Link className="side-item" href="/mere-liye"><Users size={19}/>{t.navForMe}</Link>',
    '<Link className="side-item" href="/samachar"><Newspaper size={19}/>समाचार (News)</Link>\n    <Link className="side-item" href="/mere-liye"><Users size={19}/>{t.navForMe}</Link>'
)

# 3. Export Newspaper just in case it's needed elsewhere (as it exports shared icons)
content = content.replace(
    'export {ArrowRight,Search,ShieldCheck,MapPin};',
    'export {ArrowRight,Search,ShieldCheck,MapPin,Newspaper};'
)

open(path, 'w', encoding='utf-8').write(content)
print("Updated components/site.tsx")

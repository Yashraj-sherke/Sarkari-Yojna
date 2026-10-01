import os

path = 'components/directory.tsx'
content = open(path, 'r', encoding='utf-8').read()

# 1. Update props
content = content.replace(
    "export function Directory({ schemes, initialCategory = 'all', initialState = 'all', isHomePage = false }: { schemes: SchemeSummary[]; initialCategory?: string; initialState?: string; isHomePage?: boolean }) {",
    "export function Directory({ schemes, initialCategory = 'all', initialState = 'all', isHomePage = false, latestNews = [] }: { schemes: SchemeSummary[]; initialCategory?: string; initialState?: string; isHomePage?: boolean; latestNews?: any[] }) {"
)

# 2. Insert news section
news_html = """      </section>

      {isHomePage && latestNews && latestNews.length > 0 && (
        <section className="latest-news-section" style={{marginTop: 30, marginBottom: 30, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20}}>
          <div className="section-heading" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
            <div><h2 style={{fontSize: '1.25rem'}}>ताज़ा समाचार</h2><p style={{fontSize: '0.9rem', color: '#718096'}}>योजनाओं से जुड़ी नवीनतम जानकारी</p></div>
            <Link href="/samachar" className="text-button" style={{color: '#3182ce', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4}}>सभी समाचार <ArrowRight size={16} /></Link>
          </div>
          <div className="news-grid" style={{display: 'flex', gap: 15, overflowX: 'auto', paddingBottom: 10}}>
            {latestNews.map(item => (
              <Link href={`/samachar/${item.slug}`} key={item.slug} className="news-card" style={{minWidth: 280, maxWidth: 300, flex: '0 0 auto', border: '1px solid #e2e8f0', borderRadius: 8, padding: 15, textDecoration: 'none', color: 'inherit'}}>
                <span className="news-date" style={{fontSize: '0.75rem', color: '#718096', background: '#edf2f7', padding: '2px 8px', borderRadius: 10, display: 'inline-block', marginBottom: 8}}>{new Date(item.date).toLocaleDateString('hi-IN')}</span>
                <h4 style={{fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4}}>{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}

"""

content = content.replace("      </section>\n\n      <div className=\"match-box\">", news_html + "      <div className=\"match-box\">")

open(path, 'w', encoding='utf-8').write(content)
print("Updated components/directory.tsx")

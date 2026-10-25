/** Presentation fixes preserve article facts and existing public URLs. */
export function presentArticleHtml(html: string) {
  return html.replace(/<(\/?)h1\b/gi, '<$1h2')
    .replace(/\/yojna\/ayushman-card-(?:70-plus-benefits|kaise-banaye|eligibility|status|treatment-list)(?=["')\s])/g,
      '/yojna/ayushman-bharat');
}

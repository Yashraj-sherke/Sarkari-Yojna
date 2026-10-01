# Report implementation status — 1 October 2026

## Implemented in this change

- Preserve scheme facts, benefits, eligibility, documents, FAQs and article text.
- Remove automatically appended financial years from detail-page H1, metadata and social metadata.
- Avoid duplicated eligibility/application suffixes in search titles and stop cutting scheme names mid-word.
- Consolidate the five automatically generated, unfinished sub-intent pages into permanent redirects to the main scheme article. Unsupported sub-intents and missing schemes remain 404.
- Add quick facts and conditional question navigation above the article, including on mobile.
- Use the Hindi article consistently when a full English translation is unavailable.
- Stop treating a generic source homepage as an application destination.
- Restrict related schemes to the same category, preferring the same state.
- Represent the independent informational article as WebPage with a Thing subject and source citations, without inferred GovernmentOrganization/provider claims.
- Include supported state hubs in the sitemap only when reviewed indexable schemes exist; derive their dates from their own records.
- Add a correction/contact link alongside sources.

## Existing foundations retained

Reviewed-content index controls, visible source references, department information, source/review dates, exclusions, FAQs, existing guide links, category hubs, sitemap filtering, private-page noindex, admin SEO health and draft news workflow.

## Requires ongoing evidence or account access

- Search Console property verification and private query exports: not available in this task.
- Query popularity, impressions, CTR and ranking changes: cannot be inferred from competitor wording.
- Individual source re-verification across the whole catalogue: not performed or claimed by this template improvement.
- New state-specific content and independent troubleshooting guides: publish after source research and review.
- Backlink outreach and citable research: editorial work, not achieved by internal links.
- Production field Core Web Vitals and indexing results: measure after deployment.
- Deployment: these are repository changes, not confirmation of a live release.

## Weekly operating workflow

Export queries by landing page from Search Console. Group equivalent intents, prioritize useful pages with impressions and positions 8–30, verify the answer with a government source, improve the existing page, add contextual links, record the change and compare 28-day periods. Do not publish a new URL merely for a spelling variation or automatically change the year.

The report's 90-day traffic plan is an ongoing measurement/editorial process; this change implements the applicable shared presentation and technical improvements without rewriting scheme content.

# ERGuide SEO and AI-search audit

- Audit date: 20 August 2026
- Scope: `New Website` static marketing site
- Configured canonical domain: `https://www.erguide.digital/`

## Executive summary

The site already has a sound technical base: one descriptive H1, logical headings, server-rendered product copy, working internal links, responsive layouts, canonical and social metadata, a sitemap, robots rules and valid JSON-LD.

The main SEO risk is not a missing keyword. It is the absence of verified public answers for enterprise buying questions—security, POPIA, hosting, integrations, implementation, content governance, pricing, support and measurable customer results. Those gaps can cause search engines and AI assistants to give incomplete or speculative answers.

This pass improves technical discovery and adds a public product FAQ, while keeping unverified claims clearly marked for confirmation. It does not manufacture reviews, pricing, certifications, supported countries or performance statistics.

## Changes completed in this pass

| Area | Change | Reason |
|---|---|---|
| Search description | Expanded the homepage meta description to include South Africa, Africa, key ER processes and digital case records. | Gives searchers a clearer reason to click and better describes the product category. |
| Robots | Simplified crawler rules, explicitly allowed `OAI-SearchBot`, kept public pages crawlable and blocked accidental crawling of internal docs and the retired team-image folder. | Supports normal search and ChatGPT search while reducing accidental exposure of internal files. |
| Sitemap | Added reliable `lastmod` values and the new FAQ URL. | Helps crawlers discover the complete public site. |
| Product FAQ | Added `faq.html` with direct, visible answers across product, process, legal, technical and buying topics. | Gives people and answer engines a trustworthy source instead of a keyword list. |
| Internal linking | Linked the FAQ from the homepage footer. | Makes the page discoverable through the site's own navigation. |
| Structured data | Added clearer SoftwareApplication fields, feature list, audience, language and provider; removed the empty `sameAs` array and incomplete offer. | Improves entity clarity without inventing public pricing or reviews. |
| Social metadata | Added image type and Twitter image alt text. | Improves social previews and accessibility metadata. |
| Video poster | Replaced the 7.20 MB poster with the existing 168 KB social image and added intrinsic dimensions. | Reduces the poster payload by about 97.7% and prevents layout shift. |
| Logo dimensions | Added width and height to the header and footer logos. | Reduces layout shift. |
| Retired team asset | Removed the unused Dieter photograph from the website source and retained deployment/crawler exclusions for internal team assets. | Prevents the retired image from being published accidentally. |
| No-JavaScript fallback | Reveal content is visible by default and animated only when JavaScript is available. | Prevents a script failure from leaving important content visually hidden. |
| Deployment | Added `README.md` with private S3 + CloudFront OAC deployment, caching, invalidation, rollback and verification. | Makes production hosting repeatable and avoids publishing internal files. |

## What is already strong

- The exact hero headline remains clear and memorable.
- The page defines the category as digital employment-relations case management.
- Important product information is present as HTML rather than injected after load.
- One H1 is followed by a logical H2/H3 hierarchy.
- Misconduct, incapacity, grievances, harassment and operational requirements are described in plain language.
- The Find → Start → Capture → Track → Report workflow is easy to quote and summarise.
- Phone, email, demo and login actions are explicit.
- Client logos are decorative while the organisation names remain available to assistive technology.
- Internal fragment links resolve and IDs are unique.
- The site is usable at desktop and narrow mobile widths.

## Priority decisions still required

### 1. Confirm the official domain relationship

The marketing metadata uses `www.erguide.digital`, email uses `erguide.co.za`, and the application login is `https://erguide.co.za/login`. Before launch, confirm that:

- `www.erguide.digital` is the intended public marketing domain.
- `erguide.digital` permanently redirects to the `www` hostname, or the reverse if the apex becomes canonical.
- The different marketing and application domains are intentional and approved.
- Both domains use consistent branding and valid certificates.

Every canonical, Open Graph, JSON-LD, robots and sitemap URL must match the final public hostname.

### 2. Approve a public security and privacy answer

The current site cannot truthfully answer detailed security questions. Create an approved public security-and-data page covering at least hosting, data location, encryption, access, logging, backups, retention, deletion, incident handling, data ownership, subprocessors, POPIA roles, DPA availability and security-contact procedures.

Do not claim “POPIA compliant”, “encrypted”, “secure”, a certification, data residency, uptime, RPO or RTO without current evidence and owner approval.

### 3. Publish content-governance details

The site says guidance is kept current, but not who reviews it, which legal sources are used, how changes are approved, how quickly updates are published or how customers are notified. An authoritative answer would improve trust more than additional generic SEO copy.

### 4. Confirm feature and jurisdiction wording

Product owners should verify:

- Every named live module.
- Company-policy search.
- Electronic-signature and evidence controls.
- Current reporting and export options.
- Custom templates and forms.
- The exact supported-country list.
- The exact meaning of “configured for Africa”.
- Any AI, chatbot, API, SSO or integration capability.

### 5. Add evidence, not promises

Publish authorised case studies with a defined baseline, period, measure and source. Avoid unsourced claims about guaranteed compliance, dispute reduction, cost savings, fairness, ROI or legal outcomes.

### 6. Finish video accessibility and performance work

The promotional video is approximately 13.4 MB and dates from 2021. Before treating it as an SEO asset:

- Confirm that its product wording, contacts and screens are current.
- Add WebVTT captions.
- Add a short visible transcript or text summary.
- Optimise the video while preserving quality and byte-range playback.
- Add VideoObject data only when the real name, upload date, duration and approved thumbnail are known.

### 7. Replace the mailto form when direct submission is required

The current form opens the visitor's email application. It does not create a server-side enquiry record. If enquiries must submit directly from the page, use an approved form endpoint and publish the corresponding privacy and retention information.

## AI and buyer question inventory

This inventory is a coverage map, not a list of keywords to repeat. It shows which questions people may ask search engines or AI assistants and whether the current public site can answer them safely.

Status definitions:

- **Answered** — a direct public answer exists on the homepage or FAQ.
- **Partial** — the subject is mentioned, but an important detail is missing.
- **Verify** — the website currently makes the claim, but the product owner should confirm the exact current capability.
- **Missing** — no reliable public answer exists yet.

### Product category and fit

| Question | Status | Current or recommended source |
|---|---|---|
| What is ERGuide? | Answered | Homepage hero and FAQ product basics. |
| What does ER mean? | Answered | FAQ product basics. |
| Who is ERGuide for? | Answered | Homepage hero trust line and FAQ. |
| What business problem does ERGuide solve? | Answered | Homepage problem section and FAQ. |
| Is ERGuide software, a content library or a case-management platform? | Answered | FAQ explains that it combines guidance, workflow and case records. |
| Is ERGuide a full HRIS? | Answered | FAQ states the product boundary without claiming an integration. |
| Does ERGuide replace legal advice? | Answered | FAQ states that case-specific judgement and advice remain necessary. |
| Does ERGuide make disciplinary decisions automatically? | Answered | The legal-advice boundary makes clear that decisions remain human. |
| How is ERGuide different from spreadsheets, shared drives and email? | Partial | The problem section describes fragmentation; a future decision guide should compare categories directly. |
| How is ERGuide different from generic case-management software? | Partial | Guided ER content and South African focus are visible; a factual comparison page would help. |
| Can small and large organisations use ERGuide? | Partial | Modularity is covered; verified user, case and entity scale is not. |
| Can an organisation start with selected modules? | Answered/Verify | FAQ and “Start with what you need”; confirm packaging. |
| Is ERGuide browser-based? | Answered | FAQ describes it as web-based. |
| Is there a native mobile app? | Missing | Publish a precise yes/no. “Mobile-friendly” does not prove a native app. |
| Does ERGuide work offline? | Answered | FAQ says the public claim is online access, not offline operation. |
| Which browsers and devices are supported? | Partial | Phone, tablet and desktop are named; supported browser versions are not. |
| Does ERGuide use artificial intelligence? | Answered with limitation | FAQ distinguishes public search claims from unverified generative-AI capability. |
| What is ERGuide's official login URL? | Answered | FAQ and all Login links use `https://erguide.co.za/login`. |
| Why do the marketing and login domains differ? | Answered with launch dependency | FAQ explains the configured relationship; domain ownership must still be approved. |

### Processes and day-to-day use

| Question | Status | Current or recommended source |
|---|---|---|
| Which ER processes does ERGuide support? | Answered/Verify | Homepage feature catalogue and FAQ; confirm every live module. |
| How does an ERGuide case work from start to finish? | Answered | Five-stage workflow and FAQ. |
| How does ERGuide support misconduct matters? | Answered | Homepage and FAQ. |
| Does it support disciplinary hearings? | Partial | Misconduct process is covered; exact hearing tasks and documents need confirmation. |
| How does it support poor-performance cases? | Answered | Homepage and FAQ. |
| How does it support temporary and permanent ill health? | Answered | Homepage and FAQ. |
| How does it support incompatibility cases? | Answered | Homepage process card. |
| How are grievances submitted and tracked? | Partial | Route, management levels and records are covered; exact intake and notifications are not. |
| How are harassment complaints submitted? | Answered/Verify | Informal, formal and QR-code entry are stated; verify current workflow. |
| Can a harassment complaint be anonymous? | Missing | Do not imply anonymity until confirmed. |
| How does ERGuide handle operational requirements? | Answered | Homepage and FAQ. |
| Are reminders and due-date notifications available? | Missing | Confirm before publishing. |
| Are escalations and approvals available? | Missing | Confirm before publishing. |
| Can a case be reassigned or transferred? | Missing | Confirm before publishing. |
| Can employees see case status? | Missing | Define role and employee access precisely. |
| Can managers collaborate with HR/ER on one case? | Partial | Shared record and ownership are implied; collaboration controls are not described. |
| What information must a manager capture at each step? | Partial | Actions, evidence, notes and signatures are named; process-specific requirements are not public. |
| Are model examples, checklists and visuals included? | Answered/Verify | Homepage says yes; confirm scope per module. |

### Search, records and reporting

| Question | Status | Current or recommended source |
|---|---|---|
| What content can users search? | Answered/Verify | FAQ names guidance, documents, legal principles and approved policies. |
| Does search include the organisation's policies? | Answered/Verify | Public answer exists; confirm indexing and permissions. |
| How are search results ranked or sourced? | Missing | Publish the source and limitation model, particularly if AI is added. |
| Can ERGuide use our forms and templates? | Answered/Verify | FAQ and capability card. |
| Can forms reflect our brand? | Answered/Verify | FAQ and capability card. |
| What becomes part of a case record? | Partial/Verify | FAQ names actions, evidence, notes, decisions and signatures; define the complete model. |
| Which evidence file formats and sizes are supported? | Missing | Add to product or technical documentation. |
| Does ERGuide support electronic signatures? | Answered/Verify | FAQ and homepage; verify provider and identity controls. |
| How are electronic signatures validated? | Missing | Publish the applicable controls and evidentiary limitations. |
| Does ERGuide create an audit trail? | Partial/Verify | The site describes a documented record; exact audit events are not defined. |
| Can HR see status, owner and next step? | Answered at a high level | Workflow and reporting copy. |
| Which reports are available? | Partial | Reporting is named; report catalogue is missing. |
| Are dashboards available? | Partial | “Current data and insight” is visible; dashboard content is not specified. |
| Can reports be exported? | Missing | Confirm formats and permissions. |
| Can customer data be exported at contract end? | Missing | Add to security, data and exit documentation. |
| Can existing cases or templates be migrated? | Missing | Add migration scope, formats and responsibilities. |
| Can ERGuide support multiple branches or entities? | Missing | Define hierarchy and tenancy capability. |
| Can leaders see trends without seeing confidential case detail? | Missing | Explain aggregate reporting and role-appropriate access. |

### Legal content and regional coverage

| Question | Status | Current or recommended source |
|---|---|---|
| Is ERGuide designed for South African law? | Answered | Homepage and FAQ. |
| How does it use the Code of Good Practice: Dismissal? | Answered | Homepage and FAQ. |
| Which legislation and legal sources are included? | Partial | Case law and legal principles are mentioned; source list is missing. |
| Who authors and reviews the legal content? | Missing | Publish the responsible qualified function. |
| How often is content reviewed? | Partial | “Kept current” is public; cadence is missing. |
| How quickly are legal changes published? | Missing | Publish an approved service approach, not an unsupported promise. |
| How are customers notified about updates? | Missing | Add release/change communication details. |
| Can company policy override a default workflow? | Missing | Clarify configuration and governance rules. |
| Which African countries are currently supported? | Partial/Verify | Broader Africa configuration is stated; no approved country list exists. |
| Is the legal content the same in every country? | Missing | Explain jurisdiction-specific content and configuration. |
| Does ERGuide guarantee compliance or fairness? | Answered | FAQ explicitly says no. |
| Can ERGuide advise on the facts of a live case? | Answered with boundary | FAQ says the product does not replace case-specific advice. |

### Security, privacy and IT

| Question | Status | Required public answer |
|---|---|---|
| Is ERGuide delivered as SaaS? | Missing | State the service model. |
| Where is the application hosted? | Missing | Name the approved provider and architecture at an appropriate level. |
| Where is customer data stored and processed? | Missing | State data regions and any cross-border processing. |
| Is data encrypted in transit? | Missing | Verify current controls before publishing. |
| Is data encrypted at rest? | Missing | Verify current controls before publishing. |
| Does ERGuide support SSO? | Missing | State supported protocols and identity providers. |
| Does ERGuide support MFA? | Missing | State user and administrator requirements. |
| How do roles and permissions work? | Missing | Explain least-privilege and sensitive-case access. |
| How are customer tenants separated? | Missing | Publish an approved isolation statement. |
| Which actions are logged? | Missing | Define user and administrator audit events. |
| How are backups handled? | Missing | Publish frequency, protection and test approach. |
| What disaster-recovery controls exist? | Missing | Publish an approved summary. |
| What are the RPO and RTO? | Missing | Publish only contractual, tested figures. |
| Is there an uptime commitment or SLA? | Missing | “Available 24/7” is access wording, not an SLA. |
| Are penetration tests or independent reviews performed? | Missing | Publish current evidence or offer it under NDA. |
| Which security certifications are held? | Missing | Do not imply certification without evidence. |
| What is the vulnerability-management process? | Missing | Add a security-contact and remediation summary. |
| What is the incident-response and notification process? | Missing | Add an approved public summary and contractual details. |
| Is ERGuide POPIA compliant? | Missing | Define responsible-party/operator roles and evidence; avoid a blanket guarantee. |
| Is a data-processing agreement available? | Missing | State availability during procurement. |
| Which subprocessors are used? | Missing | Publish a current list or controlled disclosure process. |
| What are the retention and deletion rules? | Missing | State configurable/default retention and verified deletion. |
| Who owns customer data? | Missing | State contract and product position clearly. |
| Is security documentation available for procurement? | Missing | Offer an approved security pack and review process. |
| What accessibility standard does the product meet? | Missing | Publish tested conformance and known limitations. |

### Implementation, pricing and support

| Question | Status | Current or recommended source |
|---|---|---|
| How is ERGuide priced? | Answered with limitation | FAQ says public pricing is unavailable and pricing depends on scope. |
| Is pricing per user, module, case or organisation? | Missing | Publish or explain the current licence model. |
| Is there an implementation fee? | Missing | Include in proposal guidance. |
| Is there a minimum contract, user count or module set? | Missing | Publish if applicable. |
| Is a pilot or trial available? | Missing | Publish a clear yes/no and conditions. |
| What happens during a demo? | Partial | Demo CTA exists; add a short agenda and preparation list. |
| How long does implementation take? | Answered with limitation | FAQ explains the factors; publish a verified typical range later. |
| What does ERGuide configure and what must the customer supply? | Missing | Add roles, inputs and approvals to an implementation page. |
| Can existing data be imported? | Missing | State migration formats and limits. |
| What administrator training is included? | Missing | Publish current onboarding scope. |
| What manager training is included? | Missing | Publish current enablement options. |
| Which support channels and hours apply? | Missing | Publish current support model. |
| What support response commitments apply? | Missing | Publish contractual targets only. |
| Are APIs available? | Missing | Confirm before publishing. |
| Does ERGuide integrate with an HRIS? | Answered with limitation | FAQ says no prebuilt integration claim is public; technical scoping is required. |
| Which procurement documents are available? | Missing | List MSA, DPA, security pack, insurance or other approved documents. |
| How are product releases communicated? | Missing | Publish release-note or customer-notification process. |
| What are renewal, cancellation and exit arrangements? | Missing | Include in commercial documentation. |

### Trust, proof and company identity

| Question | Status | Current or recommended source |
|---|---|---|
| Which organisations use ERGuide? | Answered/Verify | Client strip; confirm every logo is approved and relationship wording is accurate. |
| Are customer references available? | Missing | Logos are not references. State the reference process. |
| Are there customer reviews? | Missing | Publish only verified, attributable reviews. |
| What measurable outcomes have customers achieved? | Missing | Add case studies with method and source. |
| What ROI can an organisation expect? | Missing | Provide a transparent model or sourced example, not a generic claim. |
| How long has ERGuide operated? | Partial/Verify | Structured data says 2016; confirm legal records and make the fact visible if retained. |
| What is the contracting legal entity? | Missing | Publish the exact registered entity and identifiers where appropriate. |
| What are the official marketing, login, email and support domains? | Partial | FAQ covers marketing and login; publish a complete official-domain list if useful. |
| Is the Stellenbosch address current? | Verify | Confirm the structured-data street address and visible footer location. |

## Recommended content architecture

Keep the homepage focused. Build deeper pages only when the answers are verified and genuinely useful:

1. **Security and data** — hosting, privacy, access, encryption, resilience, retention, ownership and security review.
2. **Implementation and support** — discovery, configuration, rollout, migration, training and support.
3. **Jurisdictions and content governance** — exact country coverage, sources, qualified review, approvals and update process.
4. **Process pages** — misconduct, grievances, harassment, poor performance, ill health, incompatibility and operational requirements.
5. **Customer stories** — authorised evidence with defined outcomes.
6. **Decision guide** — ERGuide compared factually with an HRIS, generic case management and manual records.
7. **Accessible privacy page** — HTML summary alongside the existing PDF.
8. **Video transcript** — current, captioned and indexable.

Do not create a separate page for every wording variation of the same query. One authoritative page can answer several related questions.

## AI-answer and editorial guardrails

For every new page:

- Use the real user question as a heading where it helps scanning.
- Give the direct answer in the first one or two sentences.
- Follow with verified details, limitations and next steps.
- Use consistent terms: ERGuide, employment relations, ER, case, case record, module, HR/ER and manager.
- Add a visible review date and responsible content function to legal or security content.
- Cite primary legal sources when discussing laws, codes or official procedures.
- Keep all structured data consistent with the visible page.
- Do not claim “best”, “guaranteed”, “compliant”, “secure” or a quantified result without evidence.
- Do not publish confidential customer or employee information.

## AI-specific technical position

- Google states that normal SEO fundamentals also apply to its generative AI features. There is no special AI schema requirement.
- Google also states that `llms.txt` is not used for Google Search or its generative AI features. This project therefore prioritises crawlable HTML, useful answers, internal links and clear entity data instead of an AI-only text file.
- OpenAI recommends allowing `OAI-SearchBot` for discovery and citation in ChatGPT search; the updated robots file does so explicitly.
- The wildcard robots group currently permits other standards-compliant crawlers, including training crawlers. Whether to block training-specific user agents such as GPTBot or Google-Extended is a separate business and content-policy decision, not an SEO requirement.

Primary guidance:

- [Google: Optimising for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: Create a robots.txt file](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt)
- [Google: Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [OpenAI: Publishers and developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)

## Launch and measurement checklist

- Confirm the canonical marketing hostname and redirect plan.
- Verify all client-logo permissions.
- Confirm structured-data organisation facts, address and founding date.
- Confirm every product feature and jurisdiction claim.
- Replace or approve the 2021 video, then add captions and a transcript.
- Deploy only the public file set in `README.md`.
- Confirm that unknown URLs return a real 404/403 rather than the homepage with status 200.
- Confirm CloudFront compression and caching for the globe scripts and media.
- Verify the canonical domain in Google Search Console and Bing Webmaster Tools.
- Submit the sitemap.
- Inspect the homepage and FAQ URLs after deployment.
- Monitor indexing, Core Web Vitals, crawl errors, branded queries and enquiry conversions.
- Review the question inventory quarterly and update only when product facts change.

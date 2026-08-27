# ERGuide marketing website

This repository contains the public ERGuide marketing website and the files needed to preview or deploy it.

The website is a static HTML, CSS and JavaScript project. It has no build step and no application secrets.

## Repository structure

```text
site/                         Production website files
docs/AWS_S3_DEPLOYMENT.md     Detailed AWS deployment guide
source-assets/                Archived source material; not deployed
Dockerfile                    Optional local/container preview
docker-compose.yml            Optional Docker Compose preview
THIRD_PARTY_NOTICES.md        Bundled third-party notices
```

Only the contents of `site/` should be uploaded to the production web bucket.

## Quick local preview

From the repository root, start a local server:

```powershell
python -m http.server 8080 --bind 127.0.0.1 --directory .\site
```

Then open <http://127.0.0.1:8080/>.

Python is used only as a simple local web server. No packages need to be installed.

### Docker alternative

If Docker is available:

```powershell
docker compose up --build
```

Open <http://127.0.0.1:3003/>. Stop the preview with `Ctrl+C`, followed by `docker compose down` if required.

## Production deployment

The recommended production architecture is a private Amazon S3 bucket behind CloudFront using Origin Access Control, HTTPS and a custom domain.

Follow the complete [AWS S3 and CloudFront deployment guide](docs/AWS_S3_DEPLOYMENT.md).

## Production addresses

- Marketing website canonical address: `https://www.erguide.digital/`
- Existing-user login: `https://erguide.co.za/login`
- General enquiries: `info@erguide.co.za`
- Telephone: `082 451 1991`

Confirm the canonical marketing domain before deployment. If it changes, update `site/index.html`, `site/faq.html`, `site/robots.txt` and `site/sitemap.xml` together.

## Pre-deployment checklist

- Test the homepage and FAQ on desktop and mobile.
- Confirm the globe, workflow animation and product video load correctly.
- Confirm all login, telephone, email and contact links.
- Confirm the client logos are approved for public use.
- Confirm the privacy policy is the current approved version.
- Confirm the bundled Miniature Earth usage and redistribution rights described in `THIRD_PARTY_NOTICES.md`.
- Confirm `robots.txt`, `sitemap.xml`, canonical URLs and social metadata use the final domain.
- Deploy only from `site/`.

## Operational notes

- The public contact form submits through Web3Forms and shows the result without leaving the page. Its Form Access Key is intentionally public client-side configuration; the recipient address is managed in the Web3Forms account.
- The existing-user login is an external application and is not deployed from this repository.
- Archived files under `source-assets/` are retained for reference and are not part of the live site.
- This is a proprietary ERGuide project. Repository access does not grant rights beyond the applicable client or supplier agreement.

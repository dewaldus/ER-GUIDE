# ERGuide website: Amazon S3 deployment guide

The production website lives in the repository's `site/` folder. It is a static project with no build step and can be served from Amazon S3 through Amazon CloudFront.

The production recommendation is a **private S3 bucket behind CloudFront**, not a public S3 website endpoint.

```text
Visitor
  ↓ HTTPS
Route 53 / DNS
  ↓
CloudFront + ACM certificate + security headers
  ↓ signed origin request (OAC)
Private S3 bucket
```

This approach keeps the bucket private, provides HTTPS, enables CDN caching and compression, and gives the site a custom domain. AWS documents the same secure static-site pattern in its [CloudFront secure static website guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/getting-started-secure-static-website-cloudformation-template.html).

## Important domain decision

The website currently treats this as the canonical marketing address:

```text
https://www.erguide.digital/
```

That hostname appears in:

- `index.html`
- `faq.html`
- `robots.txt`
- `sitemap.xml`
- Open Graph metadata
- JSON-LD structured data

If the final marketing domain will be different, update every occurrence before deployment. The product login remains the separate external application URL:

```text
https://erguide.co.za/login
```

Choose one canonical marketing hostname, such as `www.erguide.digital`, and redirect the non-canonical hostname to it. Do not serve the same content from both `www` and the apex domain without a redirect.

## Deployment source

Deploy only the contents of the repository's `site/` folder:

```text
index.html
faq.html
robots.txt
sitemap.xml
assets/
css/
js/
```

Repository-level documentation, Docker files and archived source material are deliberately outside `site/` and must not be uploaded to the web bucket:

```text
README.md
docs/
source-assets/
Dockerfile
docker-compose.yml
THIRD_PARTY_NOTICES.md
```

## Prerequisites

You need:

1. An AWS account with permission to manage S3, CloudFront, ACM and DNS.
2. [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
3. An AWS CLI profile with the minimum permissions needed for deployment.
4. Control of the final domain's DNS.
5. An approved release or Git commit to deploy.

Configure and verify an AWS profile:

```powershell
aws configure --profile erguide-production
aws sts get-caller-identity --profile erguide-production
```

Confirm the returned AWS account before uploading anything.

## 1. Create the private S3 bucket

Create a general purpose S3 bucket in the organisation's approved AWS Region. `af-south-1` is a reasonable option for a South African workload, but the organisation's data, cost and governance requirements should decide the Region.

Use these settings:

- **Block Public Access:** keep all four settings enabled.
- **Object Ownership:** Bucket owner enforced.
- **ACLs:** disabled.
- **Default encryption:** keep S3 encryption enabled.
- **Versioning:** enable it for recovery from an accidental overwrite or deletion.
- **Static website hosting:** leave it disabled when using the recommended CloudFront OAC architecture.

Enable versioning with the CLI after the bucket exists:

```powershell
$env:ERGUIDE_BUCKET = 'replace-with-private-bucket-name'
$env:ERGUIDE_AWS_PROFILE = 'erguide-production'

aws s3api put-bucket-versioning `
  --bucket $env:ERGUIDE_BUCKET `
  --versioning-configuration Status=Enabled `
  --profile $env:ERGUIDE_AWS_PROFILE
```

S3 Versioning preserves previous object versions and supports recovery from accidental changes. See [AWS S3 Versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html).

## 2. Create the CloudFront distribution

In the CloudFront console, create a standard distribution with these settings:

| Setting | Value |
|---|---|
| Origin | Select the S3 bucket from the origin picker |
| Origin type | S3 REST origin, not an `s3-website-*` endpoint |
| Origin access | Origin access control settings (OAC) |
| Signing behaviour | Sign requests — recommended |
| Default root object | `index.html` without a leading slash |
| Viewer protocol policy | Redirect HTTP to HTTPS |
| Allowed methods | GET and HEAD |
| Compress objects automatically | Yes |
| Cache policy | Managed `CachingOptimized`, or an approved custom policy |
| Response headers policy | Managed `SecurityHeadersPolicy` |

CloudFront's OAC is the recommended way to restrict access to an S3 origin. It lets CloudFront read the files while direct public bucket access remains blocked. See [Restrict access to an S3 origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).

Apply the bucket policy offered by the CloudFront console, or use this official policy shape after replacing the placeholders:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

Useful AWS references:

- [Default root object](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html)
- [Managed security response-header policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-response-headers-policies.html)
- [CloudFront compression](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html)

This site is not a single-page application. Do **not** configure CloudFront to return `index.html` with status `200` for every missing path. That creates soft-404 URLs. When a custom `404.html` is added later, configure CloudFront to serve it while preserving a real `404` response.

## 3. Add HTTPS with ACM

Request a public certificate in AWS Certificate Manager for:

```text
www.erguide.digital
erguide.digital
```

For CloudFront, the ACM certificate must be requested or imported in **US East (N. Virginia), `us-east-1`**, regardless of the S3 bucket Region. Use DNS validation and keep the ACM validation CNAME in DNS so the certificate can renew automatically.

AWS reference: [CloudFront certificate requirements](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html).

Add the canonical hostname to the CloudFront distribution as an alternate domain name and select the ACM certificate.

## 4. Point the domain to CloudFront

If Route 53 hosts the DNS zone:

1. Open the public hosted zone.
2. Create an **A Alias** record for the canonical hostname.
3. Select **Alias to CloudFront distribution**.
4. Select the new distribution.
5. Add an **AAAA Alias** record as well if IPv6 is enabled.

Route 53 alias records can be used for both root domains and subdomains. See [Routing traffic to CloudFront](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html).

Configure the non-canonical hostname to return a permanent redirect to the canonical `https://www.erguide.digital/` URL.

## 5. Test locally before uploading

From the repository root, an optional local test server can be started with Python:

```powershell
python -m http.server 8080 --bind 127.0.0.1 --directory .\site
```

Open `http://127.0.0.1:8080/` and check:

- Homepage and FAQ page.
- Desktop and mobile navigation.
- Globe loading and interaction.
- Workflow and card animations.
- Video playback.
- Contact links and form behaviour.
- Login link to `https://erguide.co.za/login`.
- `robots.txt` and `sitemap.xml`.

Python is optional; no Python package installation is required to deploy the site.

## 6. Deploy from PowerShell

Set deployment-specific values:

```powershell
$env:ERGUIDE_SITE_DIR = (Resolve-Path -LiteralPath '.\site').Path
$env:ERGUIDE_BUCKET = 'replace-with-private-bucket-name'
$env:ERGUIDE_DISTRIBUTION_ID = 'replace-with-cloudfront-distribution-id'
$env:ERGUIDE_AWS_PROFILE = 'erguide-production'
```

Verify the account again:

```powershell
aws sts get-caller-identity --profile $env:ERGUIDE_AWS_PROFILE
```

### Preview the sync first

`--delete` removes remote objects that are not present locally. Always run the dry run and inspect every proposed upload and deletion before running the real command.

```powershell
aws s3 sync $env:ERGUIDE_SITE_DIR "s3://$env:ERGUIDE_BUCKET/" `
  --dryrun `
  --delete `
  --exclude 'index.html' `
  --exclude 'faq.html' `
  --exclude 'robots.txt' `
  --exclude 'sitemap.xml' `
  --cache-control 'public,max-age=3600,s-maxage=604800' `
  --profile $env:ERGUIDE_AWS_PROFILE
```

AWS documents `--dryrun`, filters, metadata and `--delete` in the [AWS CLI `s3 sync` reference](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html).

### Run the asset sync

Only after approving the dry-run output, run the same command without `--dryrun`:

```powershell
aws s3 sync $env:ERGUIDE_SITE_DIR "s3://$env:ERGUIDE_BUCKET/" `
  --delete `
  --exclude 'index.html' `
  --exclude 'faq.html' `
  --exclude 'robots.txt' `
  --exclude 'sitemap.xml' `
  --cache-control 'public,max-age=3600,s-maxage=604800' `
  --profile $env:ERGUIDE_AWS_PROFILE
```

File names are not content-hashed, so this guide deliberately avoids one-year `immutable` browser caching. The browser cache is one hour; CloudFront can retain assets for up to seven days.

### Upload HTML and discovery files with revalidation

```powershell
aws s3 cp "$env:ERGUIDE_SITE_DIR\index.html" "s3://$env:ERGUIDE_BUCKET/index.html" `
  --content-type 'text/html; charset=utf-8' `
  --cache-control 'public,max-age=0,must-revalidate,s-maxage=300' `
  --profile $env:ERGUIDE_AWS_PROFILE

aws s3 cp "$env:ERGUIDE_SITE_DIR\faq.html" "s3://$env:ERGUIDE_BUCKET/faq.html" `
  --content-type 'text/html; charset=utf-8' `
  --cache-control 'public,max-age=0,must-revalidate,s-maxage=300' `
  --profile $env:ERGUIDE_AWS_PROFILE

aws s3 cp "$env:ERGUIDE_SITE_DIR\robots.txt" "s3://$env:ERGUIDE_BUCKET/robots.txt" `
  --content-type 'text/plain; charset=utf-8' `
  --cache-control 'public,max-age=0,must-revalidate,s-maxage=300' `
  --profile $env:ERGUIDE_AWS_PROFILE

aws s3 cp "$env:ERGUIDE_SITE_DIR\sitemap.xml" "s3://$env:ERGUIDE_BUCKET/sitemap.xml" `
  --content-type 'application/xml; charset=utf-8' `
  --cache-control 'public,max-age=0,must-revalidate,s-maxage=300' `
  --profile $env:ERGUIDE_AWS_PROFILE
```

## 7. Invalidate CloudFront

After a release, invalidate cached files so visitors receive the new version:

```powershell
$env:ERGUIDE_INVALIDATION_ID = aws cloudfront create-invalidation `
  --distribution-id $env:ERGUIDE_DISTRIBUTION_ID `
  --paths '/*' `
  --query 'Invalidation.Id' `
  --output text `
  --profile $env:ERGUIDE_AWS_PROFILE

aws cloudfront wait invalidation-completed `
  --distribution-id $env:ERGUIDE_DISTRIBUTION_ID `
  --id $env:ERGUIDE_INVALIDATION_ID `
  --profile $env:ERGUIDE_AWS_PROFILE
```

Wildcard paths must be quoted. See [CloudFront invalidation guidance](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation_Requests.html).

## 8. Post-deployment checks

Check response headers:

```powershell
curl.exe -I https://www.erguide.digital/
curl.exe -I https://www.erguide.digital/faq.html
curl.exe -I https://www.erguide.digital/robots.txt
curl.exe -I https://www.erguide.digital/sitemap.xml
curl.exe -I https://www.erguide.digital/css/style.css
curl.exe -I http://www.erguide.digital/
```

Confirm:

- The HTTPS URLs return `200`.
- HTTP redirects to HTTPS.
- The non-canonical hostname permanently redirects to the canonical hostname.
- HTML, CSS, JavaScript, XML and text files have the correct `Content-Type`.
- HTML, robots and sitemap files have short cache lifetimes.
- CloudFront adds the expected security headers.
- Direct unauthenticated S3 object URLs are denied.
- An unknown path returns a real `404` or `403`, not `index.html` with status `200`.
- The homepage, FAQ, globe, video, animations, contact links and login work on desktop and mobile.
- The video supports byte-range requests and does not restart unnecessarily.

After launch:

1. Verify the canonical site in Google Search Console and Bing Webmaster Tools.
2. Submit `https://www.erguide.digital/sitemap.xml`.
3. Inspect the homepage and FAQ canonical URLs.
4. Monitor Core Web Vitals, crawl errors and CloudFront logs.

## Rollback

The safest rollback is to redeploy a known-good Git commit with the same commands, then invalidate `/*`.

S3 Versioning is a recovery safety net. To inspect previous versions of the homepage:

```powershell
aws s3api list-object-versions `
  --bucket $env:ERGUIDE_BUCKET `
  --prefix index.html `
  --profile $env:ERGUIDE_AWS_PROFILE
```

Restoring the complete Git release is usually safer than manually restoring individual object versions because a release contains several related files.

## Direct S3 website hosting: preview only

S3 can expose a public website endpoint, but this is not recommended for production here:

- The bucket or objects must be publicly readable.
- Relevant Block Public Access settings must be disabled.
- S3 website endpoints do not support HTTPS.
- An S3 website endpoint used by CloudFront is a custom origin and cannot use OAC.

AWS documents these limitations in [S3 website endpoints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html) and [HTTPS between CloudFront and S3](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-cloudfront-to-s3-origin.html).

Use a direct S3 website endpoint only for a temporary, non-sensitive preview. Use private S3 + CloudFront OAC for production.

## Site-specific operational notes

- The contact form opens the visitor's email application; S3 does not process form submissions.
- A server-side contact form would require a separate service such as API Gateway and Lambda or a managed form provider.
- The login and Discovery portal are external applications and are not deployed to this S3 bucket.
- The promotional video is a large media file, so CloudFront caching and byte-range support should be verified after deployment.
- Always deploy from `site/`, not from the repository root.

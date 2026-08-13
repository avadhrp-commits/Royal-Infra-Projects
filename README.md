# Royal Infra Projects — Website (Ready to Publish)

Static site. No build step, no dependencies — every file here is served as-is.

## What's in this folder

| Path | Purpose |
|---|---|
| `index.html` + page files | The nine public pages |
| `404.html` | Shown by GitHub Pages on a bad URL |
| `assets/css`, `assets/js` | Stylesheet and behaviour |
| `assets/img`, `assets/video` | Images, logos, certificates, hero loop |
| `assets/docs` | ISO certificate PDFs |
| `sitemap.xml`, `robots.txt` | Search engine crawling |
| `CNAME` | Binds the custom domain www.royalinfraprojects.com |
| `.nojekyll` | Tells GitHub Pages to serve files verbatim |

## Deploying to GitHub Pages

1. Create a repository (public) on GitHub.
2. Upload **the contents of this folder** to the repository root — not the folder
   itself. `index.html` must sit at the top level of the repo.
3. In the repository: **Settings -> Pages**.
4. Under *Build and deployment*, set **Source = Deploy from a branch**,
   **Branch = main**, **Folder = / (root)**. Save.
5. Under *Custom domain*, enter `www.royalinfraprojects.com` and save.
   (The `CNAME` file already declares this, so it should populate automatically.)
6. Tick **Enforce HTTPS** once the certificate is issued (can take a few minutes).

## DNS — point the domain at GitHub

At your domain registrar, for `www.royalinfraprojects.com`:

    Type: CNAME    Host: www    Value: <your-github-username>.github.io

And for the bare domain `royalinfraprojects.com`, four A records:

    185.199.108.153
    185.199.109.153
    185.199.110.153
    185.199.111.153

DNS changes can take up to 24 hours to propagate.

## After going live

- Submit `https://www.royalinfraprojects.com/sitemap.xml` in
  [Google Search Console](https://search.google.com/search-console).
- Verify the structured data with the
  [Rich Results Test](https://search.google.com/test/rich-results).
- Create/claim the **Google Business Profile** for
  "Royal Infra Projects - Sanand Store" so the map pin and local pack listing
  resolve to the business.

## Updating the site later

Edit `build.py` in the parent working folder and run:

    python build.py

That regenerates the pages and refreshes this `Ready to Publish` folder.

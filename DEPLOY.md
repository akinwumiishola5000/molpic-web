# Deploying MolPic Web

This walks through publishing the site on GitHub Pages, free and permanently, with no domain purchase and no server.

Your finished site will live at:

```
https://akinwumiishola5000.github.io/molpic-web/
```

There are two routes. **Route A** uses only the GitHub website and needs no software installed. **Route B** uses Git on your machine and is better if you plan to keep editing. Both produce exactly the same result — pick one.

---

## Before you start

Check the folder you're deploying looks like this:

```
molpic-web/
├── index.html          the structure drawer (home page)
├── panel.html          the panel figure builder
├── guide.html          documentation for users
├── about.html          project background and citation
├── 404.html            shown for bad URLs
├── README.md           repository front page
├── DEPLOY.md           this file
└── assets/
    ├── style.css       shared styling
    └── molpic.js       shared chemistry helpers
```

Two rules that matter more than they look:

- **`index.html` must be at the top level**, not inside a folder. GitHub Pages serves it as the home page.
- **Keep the `assets/` folder name and structure.** Every page links to `assets/style.css`, so renaming the folder breaks the styling everywhere.

### Test it locally first

Double-click `index.html`. It should open in your browser and work fully — draw a structure and download an SVG. If it works locally, it will work on GitHub Pages.

If the page loads but structures never draw, your connection is blocking the CDN that serves RDKit. Try another network before assuming the code is broken.

---

## Route A — GitHub website only

### Step 1. Create the repository

1. Sign in at [github.com](https://github.com).
2. Click the **+** in the top right, then **New repository**.
3. Set **Repository name** to `molpic-web`.
4. Add a description: *Free browser tool for publication-quality molecule images.*
5. Choose **Public**. GitHub Pages requires public repositories on free accounts.
6. Leave "Add a README file" **unticked** — you already have one.
7. Click **Create repository**.

### Step 2. Upload the files

1. On the empty repository page, click **uploading an existing file**.
2. Open your `molpic-web` folder on your computer.
3. Select everything **inside** it — the HTML files, `README.md`, `DEPLOY.md`, and the `assets` folder — and drag them into the browser window.

   Drag the *contents*, not the folder itself. If you drag the folder, everything ends up one level too deep and the site won't load.
4. Wait for all files to finish uploading. Confirm you see `index.html` and `assets` in the list.
5. In the commit box, write `Add MolPic Web site`.
6. Click **Commit changes**.

### Step 3. Turn on GitHub Pages

1. Click **Settings** in the repository's top menu.
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Click **Save**.

### Step 4. Wait, then visit

The first build takes one to three minutes. Refresh the Settings → Pages screen until a green banner appears with your URL. Open it.

Skip to [Verifying it works](#verifying-it-works).

---

## Route B — Git on your machine

Use this if you have Git installed and want to update the site with a couple of commands.

### Step 1. Create the repository on GitHub

Follow **Route A, Step 1** above, then stop — don't upload anything.

### Step 2. Push from your computer

Open a terminal, then:

```bash
cd path/to/molpic-web

git init
git add .
git commit -m "Add MolPic Web site"
git branch -M main
git remote add origin https://github.com/akinwumiishola5000/molpic-web.git
git push -u origin main
```

If GitHub asks for a password, it wants a personal access token, not your account password. Create one at **Settings → Developer settings → Personal access tokens → Tokens (classic)** with the `repo` scope, and paste it as the password.

### Step 3. Turn on GitHub Pages

Same as **Route A, Step 3**.

### Updating later

```bash
git add .
git commit -m "Describe what changed"
git push
```

The live site rebuilds automatically, usually within a minute.

---

## Verifying it works

Walk through this once. Each check catches a different class of problem.

| Check | What it proves |
|---|---|
| Home page loads with correct fonts and colours | `assets/style.css` is being found |
| Click **Caffeine**, structure appears | RDKit WebAssembly loaded and runs |
| Type `ibuprofen`, click **Look up** | PubChem name resolution works over HTTPS |
| Click **Download SVG**, open the file | Vector export works |
| Click **Download PNG**, check the background is white | Raster export and white fill work |
| Open **Panel figure**, click **Build panel** | Multi-structure composition works |
| Click every nav link | Page-to-page links are correct |
| Open the site on your phone | Responsive layout works |
| Visit `/nonsense` on your site | Your custom 404 page appears |

---

## Troubleshooting

**The page is unstyled — plain text on white.**
The stylesheet isn't loading. Almost always the folder was dragged in instead of its contents, leaving files at `molpic-web/molpic-web/index.html`. Check the repository file list: `index.html` and `assets` should be at the top level. If they aren't, delete the nested folder and re-upload correctly.

**404 at the site URL.**
Either Pages hasn't finished its first build (wait three minutes and hard-refresh), or the branch and folder in Settings → Pages are wrong. Confirm `main` and `/ (root)`. Also confirm the file is named `index.html`, all lowercase — GitHub's servers are case-sensitive even though Windows and macOS aren't.

**Structures never draw; the message stays on "Loading the chemistry engine…".**
The RDKit CDN is unreachable. Test on a different network — some university and hospital firewalls block CDN domains. If you need the site to work behind such a firewall, download `RDKit_minimal.js` and `RDKit_minimal.wasm`, commit them to `assets/`, and change the script tag in each HTML page to point at your local copy.

**Name lookup fails but SMILES works.**
That isolates the problem to the PubChem request. Check the spelling, and prefer generic names over brand names. If many lookups fail at once you may be hitting PubChem's rate limit — wait a few seconds between requests.

**A downloaded PNG has a black background.**
The transparency toggle was on and something downstream flattened the alpha channel to black. Turn transparency off and download again; white is the default for exactly this reason.

**Changes don't appear on the live site.**
Browsers cache aggressively. Hard-refresh with `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac). If it still looks old, check the **Actions** tab for a failed deployment.

---

## Optional: a shorter free URL

You said you don't want to buy a domain, and you don't need one. Two free ways to shorten what you share:

- **Rename the repository to `akinwumiishola5000.github.io`.** The site then lives at `https://akinwumiishola5000.github.io/` with no path. The catch is that each account gets only one such site, so spend it deliberately.
- **Use a free subdomain service** such as js.org, which grants `yourname.js.org` addresses to open-source projects that apply. Free, but subject to their review.

Neither is necessary. A GitHub Pages URL is perfectly respectable to cite in a paper.

---

## After launch

A few things worth doing once the site is live:

1. **Add the link to the repository.** On the repo home page, click the gear beside **About** and paste the site URL into the Website field. It then shows at the top of the page.
2. **Link it from the MolPic package.** Add a line near the top of the MolPic README: *Prefer not to install anything? Use MolPic in your browser: [link].* That's how most people will find it.
3. **Add the topics** `cheminformatics`, `rdkit`, `drug-discovery`, `smiles`, and `molecular-visualization` to both repositories so they surface in GitHub search.
4. **Archive a release on Zenodo** when the site stabilises, so the web tool is citable alongside the package.

## Keeping it running

There is genuinely nothing to maintain. No server, no certificates, no bills, no dependencies to patch. The two things that could break are outside your repository: the RDKit CDN and the PubChem API. If either changes, the fix is a one-line edit here.

Re-run the verification table once or twice a year, and after any browser generation change.

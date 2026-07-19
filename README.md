# MolPic Web

**Free, browser-based molecular figures — no install, no account, no upload.**

Live site: `https://akinwumiishola5000.github.io/molpic-web/`

MolPic Web is the browser companion to the [MolPic](https://github.com/akinwumiishola5000/MolPic) Python package. Type a compound name or paste a SMILES string and download a publication-quality structure image as vector SVG or high-resolution PNG.

## Features

- Draw a structure from a **compound name** (resolved via PubChem) or a **SMILES string**
- **SVG export** — vector, scales without limit, ideal for manuscripts and LaTeX
- **PNG export** at 2×, 4×, or 8× for slides, print, and posters
- **White background by default**, with an optional transparent mode
- **Panel figure builder** — several labelled structures composed into one grid figure
- Molecular weight, heavy-atom count, ring count, and canonical SMILES reported alongside each structure
- Fully client-side: structures are never uploaded or stored

## How it works

The site is static HTML, CSS, and JavaScript with no build step and no backend. [RDKit.js](https://github.com/rdkit/rdkit-js) — the RDKit toolkit compiled to WebAssembly — parses structures and renders every depiction inside the browser. Compound names are resolved through the [PubChem PUG-REST API](https://pubchem.ncbi.nlm.nih.gov/). Because there is no server, hosting costs nothing and the tool can stay free indefinitely.

## Running it locally

No build tools required. Clone and open:

```bash
git clone https://github.com/akinwumiishola5000/molpic-web.git
cd molpic-web
open index.html          # macOS; use start on Windows, xdg-open on Linux
```

An internet connection is needed on first load so the browser can fetch RDKit.js from the CDN.

## Deploying

See [DEPLOY.md](DEPLOY.md) for step-by-step instructions covering GitHub Pages setup, verification, and troubleshooting.

## Project structure

```
index.html      structure drawer (home page)
panel.html      multi-structure panel figure builder
guide.html      user documentation
about.html      project background and citation
404.html        custom not-found page
assets/
  style.css     shared stylesheet
  molpic.js     shared chemistry helpers
```

## Website or Python package?

| | MolPic Web | MolPic (Python) |
|---|---|---|
| Install needed | No | Yes |
| One figure, quickly | Best fit | Works |
| Hundreds of compounds from CSV | No | Best fit |
| Automatic caption files | No | Yes |
| Scriptable and reproducible | No | Yes |
| Works on a borrowed laptop | Yes | Unlikely |

Both use RDKit, so depictions are consistent between them.

## Citing

If MolPic contributed to published work, please cite the archived release:

```bibtex
@software{molpic,
  author  = {Akinwumi, Ishola Abeeb},
  title   = {MolPic: Name/SMILES to publication-ready molecular figures},
  doi     = {10.5281/zenodo.18089336},
  url     = {https://github.com/akinwumiishola5000/MolPic}
}
```

## Contributing

Bug reports and suggestions are welcome via GitHub issues. Including the SMILES string and your browser version makes problems much faster to reproduce.

## Acknowledgements

Built on [RDKit](https://www.rdkit.org/) and [PubChem](https://pubchem.ncbi.nlm.nih.gov/), both freely available to the research community.

## Licence

See `LICENSE`. RDKit is distributed under the BSD 3-Clause licence.

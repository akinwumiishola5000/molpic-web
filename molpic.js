/* MolPic Web — shared chemistry helpers
   Everything runs in the browser. Nothing is uploaded. */

const MolPic = (function () {
  let RDKit = null;
  const ready = [];

  function onReady(fn) {
    if (RDKit) fn(RDKit); else ready.push(fn);
  }

  function init(onFail) {
    if (typeof window.initRDKitModule !== 'function') {
      onFail && onFail();
      return;
    }
    window.initRDKitModule()
      .then(function (m) {
        RDKit = m;
        ready.forEach(function (fn) { fn(RDKit); });
        ready.length = 0;
      })
      .catch(function () { onFail && onFail(); });
  }

  /* Returns an RDKit mol or null. Caller must call .delete() when done. */
  function parse(smiles) {
    if (!RDKit || !smiles) return null;
    let mol = null;
    try { mol = RDKit.get_mol(smiles); } catch (e) { return null; }
    if (!mol) return null;
    if (!mol.is_valid()) { mol.delete(); return null; }
    return mol;
  }

  /* Draw a mol to an SVG string. opts: {width,height,transparent,stereo} */
  function toSVG(mol, opts) {
    const o = opts || {};
    const w = o.width || 560, h = o.height || 440;
    const details = {
      width: w,
      height: h,
      backgroundColour: o.transparent ? [1, 1, 1, 0] : [1, 1, 1, 1],
      addStereoAnnotation: o.stereo !== false,
      bondLineWidth: 1.6,
      explicitMethyl: false
    };
    try { return mol.get_svg_with_highlights(JSON.stringify(details)); }
    catch (e) { return mol.get_svg(w, h); }
  }

  function describe(mol) {
    let d = {};
    try { d = JSON.parse(mol.get_descriptors()); } catch (e) {}
    return {
      mw: typeof d.amw === 'number' ? d.amw.toFixed(2) + ' g/mol' : null,
      heavy: d.NumHeavyAtoms != null ? d.NumHeavyAtoms : null,
      rings: d.NumRings != null ? d.NumRings : null
    };
  }

  /* Resolve a compound name to SMILES via PubChem. Throws on failure. */
  async function lookupName(name) {
    const url = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/' +
      encodeURIComponent(name) + '/property/CanonicalSMILES/TXT';
    const res = await fetch(url);
    if (!res.ok) throw new Error('not-found');
    const smi = (await res.text()).trim().split('\n')[0].trim();
    if (!smi) throw new Error('empty');
    return smi;
  }

  /* ---------- file output ---------- */

  function slug(text, fallback) {
    const s = (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return s || fallback || 'molecule';
  }

  function saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  function saveSVG(svgText, filename) {
    saveBlob(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }), filename);
  }

  /* Rasterise an SVG string to PNG at a scale multiple.
     White is painted underneath unless transparent is true. */
  function savePNG(svgText, filename, width, height, scale, transparent, onError) {
    const encoded = 'data:image/svg+xml;base64,' +
      btoa(unescape(encodeURIComponent(svgText)));
    const img = new Image();
    img.onload = function () {
      const c = document.createElement('canvas');
      c.width = Math.round(width * scale);
      c.height = Math.round(height * scale);
      const ctx = c.getContext('2d');
      if (!transparent) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, c.width, c.height);
      }
      ctx.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(function (b) { saveBlob(b, filename); }, 'image/png');
    };
    img.onerror = function () { onError && onError(); };
    img.src = encoded;
  }

  /* Pull the drawable inner content and viewBox out of an RDKit SVG,
     so several structures can be composed into one panel figure. */
  function dissect(svgText) {
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const svg = doc.documentElement;
    return {
      viewBox: svg.getAttribute('viewBox') || '0 0 560 440',
      inner: svg.innerHTML
    };
  }

  return {
    init: init, onReady: onReady, parse: parse, toSVG: toSVG, describe: describe,
    lookupName: lookupName, slug: slug, saveSVG: saveSVG, savePNG: savePNG,
    saveBlob: saveBlob, dissect: dissect
  };
})();

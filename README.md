# saint-studio

A static website built with plain HTML, CSS, and JavaScript.

## Run locally

There is no install or build step required.

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Run a local server

This is the recommended option if you want the site to behave more like it will after deployment.

From the project folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Main pages

- `index.html`
- `barbershop.html`
- `team.html`
- `apparel.html`
- `contact.html`

## Archived

`archive/creative.html` is the Saint Creative page, taken out of the site navigation for now. To bring it back, move it to the project root, remove the `../` prefixes on its paths, and re-add the nav links and homepage card.

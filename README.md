# Huzaifiya & Shadil — Islamic Wedding Invitation

A fast, mobile-first, static invitation website. It has no framework, build step, or external dependency: upload the files as they are.

## Edit the invitation

Open `config.js` and change the names, date, time, venue, map link, WhatsApp text, photo paths, music path, and published site URL. This is the only file needed for ordinary updates.

For a different date, set `eventDate` to a standard ISO local date and time, for example `2027-03-27T12:30:00`. The countdown uses the visitor's device time. If the wedding has a specific time-zone requirement, include its ISO offset, for example `2027-03-27T12:30:00+05:30`.

Place optional photos, a personally licensed audio file, and a 1200 × 630 social image in `assets/`. Their expected paths are documented in `assets/README.md`.

If you change the couple's names or date, also update the social preview fields near the top of `index.html`. Social services read that HTML before JavaScript runs.

## Preview locally

Open `index.html` in a modern browser. Because this is a static site, no install or command is required.

## Publish for free

### Netlify

1. Sign in at [Netlify](https://www.netlify.com/).
2. On the Sites page, drag the entire `islamic-wedding-invitation` folder onto the deployment area.
3. Netlify gives you a public link. Paste it into `pageUrl` in `config.js`, then drag the folder again to redeploy.

### Vercel

1. Put this folder in a GitHub repository.
2. Sign in at [Vercel](https://vercel.com/), choose **Add New → Project**, and import the repository.
3. Leave the framework setting as **Other** and deploy. Paste the public link into `pageUrl` and deploy the edit.

### GitHub Pages

1. Create a new GitHub repository and upload the contents of this folder to its root (`index.html` must be at the root).
2. In the repository, open **Settings → Pages**. Select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
3. GitHub displays the website address. Add it to `pageUrl` and commit the configuration update.

## Included features

- Animated envelope opening, falling petals, gold shimmer, smooth section navigation, and reduced-motion support.
- Emerald, ivory, and gold visual system with geometric and ornamental motifs.
- Scratch or button-operated date reveal, live countdown, editable gallery cards, accessible keyboard controls, and user-started audio.
- Map and WhatsApp sharing controls. The map stays disabled until you provide a URL, so the site never guesses a location.

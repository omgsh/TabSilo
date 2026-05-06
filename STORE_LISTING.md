# Tab Vault Pro — Chrome Web Store Listing

## Name (max 45 chars)
Tab Vault Pro — Tab Manager & Saver

## Summary / Short description (max 132 chars)
Condense 500 tabs into one quiet vault. Save RAM, search instantly, sync across devices. The calmest way to manage tabs.

## Category
Productivity

## Language
English

---

## Detailed description (max 16,000 chars)

**Your browser isn't slow. It's just full.**

Tab Vault Pro condenses every open tab into a single, searchable list — freeing memory, silencing the noise, and giving Chrome its speed back.

One click closes them all. One click brings them back.

---

### ⚡ Condense All — the one-click hook
Click the toolbar icon and every open tab collapses into a titled, dated workspace. Your 47-tab window becomes 1.

### 🗂️ Named workspaces
Group tabs into projects you actually recognize: "Taxes 2026", "Wedding Planning", "Q3 Research". Open or archive entire sets in a single click.

### 🔍 Lightning-fast search
Fuzzy search across hundreds of saved tabs with instant highlighting. Press ⌘K (or Ctrl+K) from anywhere in the vault.

### ❄️ Freeze inactive tabs
Auto-suspend idle tabs to reclaim RAM. They reload the moment you click them — no data lost, no crashes.

### ☁️ Cross-device sync (Pro)
See your saved tabs on your work laptop, your home PC, and everything in between. Encrypted and end-to-end.

### 📦 Export & import
Back up your vault as JSON. Move it between machines, share it with a teammate, archive it forever.

### 🔒 Privacy-first
Free tier is 100% local — nothing ever leaves your machine. Pro syncs an encrypted copy only so it can move between your devices.

---

### Pricing

- **Free** — up to 20 saved tabs, all features, local-only
- **Pro** — $5/month — unlimited tabs, cloud sync, priority support
- **Lifetime** — $15 once — everything in Pro, forever

Payments handled securely by ExtensionPay. Cancel anytime.

---

### Why people switch from OneTab

- A modern, calm UI built for 2026 — not 2014
- Real workspace names instead of "Tab Group #47"
- Lightning-fast fuzzy search across 500+ saved tabs
- Cross-device sync that actually works
- Auto-suspend for tabs you can't bear to close
- One-time Lifetime license — no forever-subscriptions for a save button

---

### How it works

1. Click the Tab Vault Pro icon (or press the keyboard shortcut)
2. All your open tabs collapse into a new workspace
3. Name the workspace, search it, restore one tab or all of them
4. Repeat — your vault grows into a searchable archive of everything you've ever meant to read

---

### Permissions, explained

- **tabs** — to read titles/URLs of your open tabs so we can save them
- **storage** — to keep your saved tabs on your device
- **alarms** — to periodically check for inactive tabs to freeze
- **contextMenus** — to add right-click options on the toolbar icon
- **host permission for extensionpay.com** — only used to verify your Pro subscription

We never read page content. We never see your passwords. We never sell anything.

---

### Works everywhere Chrome does
Chrome · Edge · Brave · Arc · Opera · Vivaldi

---

**Stop hoarding. Start vaulting.**

---

## Single-purpose description (Chrome Web Store policy)

Tab Vault Pro is a tab manager that lets users condense their open browser tabs into a single, searchable list to free up memory and reduce visual clutter, with optional cross-device sync.

## Justification: tabs permission

The "tabs" permission is required to read the titles, URLs, and favicons of the user's currently open tabs so the extension can save them into a vault when the user clicks the toolbar icon or chooses "Send tab to Tab Vault Pro" from the context menu.

## Justification: storage permission

The "storage" permission is required to persist the user's saved tab vault and settings (auto-suspend timeout, etc.) on their device using chrome.storage.local.

## Justification: alarms permission

The "alarms" permission is required to schedule a periodic check (every minute) that identifies inactive background tabs and discards them to free memory, based on the user's configured timeout.

## Justification: contextMenus permission

The "contextMenus" permission is required to add right-click menu actions on the extension's toolbar icon ("Open Tab Vault Pro", "Send only this tab", "Send other tabs").

## Justification: host permission (extensionpay.com)

Required by the ExtensionPay payment library to verify the user's subscription status for Pro and Lifetime tiers.

## Remote code statement

No. Tab Vault Pro does not load or execute any remote code. All scripts are bundled in the extension package. The ExtensionPay library is included locally as ExtPay.js and only makes API calls (no script execution) to verify subscription status.

## Data usage disclosures

- Personally identifiable info: **No**
- Health info: **No**
- Financial info: **No** (handled entirely by ExtensionPay/Stripe, never touches the extension)
- Authentication info: **No**
- Personal communications: **No**
- Location: **No**
- Web history: **Yes** — URLs and titles of tabs the user explicitly chooses to save. Stored locally; encrypted cloud sync optional for Pro users.
- User activity: **No**
- Website content: **No**

I certify that:
- ✅ I do not sell or transfer user data to third parties outside of approved use cases
- ✅ I do not use or transfer user data for purposes unrelated to the item's single purpose
- ✅ I do not use or transfer user data to determine creditworthiness or for lending purposes

---

## Suggested store assets

- **Icon** (128x128): `extension/icons/icon.png`
- **Small promo tile** (440x280): crop from `src/assets/store-marquee.jpg`
- **Marquee promo tile** (1400x560): `src/assets/store-marquee.jpg`
- **Screenshots** (1280x800 or 640x400, at least 1, up to 5): capture from the live `vault.html` showing
  1. Empty state with "Condense all tabs" hero button
  2. Vault with 3 named workspaces (Wedding Planning, Q3 Research, Reading List)
  3. Search active with highlighted matches
  4. Pricing/upgrade modal
  5. Settings panel with auto-suspend toggle

## Suggested keywords
tab manager, tab saver, onetab alternative, tab suspender, save tabs, memory saver, ram saver, browser tabs, tab organizer, productivity, tab groups, workspace

---

## Tagline variations (for ads / social)

- 500 tabs. One quiet vault.
- Your tabs, finally under control.
- Condense, search, restore.
- The calmest way to manage tabs.
- Stop hoarding. Start vaulting.

## One-line pitch
Tab Vault Pro is the OneTab successor your 2026 browser deserves: condense, search, sync, and freeze tabs in one beautifully minimal vault.

## Twitter / X launch post (280 chars)
Just shipped Tab Vault Pro 🗂️

→ Click once. All tabs collapse into a searchable vault.
→ Name workspaces like "Taxes 2026" or "Wedding Planning"
→ Freeze inactive tabs to save RAM
→ Sync across devices

Free for 20 tabs. $15 lifetime.

No more 47-tab windows.

## Product Hunt tagline (60 chars)
Condense 500 tabs into one quiet, searchable vault.
const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</a>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: May 6, 2026</p>

        <div className="prose prose-neutral mt-10 max-w-none space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold">Summary</h2>
            <p>Tab Vault Pro is a Chrome extension that helps you save, organize, and restore browser tabs. We collect the minimum data required to make the product work. The Free tier stores everything locally on your device. The Pro tier additionally stores your saved tabs in our sync backend so they appear across your devices. We never sell your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">What we collect</h2>
            <ul className="list-disc pl-6">
              <li><strong>Saved tab data</strong> — titles and URLs of tabs you explicitly save into a vault or workspace.</li>
              <li><strong>Workspace metadata</strong> — names, colors, and timestamps you create.</li>
              <li><strong>Preferences</strong> — your in-app settings (theme, sort order, etc.).</li>
              <li><strong>License status (Pro/Lifetime only)</strong> — payment and entitlement state are handled by ExtensionPay (extensionpay.com). We receive only an anonymous user ID and a paid/unpaid flag.</li>
            </ul>
            <p>We do <strong>not</strong> collect: browsing history of pages you didn’t save, page contents, keystrokes, form data, location, IP-based tracking, advertising identifiers, health, or financial information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">How data is stored</h2>
            <ul className="list-disc pl-6">
              <li><strong>Free tier:</strong> Data lives only in <code>chrome.storage.local</code> on your device. Nothing leaves your browser.</li>
              <li><strong>Pro / Lifetime tier:</strong> Saved tabs and workspaces are encrypted in transit (TLS) and at rest, and synced through our backend so they’re available on your other signed-in devices.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">How we use data</h2>
            <p>Saved tab data is used solely to render your vault, power search, and restore tabs. License data is used solely to unlock paid features. We do not use your data to train models, build profiles, or serve ads.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Sharing</h2>
            <p>We do not sell, rent, or transfer personal data to third parties. The only third-party processors involved are:</p>
            <ul className="list-disc pl-6">
              <li><strong>ExtensionPay</strong> — payments and license verification.</li>
              <li><strong>Our hosting provider</strong> — used only to store synced vault data for Pro users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Permissions</h2>
            <ul className="list-disc pl-6">
              <li><code>tabs</code> — read titles/URLs of open tabs so you can save them.</li>
              <li><code>storage</code> — persist your vault locally.</li>
              <li><code>alarms</code> — schedule background freezing of inactive tabs to save RAM.</li>
              <li><code>contextMenus</code> — add right-click "Save tab to vault" actions.</li>
              <li><code>https://extensionpay.com/*</code> — verify Pro/Lifetime license.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Your rights</h2>
            <p>You can export or delete all your data at any time from the extension settings. Deleting the extension removes all local data. To delete synced data, use the in-app “Delete account &amp; sync data” button or email us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Children</h2>
            <p>Tab Vault Pro is not directed to children under 13 and we do not knowingly collect data from them.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Changes</h2>
            <p>If we materially change this policy, we’ll update the date above and notify Pro users in-app.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p>Questions or data requests: <a className="underline" href="mailto:privacy@tabvaultpro.app">privacy@tabvaultpro.app</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
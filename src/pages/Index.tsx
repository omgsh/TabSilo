import iconUrl from "@/assets/tabvault-icon.png";

const features = [
  {
    title: "One click. All tabs.",
    desc: "Collapse every open tab into a clean, searchable list. Your window goes from 47 tabs to 1.",
  },
  {
    title: "Instant memory boost",
    desc: "Stashed tabs use zero RAM. Inactive tabs auto-suspend after a configurable timeout.",
  },
  {
    title: "Restore anything, anytime",
    desc: "Bring back a single tab or an entire group. Your sessions never disappear.",
  },
  {
    title: "Export & import",
    desc: "Back up your vault as JSON. Move it between machines without losing a thing.",
  },
];

function downloadExtension() {
  fetch("/tabvault.zip")
    .then((r) => {
      if (!r.ok) throw new Error(`Download failed: ${r.status}`);
      return r.blob();
    })
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "tabvault.zip";
      a.click();
      URL.revokeObjectURL(a.href);
    })
    .catch((e) => alert(e.message));
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ backgroundImage: "var(--gradient-soft)" }}>
      <header className="container mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <img src={iconUrl} alt="TabVault logo" width={36} height={36} className="rounded-lg" />
          <span className="text-lg font-semibold tracking-tight">TabVault</span>
        </div>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#install" className="hover:text-foreground">Install</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <button
          onClick={downloadExtension}
          className="rounded-lg px-4 py-2 text-sm font-medium text-[hsl(var(--brand-foreground))] shadow-[var(--shadow-elegant)] transition hover:opacity-95"
          style={{ background: "var(--gradient-hero)" }}
        >
          Download
        </button>
      </header>

      <section className="container mx-auto grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: "hsl(var(--accent-2))" }} />
            Free · Open · Privacy-first
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Your tabs.<br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              Finally under control.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            TabVault collapses every open tab into a single tidy list — reclaiming memory,
            silencing the noise, and giving Chrome its speed back.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={downloadExtension}
              className="rounded-xl px-6 py-3 text-base font-semibold text-[hsl(var(--brand-foreground))] shadow-[var(--shadow-elegant)] transition hover:scale-[1.02]"
              style={{ background: "var(--gradient-hero)" }}
            >
              Download TabVault
            </button>
            <a
              href="#install"
              className="rounded-xl border border-border bg-card px-6 py-3 text-base font-semibold transition hover:bg-secondary"
            >
              Install guide
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Works on Chrome, Edge, Brave, Arc & Opera.</p>
        </div>

        <div className="relative">
          <div
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[hsl(0_72%_65%)]" />
                <span className="h-3 w-3 rounded-full bg-[hsl(45_90%_60%)]" />
                <span className="h-3 w-3 rounded-full bg-[hsl(140_60%_55%)]" />
              </div>
              <div className="ml-3 flex-1 truncate rounded-md bg-secondary px-3 py-1 text-xs text-muted-foreground">
                chrome-extension://tabvault/vault.html
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Stashed Mar 12 · 14:22</div>
                  <div className="text-xs text-muted-foreground">23 tabs · Research</div>
                </div>
                <button className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium">Restore all</button>
              </div>
              {[
                { t: "How OneTab works under the hood — Hacker News", h: "news.ycombinator.com" },
                { t: "Chrome Manifest V3 service worker lifecycle", h: "developer.chrome.com" },
                { t: "The case for tab hoarding (and the cure)", h: "theverge.com" },
                { t: "useEffect dependency array gotchas", h: "react.dev" },
                { t: "Why your laptop fan won't shut up", h: "wired.com" },
              ].map((tab, i) => (
                <div key={i} className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-secondary">
                  <span className="h-4 w-4 rounded-sm" style={{ background: "var(--gradient-hero)", opacity: 0.6 + i * 0.08 }} />
                  <span className="flex-1 truncate text-sm">{tab.t}</span>
                  <span className="text-xs text-muted-foreground">{tab.h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto py-16">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Built for tab hoarders</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Inspired by OneTab, rebuilt with auto-suspension, exports and a calmer interface.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-[hsl(var(--brand-foreground))]"
                style={{ background: "var(--gradient-hero)" }}
              >
                ✦
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="install" className="container mx-auto py-16">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)] md:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Install in 30 seconds</h2>
              <ol className="mt-6 space-y-3 text-sm">
                {[
                  "Download the TabVault zip and unzip it.",
                  <>Open <code className="rounded bg-secondary px-1.5 py-0.5">chrome://extensions</code> in your browser.</>,
                  "Toggle Developer mode in the top-right.",
                  "Click Load unpacked and select the unzipped folder.",
                  "Pin TabVault. Click the icon to stash all tabs.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-semibold text-[hsl(var(--brand-foreground))]"
                      style={{ background: "var(--gradient-hero)" }}
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <button
              onClick={downloadExtension}
              className="rounded-xl px-8 py-4 text-base font-semibold text-[hsl(var(--brand-foreground))] shadow-[var(--shadow-elegant)] transition hover:scale-[1.02]"
              style={{ background: "var(--gradient-hero)" }}
            >
              Download .zip
            </button>
          </div>
        </div>
      </section>

      <section id="faq" className="container mx-auto pb-24 pt-8">
        <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            { q: "Does TabVault upload my browsing data?", a: "No. Everything stays in chrome.storage.local on your device." },
            { q: "How is it different from OneTab?", a: "Same core idea — collapse tabs into a list — plus auto-suspending of inactive tabs, export/import, and a redesigned UI." },
            { q: "Will my stashed tabs survive a restart?", a: "Yes. Groups persist locally until you delete them." },
            { q: "Why not in the Chrome Web Store?", a: "This is a side-loaded build. Load it via chrome://extensions → Load unpacked." },
          ].map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Made with care for over-tabbed humans.
      </footer>
    </div>
  );
};

export default Index;

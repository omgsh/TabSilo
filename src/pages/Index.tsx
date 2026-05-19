import iconUrl from "@/assets/tabvault-icon.png";
import { Check, Search, Layers, Snowflake, Cloud } from "lucide-react";

const features = [
  {
    title: "Condense All — one click",
    icon: Layers,
    desc: "A single button instantly closes every tab and files them into a titled, dated workspace.",
  },
  {
    title: "Lightning-fast search",
    icon: Search,
    desc: "Fuzzy search across 500+ saved tabs with instant highlighting. ⌘K from anywhere.",
  },
  {
    title: "Named workspaces",
    icon: Cloud,
    desc: "Group tabs into projects like “Taxes 2026” or “Wedding Planning.” Open or archive entire sets.",
  },
  {
    title: "Freeze inactive tabs",
    icon: Snowflake,
    desc: "Discard idle tabs to free RAM. They reload instantly the moment you click them.",
  },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    cta: "Download free",
    highlight: false,
    features: ["Up to 20 saved tabs", "Named workspaces", "Search & freeze", "Local-only storage"],
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    cta: "Start Pro",
    highlight: true,
    features: ["Unlimited saved tabs", "Cross-device sync", "Priority support", "Cloud backups"],
  },
  {
    name: "Lifetime",
    price: "$15",
    period: "once",
    cta: "Get Lifetime",
    badge: "Most loved",
    highlight: false,
    features: ["Everything in Pro", "Pay once, own forever", "All future updates", "Founder badge"],
  },
];

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/tab-vault-pro-%E2%80%94-tab-manag/fkifabjdepbgcajbphnmbhllikdkampa";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ backgroundImage: "var(--gradient-soft)" }}>
      <header className="container mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <img src={iconUrl} alt="Tab Vault Pro logo" width={36} height={36} className="rounded-lg" />
          <span className="text-lg font-semibold tracking-tight">Tab Vault Pro</span>
        </div>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <a
          href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer"
          className="rounded-lg px-4 py-2 text-sm font-medium text-[hsl(var(--brand-foreground))] shadow-[var(--shadow-elegant)] transition hover:opacity-95"
          style={{ background: "var(--gradient-hero)" }}
        >
          Download
        </a>
      </header>

      <section className="container mx-auto grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: "hsl(var(--accent-2))" }} />
            New · Workspace sync · Lifetime $15
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            500 tabs.<br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              One quiet vault.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Tab Vault Pro condenses every open tab into a named, searchable workspace —
            freeing memory, syncing across devices, and giving Chrome its speed back.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer"
              className="rounded-xl px-6 py-3 text-base font-semibold text-[hsl(var(--brand-foreground))] shadow-[var(--shadow-elegant)] transition hover:scale-[1.02]"
              style={{ background: "var(--gradient-hero)" }}
            >
              Download free
            </a>
            <a
              href="#pricing"
              className="rounded-xl border border-border bg-card px-6 py-3 text-base font-semibold transition hover:bg-secondary"
            >
              See pricing
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
                chrome-extension://tab-vault-pro/vault.html
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <div className="rounded-md border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                🔍 Search 247 saved tabs…
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Wedding Planning</div>
                  <div className="text-xs text-muted-foreground">23 tabs · Saved Mar 12</div>
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
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Built for productivity nerds</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Everything OneTab does, plus workspace sync, fuzzy search, and a calmer interface.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-[hsl(var(--brand-foreground))]"
                style={{ background: "var(--gradient-hero)" }}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="container mx-auto py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple, honest pricing</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Start free. Upgrade when your vault outgrows 20 tabs — or pay once and own it forever.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border bg-card p-8 shadow-[var(--shadow-card)] ${
                t.highlight ? "border-transparent ring-2 ring-[hsl(var(--primary))]" : "border-border"
              }`}
            >
              {t.badge && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-[hsl(var(--brand-foreground))]"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  {t.badge}
                </span>
              )}
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-[hsl(var(--primary))]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer"
                className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  t.highlight
                    ? "text-[hsl(var(--brand-foreground))] shadow-[var(--shadow-elegant)] hover:scale-[1.02]"
                    : "border border-border bg-secondary hover:bg-secondary/70"
                }`}
                style={t.highlight ? { background: "var(--gradient-hero)" } : undefined}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="container mx-auto pb-24 pt-8">
        <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            { q: "Does Tab Vault Pro upload my browsing data?", a: "Free tier is 100% local. Pro stores an encrypted copy in the cloud only so it can sync across your devices." },
            { q: "How is it different from OneTab?", a: "Same core idea — condense tabs into a list — plus named workspaces, fuzzy search, freeze, and cross-device sync." },
            { q: "What happens at the 20-tab limit?", a: "On Free, the oldest workspaces are read-only once you pass 20 saved tabs. Upgrade to Pro or Lifetime for unlimited storage." },
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
        Made with care for over-tabbed humans. · <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default Index;

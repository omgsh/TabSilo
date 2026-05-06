const VAULT_KEY = "tabvault_groups";
const SETTINGS_KEY = "tabvault_settings";
const DEFAULT_SETTINGS = { autoSuspendMinutes: 30, suspendEnabled: true };

const groupsEl = document.getElementById("groups");
const statsEl = document.getElementById("stats");
const tpl = document.getElementById("group-tpl");
const searchEl = document.getElementById("search");
let searchQuery = "";

async function loadGroups() {
  const { [VAULT_KEY]: g } = await chrome.storage.local.get(VAULT_KEY);
  return Array.isArray(g) ? g : [];
}
async function saveGroups(g) { await chrome.storage.local.set({ [VAULT_KEY]: g }); }

async function loadSettings() {
  const { [SETTINGS_KEY]: s } = await chrome.storage.local.get(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(s || {}) };
}
async function saveSettings(s) { await chrome.storage.local.set({ [SETTINGS_KEY]: s }); }

function host(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } }
function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function highlight(text, q) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return [text.slice(0, idx), Object.assign(document.createElement("mark"), { className: "hl", textContent: text.slice(idx, idx + q.length) }), text.slice(idx + q.length)];
}

async function render() {
  const groups = await loadGroups();
  groupsEl.innerHTML = "";
  const totalTabs = groups.reduce((n, g) => n + g.tabs.length, 0);
  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? groups
        .map((g) => ({
          ...g,
          tabs: g.tabs.filter(
            (t) =>
              (t.title || "").toLowerCase().includes(q) ||
              (t.url || "").toLowerCase().includes(q) ||
              (g.name || "").toLowerCase().includes(q)
          ),
        }))
        .filter((g) => g.tabs.length)
    : groups;
  const matchCount = filtered.reduce((n, g) => n + g.tabs.length, 0);
  statsEl.innerHTML = q
    ? `<div><strong>${matchCount}</strong> match${matchCount === 1 ? "" : "es"} for “${q}”</div>
       <div>across <strong>${filtered.length}</strong> workspace${filtered.length === 1 ? "" : "s"}</div>`
    : `<div><strong>${groups.length}</strong> workspace${groups.length === 1 ? "" : "s"}</div>
       <div><strong>${totalTabs}</strong> saved tab${totalTabs === 1 ? "" : "s"}</div>
       <div>Click a tab to restore it. Name a workspace to organize your projects.</div>`;

  if (!groups.length) {
    groupsEl.innerHTML = `<div class="empty">
      <h2>Your vault is empty</h2>
      <p>Click <strong>Condense all tabs</strong> or the toolbar icon to collapse your tabs into a tidy workspace.</p>
    </div>`;
    return;
  }
  if (!filtered.length) {
    groupsEl.innerHTML = `<div class="empty"><h2>No matches</h2><p>No saved tabs match “${q}”.</p></div>`;
    return;
  }

  for (const group of filtered) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const nameInput = node.querySelector(".group-name");
    nameInput.value = group.name || "";
    nameInput.placeholder = `Workspace · ${fmtDate(group.createdAt)}`;
    nameInput.addEventListener("change", async () => {
      const all = await loadGroups();
      const idx = all.findIndex((g) => g.id === group.id);
      if (idx >= 0) { all[idx].name = nameInput.value.trim(); await saveGroups(all); }
    });

    node.querySelector(".group-meta").textContent =
      `${group.tabs.length} tab${group.tabs.length === 1 ? "" : "s"} · ${fmtDate(group.createdAt)}`;

    node.querySelector(".restore-group").addEventListener("click", () => restoreGroup(group.id, true));
    node.querySelector(".delete-group").addEventListener("click", async () => {
      if (!confirm(`Delete this group of ${group.tabs.length} tabs?`)) return;
      const all = (await loadGroups()).filter((g) => g.id !== group.id);
      await saveGroups(all); render();
    });

    const list = node.querySelector(".tab-list");
    group.tabs.forEach((tab, i) => {
      const li = document.createElement("li");
      li.className = "tab-item";
      const img = document.createElement("img");
      img.src = tab.favIconUrl || "icons/icon.png";
      img.onerror = () => { img.src = "icons/icon.png"; };
      const a = document.createElement("a");
      a.href = tab.url; a.target = "_blank"; a.rel = "noopener";
      const parts = highlight(tab.title || tab.url, q);
      if (Array.isArray(parts)) parts.forEach((p) => a.append(p)); else a.textContent = parts;
      a.addEventListener("click", async (e) => {
        e.preventDefault();
        await chrome.tabs.create({ url: tab.url, active: true });
        await removeTabFromGroup(group.id, i);
      });
      const hostSpan = document.createElement("span");
      hostSpan.className = "host"; hostSpan.textContent = host(tab.url);
      const rm = document.createElement("button");
      rm.className = "remove"; rm.textContent = "×"; rm.title = "Remove";
      rm.addEventListener("click", () => removeTabFromGroup(group.id, i));
      li.append(img, a, hostSpan, rm);
      list.append(li);
    });

    groupsEl.append(node);
  }
}

async function removeTabFromGroup(groupId, tabIndex) {
  const all = await loadGroups();
  const idx = all.findIndex((g) => g.id === groupId);
  if (idx < 0) return;
  all[idx].tabs.splice(tabIndex, 1);
  if (all[idx].tabs.length === 0) all.splice(idx, 1);
  await saveGroups(all); render();
}

async function restoreGroup(groupId, removeAfter) {
  const all = await loadGroups();
  const group = all.find((g) => g.id === groupId);
  if (!group) return;
  for (const t of group.tabs) await chrome.tabs.create({ url: t.url, active: false });
  if (removeAfter) {
    const filtered = all.filter((g) => g.id !== groupId);
    await saveGroups(filtered); render();
  }
}

document.getElementById("stash-all").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "stashAll" }, () => setTimeout(render, 300));
});
document.getElementById("freeze-all").addEventListener("click", async () => {
  const tabs = await chrome.tabs.query({ active: false, discarded: false, audible: false });
  let n = 0;
  for (const t of tabs) {
    if (t.pinned) continue;
    if (!t.url || t.url.startsWith("chrome://") || t.url.startsWith("chrome-extension://")) continue;
    try { await chrome.tabs.discard(t.id); n++; } catch {}
  }
  alert(`Froze ${n} inactive tab${n === 1 ? "" : "s"} to save RAM.`);
});
searchEl.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  render();
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchEl.focus(); }
});
document.getElementById("restore-all").addEventListener("click", async () => {
  const all = await loadGroups();
  if (!all.length) return;
  if (!confirm("Restore every stashed tab and clear the vault?")) return;
  for (const g of all) for (const t of g.tabs) await chrome.tabs.create({ url: t.url, active: false });
  await saveGroups([]); render();
});
document.getElementById("export").addEventListener("click", async () => {
  const groups = await loadGroups();
  const blob = new Blob([JSON.stringify(groups, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `tabvault-${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(a.href);
});
document.getElementById("import-btn").addEventListener("click", () => document.getElementById("import-file").click());
document.getElementById("import-file").addEventListener("change", async (e) => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data)) throw new Error("Invalid file");
    const existing = await loadGroups();
    await saveGroups([...data, ...existing]); render();
  } catch (err) { alert("Could not import: " + err.message); }
});

// Settings wiring
(async () => {
  const s = await loadSettings();
  const enabled = document.getElementById("suspend-enabled");
  const minutes = document.getElementById("suspend-minutes");
  enabled.checked = s.suspendEnabled;
  minutes.value = s.autoSuspendMinutes;
  enabled.addEventListener("change", async () => {
    const cur = await loadSettings();
    await saveSettings({ ...cur, suspendEnabled: enabled.checked });
  });
  minutes.addEventListener("change", async () => {
    const v = Math.max(1, Math.min(600, parseInt(minutes.value, 10) || 30));
    minutes.value = v;
    const cur = await loadSettings();
    await saveSettings({ ...cur, autoSuspendMinutes: v });
  });
})();

chrome.storage.onChanged.addListener((changes) => {
  if (changes[VAULT_KEY]) render();
});

render();

// ===== ExtensionPay UI =====
function send(msg) {
  return new Promise((res) => chrome.runtime.sendMessage(msg, res));
}
async function refreshPayUI() {
  const upgradeBtn = document.getElementById("upgrade");
  const proBadge = document.getElementById("pro-badge");
  const banner = document.getElementById("limit-banner");
  const limitCount = document.getElementById("limit-count");
  const status = await send({ type: "checkLimit" });
  if (!status?.ok) return;
  if (status.paid) {
    upgradeBtn.hidden = true; proBadge.hidden = false; banner.hidden = true;
  } else {
    upgradeBtn.hidden = false; proBadge.hidden = true;
    banner.hidden = false;
    limitCount.textContent = status.count;
    banner.style.borderColor = status.atLimit ? "rgba(220,38,38,.4)" : "";
  }
}
document.getElementById("upgrade").addEventListener("click", () => send({ type: "openPayment" }));
document.getElementById("banner-upgrade").addEventListener("click", () => send({ type: "openPayment" }));
refreshPayUI();
chrome.storage.onChanged.addListener((c) => { if (c[VAULT_KEY]) refreshPayUI(); });
window.addEventListener("focus", refreshPayUI);
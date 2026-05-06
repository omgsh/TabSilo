const VAULT_KEY = "tabvault_groups";
const SETTINGS_KEY = "tabvault_settings";
const DEFAULT_SETTINGS = { autoSuspendMinutes: 30, suspendEnabled: true };

const groupsEl = document.getElementById("groups");
const statsEl = document.getElementById("stats");
const tpl = document.getElementById("group-tpl");

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

async function render() {
  const groups = await loadGroups();
  groupsEl.innerHTML = "";
  const totalTabs = groups.reduce((n, g) => n + g.tabs.length, 0);
  statsEl.innerHTML = `<div><strong>${groups.length}</strong> group${groups.length === 1 ? "" : "s"}</div>
    <div><strong>${totalTabs}</strong> stashed tab${totalTabs === 1 ? "" : "s"}</div>
    <div>Click a tab to restore it. Click <em>Restore all</em> to bring back the whole group.</div>`;

  if (!groups.length) {
    groupsEl.innerHTML = `<div class="empty">
      <h2>Your vault is empty</h2>
      <p>Click <strong>Stash all open tabs</strong> or the toolbar icon to collapse your tabs into a tidy list.</p>
    </div>`;
    return;
  }

  for (const group of groups) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const nameInput = node.querySelector(".group-name");
    nameInput.value = group.name || "";
    nameInput.placeholder = `Stashed ${fmtDate(group.createdAt)}`;
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
      a.href = tab.url; a.textContent = tab.title || tab.url; a.target = "_blank"; a.rel = "noopener";
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
// TabVault background service worker
const VAULT_KEY = "tabvault_groups";
const SETTINGS_KEY = "tabvault_settings";
const DEFAULT_SETTINGS = { autoSuspendMinutes: 30, suspendEnabled: true };

async function getSettings() {
  const { [SETTINGS_KEY]: s } = await chrome.storage.local.get(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(s || {}) };
}

async function getVaultUrl() {
  return chrome.runtime.getURL("vault.html");
}

async function openVault() {
  const url = await getVaultUrl();
  const tabs = await chrome.tabs.query({});
  const existing = tabs.find((t) => t.url && t.url.startsWith(url));
  if (existing) {
    await chrome.tabs.update(existing.id, { active: true });
    await chrome.windows.update(existing.windowId, { focused: true });
    return existing;
  }
  return chrome.tabs.create({ url });
}

async function stashAllTabs() {
  const vaultUrl = await getVaultUrl();
  const window = await chrome.windows.getCurrent();
  const tabs = await chrome.tabs.query({ windowId: window.id });
  const stashable = tabs.filter(
    (t) =>
      t.url &&
      !t.pinned &&
      !t.url.startsWith("chrome://") &&
      !t.url.startsWith("chrome-extension://") &&
      !t.url.startsWith("edge://") &&
      !t.url.startsWith("about:")
  );
  if (stashable.length === 0) {
    await openVault();
    return;
  }
  const group = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    name: "",
    tabs: stashable.map((t) => ({
      url: t.url,
      title: t.title || t.url,
      favIconUrl: t.favIconUrl || "",
    })),
  };
  const { [VAULT_KEY]: existing } = await chrome.storage.local.get(VAULT_KEY);
  const groups = Array.isArray(existing) ? existing : [];
  groups.unshift(group);
  await chrome.storage.local.set({ [VAULT_KEY]: groups });
  await openVault();
  await chrome.tabs.remove(stashable.map((t) => t.id));
}

chrome.action.onClicked.addListener(() => {
  stashAllTabs().catch((e) => console.error(e));
});

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "tabvault-open",
    title: "Open TabVault",
    contexts: ["action"],
  });
  chrome.contextMenus.create({
    id: "tabvault-stash-current",
    title: "Send only this tab to TabVault",
    contexts: ["action"],
  });
  chrome.contextMenus.create({
    id: "tabvault-stash-others",
    title: "Send other tabs to TabVault",
    contexts: ["action"],
  });
  await chrome.alarms.create("tabvault-suspend-check", { periodInMinutes: 1 });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "tabvault-open") return openVault();
  if (info.menuItemId === "tabvault-stash-current" && tab) {
    return stashTabs([tab]);
  }
  if (info.menuItemId === "tabvault-stash-others") {
    const window = await chrome.windows.getCurrent();
    const tabs = await chrome.tabs.query({ windowId: window.id });
    return stashTabs(tabs.filter((t) => t.id !== tab.id));
  }
});

async function stashTabs(tabs) {
  const stashable = tabs.filter(
    (t) =>
      t.url &&
      !t.pinned &&
      !t.url.startsWith("chrome://") &&
      !t.url.startsWith("chrome-extension://")
  );
  if (!stashable.length) return openVault();
  const group = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    name: "",
    tabs: stashable.map((t) => ({
      url: t.url,
      title: t.title || t.url,
      favIconUrl: t.favIconUrl || "",
    })),
  };
  const { [VAULT_KEY]: existing } = await chrome.storage.local.get(VAULT_KEY);
  const groups = Array.isArray(existing) ? existing : [];
  groups.unshift(group);
  await chrome.storage.local.set({ [VAULT_KEY]: groups });
  await openVault();
  await chrome.tabs.remove(stashable.map((t) => t.id));
}

// ===== Auto-suspend (discard) inactive tabs =====
const lastActive = new Map(); // tabId -> timestamp

chrome.tabs.onActivated.addListener(({ tabId }) => {
  lastActive.set(tabId, Date.now());
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") lastActive.set(tabId, Date.now());
});
chrome.tabs.onRemoved.addListener((tabId) => lastActive.delete(tabId));

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "tabvault-suspend-check") return;
  const settings = await getSettings();
  if (!settings.suspendEnabled) return;
  const cutoff = Date.now() - settings.autoSuspendMinutes * 60_000;
  const tabs = await chrome.tabs.query({ active: false, discarded: false, audible: false });
  for (const t of tabs) {
    if (t.pinned) continue;
    if (!t.url || t.url.startsWith("chrome://") || t.url.startsWith("chrome-extension://")) continue;
    const ts = lastActive.get(t.id) ?? t.lastAccessed ?? 0;
    if (ts && ts < cutoff) {
      try { await chrome.tabs.discard(t.id); } catch {}
    }
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    if (msg.type === "stashAll") { await stashAllTabs(); sendResponse({ ok: true }); }
    if (msg.type === "openVault") { await openVault(); sendResponse({ ok: true }); }
  })();
  return true;
});
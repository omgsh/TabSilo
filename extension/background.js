// Tab Silo background service worker
importScripts('ExtPay.js');
const extpay = ExtPay('tab-silo');
extpay.startBackground();

const VAULT_KEY = "tabvault_groups";
const SETTINGS_KEY = "tabvault_settings";
const DEFAULT_SETTINGS = { autoSuspendMinutes: 30, suspendEnabled: true };
const FREE_TAB_LIMIT = 20;

async function isPaid() {
  try {
    const user = await ExtPay('tab-silo').getUser();
    return !!user.paid;
  } catch { return false; }
}

async function countSavedTabs() {
  const { [VAULT_KEY]: existing } = await chrome.storage.local.get(VAULT_KEY);
  const groups = Array.isArray(existing) ? existing : [];
  return groups.reduce((n, g) => n + (g.tabs?.length || 0), 0);
}

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
  const paid = await isPaid();
  const current = await countSavedTabs();
  let toSave = stashable;
  if (!paid) {
    const remaining = Math.max(0, FREE_TAB_LIMIT - current);
    if (remaining === 0) {
      await openVault();
      ExtPay('tab-silo').openPaymentPage();
      return;
    }
    toSave = stashable.slice(0, remaining);
  }
  const group = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    name: "",
    tabs: toSave.map((t) => ({
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
  await chrome.tabs.remove(toSave.map((t) => t.id));
  if (!paid && toSave.length < stashable.length) {
    ExtPay('tab-silo').openPaymentPage();
  }
}

chrome.action.onClicked.addListener(() => {
  stashAllTabs().catch((e) => console.error(e));
});

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "tabvault-open",
    title: "Open Tab Silo",
    contexts: ["action"],
  });
  chrome.contextMenus.create({
    id: "tabvault-stash-current",
    title: "Send only this tab to Tab Silo",
    contexts: ["action"],
  });
  chrome.contextMenus.create({
    id: "tabvault-stash-others",
    title: "Send other tabs to Tab Silo",
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
  const paid = await isPaid();
  const current = await countSavedTabs();
  let toSave = stashable;
  if (!paid) {
    const remaining = Math.max(0, FREE_TAB_LIMIT - current);
    if (remaining === 0) { await openVault(); ExtPay('tab-silo').openPaymentPage(); return; }
    toSave = stashable.slice(0, remaining);
  }
  const group = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    name: "",
    tabs: toSave.map((t) => ({
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
  await chrome.tabs.remove(toSave.map((t) => t.id));
  if (!paid && toSave.length < stashable.length) ExtPay('tab-silo').openPaymentPage();
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
    if (msg.type === "openPayment") { ExtPay('tab-silo').openPaymentPage(); sendResponse({ ok: true }); }
    if (msg.type === "openLogin") { ExtPay('tab-silo').openLoginPage(); sendResponse({ ok: true }); }
    if (msg.type === "getUser") {
      try { const u = await ExtPay('tab-silo').getUser(); sendResponse({ ok: true, user: { paid: !!u.paid, email: u.email || null } }); }
      catch (e) { sendResponse({ ok: false, error: String(e) }); }
    }
    if (msg.type === "checkLimit") {
      const paid = await isPaid();
      const count = await countSavedTabs();
      sendResponse({ ok: true, paid, count, limit: FREE_TAB_LIMIT, atLimit: !paid && count >= FREE_TAB_LIMIT });
    }
  })();
  return true;
});
function validURL(str) {
  if (/\s/.test(str)) {
    return false;  // don't allow whitespace in the middle.
  }
  try {
    const u = new URL(str);
    // Note that tabs.create() won't accept data: or javascript: URLs.
    return /^(https?):$/.test(u.protocol);
  } catch (e) {
    return false;
  }
}

function splicePrefix(url, proto, max_missing) {
  const urlLower = url.toLowerCase();
  for (let i = 0; i <= max_missing; i++) {
    const s = proto.substring(i);
    if (urlLower.startsWith(s)) {
      return proto + url.substring(s.length);
    }
  }
  return null;
}

function fixURL(url) {
  if (!url) {
    return null;
  }
  url = url.trim();
  if (validURL(url)) {
    return url;
  }
  if (!/[:./]/.test(url)) {
    return null;  // Not URLy enough.
  }
  // Put IPv6 addresses in brackets.
  if (/^([0-9A-Fa-f]*:){2}[0-9A-Fa-f:.]*$/.test(url)) {
    url = `[${url}]`;
  }
  // Try adding a protocol prefix.
  const prefixedURL = splicePrefix(url, "http://", 3) || splicePrefix(url, "https://", 8);
  if (validURL(prefixedURL)) {
    return prefixedURL;
  }
  return null;
}

async function openTab(parentTab, mods, url) {
  try {
    const props = { url };
    // parentTab may be null if (e.g.) the context menu was opened from
    // another extension's popup window.
    if (parentTab) {
      props.windowId = parentTab.windowId;
    }
    if (mods == "Ctrl" || mods == "Command" || mods == "Shift") {
      // Open a new background tab.
      if (parentTab) {
        props.index = await nextBackgroundIndex(parentTab);
        props.openerTabId = parentTab.id;
      }
      props.active = false;
      const newTab = await browser.tabs.create(props);
      if (mods == "Shift") {
        // Move the tab to a new window. We do this in two steps because
        // windows.create() doesn't catch invalid URLs.
        await browser.windows.create({tabId: newTab.id});
      }
      return newTab;
    } else {
      // Default behavior: open a new foreground tab.
      if (parentTab) {
        props.index = parentTab.index + 1;
        props.openerTabId = parentTab.id;
      }
      return await browser.tabs.create(props);
    }
  } catch (e) {
    console.log("openTab fail:", e);
    return null;  // Indicate that an error occurred
  }
}

async function nextBackgroundIndex(tab) {
  const childTabs = await browser.tabs.query({openerTabId: tab.id});
  if (childTabs.length > 0) {
    childTabs.sort((a, b) => a.index - b.index);
    return childTabs[childTabs.length - 1].index + 1;
  } else {
    return tab.index + 1;
  }
}

function textToErrorURL(text) {
  if (text.length > 100) {
    text = text.substring(0, 100) + "…";
  }
  return browser.runtime.getURL("error.html") + "?text=" + encodeURIComponent(text);
}


async function hasPermission(p) {
  try {
    return browser.permissions.contains(p);
  } catch (error) {
    console.error("Permission check failed:", error);
    return false;
  }
}

const ALL_URLS = { origins: ["<all_urls>"] };
const WILDCARD_TITLE = "Goto \"%s\" as URL";

browser.contextMenus.create({
  id: "gotofoo",
  title: WILDCARD_TITLE,
  contexts: ["selection"],
  visible: true
});

browser.contextMenus.onShown.addListener(async (info, tab) => {
  let visible = true;
  let title = WILDCARD_TITLE;

  // Firefox automatically grants temporary permission on user interaction,
  // but that happens after showing this context menu. To keep the UI
  // consistent, we only process text if granted permanent permission.
  if (info.selectionText && await hasPermission(ALL_URLS)) {
    const url = fixURL(info.selectionText);
    visible = !!url;
    title = `Goto ${url}`;
  }
  browser.contextMenus.update("gotofoo", { visible, title });
  browser.contextMenus.refresh();
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "gotofoo") {
    const mods = info.modifiers.sort().join('|');
    const url = fixURL(info.selectionText);
    if (!(url && await openTab(tab, mods, url))) {
      // If the URL is invalid or opening fails, show a detailed error page.
      await openTab(tab, mods, textToErrorURL(info.selectionText));
    }
  }
});
function validURL(str) {
  if (/\s/.test(str)) {
    return false;  // don't allow whitespace in the middle.
  }
  try {
    const u = new URL(str);
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
    if (mods == "Ctrl" || mods == "Command" || mods == "Shift") {
      // Open a new background tab.
      const newTab = await browser.tabs.create({
        'url': url,
        'windowId': parentTab.windowId,
        'index': await nextBackgroundIndex(parentTab),
        'openerTabId': parentTab.id,
        'active': false
      });
      if (mods == "Shift") {
        // Move the tab to a new window. We do this in two steps because
        // windows.create() doesn't catch invalid URLs.
        await browser.windows.create({'tabId': newTab.id});
      }
      return newTab;
    } else {
      // Default behavior: open a new foreground tab.
      return await browser.tabs.create({
        'url': url,
        'windowId': parentTab.windowId,
        'index': parentTab.index + 1,
        'openerTabId': parentTab.id
      });
    }
  } catch (e) {
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

// Flash a simple "URL ?" error message for 1 second.
async function flashError(tab, mods) {
  const newTab = await openTab(tab, mods, browser.runtime.getURL("error.html"));
  if (newTab) {
    setTimeout(() => {
      browser.tabs.remove(newTab.id);
    }, 1000);
  }
}

const wildcardTitle = "Goto \"%s\" as URL";

browser.contextMenus.create({
  id: "gotofoo",
  title: wildcardTitle,
  contexts: ["selection"],
  visible: true
});

browser.contextMenus.onShown.addListener((info, tab) => {
  console.log("onShown1", info);
  console.log("onShown2", info.selectionText);
  let visible = true;
  let title = wildcardTitle;
  if (info.selectionText) {
    // This only works when we have <all_urls> permission.
    const url = fixURL(info.selectionText);
    visible = !!url;
    title = `Goto ${url}`;
  }
  browser.contextMenus.update("gotofoo", { visible, title });
  browser.contextMenus.refresh();
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "gotofoo") {
    console.log("onClicked", info.selectionText, info);
    const mods = info.modifiers.sort().join('|');
    const url = fixURL(info.selectionText);
    if (!(url && await openTab(tab, mods, url))) {
      // This error is known to occur when opening data: or javascript: URLs,
      // though the validURL() regex filters them out first.
      await flashError(tab, mods);
    }
  }
});

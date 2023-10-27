function validURL(str) {
  if (/\s/.test(str)) {
    return null;  // don't allow whitespace in the middle.
  }
  try {
    const u = new URL(str);
    return /^(https?):$/.test(u.protocol);
  } catch (e) {
    return null;
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

async function addChildTab(parentTab, url) {
  try {
    return await browser.tabs.create({
      'url': url,
      'windowId': parentTab.windowId,
      'index': parentTab.index + 1,  // n.b. index not id
      'openerTabId': parentTab.id    // n.b. id not index
    });
  } catch (e) {
    return null;  // Indicate that an error occurred
  }
}

// Flash a simple "URL ?" error message for 1 second.
async function flashError(tab) {
  const newTab = await addChildTab(tab, browser.runtime.getURL("error.html"));
  if (newTab) {
    setTimeout(() => {
      browser.tabs.remove(newTab.id);
    }, 1000);
  }
}

browser.contextMenus.create({
  id: "gotofoo",
  title: "Goto foo",
  contexts: ["selection"],
  visible: false
});

browser.contextMenus.onShown.addListener((info, tab) => {
  const url = fixURL(info.selectionText);
  const visible = !!url;
  const title = `Goto ${url}`;
  browser.contextMenus.update("gotofoo", { visible, title });
  browser.contextMenus.refresh();
});

browser.contextMenus.onHidden.addListener(() => {
  const visible = false;
  browser.contextMenus.update("gotofoo", { visible });
  browser.contextMenus.refresh();
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "gotofoo") {
    const url = fixURL(info.selectionText);
    if (!(url && await addChildTab(tab, url))) {
      // This error is known to occur when opening data: or javascript: URLs,
      // though the validURL() regex filters them out first.
      await flashError(tab);
    }
  }
});

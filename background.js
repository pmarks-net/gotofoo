function validURL(str) {
  if (/\s/.test(url)) {
    return null;  // don't allow whitespace in the middle.
  }
  try {
    const u = new URL(str);
    return /^https?:$/.test(u.protocol);
  } catch (e) {
    return null;
  }
}

function fixURL(url) {
  if (!url) {
    return null;
  }
  url = url.trim();
  if (validURL(url)) {
    return url;
  }
  // Put IPv6 addresses in brackets.
  if (/^([0-9A-Fa-f]*:){2}[0-9A-Fa-f:.]*$/.test(url)) {
    url = `[${url}]`;
  }
  // Maybe the URL is valid with an https:// prefix?
  if (/^[^:/]/.test(url) && /[:./]/.test(url)) {
    const prefixedURL = `https://${url}`;
    if (validURL(prefixedURL)) {
      return prefixedURL;
    }
  }
  return null;
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

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "gotofoo") {
    const url = fixURL(info.selectionText);
    if (url) {
      browser.tabs.create({ url });
    }
  }
});

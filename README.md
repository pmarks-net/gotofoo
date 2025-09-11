# Goto foo
![](/src/icon128.png?raw=true)

Adds "Goto &lt;selected text as URL>" to the Firefox right-click menu.

Firefox's existing "Open Link" option only works when selecting complete URLs, whereas **Goto foo** can yank `xample.co` from `https://example.com` if you want it to. I made this because I missed having the flexibility of Chrome's "Go to &lt;url>" option in Firefox.

## Permissionless mode

Since version 1.8, the `<all_urls>` permission is optional, but the user interface works more consistently if granted.

- Permissionless: **`Goto "any selected text" as URL`**, no filtering
- With permission: **`Goto https://formatted.url`**, with non-URLs omitted

In permissionless mode, clicking on Goto "random invalid text" shows an error page, which offers a `[Grant Permission]` button.  If granted, the error page becomes unnecessary.

## Privacy policy

Goto foo uses your personal data strictly for the purpose of formatting selected text as a URL, and navigating to that URL. This action necessarily shares the URL with the server specified therein, but otherwise no data leaves your computer.

## Add to Firefox
https://addons.mozilla.org/firefox/addon/gotofoo/  

<picture><img src="https://badgen.net/amo/v/gotofoo"></picture>
<picture><img src="https://badgen.net/amo/users/gotofoo"></picture>
<picture><img src="https://badgen.net/amo/rating/gotofoo"></picture>

## Screenshot
![Screenshot](/misc/screenshot_640x400.png?raw=true)

## Example URLs

After installing Goto foo, you can test its behavior by selecting these URLs, or various substrings:

```
http://www.example.com
https://1.1.1.1/media/lighthouse.svg
https://[2606:4700:4700::1111]/media/lighthouse.svg
```

Note that data: and javascript: URLs are not supported:

```
data:text/html,hello
javascript:alert('hello');
```

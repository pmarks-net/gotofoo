# Goto foo
![](/src/icon128.png?raw=true)

Adds "Goto &lt;selected text as URL>" to the Firefox right-click menu.

Firefox's existing "Open Link" option only works when selecting complete URLs. **Goto foo** can yank the `xample.co` out of `https://example.com` if you want it to.

I made **Goto foo** because I missed having the flexibility of Chrome's "Go to &lt;url>" option in Firefox.

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

# Goto foo
![](/src/icon128.png?raw=true)

Adds a 'Goto &lt;url&gt;' option to Firefox, when right-clicking text that resembles a URL.

Note that this extension doesn't work on Chrome, because Chrome doesn't support `contextMenus.{onShown,onHidden}`, and Chrome already has a built-in "Go to &lt;url&gt;" feature.

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
http://example.com
https://1.1.1.1/media/lighthouse.svg
https://[2606:4700:4700::1111]/media/lighthouse.svg

Note that data: and javascript: URLs are not supported:
data:text/html,hello
javascript:alert('hello');
```

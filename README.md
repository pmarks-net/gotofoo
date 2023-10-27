# Goto foo
![](/src/icon128.png?raw=true)

Adds a "Goto &lt;url&gt;" option to Firefox, when right-clicking text that resembles a URL.

Firefox already provides an "Open Link" option when highlighting well-formed URLs, but **Goto foo** is more comprehensive, recognizing IP address literals and incomplete URLs without an http:// prefix.

Chrome doesn't need **Goto foo**, because its "Go to &lt;url&gt;" feature already works fine.

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

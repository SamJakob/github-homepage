# github-homepage (restorer)

Restore the old GitHub dashboard. Submitted to Firefox Developer Hub and Google Web Store and pending review.

- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/github-homepage-restorer/)
- [Chrome](https://chrome.google.com/webstore/detail/cfdlcjikdibojiddgiijfeiaoohbklec/)

_Links will be unavailable whilst review is pending._

## Firefox Installation

You cannot permenantly install this addon in Firefox without it being accepted on the Developer Hub.

To install it temporarily for the current session:

1. Go to `about:debugging` and select "Thsis Firefox" in the left-hand sidebar.
2. Under "Temporary Extensions" choose "Load Temporary Add-on..."
3. Choose the `manifest.json` file in this repository (you need the other files to be there also, so having cloned the repository you can then navigate to that file in the Select dialog).

You will then need to click the extensions icon in the top-right, choose "GitHub Homepage Restorer", right-click and select "Always Allow on github.com".
(This is because the manifest version was set to v3, which is a requirement for Chrome. The version submitted to Firefox is v2 because I did not realize this before-hand and the
v2 manifest does not require this to be done - it will just work straight away).

## Chrome Installation

1. Go to `chrome://extensions` or find Extensions in the Settings page.
2. Enable "Development Mode" in the top-right.
3. Choose "Load Unpacked Extension" and navigate to the root of the cloned repository.

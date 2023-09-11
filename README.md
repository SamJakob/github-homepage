# github-homepage (restorer)

Restore the old GitHub dashboard.

<br>

**Changelog**

<!--
  Safari's v1.0.2 has a minor alteration to it's code to ensure full functionality remains.
  
  If further updates (i.e., a v1.0.3) is required, I'll reconcile the versions then as the Safari code is
  essentially an additional polyfill that should function fine in all browsers and ensure additional
  robustness.
-->

- v1.0.2
  - Bug hotfix for v1.0.1
- v1.0.1
  - Now detects all dashboard pages seamlessly (fixes [#1](https://github.com/SamJakob/github-homepage/issues/1))
  - Firefox for Android support (no actual code changes, just didn't think to tick the box last time lol)
- v1.0
  - Initial release

<br>

## Released

- [**Firefox**](https://addons.mozilla.org/en-US/firefox/addon/github-homepage-restorer/)
- [**Safari for macOS and iOS**](https://apps.apple.com/app/github-homepage-restorer/id6465572067)
- [**Chrome**](https://chrome.google.com/webstore/detail/cfdlcjikdibojiddgiijfeiaoohbklec/) (v1.0 released, v1.0.2 pending approval)

<br>

<!--

## Pending Approval

The extension has been submitted to the following respective store(s) where it is pending review.  
The below links should start working once it has been approved.

<br>

-->

## Supported

These versions are supported but not available due to reasons outside of my control.

- **Firefox for Android**: The [Firefox](https://addons.mozilla.org/en-US/firefox/addon/github-homepage-restorer/) extension supports and has been tested on Firefox for Android, however Firefox for Android presently only supports a limited number of extensions for installation. See [this article](https://support.mozilla.org/en-US/kb/find-and-install-add-ons-firefox-android) for details (as well as how to install extensions - such as this one - on Firefox Nightly).

<br>

## Manual Installation

### Manual Firefox Installation

**Manual Firefox installation does not persist after the app is restarted.**

To install it temporarily for the current session:

1. Go to `about:debugging` and select "This Firefox" in the left-hand sidebar.
2. Under "Temporary Extensions" choose "Load Temporary Add-on..."
3. Choose the `manifest.json` file in this repository (you need the other files to be there also, so having cloned the repository you can then navigate to that file in the Select dialog).

### Manual Chrome Installation

1. Go to `chrome://extensions` or find Extensions in the Settings page.
2. Enable "Development Mode" in the top-right.
3. Choose "Load Unpacked Extension" and navigate to the root of the cloned repository.
4. You will then need to click the extensions icon in the top-right, choose "GitHub Homepage Restorer", right-click and select "Always Allow on github.com".

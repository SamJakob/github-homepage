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

- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/github-homepage-restorer/)
- [Safari for macOS](https://apps.apple.com/app/github-homepage-restorer/id6465572067)

<br>

## Pending Approval

The extension has been submitted to the following respective store(s) where it is pending review.  
The below links should start working once it has been approved.

- Safari for iOS (pending review)

<!--
  1. First, go to the releases page by clicking the link above and download the application.
     _(Safari Extensions are bundled in applications, but this was just generated with the command-line tool from the Chrome/Firefox extension. You can see the macOS/iOS Source on the branch `feat/safari`)_
  2. Run the application. It should show a message saying that the extension is not enabled and just have a button to Quit the application.
  3. Quit the application and switch to Safari.
  4. In the menu bar, choose Safari -> Safari Extensions.
  5. Check the GitHub Homepage Restorer option.
  6. Choose "Edit Websites" and for github.com change to "Allow".
-->

- [Chrome](https://chrome.google.com/webstore/detail/cfdlcjikdibojiddgiijfeiaoohbklec/)

_Links will be unavailable whilst review is pending._

### Manual Chrome Installation

1. Go to `chrome://extensions` or find Extensions in the Settings page.
2. Enable "Development Mode" in the top-right.
3. Choose "Load Unpacked Extension" and navigate to the root of the cloned repository.
4. You will then need to click the extensions icon in the top-right, choose "GitHub Homepage Restorer", right-click and select "Always Allow on github.com".

<br>

## Manual Installation

### Manual Firefox Installation

**You cannot permenantly install this addon in Firefox without it being accepted on the Developer Hub.**

To install it temporarily for the current session:

1. Go to `about:debugging` and select "This Firefox" in the left-hand sidebar.
2. Under "Temporary Extensions" choose "Load Temporary Add-on..."
3. Choose the `manifest.json` file in this repository (you need the other files to be there also, so having cloned the repository you can then navigate to that file in the Select dialog).

<!--
<br>

[^1]: The same extension as macOS works on iOS, however iOS Safari Extensions can only be distributed through the App Store as they are packaged in an iOS App. I'm not sure how likely Apple would be to approve this extension and some further work may be required to reach App Store standards but I will look into it. (For those with a developer license already, see [Manual iOS Installation](#manual-ios-installation).)
-->

'use strict';

(() => {

    const GITHUB_ISSUES_URL = "https://github.com/SamJakob/github-homepage/issues";

    // --------------------------------------------------------------

    // Create a loading or error screen based on GitHub's own loading
    // animation. (Fairly gross code so as to avoid using innerHTML in a browser
    // extension!)
    const loader = (message) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('text-center');
        wrapper.dataset.hideOnError = "";

        let wrapperPicture = document.createElement('picture');
        let wrapperPictureChild = document.createElement('img');
        wrapperPictureChild.src = "https://github.githubassets.com/images/mona-loading-dimmed.gif";
        wrapperPictureChild.width = 48;
        wrapperPictureChild.alt = "Loading your activity...";
        wrapperPictureChild.classList.add('mt-4', 'hide-reduced-motion');
        wrapperPicture.appendChild(wrapperPictureChild);
        wrapper.appendChild(wrapperPicture);

        wrapperPicture = document.createElement('picture');
        wrapperPictureChild = document.createElement('img');
        wrapperPictureChild.src = "https://github.githubassets.com/images/mona-loading-dimmed-static.svg";
        wrapperPictureChild.width = 48;
        wrapperPictureChild.alt = "Loading your activity...";
        wrapperPictureChild.classList.add('mt-4', 'hide-no-pref-motion');
        wrapperPicture.appendChild(wrapperPictureChild);
        wrapper.appendChild(wrapperPicture);

        let wrapperText = document.createElement('p');
        wrapperText.classList.add('color-fg-muted', 'my-2');
        wrapperText.textContent = message;
        wrapper.appendChild(wrapperText);

        return wrapper;
    }

    // Similarly, to create an error message for the extension.
    // (Again, fairly gross code so as to avoid using innerHTML in a browser
    // extension!)
    const error = (message) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('text-center');
        wrapper.dataset.hideOnError = "";

        let wrapperPicture = document.createElement('picture');
        let wrapperPictureChild = document.createElement('img');
        wrapperPictureChild.src = "https://github.githubassets.com/images/mona-loading-dimmed-static.svg";
        wrapperPictureChild.width = 48;
        wrapperPictureChild.alt = "Loading your activity...";
        wrapperPictureChild.classList.add('mt-4');
        wrapperPicture.appendChild(wrapperPictureChild);
        wrapper.appendChild(wrapperPicture);

        let wrapperText = document.createElement('p');
        wrapperText.classList.add('color-fg-muted', 'my-2');
        let wrapperTextSpan = document.createElement('span');
        wrapperTextSpan.textContent = message;
        wrapperText.appendChild(wrapperTextSpan);
        wrapperText.appendChild(document.createElement('br'));
        wrapperTextSpan = document.createElement('span');
        wrapperTextSpan.textContent = "Please file an issue";
        wrapperText.appendChild(wrapperTextSpan);
        let wrapperTextLink = document.createElement('a');
        wrapperTextLink.target = "_blank";
        wrapperTextLink.rel = "nofollow";
        wrapperTextLink.href = GITHUB_ISSUES_URL;
        wrapperTextSpan = document.createElement('span');
        wrapperTextSpan.textContent = ".";
        wrapperText.appendChild(wrapperTextSpan);
        wrapper.appendChild(wrapperText);

        return wrapper;
    }

    // --------------------------------------------------------------
    // Create a MutationObserver to override the feed-container with the
    // loading animation as soon as it becomes available.

    let _locateElementResolve, _locateElementReject;
    const locateElementCompleter = new Promise(
        (resolve, reject) => {
            _locateElementResolve = resolve;
            _locateElementReject = reject;
        }
    );

    const observer = new MutationObserver((_, observer) => {
        // Override the feed container with the loading animation to ensure
        // there is no FOUC whilst the better feed is loaded in to replace it.
        const feedContainer = document.querySelector('feed-container');
        if (!feedContainer) return;

        feedContainer.replaceChildren(loader('One moment please...'));
        _locateElementResolve(feedContainer);

        // Once we've replaced the content, we can stop observing.
        observer.disconnect();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    // --------------------------------------------------------------
    // Then, attempt to fetch the dashboard and replace the feed-container
    // with it.

    const goodHomepageFeedPromise = new Promise(async (resolve, reject) => {
        try {
            // Fetch and parse the old dashboard homepage.
            const goodHomepageRaw = await (await fetch(`${window.location.href}/dashboard-feed`)).text();
            const parser = new DOMParser();
            const goodHomepage = parser.parseFromString(
                goodHomepageRaw,
                "text/html"
            );

            // Extract the feed from the old homepage.
            const goodHomepageFeed = goodHomepage.querySelector('.application-main > main > div');

            // Replace the new feed with the old one.
            resolve(goodHomepageFeed);
        } catch (ex) {
            resolve(error("Sorry! Something went wrong whilst loading the old dashboard."));
        }
    });

    // Wait for the homepage feed loader to complete and then replace the
    // feedContainer's contents with the result (once the container has
    // been located).
    goodHomepageFeedPromise.then(async (result) => {
        const feedContainer = await locateElementCompleter;
        feedContainer.replaceChildren(result);
    });

    // --------------------------------------------------------------

})();
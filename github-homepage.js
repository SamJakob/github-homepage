'use strict';

(() => {

    // IMPLEMENTATION SETTINGS

    /**
     * The URL of the dashboard feed (will be resolved relative to the current
     * page's URL).
     */
    const DASHBOARD_FEED_URL = "/dashboard-feed";

    /**
     * Paths, for which, the old dashboard feed should be eagerly loaded to
     * reduce loading times.
     * 
     * NOTE: Other pages will still load the old dashboard feed if a
     * .feed-container element is detected, but this will be done after the
     * element has been detected (i.e. it will not be eagerly loaded).
     * 
     * (So honestly, this feature might be overkill but hey - this extension is
     *  all about that good UX!)
     */
    const EAGER_LOAD_PATHS = ["/", "/dashboard"];

    // --------------------------------------------------------------

    // EXTENSION SETTINGS

    /**
     * A URL for reporting issues with the extension.
     */
    const EXT_GITHUB_ISSUES_URL = "https://github.com/SamJakob/github-homepage/issues";

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
        wrapperTextLink.href = EXT_GITHUB_ISSUES_URL;
        wrapperTextSpan = document.createElement('span');
        wrapperTextSpan.textContent = ".";
        wrapperText.appendChild(wrapperTextSpan);
        wrapper.appendChild(wrapperText);

        return wrapper;
    }

    // --------------------------------------------------------------

    /**
     * Contains and triggers the code necessary to override the feed-container
     * with the loading animation as soon as it becomes available (and then,
     * of course, the good feed as soon as it has loaded).
     * 
     * @param {boolean} eager Whether or not to eagerly load the old dashboard
     * feed (i.e. before the feed-container is available). (We can do this
     * when the path is "/" or "/dashboard", otherwise we should hold off to
     * avoid slamming the GitHub servers with requests.)
     */
    function triggerOverride(eager = false) {
        
        // --------------------------------------------------------------
        // Create a MutationObserver to override the feed-container with the
        // loading animation as soon as it becomes available.

        let _locateElementResolve;
        const locateElementCompleter = new Promise((resolve) => {
            _locateElementResolve = resolve;
        });

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

        // Wait for the homepage feed loader to complete and then replace the
        // feedContainer's contents with the result (once the container has
        // been located).
        (async () => {
            // If eager is not specified, we'll wait for the
            // locateElementCompleter to find the feedContainer first.
            //
            // Otherwise, we'll continue which will let the promise resolve
            // simultaneously as we wait for the container to appear.
            let feedContainer;
            if (!eager) feedContainer = await locateElementCompleter;

            // Attempt to fetch the dashboard.
            (new Promise(async (resolve) => {
                try {
                    // Compute the path to the old dashboard homepage.
                    const goodHomepagePath = new URL(
                        DASHBOARD_FEED_URL,
                        window.location.href
                    ).href;

                    // Fetch and parse the old dashboard homepage.
                    const goodHomepageReq = await fetch(goodHomepagePath);
                    const goodHomepageRaw = await (goodHomepageReq).text();
                    const parser = new DOMParser();
                    const goodHomepage = parser.parseFromString(
                        goodHomepageRaw,
                        "text/html"
                    );

                    // Extract the feed from the old homepage.
                    const goodHomepageFeed = goodHomepage.querySelector(
                        '.application-main > main > div'
                    );

                    // Replace the new feed with the old one.
                    resolve(goodHomepageFeed);
                } catch (ex) {
                    resolve(error(
                        "Sorry! Something went wrong whilst loading the old dashboard."
                    ));
                }
            })).then(async (result) => {
                // If the feedContainer has not been found yet, but the promise
                // has concluded (i.e., eager was true), we'll wait for the
                // locateElementCompleter to find the feedContainer.
                if (!feedContainer) feedContainer = await locateElementCompleter;
                feedContainer.replaceChildren(result);
            });
        })();

    }

    // Immediately trigger the override to load the old dashboard.
    triggerOverride(
        // Eagerly load if window.location.pathname is in EAGER_LOAD_PATHS.
        EAGER_LOAD_PATHS.find((path) => window.location.pathname === path)
    );

    // Hook into the Turbo pre-render event to override the feed-container
    // if Turbo is used to navigate to a dashboard page.
    addEventListener('turbo:before-render', (event) => {
        // Inspect the body of the page being rendered to see if it contains
        // a feed-container.
        const newPage = event.detail.newBody;
        const newFeedContainer = newPage.querySelector('feed-container');

        // If the new page contains a feed-container, we need to override it.
        if (newFeedContainer) {
            // Replace the feed-container with the loading animation.
            newFeedContainer.replaceChildren(loader('One moment please...'));
            
            // Trigger the override.
            // In this case, we can always eagerly load the old dashboard feed
            // as we already know that the page contains a feed-container.
            // (Turbo gave us the opportunity to both detect and inject our
            //  loading animation into the feed container, so it must be
            //  there.)
            triggerOverride(true);
        }
    })

    // --------------------------------------------------------------

})();
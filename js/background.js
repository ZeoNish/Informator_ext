chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){

        if(request.msg == "startScreen") {
            chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
                // let id = tab.id;

                let url = tabs[0].url;

                let lnk = url.split("/");
                if (lnk.length == 5 && lnk[lnk.length - 2] == 'thermal-point' && parseInt(lnk[lnk.length - 1])) {

                    chrome.tabs.captureVisibleTab((screenshotUrl, newrr = url) => {

                        const viewTabUrl = chrome.extension.getURL('screenshot.html?id=' + sendResponse.id++)
                        let targetId = null;
                        chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
                            if (tabId != targetId || changedProps.status != "complete")
                                return;
                            chrome.tabs.onUpdated.removeListener(listener);
                            const views = chrome.extension.getViews();
                            for (let i = 0; i < views.length; i++) {
                                let view = views[i];
                                if (view.location.href == viewTabUrl) {
                                    view.setScreenshotUrl(screenshotUrl, newrr);
                                    break;
                                }
                            }

                        });
                        chrome.tabs.create({url: viewTabUrl}, (tab) => {
                            targetId = tab.id;
                        });
                    });

                } else {
                    alert('Скриншот можно сделать на стрице с термической точкой')
                }

            });
        };

    }
);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// https://deepinder.me/creating-a-screenshot-taking-chrome-extension-from-scratch
// https://blog.shahednasser.com/how-to-take-screenshots-in-chrome-extension/
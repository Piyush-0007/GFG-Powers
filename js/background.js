chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
    try {
        if (payload.action == "setData") {
            chrome.storage.session.set({ [payload.key]: payload.value }, () => {
                if (chrome.runtime.lastError) {
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else {
                    sendResponse({ success: true });
                }
            });
        } else if (payload.action == "getData") {
            chrome.storage.session.get([payload.key], (data) => {
                if (chrome.runtime.lastError) {
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else {
                    sendResponse({ success: true, data: data[payload.key] });
                }
            });
        }
    } catch (err) {
        sendResponse({ success: false, error: err.message });
    }
    return true; // Indicates that the response is asynchronous
});

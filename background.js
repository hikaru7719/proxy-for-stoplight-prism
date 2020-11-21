chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "localhost" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
  chrome.webRequest.onBeforeSendHeaders.addListener(
    async function (details) {
      chrome.storage.sync.get(["preferHeader"], function (result) {
        const value = sanitizeInput(result.preferHeader);
        if (!value) {
          return details;
        }
        let found = false;
        for (let i = 0; i < details.requestHeaders.length; ++i) {
          if (details.requestHeaders[i].name.toLowerCase() === "prefer") {
            details.requestHeaders[i].value = value;
            found = true;
            break;
          }
        }
        if (!found) {
          details.requestHeaders.push({
            name: "Prefer",
            value: value,
          });
        }
        return {
          requestHeaders: details.requestHeaders,
        };
      });
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
  );
});

function sanitizeInput(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

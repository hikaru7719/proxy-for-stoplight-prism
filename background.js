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
      let found = false;
      for (let i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name.toLowerCase() === "prefer") {
          details.requestHeaders[i].value = "testValue";
          found = true;
          break;
        }
      }
      if (!found) {
        details.requestHeaders.push({
          name: "Prefer",
          value: "testValue",
        });
      }
      return {
        requestHeaders: details.requestHeaders,
      };
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
  );
});

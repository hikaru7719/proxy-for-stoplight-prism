const button = document.getElementById("enterButton");

button.onclick = function () {
  const preferHeader = document.getElementById("preferHeader").value;
  if (preferHeader) {
    chrome.storage.sync.set({ preferHeader: preferHeader }, function () {
      console.log(`preferHeader value ${preferHeader} saved`);
    });
  }
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
      chrome.tabs.sendRequest(tab.id, changeInfo, function(response) {});
  }
});

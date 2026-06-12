chrome.commands.onCommand.addListener((cmd) => {
  if (cmd === "toggle-rtl-engine") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle" });
      }
    });
  }
});
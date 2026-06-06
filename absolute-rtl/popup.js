document.addEventListener('DOMContentLoaded', () => {
    const mainToggle = document.getElementById('main-toggle');
    const defaultToggle = document.getElementById('default-toggle');
    const hintText = document.getElementById('shortcut-hint');
    const behaviorHint = document.getElementById('behavior-hint');

    const updateBehaviorHint = (isActive) => {
        behaviorHint.textContent = isActive 
            ? "Auto-executes on page load." 
            : "Manual activation required.";
        
        if (isActive) {
            behaviorHint.classList.remove('warning');
        } else {
            behaviorHint.classList.add('warning');
        }
    };

    chrome.commands.getAll((commands) => {
        const cmd = commands.find(c => c.name === "toggle-rtl-engine");
        hintText.textContent = cmd && cmd.shortcut ? `Shortcut: ${cmd.shortcut}` : 'No shortcut set. Configure in browser settings.';
    });

    chrome.storage.local.get({ defaultBehavior: true }, (data) => {
        defaultToggle.checked = data.defaultBehavior;
        updateBehaviorHint(data.defaultBehavior);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "getState" }, (res) => {
                if (chrome.runtime.lastError) {
                    mainToggle.disabled = true;
                    hintText.textContent = "Engine inactive on this URL.";
                } else if (res) {
                    mainToggle.checked = res.isActive;
                }
            });
        }
    });

    mainToggle.addEventListener('change', (e) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "toggle", state: e.target.checked });
            }
        });
    });

    defaultToggle.addEventListener('change', (e) => {
        chrome.storage.local.set({ defaultBehavior: e.target.checked });
        updateBehaviorHint(e.target.checked);
    });
});
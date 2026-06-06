(function() {
    'use strict';

    // Target specific highly-nested structural containers used within advanced LLM chat interfaces
    const AI_Q = ':is(.model-response-text, .message-content, message-content, .markdown, .chat-message-content, ms-text-chunk, ms-cmark-node) :is(p, ul, ol, li, h1, h2, h3, h4, h5, h6, table)';
    const IN_Q = 'div[contenteditable="true"], textarea, .query-text, .input-area rich-textarea > div, .prompt-box-container .text-wrapper';
    const CODE_Q = 'pre, code, ms-code-block, .code-block';
    const PERSIAN_RX = /[\u0600-\u06FF]/;

    let isActive = false;
    let isInitialized = false;

    const process = (e) => {
        if (e.closest(CODE_Q) || !e.textContent.trim()) return;

        if (PERSIAN_RX.test(e.textContent)) {
            e.setAttribute('data-ext-dir', 'rtl');
        } else {
            const parentList = e.closest('ul, ol');
            e.setAttribute('data-ext-dir', parentList && parentList.getAttribute('data-ext-dir') === 'rtl' ? 'rtl' : 'ltr');
        }
    };

    const scan = (n) => {
        if (n.nodeType !== 1) return;

        if (n.matches(IN_Q)) n.setAttribute('data-ext-dir', 'rtl-input');
        n.querySelectorAll(IN_Q).forEach(e => e.setAttribute('data-ext-dir', 'rtl-input'));

        if (n.matches(AI_Q)) process(n);
        n.querySelectorAll(AI_Q).forEach(process);
    };

    const obs = new MutationObserver((muts) => {
        for (const m of muts) {
            if (m.type === 'childList') {
                m.addedNodes.forEach(scan);
            } else if (m.type === 'characterData') {
                const parent = m.target.parentElement;
                if (parent && parent.matches(AI_Q)) process(parent);
            }
        }
    });

    chrome.storage.local.get({ defaultBehavior: true }, (data) => {
        if (isInitialized) return;
        isActive = data.defaultBehavior;
        if (isActive) {
            document.documentElement.classList.add('rtl-engine-active');
            scan(document.body);
            obs.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
    });

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.action === "toggle") {
            isInitialized = true;
            isActive = typeof msg.state === 'boolean' ? msg.state : !isActive;

            document.documentElement.classList.toggle('rtl-engine-active', isActive);
            if (isActive) {
                scan(document.body);
                obs.observe(document.body, { childList: true, subtree: true, characterData: true });
            } else {
                obs.disconnect();
                document.querySelectorAll('[data-ext-dir]').forEach(e => e.removeAttribute('data-ext-dir'));
            }
            sendResponse({ isActive });
        } else if (msg.action === "getState") {
            sendResponse({ isActive });
        }
    });
})();
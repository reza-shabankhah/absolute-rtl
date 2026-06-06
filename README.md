<div align="center">

# AbsoluteRTL

**An offline browser extension for RTL rendering in data-sensitive AI workflows.**

[![Type](https://img.shields.io/badge/Type-Browser_Extension-orange.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</div>
<br>

AbsoluteRTL is a lightweight, open-source extension that brings seamless Right-to-Left (RTL) formatting to AI interfaces lacking native support for complex, multi-language text directions. It gives you precise, on-demand control over your layout, runs entirely offline with absolute zero telemetry, and enforces the [Vazirmatn](https://github.com/rastikerdar/vazirmatn) typeface to ensure consistent, highly legible rendering for Persian and Arabic scripts.

**Currently Supported Platforms:**
- Google Gemini
- Google AI Studio

## The Security Paradigm

Browser extensions that manipulate DOM content inherently possess the capability to read all screen data. In the context of AI workflows, this data is often highly confidential. 

AbsoluteRTL is built on a strict **Zero-Trust Architecture**:
- **Zero Telemetry:** The engine contains absolutely no analytics, tracking, or background reporting code.
- **Zero Network Activity:** It does not communicate with external APIs, dictionaries, or translation servers. All logic is executed 100% locally.
- **Zero Dependencies:** The codebase is constructed from pure, vanilla JavaScript and CSS. It relies on no third-party libraries that could introduce supply-chain vulnerabilities.

## Core Mechanics

Rather than blindly flipping the entire `dir` attribute of the `<html>` tag—which permanently breaks UI elements—AbsoluteRTL utilizes a highly targeted `MutationObserver`. 

- **Continuous Scanning:** Monitors specific, nested structural containers used within AI chat interfaces.
- **Deterministic Processing:** Identifies RTL character sets via absolute Unicode ranges.
- **Synthetic Reconstruction:** Selectively applies `dir="rtl"` to specific text nodes while forcefully isolating code blocks, mathematical formulas, and command prompts into `dir="ltr"` to prevent syntax corruption.

## Installation Protocols

For maximum operational security, verify the source code and install the engine as an unpacked local directory. 

1. Clone this repository to your local machine:
```bash
   git clone https://github.com/reza-shabankhah/absolute-rtl.git
```
2. **Chromium (Chrome/Brave/Edge):**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the `absolute-rtl/` directory.
3. **Mozilla Firefox:**
   - Navigate to `about:debugging`
   - Select **This Firefox**
   - Click **Load Temporary Add-on** and select the `manifest.json` file inside the `absolute-rtl/` directory. *(Note: Firefox purges temporary extensions upon restart).*

## License
This project is open-source and distributed under the MIT License. See the `LICENSE` file for absolute legal parameters.

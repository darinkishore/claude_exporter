# Export Claude.ai Conversation UserScript

A simple userscript that adds a convenient “Export Convo” button to the top bar on Claude.ai. It also allows you to copy the conversation to clipboard by double-tapping the **Shift** key. The exported conversation is placed on your clipboard in a structured semantic-xml format, wrapped with `<conversation>...</conversation>` tags.

## Features
- **Double-tap Shift** to copy the conversation in one go
- **Button** at the top, right next to rename chat. 
- **Minimal** overhead—just runs once the page loads

## Installation

1. **Install a Userscript Manager**  
   - **Chrome**: [Violentmonkey for Chrome](https://chrome.google.com/webstore/detail/violentmonkey/)  
   - **Firefox**: [Violentmonkey for Firefox](https://addons.mozilla.org/firefox/addon/violentmonkey/)  
2. **Add the Userscript**  
   - [Click here to install the userscript](https://raw.githubusercontent.com/darinkishore/claude_exporter/main/export-claude-convo.user.js) or open Violentmonkey and create a new script, then paste in the code from [export-claude-convo.user.js](https://github.com/darinkishore/claude_exporter/blob/main/export-claude-convo.user.js) (this is the file in this repository).  
3. **Reload the Claude.ai page**  
   - You should see an **Export Convo** button next to the conversation’s top bar menu item.

## Usage
- **Click the "Export Convo" Button**: Instantly copy all messages to your clipboard in `<conversation>` format.  
- **Double-Tap Shift**: Also triggers the export, for quick copying without using the mouse.

## Code Overview
- **Mutation**: Polls for the container that houses the “chat-menu-trigger” button, inserts a new accent-colored button.  
- **Export Routine**: Gathers all user messages (`data-testid="user-message"`) and assistant messages (`.font-claude-message`) in DOM order, then pushes them to your clipboard.

## Caveats
- If the Claude.ai layout changes significantly, this script may require minor updates.  
- This script is **unofficial** and not affiliated with Claude.ai or Anthropic.

## Contributing
Pull requests are welcome! If you encounter issues with new page layouts or want to tweak styling, feel free to open an issue or submit a PR.

Enjoy easy conversation exports!

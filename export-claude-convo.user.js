// ==UserScript==
// @name         export claude.ai conversation
// @version      0.7
// @description  Double-tap shift OR click the new accent button next to the "chat-menu-trigger" to export conversation, including codeblocks
// @match        https://claude.ai/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
  'use strict';

  // double-tap shift detection
  let lastShiftTime = 0;
  const SHIFT_INTERVAL = 300; // ms threshold
  document.addEventListener('keydown', e => {
    if(!e.repeat && e.key === 'Shift') {
      const now = Date.now();
      if(now - lastShiftTime < SHIFT_INTERVAL) {
        exportConversation();
      }
      lastShiftTime = now;
    }
  });

  // poll for the container that has the existing chat-menu-trigger button
  const poll = setInterval(() => {
    const parent = document.querySelector(
      'div.flex.min-w-0.items-center.max-md\\:text-sm'
    );
    if (!parent) return;

    const existingBtn = parent.querySelector(
      'button[data-testid="chat-menu-trigger"]'
    );
    if (!existingBtn) return;

    clearInterval(poll);
    addExportButton(parent, existingBtn);
  }, 1000);

  function addExportButton(parentDiv, existingBtn) {
    const newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.textContent = 'Export Convo';

    // replicate the existing button's classes, then ensure the accent orange style
    newBtn.className = existingBtn.className
      + ' bg-accent-main-100 text-oncolor-100 hover:bg-accent-main-200 hover:text-oncolor-100';

    // remove data attributes to avoid collisions
    newBtn.removeAttribute('data-testid');
    newBtn.removeAttribute('id');
    newBtn.removeAttribute('aria-haspopup');
    newBtn.removeAttribute('aria-expanded');
    newBtn.removeAttribute('data-state');

    // handle click
    newBtn.addEventListener('click', exportConversation);

    // insert the new button right after the existing one
    parentDiv.insertBefore(newBtn, existingBtn.nextSibling);
  }

  function exportConversation() {
    // gather user+assistant messages in order
    const blocks = [...document.querySelectorAll(
      'div[data-testid="user-message"], div.font-claude-message'
    )];

    let output = '<conversation>\n\n';
    for(const el of blocks) {
      if (el.matches('div[data-testid="user-message"]')) {
        output += `<user>\n${parseMessageContent(el)}\n</user>\n\n`;
      } else {
        output += `<assistant>\n${parseMessageContent(el)}\n</assistant>\n\n`;
      }
    }
    output += '</conversation>';

    GM_setClipboard(output);
    alert('conversation copied!');
  }

  /**
   * parseMessageContent:
   * - finds all <p> and code blocks (<pre> <code>) in DOM order
   * - code blocks get formatted as:
   *
   *   <code>
   *   ```$LANG
   *   (code content)
   *   ```
   *   </code>
   *
   * - returns a string suitable for the final export
   */
  function parseMessageContent(root) {
    let parts = [];

    // we want everything in order, so let's pick p's and code blocks in sequence
    // the main container for assistant messages is often:
    //   <div class="grid-cols-1 grid ...">
    // but let's just search inside `root` for 'p, pre code'
    const nodes = root.querySelectorAll('p, pre code');

    for (const node of nodes) {
      if (node.tagName.toLowerCase() === 'p') {
        // just the text
        parts.push(node.innerText.trim());
      } else {
        // it's a code block
        const codeText = node.textContent || '';
        let lang = '';

        // parse language-xxx from class
        const className = node.className || '';
        const match = className.match(/language-([\w-]+)/);
        if (match) {
          lang = match[1]; // e.g. 'python'
        }

        // build the block
        const codeBlock = `\n<code>\n\`\`\`${lang}\n${codeText}\n\`\`\`\n</code>\n`;
        parts.push(codeBlock);
      }
    }

    // join with blank lines in between for clarity
    return parts.join('\n\n');
  }
})();

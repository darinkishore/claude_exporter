// ==UserScript==
// @name         export claude.ai conversation
// @namespace    https://your-namespace
// @version      0.6
// @description  double-tap shift or click the new accent button next to the existing "chat-menu-trigger" to export
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

  // poll for the container that has the existing "The Carrington Solar Storm" button
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
    newBtn.textContent = 'export';

    // replicate the existing button's classes, then ensure the accent orange style
    newBtn.className = existingBtn.className
      + 'px-30 text-oncolor-100 hover:bg-accent-main-200 hover:text-oncolor-100';

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
    const blocks = [...document.querySelectorAll(
      'div[data-testid="user-message"], div.font-claude-message'
    )];

    let output = '<conversation>\n\n';
    for(const el of blocks) {
      if (el.matches('div[data-testid="user-message"]')) {
        output += `<user>\n${grabText(el)}\n</user>\n\n`;
      } else {
        output += `<assistant>\n${grabText(el)}\n</assistant>\n\n`;
      }
    }
    output += '</conversation>';

    GM_setClipboard(output);
    alert('conversation copied!');
  }

  function grabText(root) {
    let text = '';
    const paragraphs = root.querySelectorAll('p');
    paragraphs.forEach(p => {
      text += p.innerText.trim() + '\n';
    });
    return text.trim();
  }
})();

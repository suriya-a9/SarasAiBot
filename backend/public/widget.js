(function () {
    const currentScript = document.currentScript;
    const botId = currentScript.getAttribute('data-bot-id');
    const API_BASE = new URL(currentScript.src).origin;

    if (!botId) {
        console.error('Saras widget: data-bot-id is missing on the script tag.');
        return;
    }

    const VISITOR_KEY = 'saras_visitor_id';
    const CONVO_KEY = `saras_convo_${botId}`;
    const CONTACT_KEY = `saras_contact_${botId}`;

    let visitorId = localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem(VISITOR_KEY, visitorId);
    }
    let conversationId = localStorage.getItem(CONVO_KEY) || null;
    let visitorInfo = null;
    try {
        const stored = localStorage.getItem(CONTACT_KEY);
        if (stored) visitorInfo = JSON.parse(stored);
    } catch (e) {
        visitorInfo = null;
    }

    const icons = {
        bot: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>',
        sparkles: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
        headphones: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
        message: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
        minimize: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        close: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        send: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    };
    const fieldLabels = { name: 'Your name', email: 'Email address', phone: 'Phone number' };
    const fieldTypes = { name: 'text', email: 'email', phone: 'tel' };

    async function init() {
        let config;
        try {
            const res = await fetch(`${API_BASE}/api/chat/${botId}/config`);
            config = await res.json();
        } catch (e) {
            console.error('Saras widget: failed to load bot config', e);
            return;
        }

        const color = config.accentColor || '#40295C';
        const position = config.position === 'left' ? 'left' : 'right';
        const sideCSS = position === 'left' ? 'left: 20px;' : 'right: 20px;';
        const avatarIcon = icons[config.avatar] || icons.bot;
        const needsContactForm = config.requireContactForm && !visitorInfo;

        const style = document.createElement('style');
        style.textContent = `
      .saras-bubble {
        position: fixed; bottom: 20px; ${sideCSS} width: 56px; height: 56px;
        border-radius: 50%; background: ${color}; color: #fff; border: none;
        cursor: pointer; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 999999;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.15s;
      }
      .saras-bubble:hover { transform: scale(1.05); }
      .saras-panel {
        position: fixed; bottom: 88px; ${sideCSS} width: 320px; height: 460px;
        background: #fff; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.18);
        border: 1px solid rgba(0,0,0,0.06);
        display: none; flex-direction: column; overflow: hidden; z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .saras-panel.open { display: flex; }

      .saras-header {
        background: ${color}; color: #fff; padding: 14px 16px;
        display: flex; align-items: center; justify-content: space-between;
      }
      .saras-header-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
      .saras-avatar {
        width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.15);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .saras-header-text { min-width: 0; }
      .saras-header-name { font-size: 13.5px; font-weight: 600; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .saras-header-status { font-size: 10.5px; font-weight: 500; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 4px; margin-top: 2px; }
      .saras-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; flex-shrink: 0; }
      .saras-header-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
      .saras-icon-btn {
        background: none; border: none; color: rgba(255,255,255,0.75); cursor: pointer;
        width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
        border-radius: 6px; transition: color 0.15s, background 0.15s;
      }
      .saras-icon-btn:hover { color: #fff; background: rgba(255,255,255,0.12); }

      .saras-messages { flex: 1; overflow-y: auto; padding: 14px; background: #FAFAF9; scrollbar-width: thin; }
      .saras-messages::-webkit-scrollbar { width: 4px; }
      .saras-messages::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 4px; }

      .saras-row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 12px; }
      .saras-row.user { justify-content: flex-end; }
      .saras-msg-avatar {
        width: 24px; height: 24px; border-radius: 50%; background: ${color}; color: #fff;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
      }
      .saras-msg {
        padding: 9px 13px; border-radius: 16px; max-width: 205px; font-size: 13px;
        line-height: 1.55; word-wrap: break-word;
      }
      .saras-msg.user { background: ${color}; color: #fff; border-bottom-right-radius: 4px; }
      .saras-msg.assistant { background: #fff; color: #333; border: 1px solid #EAEAE5; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }

      .saras-suggestions { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 12px 46px; }
      .saras-chip {
        border: 1px solid ${color}33; color: ${color}; background: ${color}0d;
        border-radius: 999px; padding: 6px 12px; font-size: 10.5px; font-weight: 500; cursor: pointer;
        transition: background 0.15s;
      }
      .saras-chip:hover { background: ${color}1a; }

      .saras-input-row { display: flex; align-items: center; gap: 8px; border-top: 1px solid #f0f0ee; padding: 8px; background: #fff; }
      .saras-input {
        flex: 1; border: 1px solid #e5e5e0; background: #fafaf8; border-radius: 999px;
        padding: 9px 14px; font-size: 13px; outline: none;
      }
      .saras-input:focus { border-color: ${color}55; }
      .saras-send {
        border: none; background: ${color}; color: #fff; width: 32px; height: 32px; border-radius: 50%;
        cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: transform 0.15s;
      }
      .saras-send:hover { transform: scale(1.06); }
      .saras-send:disabled { opacity: 0.5; cursor: default; }

      .saras-form-wrap { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 24px; background: #fff; }
      .saras-form-title { font-size: 15px; font-weight: 600; color: #222; margin-bottom: 4px; }
      .saras-form-sub { font-size: 12px; color: #888; margin-bottom: 18px; }
      .saras-form-field { margin-bottom: 12px; }
      .saras-form-field label { display: block; font-size: 11px; font-weight: 600; color: #666; margin-bottom: 4px; }
      .saras-form-field input {
        width: 100%; box-sizing: border-box; border: 1px solid #ddd; border-radius: 8px;
        padding: 10px 12px; font-size: 13px; outline: none;
      }
      .saras-form-field input:focus { border-color: ${color}; }
      .saras-form-submit {
        margin-top: 6px; border: none; background: ${color}; color: #fff; border-radius: 8px;
        padding: 11px; font-size: 13px; font-weight: 600; cursor: pointer;
      }
      .saras-form-error { color: #c0392b; font-size: 11px; margin-top: -6px; margin-bottom: 10px; }
    `;
        document.head.appendChild(style);

        const bubble = document.createElement('button');
        bubble.className = 'saras-bubble';
        bubble.innerHTML = avatarIcon;
        document.body.appendChild(bubble);

        const panel = document.createElement('div');
        panel.className = 'saras-panel';
        document.body.appendChild(panel);

        function openPanel() {
            panel.classList.add('open');
            bubble.innerHTML = icons.close;
        }
        function closePanel() {
            panel.classList.remove('open');
            bubble.innerHTML = avatarIcon;
        }
        bubble.addEventListener('click', () => {
            panel.classList.contains('open') ? closePanel() : openPanel();
        });

        if (needsContactForm) {
            renderContactForm();
        } else {
            renderChatUI();
        }

        function renderHeader() {
            return `
        <div class="saras-header">
          <div class="saras-header-left">
            <div class="saras-avatar">${avatarIcon}</div>
            <div class="saras-header-text">
              <div class="saras-header-name">${config.name || 'Chat with us'}</div>
              <div class="saras-header-status">
                <span class="saras-status-dot"></span>
                Online · ${config.tone || 'Friendly'}
              </div>
            </div>
          </div>
          <div class="saras-header-actions">
            <button class="saras-icon-btn" data-action="minimize" title="Minimize">${icons.minimize}</button>
            <button class="saras-icon-btn" data-action="close" title="Close">${icons.close}</button>
          </div>
        </div>
      `;
        }

        function wireHeaderActions() {
            panel.querySelector('[data-action="minimize"]').addEventListener('click', closePanel);
            panel.querySelector('[data-action="close"]').addEventListener('click', closePanel);
        }

        function renderContactForm() {
            const fields = config.contactFormFields && config.contactFormFields.length
                ? config.contactFormFields
                : ['name', 'email'];

            panel.innerHTML = `
        ${renderHeader()}
        <div class="saras-form-wrap">
          <div class="saras-form-title">Let's get started</div>
          <div class="saras-form-sub">Please share a few details before we begin chatting.</div>
          <form id="saras-contact-form">
            ${fields.map((f) => `
              <div class="saras-form-field">
                <label>${fieldLabels[f] || f}</label>
                <input type="${fieldTypes[f] || 'text'}" name="${f}" required />
              </div>
            `).join('')}
            <div class="saras-form-error" style="display:none;"></div>
            <button type="submit" class="saras-form-submit">Start chatting</button>
          </form>
        </div>
      `;

            wireHeaderActions();

            const form = panel.querySelector('#saras-contact-form');
            const errorEl = panel.querySelector('.saras-form-error');

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const info = {};
                for (const f of fields) {
                    const val = (formData.get(f) || '').toString().trim();
                    if (!val) {
                        errorEl.textContent = 'Please fill in all fields.';
                        errorEl.style.display = 'block';
                        return;
                    }
                    info[f] = val;
                }
                visitorInfo = info;
                localStorage.setItem(CONTACT_KEY, JSON.stringify(info));
                renderChatUI();
            });
        }

        function renderChatUI() {
            panel.innerHTML = `
        ${renderHeader()}
        <div class="saras-messages"></div>
        <div class="saras-suggestions"></div>
        <div class="saras-input-row">
          <input class="saras-input" type="text" placeholder="Type a message..." />
          <button class="saras-send">${icons.send}</button>
        </div>
      `;

            wireHeaderActions();

            const messagesEl = panel.querySelector('.saras-messages');
            const suggestionsEl = panel.querySelector('.saras-suggestions');
            const inputEl = panel.querySelector('.saras-input');
            const sendBtn = panel.querySelector('.saras-send');

            function addMessage(role, text) {
                const row = document.createElement('div');
                row.className = `saras-row ${role}`;
                if (role === 'assistant') {
                    row.innerHTML = `<div class="saras-msg-avatar">${avatarIcon}</div><div class="saras-msg assistant"></div>`;
                    row.querySelector('.saras-msg').textContent = text;
                } else {
                    row.innerHTML = `<div class="saras-msg user"></div>`;
                    row.querySelector('.saras-msg').textContent = text;
                }
                messagesEl.appendChild(row);
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }

            if (config.welcomeMessage) addMessage('assistant', config.welcomeMessage);
            (config.suggestions || []).forEach((s) => {
                const chip = document.createElement('button');
                chip.className = 'saras-chip';
                chip.textContent = s;
                chip.onclick = () => { inputEl.value = s; sendMessage(); };
                suggestionsEl.appendChild(chip);
            });

            async function sendMessage() {
                const text = inputEl.value.trim();
                if (!text) return;
                addMessage('user', text);
                inputEl.value = '';
                suggestionsEl.innerHTML = '';
                sendBtn.disabled = true;
                try {
                    const res = await fetch(`${API_BASE}/api/chat/${botId}/message`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: text,
                            visitorId,
                            conversationId,
                            visitorInfo: conversationId ? undefined : visitorInfo,
                        }),
                    });
                    const data = await res.json();
                    if (!res.ok) { addMessage('assistant', "Sorry, something went wrong."); return; }
                    if (data.conversationId && data.conversationId !== conversationId) {
                        conversationId = data.conversationId;
                        localStorage.setItem(CONVO_KEY, conversationId);
                    }
                    addMessage('assistant', data.reply);
                } catch (err) {
                    addMessage('assistant', "Sorry, I couldn't connect.");
                } finally {
                    sendBtn.disabled = false;
                }
            }

            sendBtn.addEventListener('click', sendMessage);
            inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
        }
    }

    init();
})();
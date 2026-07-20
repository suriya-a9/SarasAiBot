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

    const avatarEmoji = { bot: '🤖', sparkles: '✨', headphones: '🎧', message: '💬' };
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
        const emoji = avatarEmoji[config.avatar] || '🤖';
        const needsContactForm = config.requireContactForm && !visitorInfo;

        const style = document.createElement('style');
        style.textContent = `
      .saras-bubble {
        position: fixed; bottom: 20px; ${sideCSS} width: 56px; height: 56px;
        border-radius: 50%; background: ${color}; color: #fff; border: none;
        cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 999999;
        font-size: 22px; display: flex; align-items: center; justify-content: center;
      }
      .saras-panel {
        position: fixed; bottom: 88px; ${sideCSS} width: 320px; height: 460px;
        background: #fff; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        display: none; flex-direction: column; overflow: hidden; z-index: 999999;
        font-family: -apple-system, sans-serif;
      }
      .saras-panel.open { display: flex; }
      .saras-header { background: ${color}; color: #fff; padding: 14px 16px; font-weight: 600; display:flex; align-items:center; gap:8px; }
      .saras-messages { flex: 1; overflow-y: auto; padding: 12px; background: #F7F7F5; }
      .saras-msg { margin-bottom: 10px; padding: 8px 12px; border-radius: 10px; max-width: 80%; font-size: 14px; line-height: 1.4; }
      .saras-msg.user { background: ${color}; color: #fff; margin-left: auto; }
      .saras-msg.assistant { background: #fff; color: #222; border: 1px solid #E5E5E0; }
      .saras-suggestions { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 12px 10px 40px; }
      .saras-chip { border: 1px solid ${color}55; color: ${color}; background: ${color}15; border-radius: 999px; padding: 5px 10px; font-size: 11px; cursor: pointer; }
      .saras-input-row { display: flex; border-top: 1px solid #eee; }
      .saras-input { flex: 1; border: none; padding: 12px; font-size: 14px; outline: none; }
      .saras-send { border: none; background: ${color}; color: #fff; padding: 0 16px; cursor: pointer; }

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
        bubble.innerHTML = emoji;

        const panel = document.createElement('div');
        panel.className = 'saras-panel';
        document.body.appendChild(bubble);
        document.body.appendChild(panel);

        bubble.addEventListener('click', () => panel.classList.toggle('open'));

        if (needsContactForm) {
            renderContactForm();
        } else {
            renderChatUI();
        }

        function renderContactForm() {
            const fields = config.contactFormFields && config.contactFormFields.length
                ? config.contactFormFields
                : ['name', 'email'];

            panel.innerHTML = `
        <div class="saras-header"><span>${emoji}</span><span>${config.name || 'Chat with us'}</span></div>
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
        <div class="saras-header"><span>${emoji}</span><span>${config.name || 'Chat with us'}</span></div>
        <div class="saras-messages"></div>
        <div class="saras-suggestions"></div>
        <div class="saras-input-row">
          <input class="saras-input" type="text" placeholder="Type a message..." />
          <button class="saras-send">Send</button>
        </div>
      `;

            const messagesEl = panel.querySelector('.saras-messages');
            const suggestionsEl = panel.querySelector('.saras-suggestions');
            const inputEl = panel.querySelector('.saras-input');
            const sendBtn = panel.querySelector('.saras-send');

            function addMessage(role, text) {
                const el = document.createElement('div');
                el.className = `saras-msg ${role}`;
                el.textContent = text;
                messagesEl.appendChild(el);
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
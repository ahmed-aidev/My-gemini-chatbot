// --- 🤖 BOT LOGIC & BACKEND FETCH ---

function checkInput() {
    const input = document.getElementById('userInput');
    const btn = document.getElementById('sendBtn');
    if (input.value.trim() !== "") {
        btn.classList.add('active-btn');
        btn.removeAttribute('disabled');
    } else {
        btn.classList.remove('active-btn');
        btn.setAttribute('disabled', 'true');
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const messageText = input.value.trim();

    if (messageText === "") return;

    // 1. User Message Display
    const userDiv = document.createElement('div');
    userDiv.className = 'message user-message';
    userDiv.innerText = messageText;
    chatBox.appendChild(userDiv);

    input.value = "";
    checkInput(); 
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Thinking Loader
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message';
    loadingDiv.id = 'loading-status';
    loadingDiv.innerText = "Thinking...";
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageText })
        });

        const data = await response.json();
        
        const loader = document.getElementById('loading-status');
        if (loader) loader.remove();

        // Safe backup options to prevent 'undefined' response
        let botReply = data.response || data.reply || data.message || "Kuch samajh nahi aaya!";

        const botDiv = document.createElement('div');
        botDiv.className = 'message bot-message';
        botDiv.innerText = botReply;
        chatBox.appendChild(botDiv);

    } catch (error) {
        const loader = document.getElementById('loading-status');
        if (loader) loader.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message bot-message';
        errorDiv.innerText = "Error: Backend server se connection nahi ho saka.";
        chatBox.appendChild(errorDiv);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}
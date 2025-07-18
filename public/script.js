const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) {
    return;
  }

  appendMessage('user', userMessage); 
  input.value = '';

  appendMessage('bot', ' I\'m Thinking...');
  try{
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    
    if (data.reply) {
      appendMessage('bot', data.reply);
    } else {
      appendMessage('bot', '⚠️ Gagal dapet respon dari Gemini!');
    }


  }catch (error) {
    console.error('Error:', error);
    appendMessage('bot', 'I\'m overloading.');
    return;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

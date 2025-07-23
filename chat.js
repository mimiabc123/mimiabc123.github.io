document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    let conversationHistory = [];

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        appendMessage(message, 'user-message');
        conversationHistory.push({ role: 'user', parts: [{ text: message }] });

        userInput.value = '';

        // Call Gemini API
        callGemini();
    }

    async function callGemini() {
        // IMPORTANT: For production, do NOT hardcode your API key directly in client-side code.
        // Use a secure backend or a proxy to handle your API key.
        const GEMINI_API_KEY = 'AIzaSyAsClpFDCzE7cZnisI103BjgY1Q6j3O_A4'; // Replace with your actual API key
        const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`; // Updated model to gemini-1.5-flash

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: conversationHistory,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_NONE',
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_NONE',
                        },
                        {
                            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                            threshold: 'BLOCK_NONE',
                        },
                        {
                            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            threshold: 'BLOCK_NONE',
                        },
                    ],
                })
            });

            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                conversationHistory.push({ role: 'model', parts: [{ text: aiResponse }] });
                appendMessage(aiResponse, 'ai-message');
            } else {
                appendMessage('Error: Could not get a response from AI.', 'ai-message');
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            appendMessage('Error: Failed to connect to AI.', 'ai-message');
        }
    }

    function appendMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
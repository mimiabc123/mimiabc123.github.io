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
        const GEMINI_API_KEYS = [
            'AIzaSyAsClpFDCzE7cZnisI103BjgY1Q6j3O_A4',
            'AIzaSyCl0sodJIecalWcn8yLpWsZZQSL70DJLig',
            'AIzaSyDEEkd_HXXllC883uGv8RMkoWU184bhLNQ',
        ];
        // currentApiKeyIndex is now a global variable, defined outside callGemini
        const GEMINI_API_KEY = GEMINI_API_KEYS[currentApiKeyIndex];
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

            console.log('Conversation History before API call:', conversationHistory);
            const data = await response.json();
            console.log('Gemini API Response Status:', response.status);
            console.log('Gemini API Response Data:', data);
            if (data.candidates && data.candidates.length > 0) {
                currentApiKeyIndex = 0; // Reset index on successful call

                const aiResponse = data.candidates[0].content.parts[0].text;
                // Ensure aiResponse is a string before pushing to history for robustness
                conversationHistory.push({ role: 'model', parts: [{ text: String(aiResponse) }] });
                appendMessage(aiResponse, 'ai-message');
            } else {
                // Switch to next API key on error
                currentApiKeyIndex = (currentApiKeyIndex + 1) % GEMINI_API_KEYS.length;
                // Do not display error message, just retry with the new key
                callGemini(); // Retry with the new key
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            // Switch to next API key on error
            currentApiKeyIndex = (currentApiKeyIndex + 1) % GEMINI_API_KEYS.length;
            // Do not display error message, just retry with the new key
            callGemini(); // Retry with the new key
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

let currentApiKeyIndex = 0; // Initialize currentApiKeyIndex globally
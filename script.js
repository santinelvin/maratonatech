document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickBtns = document.querySelectorAll('.quick-btn');
    
    // Histórico da conversa
    let conversationHistory = [];
    
    // Mensagem inicial do bot
    const initialMessage = {
        sender: 'bot',
        text: 'Olá! Sou o assistente de IA da AgroTech Milho. Como posso ajudar você com problemas de pragas em sua lavoura de milho hoje?',
        timestamp: new Date().toLocaleTimeString()
    };
    
    // Inicializa o chat
    initChat();
    
    // Função de inicialização
    function initChat() {
        addMessageToHistory(initialMessage);
        renderMessage(initialMessage);
    }
    
    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            userInput.value = question;
            sendMessage();
        });
    });
    
    // Função principal para enviar mensagem
    function sendMessage() {
        const messageText = userInput.value.trim();
        if (!messageText) return;
        
        // Cria e adiciona mensagem do usuário
        const userMessage = {
            sender: 'user',
            text: messageText,
            timestamp: new Date().toLocaleTimeString()
        };
        
        addMessageToHistory(userMessage);
        renderMessage(userMessage);
        userInput.value = '';
        
        // Simula processamento
        setTimeout(() => {
            const botResponse = generateBotResponse(messageText);
            addMessageToHistory(botResponse);
            renderMessage(botResponse);
        }, 800);
    }
    
    // Adiciona mensagem ao histórico
    function addMessageToHistory(message) {
        conversationHistory.push(message);
        // Limita o histórico a 50 mensagens
        if (conversationHistory.length > 50) {
            conversationHistory.shift();
        }
    }
    
    // Renderiza mensagem na tela
    function renderMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${message.sender}-message`);
        
        // Adiciona timestamp
        const timeElement = document.createElement('span');
        timeElement.classList.add('timestamp');
        timeElement.textContent = message.timestamp;
        
        // Formata mensagens longas com quebras de linha
        const textElement = document.createElement('div');
        textElement.classList.add('message-text');
        
        if (typeof message.text === 'string') {
            textElement.innerHTML = message.text.replace(/\n/g, '<br>');
        } else {
            textElement.textContent = message.text;
        }
        
        messageElement.appendChild(timeElement);
        messageElement.appendChild(textElement);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    // Gera resposta do bot
    function generateBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Padrões de detecção melhorados
        const responses = {
            lagarta: {
                patterns: ['lagarta', 'cartucho', 'spodoptera', 'frugiperda'],
                response: `🦋 <strong>Lagarta-do-cartucho (Spodoptera frugiperda)</strong><br><br>
                <u>Recomendações:</u><br>
                1. <strong>Monitoramento</strong>: Semanal da lavoura<br>
                2. <strong>Controle biológico</strong>: Vespas Trichogramma (3-5 vespas/m²)<br>
                3. <strong>Inseticidas</strong>: Clorantraniliprole (20-30 ml/ha) ou Espinetoram (50-75 ml/ha)<br>
                4. <strong>Práticas culturais</strong>: Rotação com feijão ou algodão`
            },
            mancha: {
                patterns: ['mancha', 'folha', 'folhas', 'doença'],
                response: `🍂 <strong>Problemas foliares no milho</strong><br><br>
                <u>Possíveis causas:</u><br>
                - <strong>Mancha branca</strong>: Fungicidas triazóis (aplicar preventivamente)<br>
                - <strong>Ferrugem comum</strong>: Estrobilurinas + triazóis<br>
                - <strong>Cercosporiose</strong>: Mancozeb (2-2.5 kg/ha)<br><br>
                <em>Para diagnóstico preciso, envie fotos das folhas afetadas.</em>`
            },
            prevencao: {
                patterns: ['preven', 'evitar', 'protege', 'defesa'],
                response: `🛡️ <strong>Prevenção de pragas no milho</strong><br><br>
                <u>Medidas eficazes:</u><br>
                1. Rotação com soja/feijão (quebra ciclo de pragas)<br>
                2. Plantio na época recomendada para sua região<br>
                3. Sementes tratadas com inseticidas/fungicidas<br>
                4. Áreas de refúgio (20% da área)<br>
                5. Monitoramento com armadilhas feromônios`
            },
            produtividade: {
                patterns: ['produtividade', 'aumentar', 'rendimento', 'colheita'],
                response: `📈 <strong>Aumento de Produtividade</strong><br><br>
                <u>Estratégias comprovadas:</u><br>
                1. Análise de solo (coleta 0-20 cm de profundidade)<br>
                2. Adubação NPK (80-120 kg N/ha, 40-60 kg P₂O₅/ha, 40-80 kg K₂O/ha)<br>
                3. Controle integrado de pragas e doenças<br>
                4. Irrigação (500-800 mm/ciclo)<br>
                5. Escolha de híbridos adaptados`
            },
            default: {
                response: `🤖 <strong>Assistente AgroTech</strong><br><br>
                Entendi sua dúvida sobre <em>"${userMessage}"</em>. Para ajudar melhor:<br><br>
                1. Descreva os sintomas com detalhes<br>
                2. Informe a fase da cultura (V3, V6, floração, etc.)<br>
                3. Relate condições climáticas recentes<br>
                4. Se possível, envie fotos das plantas afetadas<br><br>
                <strong>Problemas que posso ajudar:</strong> lagarta-do-cartucho, manchas foliares, pulgões, doenças fúngicas.`
            }
        };
        
        // Verifica os padrões
        let responseKey = 'default';
        
        Object.keys(responses).forEach(key => {
            if (key !== 'default') {
                const hasPattern = responses[key].patterns.some(pattern => 
                    lowerMessage.includes(pattern)
                );
                if (hasPattern) responseKey = key;
            }
        });
        
        // Cria objeto de resposta
        return {
            sender: 'bot',
            text: responses[responseKey].response,
            timestamp: new Date().toLocaleTimeString()
        };
    }
    
    // Scroll suave para navegação
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

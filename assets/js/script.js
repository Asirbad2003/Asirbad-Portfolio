     // Theme Toggle with Local Storage
function toggleTheme() {
    document.documentElement.classList.toggle('light');
    const icon = document.querySelector('.theme-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    
    // Save theme preference
    const isDark = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('theme', isDark);
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light');
        document.querySelector('.theme-toggle i').classList.add('fa-moon');
    }
});

// Advanced Typing Animation
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        // Initial Type Speed
        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

function init() {
    const txtElement = document.querySelector('.typed-text');
    const words = [
        'Software Developer 💻',
        'Web Developer 🌐',
        'Python Developer 🐍',
        'Java Developer ☕',
        'Full Stack Developer 🚀'
    ];
    const wait = 3000;
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
}

// Enhanced Chatbot functionality
class Chatbot {
    constructor() {
        this.chatOpen = false;
        this.userInfo = {
            name: null,
            email: null,
            message: null
        };
        this.currentStep = 'name';
        this.chatWindow = document.querySelector('.chat-window');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        
        // Bind event listeners
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.chatOpen = !this.chatOpen;
        this.chatWindow.style.display = this.chatOpen ? 'flex' : 'none';
        
        if (this.chatOpen && !this.chatMessages.innerHTML) {
            this.addBotMessage("Hi! I'm Asirbad's virtual assistant. What's your name? 😊");
        }

        if (this.chatOpen) {
            this.chatInput.focus();
        }
    }

    addBotMessage(message, delay = 500) {
        setTimeout(() => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message';
            messageDiv.textContent = message;
            
            // Add typing animation
            messageDiv.style.opacity = '0';
            this.chatMessages.appendChild(messageDiv);
            
            // Smooth fade in
            setTimeout(() => {
                messageDiv.style.opacity = '1';
            }, 100);
            
            this.scrollToBottom();
        }, delay);
    }

    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = message;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    validateEmail(email) {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        
        if (!message) return;

        this.addUserMessage(message);
        this.chatInput.value = '';

        switch (this.currentStep) {
            case 'name':
                this.userInfo.name = message;
                this.currentStep = 'email';
                this.addBotMessage(`Nice to meet you, ${message}! 👋 Please share your email address so I can get back to you.`);
                break;

            case 'email':
                if (this.validateEmail(message)) {
                    this.userInfo.email = message;
                    this.currentStep = 'message';
                    this.addBotMessage("Great! What would you like to discuss with Asirbad?");
                } else {
                    this.addBotMessage("Oops! That doesn't look like a valid email address. Please try again.");
                }
                break;

            case 'message':
                this.userInfo.message = message;
                this.currentStep = 'complete';
                
                // Simulate sending email
                this.addBotMessage("Thanks for your message! I'll forward this to Asirbad right away. 📨");
                this.addBotMessage("He'll get back to you at " + this.userInfo.email + " soon!", 1000);
                this.addBotMessage("Is there anything else I can help you with? Feel free to start a new conversation!", 2000);
                
                // Actually send the message (you'll need to implement this)
                this.sendToEmail();
                
                // Reset for new conversation
                setTimeout(() => {
                    this.currentStep = 'name';
                    this.userInfo = {
                        name: null,
                        email: null,
                        message: null
                    };
                }, 3000);
                break;
        }
    }

    async sendToEmail() {
        const formData = new URLSearchParams();
        formData.append('entry.3733981', this.userInfo.name);       // Your Name field ID
        formData.append('entry.843092572', this.userInfo.email);     // Your Email field ID
        formData.append('entry.1633255377', this.userInfo.message);  // Your Message field ID
    
        const response = await fetch('https://docs.google.com/forms/d/e/1FAIpQLSdK0ftBJh6VOxRTkfOkoOAigN3SJV9xLaIiXvg6ic_6C6hUUg/formResponse', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
    
        if (response.ok) {
            console.log('Response saved to Google Form!');
        } else {
            console.error('Error saving response:', response.statusText);
        }
    }
    
    
}

// Initialize chatbot
const chatbot = new Chatbot();

// Smooth scroll for navigation only if it's an in-page link
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Check if the link is an in-page link (starts with "#")
        if (href.startsWith('#')) {
            e.preventDefault();
            const section = document.querySelector(href);
            section.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Expose necessary functions globally
window.toggleChat = () => chatbot.toggleChat();
window.sendMessage = () => chatbot.sendMessage();
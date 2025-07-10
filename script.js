// JavaScript for countdown, FAQ, chatbot, etc.

console.log("AI & ML Course Landing Page Script Loaded");

// --- Countdown Timer ---
function startCountdown(endDateStr) {
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.error("Timer element not found!");
        return;
    }

    const targetDate = new Date(endDateStr).getTime();

    if (isNaN(targetDate)) {
        console.error("Invalid endDateStr for countdown:", endDateStr);
        timerElement.innerHTML = "<span>Timer Error</span>";
        return;
    }

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(interval);
            timerElement.innerHTML = "<span>Enrollment Closed</span>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerElement.innerHTML = `
            <span>${days.toString().padStart(2, '0')}D</span> :
            <span>${hours.toString().padStart(2, '0')}H</span> :
            <span>${minutes.toString().padStart(2, '0')}M</span> :
            <span>${seconds.toString().padStart(2, '0')}S</span>
        `;
    }, 1000);
}

// --- Initialize page elements ---
document.addEventListener('DOMContentLoaded', () => {
    // Set a target date for the countdown, e.g., 30 days from now
    const today = new Date();
    const targetEnrollmentDate = new Date(today.setDate(today.getDate() + 30));
    // Format: YYYY-MM-DDTHH:MM:SS
    const formattedTargetDate = `${targetEnrollmentDate.getFullYear()}-${(targetEnrollmentDate.getMonth() + 1).toString().padStart(2, '0')}-${targetEnrollmentDate.getDate().toString().padStart(2, '0')}T23:59:59`;

    startCountdown(formattedTargetDate);

    // Placeholder for other initializations
    initFAQ();
    initChatbot();
    // initInteractivePreview(); // Already handled below for now
});

// --- FAQ Accordion ---
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        if (questionButton) {
            questionButton.addEventListener('click', () => {
                // Toggle active class on the item
                const isActive = item.classList.contains('active');

                // Optional: Close other active items
                // faqItems.forEach(otherItem => {
                //     if (otherItem !== item) {
                //         otherItem.classList.remove('active');
                //     }
                // });

                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });
}

// --- Interactive Preview (Simple Version) ---
const previewButton = document.getElementById('preview-button');
const previewData = document.getElementById('preview-data');

if (previewButton && previewData) {
    previewButton.addEventListener('click', () => {
        if (previewData.style.display === 'none') {
            previewData.style.display = 'block';
            previewButton.textContent = 'Hide Preview Content';
        } else {
            previewData.style.display = 'none';
            previewButton.textContent = 'Show Preview Content';
        }
    });
} else {
    console.warn("Preview button or data element not found.");
}

// --- Basic Chatbot UI ---
function initChatbot() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    if (!chatMessages || !userInput || !sendButton) {
        console.warn("Chatbot elements not found. Chatbot functionality will be disabled.");
        return;
    }

    const botResponses = {
        "hello": "Hi there! How can I assist you with the AI/ML course today?",
        "hi": "Hello! Ask me anything about the course.",
        "course details": "This is a comprehensive course on AI and Machine Learning, covering topics from basic concepts to advanced algorithms and a capstone project. Check the Syllabus section for more!",
        "syllabus": "You can find the detailed syllabus in the 'Syllabus' section of this page. It includes modules on Supervised Learning, Unsupervised Learning, Deep Learning, and more.",
        "prerequisites": "Basic Python programming knowledge and high-school level mathematics are recommended. We cover the fundamentals, so a strong desire to learn is key!",
        "duration": "The course is designed to be completed in 12 weeks, assuming a study time of 8-10 hours per week.",
        "enroll": "You can enroll by clicking the 'Enroll Now' button on this page. The countdown timer shows how much time is left for the current enrollment period.",
        "cost": "For pricing and payment options, please visit our enrollment page or contact admissions.",
        "help": "I can answer questions about the course syllabus, prerequisites, duration, and enrollment. What would you like to know?",
        "bye": "Goodbye! Feel free to ask more questions later.",
        "default": "I'm still learning! I can answer questions about: course details, syllabus, prerequisites, duration, or how to enroll. For other topics, please check the FAQ or contact support."
    };

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        const p = document.createElement('p');
        p.textContent = text;
        messageDiv.appendChild(p);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
    }

    function getBotResponse(userText) {
        const text = userText.toLowerCase().trim();
        let response = botResponses.default;

        // Simple keyword matching
        if (text.includes("hello") || text.includes("hi")) {
            response = botResponses.hello;
        } else if (text.includes("course") && text.includes("detail")) {
            response = botResponses.course_details;
        } else if (text.includes("syllabus")) {
            response = botResponses.syllabus;
        } else if (text.includes("prerequisite")) {
            response = botResponses.prerequisites;
        } else if (text.includes("duration") || text.includes("long")) {
            response = botResponses.duration;
        } else if (text.includes("enroll") || text.includes("join")) {
            response = botResponses.enroll;
        } else if (text.includes("cost") || text.includes("price") || text.includes("fee")) {
            response = botResponses.cost;
        } else if (text.includes("help")) {
            response = botResponses.help;
        } else if (text.includes("bye") || text.includes("thank")) {
            response = botResponses.bye;
        }
        // Add more specific checks before broader ones
        for (const keyword in botResponses) {
            if (text.includes(keyword)) {
                response = botResponses[keyword];
                break;
            }
        }


        return response;
    }

    function handleUserMessage() {
        const userText = userInput.value.trim();
        if (userText === "") return;

        addMessage(userText, 'user');
        userInput.value = ""; // Clear input field

        // Simulate bot thinking time
        setTimeout(() => {
            const botReply = getBotResponse(userText);
            addMessage(botReply, 'bot');
        }, 500 + Math.random() * 500); // Random delay for a more natural feel
    }

    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleUserMessage();
        }
    });
}

// Global variables
let messageCounter = 0;
let isTyping = false;

// DOM elements
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const messagesContainer = document.getElementById("messagesContainer");
const typingIndicator = document.getElementById("typingIndicator");
const emptyState = document.getElementById("emptyState");
const quickSuggestions = document.getElementById("quickSuggestions");

// Auto-resize textarea
function adjustTextareaHeight() {
  chatInput.style.height = "auto";
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";

  // Enable/disable send button
  sendBtn.disabled = chatInput.value.trim() === "";
}

// Handle Enter key press
function handleKeyPress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// Send message function
async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message || isTyping) return;

  console.log("Sending message:", message); // Debug log

  // Hide empty state and suggestions after first message
  if (emptyState && emptyState.style.display !== "none") {
    emptyState.style.display = "none";
    if (quickSuggestions) {
      quickSuggestions.style.display = "none";
    }
  }

  // Add user message
  addMessage(message, "user");

  // Clear input
  chatInput.value = "";
  adjustTextareaHeight();

  // Show typing indicator
  showTypingIndicator();

  // Call AI API
  try {
    const response = await callAIAPI(message);
    hideTypingIndicator();
    addMessage(response, "bot");
  } catch (error) {
    console.error("API Error:", error); // Debug log
    hideTypingIndicator();
    addMessage("Sorry, I encountered an error. Please try again.", "bot", true);
  }
}

// Add message to chat
function addMessage(content, sender, isError = false) {
  const messageId = "msg-" + ++messageCounter;
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const messageDiv = document.createElement("div");
  messageDiv.className = `message message-${sender}`;
  messageDiv.id = messageId;
  messageDiv.style.animationDelay = "0.1s";

  const bubbleClass = isError ? "message-bubble error" : "message-bubble";
  const icon = sender === "user" ? "fas fa-user" : "fas fa-robot";

  messageDiv.innerHTML = `
    <div class="${bubbleClass}">
        <div class="message-content">${content}</div>
        <div class="message-meta">
            <i class="${icon}"></i>
            <span>${timestamp}</span>
            ${
              sender === "bot"
                ? '<i class="fas fa-copy ms-2" onclick="copyMessage(\'' +
                  messageId +
                  '\')" title="Copy message"></i>'
                : ""
            }
        </div>
    </div>
  `;

  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

// Send suggestion
function sendSuggestion(suggestion) {
  chatInput.value = suggestion;
  sendMessage();
}

// Show/hide typing indicator
function showTypingIndicator() {
  isTyping = true;
  sendBtn.disabled = true;
  typingIndicator.style.display = "block";
  scrollToBottom();
}

function hideTypingIndicator() {
  isTyping = false;
  sendBtn.disabled = chatInput.value.trim() === "";
  typingIndicator.style.display = "none";
}

// Scroll to bottom
function scrollToBottom() {
  const chatBody = document.getElementById("chatBody");
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Copy message
function copyMessage(messageId) {
  const messageElement = document.getElementById(messageId);
  const content = messageElement.querySelector(".message-content").textContent;
  navigator.clipboard.writeText(content).then(() => {
    // Visual feedback
    const copyIcon = messageElement.querySelector(".fa-copy");
    const originalClass = copyIcon.className;
    copyIcon.className = "fas fa-check";
    setTimeout(() => {
      copyIcon.className = originalClass;
    }, 1000);
  });
}

// Clear chat
function clearChat() {
  if (confirm("Are you sure you want to clear the chat?")) {
    messagesContainer.innerHTML = "";
    if (emptyState) {
      emptyState.style.display = "flex";
    }
    if (quickSuggestions) {
      quickSuggestions.style.display = "flex";
    }
    messageCounter = 0;
  }
}

// Export chat
function exportChat() {
  const messages = Array.from(messagesContainer.querySelectorAll(".message"))
    .map((msg) => {
      const sender = msg.classList.contains("message-user") ? "User" : "AI";
      const content = msg.querySelector(".message-content").textContent;
      const timestamp = msg.querySelector(".message-meta span").textContent;
      return `[${timestamp}] ${sender}: ${content}`;
    })
    .join("\n");

  const blob = new Blob([messages], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chat-export-${new Date().toISOString().split("T")[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// AI API call function
async function callAIAPI(message) {
  try {
    const response = await fetch("/faq_question/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: message }), // ✅ FIXED
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.answer || "I received your message but couldn't generate a response."
    );
  } catch (error) {
    console.error("API call error:", error);
    return `I received your message: "${message}". This is a placeholder response.`;
  }
}

// Get CSRF token (if using Django)
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing chat"); // Debug log
  adjustTextareaHeight();
  chatInput.focus();

  // Test if elements exist
  console.log("Chat input found:", !!chatInput);
  console.log("Send button found:", !!sendBtn);
  console.log("Messages container found:", !!messagesContainer);
});

// Handle online/offline status
window.addEventListener("online", () => {
  const statusText = document.getElementById("statusText");
  if (statusText) {
    statusText.textContent = "Online";
  }
});

window.addEventListener("offline", () => {
  const statusText = document.getElementById("statusText");
  if (statusText) {
    statusText.textContent = "Offline";
  }
});

// Authentication functions
function registerUser(username, email, password) {
    const users = JSON.parse(localStorage.getItem('quizPlatformUsers') || '[]');
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        throw new Error('User already exists with this email');
    }
    
    const newUser = {
        id: generateId(),
        username: username,
        email: email,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('quizPlatformUsers', JSON.stringify(users));
    
    return newUser;
}

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('quizPlatformUsers') || '[]');
    const user = users.find(user => user.email === email);
    
    if (!user) {
        throw new Error('No account found with this email');
    }
    
    return user;
}

// Quiz functions
function createQuiz(quizData, creatorId) {
    const quizzes = JSON.parse(localStorage.getItem('quizPlatformQuizzes') || '[]');
    
    const quizId = generateId();
    const quiz = {
        id: quizId,
        title: quizData.title,
        description: quizData.description,
        questions: quizData.questions,
        creatorId: creatorId,
        createdAt: new Date().toISOString()
    };
    
    quizzes.push(quiz);
    localStorage.setItem('quizPlatformQuizzes', JSON.stringify(quizzes));
    
    return quizId;
}

function getQuiz(quizId) {
    const quizzes = JSON.parse(localStorage.getItem('quizPlatformQuizzes') || '[]');
    return quizzes.find(quiz => quiz.id === quizId) || null;
}

function getUserQuizzes(userId) {
    const quizzes = JSON.parse(localStorage.getItem('quizPlatformQuizzes') || '[]');
    return quizzes.filter(quiz => quiz.creatorId === userId);
}

function removeQuiz(quizId) {
    const quizzes = JSON.parse(localStorage.getItem('quizPlatformQuizzes') || '[]');
    const filteredQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
    localStorage.setItem('quizPlatformQuizzes', JSON.stringify(filteredQuizzes));
    
    // Also remove related results
    const results = JSON.parse(localStorage.getItem('quizPlatformResults') || '[]');
    const filteredResults = results.filter(result => result.quizId !== quizId);
    localStorage.setItem('quizPlatformResults', JSON.stringify(filteredResults));
}

// Results functions
function saveQuizResult(result) {
    const results = JSON.parse(localStorage.getItem('quizPlatformResults') || '[]');
    results.push(result);
    localStorage.setItem('quizPlatformResults', JSON.stringify(results));
}

function getQuizResults(quizId) {
    const results = JSON.parse(localStorage.getItem('quizPlatformResults') || '[]');
    return results.filter(result => result.quizId === quizId);
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(currentUser);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getScoreClass(score) {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    return 'score-poor';
}

// UI Helper functions
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function hideError(element) {
    element.classList.remove('show');
}

function showButtonLoading(button) {
    button.classList.add('loading');
    button.disabled = true;
}

function hideButtonLoading(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 4000);
}

// Initialize tooltips and other interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.share-dialog');
            modals.forEach(modal => modal.remove());
        }
    });
});

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Local storage cleanup
function cleanupOldData() {
    // Clean up old localStorage data (can be called periodically)
    const keys = ['quizPlatformUsers', 'quizPlatformQuizzes', 'quizPlatformResults'];
    keys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                JSON.parse(data);
            } catch (e) {
                localStorage.removeItem(key);
            }
        }
    });
}

// Run cleanup on load
cleanupOldData();
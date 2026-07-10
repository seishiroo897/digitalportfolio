function showSecurityMessage(message) {
    // Remove any existing toast
    let toast = document.getElementById('security-toast');
    if (toast) {
        document.body.removeChild(toast);
    }
    
    toast = document.createElement('div');
    toast.id = 'security-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--paper-alt, #FFFFFF);
        color: var(--ink, #12151B);
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 0.85rem;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 4px 16px rgba(18, 21, 27, 0.12);
        border: 1px solid var(--line, #E3E6EB);
        border-left: 4px solid var(--accent, #2D3FE0);
        font-family: 'IBM Plex Sans', sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
        pointer-events: none;
        animation: slideInRight 0.3s ease;
        letter-spacing: -0.01em;
    `;
    
    const icon = document.createElement('span');
    icon.textContent = '🔒';
    icon.style.cssText = 'font-size: 1rem;';
    
    const text = document.createElement('span');
    text.textContent = message.replace('🔒 ', ''); // Remove duplicate lock emoji
    
    toast.appendChild(icon);
    toast.appendChild(text);
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.transition = 'opacity 0.5s, transform 0.5s';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 500);
        }
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    /* Disable text selection on the entire page */
    body {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    /* Allow text selection only on specific elements */
    input, textarea, [contenteditable="true"] {
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
    }
    
    /* Disable drag on images */
    img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
    }
`;
document.head.appendChild(style);

// ============== 1. BLOCK RIGHT-CLICK ==============
document.addEventListener('contextmenu', function(e) {
    // Allow right-click only on input/textarea elements for accessibility
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        showSecurityMessage('🔒 Context menu is disabled for security');
        return false;
    }
});

// ============== 2. BLOCK DEVELOPER SHORTCUTS ==============
document.addEventListener('keydown', function(e) {
    // Block F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        showSecurityMessage('🔒 F12 is disabled');
        return false;
    }
    
    // Block Ctrl+Shift+I (DevTools)
    if ((e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.metaKey && e.altKey && e.key === 'i')) {
        e.preventDefault();
        showSecurityMessage('🔒 Developer tools are disabled');
        return false;
    }
    
    // Block Ctrl+Shift+J (Console)
    if ((e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.metaKey && e.altKey && e.key === 'j')) {
        e.preventDefault();
        showSecurityMessage('🔒 Console is disabled');
        return false;
    }
    
    // Block Ctrl+Shift+C (Inspect)
    if ((e.ctrlKey && e.shiftKey && e.key === 'C') || 
        (e.metaKey && e.shiftKey && e.key === 'c')) {
        e.preventDefault();
        showSecurityMessage('🔒 Inspect element is disabled');
        return false;
    }
    
    // Block Ctrl+U (View Source)
    if ((e.ctrlKey && e.key === 'u') || 
        (e.metaKey && e.altKey && e.key === 'u')) {
        e.preventDefault();
        showSecurityMessage('🔒 View source is disabled');
        return false;
    }
    
    // Block Ctrl+S (Save)
    if ((e.ctrlKey && e.key === 's') || (e.metaKey && e.key === 's')) {
        e.preventDefault();
        return false;
    }
    
    // Block Ctrl+P (Print)
    if ((e.ctrlKey && e.key === 'p') || (e.metaKey && e.key === 'p')) {
        e.preventDefault();
        return false;
    }
    
    // Block Ctrl+Shift+K (Firefox Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        showSecurityMessage('🔒 Console is disabled');
        return false;
    }
});

// ============== 3. DETECT DEVTOOLS ==============
(function detectDevTools() {
    // Method 1: Check window dimensions
    const checkDevTools = function() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
            showSecurityMessage('🔒 Please close developer tools');
        }
    };
    
    // Method 2: Debugger detection
    const checkDebugger = function() {
        const start = performance.now();
        debugger;
        const end = performance.now();
        
        if (end - start > 100) {
            showSecurityMessage('🔒 Debugger detected');
        }
    };
    
    // Run checks periodically
    setInterval(function() {
        checkDevTools();
        checkDebugger();
    }, 2000);
})();
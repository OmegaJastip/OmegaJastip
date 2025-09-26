// Right Click Protection Script for Omega Jastip
document.addEventListener('DOMContentLoaded', function() {
    // Protection state management
    let protectionState = {
        warningsShown: 0,
        lastWarningTime: 0,
        attempts: {
            rightClick: 0,
            keyboard: 0,
            dragDrop: 0,
            console: 0
        }
    };

    // Rate limiting function
    function shouldShowAlert(actionType, maxAttempts = 3, timeWindow = 10000) {
        const now = Date.now();
        const lastTime = protectionState.lastWarningTime;
        const attempts = protectionState.attempts[actionType];

        // Reset counter if time window has passed
        if (now - lastTime > timeWindow) {
            protectionState.attempts[actionType] = 0;
        }

        protectionState.attempts[actionType]++;
        protectionState.lastWarningTime = now;

        // Only show alert after multiple attempts
        return protectionState.attempts[actionType] >= maxAttempts;
    }

    // Show warning message (less intrusive)
    function showWarning(message) {
        if (protectionState.warningsShown < 2) { // Limit total warnings per session
            console.warn('🔒 ' + message);
            protectionState.warningsShown++;

            // Play alert sound
            const audio = new Audio('sound/alert.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));

            // Show subtle notification instead of alert
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            notification.textContent = '⏰ ' + message;
            document.body.appendChild(notification);

            // Fade in
            setTimeout(() => notification.style.opacity = '1', 100);

            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => document.body.removeChild(notification), 300);
            }, 3000);
        }
    }

    // Disable right-click context menu (only alert after multiple attempts)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();

        if (shouldShowAlert('rightClick')) {
            showWarning('Right-click is disabled to protect content. Please respect the copyright.');
        }
        return false;
    });

    // Disable keyboard shortcuts (only alert after multiple attempts)
    document.addEventListener('keydown', function(e) {
        let blocked = false;
        let actionType = '';

        // Disable F12 (Developer Tools)
        if (e.keyCode === 123) {
            e.preventDefault();
            blocked = true;
            actionType = 'keyboard';
        }

        // Disable Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            blocked = true;
            actionType = 'keyboard';
        }

        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            blocked = true;
            actionType = 'keyboard';
        }

        // Disable Ctrl+S (Save Page) - Allow normal save functionality
        if (e.ctrlKey && e.keyCode === 83 && !e.target.closest('input, textarea')) {
            e.preventDefault();
            blocked = true;
            actionType = 'keyboard';
        }

        // Disable Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            blocked = true;
            actionType = 'keyboard';
        }

        // Disable Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            blocked = true;
            actionType = 'keyboard';
        }

        if (blocked && shouldShowAlert(actionType)) {
            showWarning('Developer tools access is restricted. Please respect the copyright.');
        }
        return false;
    });

    // Disable text selection (remove alert, just prevent selection)
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable drag and drop (only alert after multiple attempts)
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();

        if (shouldShowAlert('dragDrop')) {
            showWarning('Drag and drop is disabled. Please respect the copyright.');
        }
        return false;
    });

    // Disable image dragging (only alert after multiple attempts)
    document.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();

            if (shouldShowAlert('dragDrop')) {
                showWarning('Image dragging is disabled. Please respect the copyright.');
            }
            return false;
        }
    });

    // Additional protection for images (only alert after multiple attempts)
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();

            if (shouldShowAlert('rightClick')) {
                showWarning('Right-click on images is disabled. Please respect the copyright.');
            }
            return false;
        });

        // Disable image downloading by removing href if it's just #
        if (img.parentElement && img.parentElement.tagName === 'A' && img.parentElement.getAttribute('href') === '#') {
            img.parentElement.removeAttribute('href');
        }
    });

    // Console protection (less intrusive)
    const originalConsole = window.console;
    window.console = {
        log: function() {
            // Allow jQuery logs and normal console usage
            if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].includes('jQuery')) {
                return originalConsole.log.apply(originalConsole, arguments);
            }

            // Only warn about suspicious console usage
            if (arguments[0] && typeof arguments[0] === 'string' &&
                (arguments[0].includes('eval') || arguments[0].includes('script') || arguments[0].includes('innerHTML'))) {
                if (shouldShowAlert('console')) {
                    showWarning('Suspicious console activity detected. Please respect the copyright.');
                }
            }

            return originalConsole.log.apply(originalConsole, arguments);
        },
        warn: function() {
            return originalConsole.warn.apply(originalConsole, arguments);
        },
        error: function() {
            return originalConsole.error.apply(originalConsole, arguments);
        },
        info: function() {
            return originalConsole.info.apply(originalConsole, arguments);
        }
    };

    // Prevent viewing source in mobile browsers (only alert after multiple attempts)
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();

            if (shouldShowAlert('keyboard')) {
                showWarning('Multi-touch gestures are restricted. Please respect the copyright.');
            }
            return false;
        }
    }, { passive: false });

    // Additional security message (only show once per session)
    window.addEventListener('beforeunload', function(e) {
        // Only show warning if user has triggered protection multiple times
        if (protectionState.warningsShown > 0) {
            // This will show a confirmation dialog when user tries to leave
            // Uncomment if you want to prevent accidental navigation
            // e.preventDefault();
            // e.returnValue = 'Are you sure you want to leave?';
        }
    });

    console.log('🔒 Content protection activated for Omega Jastip Lubuklinggau (Enhanced Version)');
});

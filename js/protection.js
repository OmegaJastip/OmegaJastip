// Right Click Protection Script for Omega Jastip
document.addEventListener('DOMContentLoaded', function() {
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        alert('⏰ Right-click is disabled on this page to protect content. Please respect the copyright.');
        return false;
    });

    // Disable keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Disable F12 (Developer Tools)
        if (e.keyCode === 123) {
            e.preventDefault();
            alert('⏰ Developer Tools access is disabled. Please respect the copyright.');
            return false;
        }

        // Disable Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            alert('⏰ Developer Tools access is disabled. Please respect the copyright.');
            return false;
        }

        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            alert('⏰ View Source is disabled. Please respect the copyright.');
            return false;
        }

        // Disable Ctrl+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            alert('⏰ Save Page is disabled. Please respect the copyright.');
            return false;
        }

        // Disable Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            alert('⏰ Inspect Element is disabled. Please respect the copyright.');
            return false;
        }

        // Disable Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            alert('⏰ Console access is disabled. Please respect the copyright.');
            return false;
        }
    });

    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        alert('⏰ Drag and drop is disabled. Please respect the copyright.');
        return false;
    });

    // Disable image dragging
    document.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            alert('⏰ Image dragging is disabled. Please respect the copyright.');
            return false;
        }
    });

    // Additional protection for images
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            alert('⏰ Right-click on images is disabled. Please respect the copyright.');
            return false;
        });

        // Disable image downloading by removing href if it's just #
        if (img.parentElement && img.parentElement.tagName === 'A' && img.parentElement.getAttribute('href') === '#') {
            img.parentElement.removeAttribute('href');
        }
    });

    // Console protection
    const originalConsole = window.console;
    window.console = {
        log: function() {
            if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].includes('jQuery')) {
                return;
            }
            alert('⏰ Console access is disabled. Please respect the copyright.');
        },
        warn: function() {
            alert('⏰ Console access is disabled. Please respect the copyright.');
        },
        error: function() {
            alert('⏰ Console access is disabled. Please respect the copyright.');
        },
        info: function() {
            alert('⏰ Console access is disabled. Please respect the copyright.');
        }
    };

    // Prevent viewing source in mobile browsers
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
            alert('⏰ Multi-touch is disabled. Please respect the copyright.');
            return false;
        }
    }, { passive: false });

    // Additional security message
    window.addEventListener('beforeunload', function(e) {
        // This will show a confirmation dialog when user tries to leave
        // Uncomment if you want to prevent accidental navigation
        // e.preventDefault();
        // e.returnValue = 'Are you sure you want to leave?';
    });

    console.log('🔒 Content protection activated for Omega Jastip Lubuklinggau');
});

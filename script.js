class PythonRoadmapTracker {
    constructor() {
        this.storageKey = 'python-roadmap-progress';
        this.checkboxes = document.querySelectorAll('input[type="checkbox"][data-topic]');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        this.init();
    }

    init() {
        this.loadProgress();
        this.attachEventListeners();
        this.updateProgress();
    }

    loadProgress() {
        try {
            const savedProgress = localStorage.getItem(this.storageKey);
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                
                this.checkboxes.forEach(checkbox => {
                    const topic = checkbox.getAttribute('data-topic');
                    if (progress[topic]) {
                        checkbox.checked = true;
                    }
                });
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }

    saveProgress() {
        try {
            const progress = {};
            
            this.checkboxes.forEach(checkbox => {
                const topic = checkbox.getAttribute('data-topic');
                progress[topic] = checkbox.checked;
            });
            
            localStorage.setItem(this.storageKey, JSON.stringify(progress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    attachEventListeners() {
        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveProgress();
                this.updateProgress();
            });
        });
    }

    updateProgress() {
        const totalItems = this.checkboxes.length;
        const completedItems = Array.from(this.checkboxes).filter(cb => cb.checked).length;
        const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = `${percentage}% Complete (${completedItems}/${totalItems})`;
        
        if (percentage === 100) {
            this.showCompletionMessage();
        }
    }

    showCompletionMessage() {
        if (!this.completionShown) {
            alert('Congratulations! You have completed the entire Python roadmap!');
            this.completionShown = true;
        }
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            this.checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            this.updateProgress();
            this.completionShown = false;
        }
    }
}

// Initialize the tracker when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tracker = new PythonRoadmapTracker();
    
    // Make tracker available globally for debugging
    window.pythonTracker = tracker;
    
    console.log('Python Roadmap Tracker initialized!');
    console.log('Use pythonTracker.resetProgress() to reset all progress');
});

// Add keyboard shortcut for reset (Ctrl+Shift+R)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        if (window.pythonTracker) {
            window.pythonTracker.resetProgress();
        }
    }
});
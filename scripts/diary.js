// Diary functionality
document.addEventListener('DOMContentLoaded', function() {
    const addEntryForm = document.getElementById('addEntryForm');
    const saveEntryBtn = document.getElementById('saveEntryBtn');
    const progressTimeline = document.getElementById('progressTimeline');

    // Update statistics
    function updateStatistics() {
        const completedItems = document.querySelectorAll('.timeline-item.completed').length;
        const inProgressItems = document.querySelectorAll('.timeline-item.in-progress').length;
        
        document.getElementById('completedCount').textContent = completedItems;
        document.getElementById('inProgressCount').textContent = inProgressItems;
    }

    // Add new entry
    saveEntryBtn.addEventListener('click', function() {
        const title = document.getElementById('entryTitle').value;
        const description = document.getElementById('entryDescription').value;
        const date = document.getElementById('entryDate').value;
        const status = document.getElementById('entryStatus').value;

        if (!title || !date) {
            alert('Пожалуйста, заполните обязательные поля');
            return;
        }

        // Create new timeline item
        const newItem = createTimelineItem(title, description, date, status);
        progressTimeline.insertBefore(newItem, progressTimeline.firstChild);

        // Reset form and close modal
        addEntryForm.reset();
        bootstrap.Modal.getInstance(document.getElementById('addEntryModal')).hide();

        // Update statistics
        updateStatistics();

        // Show success message
        showNotification('Запись успешно добавлена!', 'success');
    });

    // Create timeline item element
    function createTimelineItem(title, description, date, status) {
        const item = document.createElement('div');
        item.className = `timeline-item ${status}`;

        const statusConfig = {
            'completed': { class: 'bg-success', icon: 'bi-check-lg', badge: 'Завершено' },
            'in-progress': { class: 'bg-warning', icon: 'bi-arrow-repeat', badge: 'В процессе' },
            'planned': { class: 'bg-secondary', icon: 'bi-clock', badge: 'Запланировано' }
        };

        const config = statusConfig[status];

        item.innerHTML = `
            <div class="timeline-marker ${config.class}">
                <i class="${config.icon}"></i>
            </div>
            <div class="timeline-content">
                <div class="d-flex justify-content-between align-items-start">
                    <h6 class="mb-1">${title}</h6>
                    <span class="badge ${config.class}">${config.badge}</span>
                </div>
                <p class="text-muted mb-1">${description}</p>
                <small class="text-muted">
                    <i class="bi bi-calendar me-1"></i>${formatDate(date)}
                </small>
                <div class="mt-2 technologies-container">
                    ${getSelectedTechnologies()}
                </div>
            </div>
        `;

        return item;
    }

    // Format date
    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    // Get selected technologies
    function getSelectedTechnologies() {
        const techMap = {
            'html': { text: 'HTML/CSS', class: 'bg-primary' },
            'js': { text: 'JavaScript', class: 'bg-success' },
            'bootstrap': { text: 'Bootstrap', class: 'bg-primary' },
            'react': { text: 'React', class: 'bg-info' }
        };

        let technologies = '';
        for (const [tech, config] of Object.entries(techMap)) {
            const checkbox = document.getElementById(`tech${tech.charAt(0).toUpperCase() + tech.slice(1)}`);
            if (checkbox && checkbox.checked) {
                technologies += `<span class="badge ${config.class} me-1">${config.text}</span>`;
            }
        }
        return technologies;
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const alertClass = {
            'success': 'alert-success',
            'error': 'alert-danger',
            'info': 'alert-info',
            'warning': 'alert-warning'
        }[type];

        const alert = document.createElement('div');
        alert.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    // Initialize statistics
    updateStatistics();

    // Set today's date as default
    document.getElementById('entryDate').valueAsDate = new Date();
});
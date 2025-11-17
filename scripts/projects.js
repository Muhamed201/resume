// Projects filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const noProjectsMessage = document.getElementById('noProjectsMessage');

    // Filter projects
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            let visibleCount = 0;
            
            projectItems.forEach(item => {
                const categories = item.getAttribute('data-categories').split(',');
                
                if (filter === 'all' || categories.includes(filter)) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide no projects message
            if (visibleCount === 0) {
                noProjectsMessage.classList.remove('d-none');
            } else {
                noProjectsMessage.classList.add('d-none');
            }
        });
    });

    // Add animation to project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
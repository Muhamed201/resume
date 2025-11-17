// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Анимация прогресс-баров при скролле
    const animateProgressBars = () => {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    };

    // Запуск анимации при загрузке
    animateProgressBars();
});
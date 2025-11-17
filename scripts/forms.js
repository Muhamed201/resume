// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = submitBtn.querySelector('.spinner-border');

    // Form validation
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        // Validate form
        if (!contactForm.checkValidity()) {
            contactForm.classList.add('was-validated');
            return;
        }

        // If form is valid, submit it
        submitForm();
    });

    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            if (this.type !== 'checkbox') {
                validateField(this);
            }
        });

        field.addEventListener('blur', function() {
            if (this.type !== 'checkbox') {
                validateField(this);
            }
        });
    });

    // Custom validation for message length
    const messageField = document.getElementById('message');
    messageField.addEventListener('input', function() {
        validateMessageLength(this);
    });

    // Submit form function
    function submitForm() {
        // Show loading state
        submitBtn.disabled = true;
        spinner.classList.remove('d-none');
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Отправка...';

        // Simulate form submission (in real project, this would be AJAX)
        setTimeout(() => {
            // Hide loading state
            submitBtn.disabled = false;
            spinner.classList.add('d-none');
            submitBtn.innerHTML = 'Отправить сообщение';

            // Show success modal
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();

            // Reset form
            contactForm.reset();
            contactForm.classList.remove('was-validated');

            // Log form data (in real project, send to server)
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                agreeTerms: document.getElementById('agreeTerms').checked
            };
            
            console.log('Form submitted:', formData);
        }, 2000);
    }

    // Validate individual field
    function validateField(field) {
        const isValid = field.checkValidity();
        
        if (field.type === 'email' && field.value) {
            const emailValid = validateEmail(field.value);
            if (!emailValid) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                return;
            }
        }

        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }
    }

    // Validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate message length
    function validateMessageLength(field) {
        const minLength = 10;
        const isValid = field.value.length >= minLength;

        if (field.value && !isValid) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
        } else if (field.value && isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-invalid');
            field.classList.remove('is-valid');
        }
    }

    // Reset form validation on reset
    contactForm.addEventListener('reset', function() {
        contactForm.classList.remove('was-validated');
        formFields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    });

    // Add hover effects to social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
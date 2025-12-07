// Contact form functionality with improved accessibility
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = submitBtn.querySelector('.spinner-border');
    const successMessage = document.getElementById('successMessage');

    // Form validation
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        // Validate form
        if (!validateForm()) {
            // Move focus to first error
            const firstError = document.querySelector('.error-message.show');
            if (firstError) {
                const fieldId = firstError.id.replace('Error', '');
                const field = document.getElementById(fieldId);
                if (field) {
                    field.focus();
                }
            }
            return;
        }

        // If form is valid, submit it
        submitForm();
    });

    // Real-time validation with improved accessibility
    const formFields = contactForm.querySelectorAll('input, select, textarea, [role="checkbox"]');
    
    formFields.forEach(field => {
        // For text inputs
        if (field.type !== 'checkbox' && field.type !== 'radio') {
            field.addEventListener('input', function() {
                validateField(this);
            });

            field.addEventListener('blur', function() {
                validateField(this);
            });
        }
        
        // For checkboxes
        if (field.type === 'checkbox') {
            field.addEventListener('change', function() {
                validateField(this);
            });
        }
    });

    // Custom validation for message length
    const messageField = document.getElementById('message');
    if (messageField) {
        messageField.addEventListener('input', function() {
            validateMessageLength(this);
        });
    }

    // Submit form function
    function submitForm() {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-disabled', 'true');
        spinner.classList.remove('d-none');
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Отправка...';

        // Announce loading to screen readers
        announceToScreenReader('Отправка формы...');

        // Simulate form submission
        setTimeout(() => {
            // Hide loading state
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-disabled');
            spinner.classList.add('d-none');
            submitBtn.innerHTML = 'Отправить сообщение';

            // Show success message
            if (successMessage) {
                successMessage.classList.add('show');
                successMessage.setAttribute('role', 'alert');
                successMessage.setAttribute('aria-live', 'assertive');
                
                // Focus success message for screen readers
                successMessage.focus();
                
                // Announce success to screen readers
                announceToScreenReader('Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.');
            }

            // Reset form
            contactForm.reset();
            contactForm.classList.remove('was-validated');
            
            // Clear all error states
            formFields.forEach(field => {
                field.classList.remove('is-valid', 'is-invalid');
                field.removeAttribute('aria-invalid');
            });

            // Log form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                agreeTerms: document.getElementById('agreeTerms').checked
            };
            
            console.log('Form submitted:', formData);
            
            // Show success modal after a delay
            setTimeout(() => {
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
            }, 1000);
        }, 2000);
    }

    // Validate individual field with improved accessibility
    function validateField(field) {
        const fieldId = field.id;
        const errorElement = document.getElementById(fieldId + 'Error');
        
        let isValid = field.checkValidity();
        
        // Additional validation for specific fields
        if (field.type === 'email' && field.value) {
            isValid = validateEmail(field.value);
        }
        
        if (fieldId === 'message' && field.value) {
            isValid = field.value.length >= 10;
        }
        
        if (field.type === 'checkbox' && field.required) {
            isValid = field.checked;
        }

        // Update field state
        if (field.value === '' && !field.required) {
            // Clear states for optional empty fields
            field.classList.remove('is-valid', 'is-invalid');
            field.removeAttribute('aria-invalid');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        } else if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            field.removeAttribute('aria-invalid');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            field.setAttribute('aria-invalid', 'true');
            if (errorElement) {
                errorElement.classList.add('show');
            }
        }
    }

    // Validate entire form
    function validateForm() {
        let isValid = true;
        
        formFields.forEach(field => {
            if (field.required || field.id === 'email' || field.id === 'message') {
                validateField(field);
                if (field.classList.contains('is-invalid')) {
                    isValid = false;
                }
            }
        });
        
        return isValid;
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
            field.setAttribute('aria-invalid', 'true');
        } else if (field.value && isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            field.removeAttribute('aria-invalid');
        } else {
            field.classList.remove('is-invalid');
            field.classList.remove('is-valid');
            field.removeAttribute('aria-invalid');
        }
    }

    // Function to announce messages to screen readers
    function announceToScreenReader(message, priority = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.classList.add('visually-hidden');
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Reset form validation on reset
    contactForm.addEventListener('reset', function() {
        contactForm.classList.remove('was-validated');
        formFields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
            field.removeAttribute('aria-invalid');
        });
        
        // Hide all error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
        
        // Hide success message
        if (successMessage) {
            successMessage.classList.remove('show');
        }
        
        // Announce reset to screen readers
        announceToScreenReader('Форма сброшена');
    });

    // Add keyboard navigation improvements
    document.addEventListener('keydown', function(event) {
        // Close modals with Escape
        if (event.key === 'Escape') {
            const modal = document.querySelector('.modal.show');
            if (modal) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                    announceToScreenReader('Модальное окно закрыто');
                }
            }
        }
        
        // Submit form with Ctrl + Enter
        if (event.ctrlKey && event.key === 'Enter') {
            if (contactForm && document.activeElement.closest('form') === contactForm) {
                contactForm.requestSubmit();
            }
        }
    });

    // Improve focus management for modal
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
        modalElement.addEventListener('shown.bs.modal', function() {
            const closeButton = this.querySelector('.btn-primary[data-bs-dismiss="modal"]');
            if (closeButton) {
                closeButton.focus();
            }
        });
        
        modalElement.addEventListener('hidden.bs.modal', function() {
            // Return focus to the element that opened the modal
            const triggerButton = document.querySelector('[data-bs-target="#successModal"]');
            if (triggerButton) {
                triggerButton.focus();
            }
        });
    }

    // Add hover effects to social links with improved accessibility
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Add focus styles
        link.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Initialize form validation on page load
    validateForm();
});
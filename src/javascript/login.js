// Password Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // Form Validation
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, digite um email válido.');
                return;
            }
            
            // Validate password
            if (senha === '') {
                alert('Por favor, digite sua senha.');
                return;
            }
            
            // If all validations pass
            alert('Login realizado com sucesso!');
            // Here you would typically send the data to your backend
            // loginForm.submit();
        });
    }
    
    // Social Login Buttons
    const btnGoogle = document.querySelector('.btn-google');
    const btnFacebook = document.querySelector('.btn-facebook');
    
    if (btnGoogle) {
        btnGoogle.addEventListener('click', function() {
            alert('Login com Google será implementado em breve!');
            // Here you would integrate with Google OAuth
        });
    }
    
    if (btnFacebook) {
        btnFacebook.addEventListener('click', function() {
            alert('Login com Facebook será implementado em breve!');
            // Here you would integrate with Facebook OAuth
        });
    }
});

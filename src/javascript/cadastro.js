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
    const cadastroForm = document.getElementById('cadastroForm');
    
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;
            const terms = document.getElementById('terms').checked;
            
            // Validate name
            if (nome === '') {
                alert('Por favor, digite seu nome.');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, digite um email válido.');
                return;
            }
            
            // Validate password length
            if (senha.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }
            
            // Validate password match
            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem. Por favor, verifique.');
                return;
            }
            
            // Validate terms
            if (!terms) {
                alert('Você deve aceitar os Termos de uso e Política de Privacidade.');
                return;
            }
            
            // If all validations pass
            alert('Cadastro realizado com sucesso!');
            // Here you would typically send the data to your backend
            // cadastroForm.submit();
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

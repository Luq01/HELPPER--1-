// Profile Photo Upload
document.addEventListener('DOMContentLoaded', function() {
    const profilePhoto = document.querySelector('.profile-photo');
    const photoUpload = document.getElementById('photoUpload');
    
    if (profilePhoto && photoUpload) {
        profilePhoto.addEventListener('click', function() {
            photoUpload.click();
        });
        
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePhoto.style.backgroundImage = `url(${event.target.result})`;
                    profilePhoto.style.backgroundSize = 'cover';
                    profilePhoto.style.backgroundPosition = 'center';
                    profilePhoto.innerHTML = '';
                    alert('Foto de perfil atualizada com sucesso!');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Edit Profile Name
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profileName = document.getElementById('profileName');
    
    if (editProfileBtn && profileName) {
        editProfileBtn.addEventListener('click', function() {
            const currentName = profileName.textContent;
            const newName = prompt('Digite o novo nome:', currentName);
            
            if (newName && newName.trim() !== '') {
                profileName.textContent = newName.trim();
                alert('Nome atualizado com sucesso!');
            }
        });
    }
    
    // Modal Management
    const addressModal = document.getElementById('addressModal');
    const dataModal = document.getElementById('dataModal');
    const editInfoBtns = document.querySelectorAll('.edit-info-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Open Modals
    editInfoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section === 'address') {
                addressModal.classList.add('active');
            } else if (section === 'data') {
                dataModal.classList.add('active');
            }
        });
    });
    
    // Close Modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            addressModal.classList.remove('active');
            dataModal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === addressModal) {
            addressModal.classList.remove('active');
        }
        if (e.target === dataModal) {
            dataModal.classList.remove('active');
        }
    });
    
    // Save Address
    const saveAddressBtn = document.getElementById('saveAddressBtn');
    const addressContent = document.getElementById('addressContent');
    
    if (saveAddressBtn) {
        saveAddressBtn.addEventListener('click', function() {
            const cep = document.getElementById('cep').value.trim();
            const rua = document.getElementById('rua').value.trim();
            const numero = document.getElementById('numero').value.trim();
            const complemento = document.getElementById('complemento').value.trim();
            const bairro = document.getElementById('bairro').value.trim();
            const cidade = document.getElementById('cidade').value.trim();
            const estado = document.getElementById('estado').value.trim();
            
            if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Update address content
            let addressHTML = `
                <p><strong>CEP:</strong> ${cep}</p>
                <p><strong>Endereço:</strong> ${rua}, ${numero}${complemento ? ' - ' + complemento : ''}</p>
                <p><strong>Bairro:</strong> ${bairro}</p>
                <p><strong>Cidade/Estado:</strong> ${cidade} - ${estado}</p>
            `;
            
            addressContent.innerHTML = addressHTML;
            addressModal.classList.remove('active');
            alert('Endereço salvo com sucesso!');
        });
    }
    
    // Save Personal Data
    const saveDataBtn = document.getElementById('saveDataBtn');
    const dataContent = document.getElementById('dataContent');
    
    if (saveDataBtn) {
        saveDataBtn.addEventListener('click', function() {
            const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
            const cpf = document.getElementById('cpf').value.trim();
            const dataNascimento = document.getElementById('dataNascimento').value;
            const telefone = document.getElementById('telefone').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (!nomeCompleto || !cpf || !dataNascimento || !telefone || !email) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, digite um email válido.');
                return;
            }
            
            // Format date
            const date = new Date(dataNascimento);
            const formattedDate = date.toLocaleDateString('pt-BR');
            
            // Update data content
            let dataHTML = `
                <p><strong>Nome:</strong> ${nomeCompleto}</p>
                <p><strong>CPF:</strong> ${cpf}</p>
                <p><strong>Data de Nascimento:</strong> ${formattedDate}</p>
                <p><strong>Telefone:</strong> ${telefone}</p>
                <p><strong>Email:</strong> ${email}</p>
            `;
            
            dataContent.innerHTML = dataHTML;
            
            // Update profile name
            if (profileName) {
                profileName.textContent = nomeCompleto;
            }
            
            dataModal.classList.remove('active');
            alert('Dados salvos com sucesso!');
        });
    }
    
    // Input Masks
    const cepInput = document.getElementById('cep');
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);
            if (value.length > 5) {
                value = value.slice(0, 5) + '-' + value.slice(5);
            }
            e.target.value = value;
        });
    }
    
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 9) {
                value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6, 9) + '-' + value.slice(9);
            } else if (value.length > 6) {
                value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6);
            } else if (value.length > 3) {
                value = value.slice(0, 3) + '.' + value.slice(3);
            }
            e.target.value = value;
        });
    }
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 10) {
                value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
            } else if (value.length > 6) {
                value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 6) + '-' + value.slice(6);
            } else if (value.length > 2) {
                value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
            }
            e.target.value = value;
        });
    }
});

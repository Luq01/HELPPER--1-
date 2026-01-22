// Upload de foto de perfil
const profilePhoto = document.getElementById('profilePhoto');
const photoInput = document.getElementById('photoInput');
const displayName = document.getElementById('displayName');
const nameInput = document.getElementById('nameInput');

// Click na foto para upload
profilePhoto.addEventListener('click', () => {
    photoInput.click();
});

// Preview da foto
photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Validar tipo de arquivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG ou JPEG).');
            return;
        }

        // Validar tamanho (máx 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('O arquivo é muito grande. O tamanho máximo permitido é 5MB.');
            return;
        }

        // Ler e exibir preview
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePhoto.innerHTML = `<img src="${e.target.result}" alt="Foto de Perfil">`;
        };
        reader.readAsDataURL(file);
    }
});

// Atualizar nome em tempo real
nameInput.addEventListener('input', (e) => {
    let value = e.target.value;
    // Permitir apenas letras e espaços
    value = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    nameInput.value = value;
    
    // Atualizar o nome no header
    displayName.textContent = value || 'Seu Nome';
});

// Máscara para CPF
const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) {
        value = value.substring(0, 3) + '.' + value.substring(3);
    }
    if (value.length > 7) {
        value = value.substring(0, 7) + '.' + value.substring(7);
    }
    if (value.length > 11) {
        value = value.substring(0, 11) + '-' + value.substring(11, 13);
    }
    e.target.value = value;
});

// Validação de CPF em tempo real
cpfInput.addEventListener('blur', (e) => {
    const cpf = e.target.value;
    if (cpf && !validarCPF(cpf)) {
        alert('CPF inválido! Por favor, verifique o número digitado.');
        cpfInput.focus();
        cpfInput.style.borderColor = '#dc3545';
    } else if (cpf) {
        cpfInput.style.borderColor = '#28a745';
    } else {
        cpfInput.style.borderColor = '#e0e0e0';
    }
});

// Máscara para Telefone
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = '(' + value;
    }
    if (value.length > 3) {
        value = value.substring(0, 3) + ') ' + value.substring(3);
    }
    if (value.length > 10) {
        value = value.substring(0, 10) + '-' + value.substring(10, 14);
    }
    e.target.value = value;
});

// Validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) {
        return false;
    }

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}

// Validação de Email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validação de data de nascimento
const dataNascimentoInput = document.getElementById('dataNascimento');
dataNascimentoInput.addEventListener('change', (e) => {
    const dataSelecionada = new Date(e.target.value);
    const hoje = new Date();
    
    if (dataSelecionada > hoje) {
        alert('A data de nascimento não pode ser futura.');
        e.target.value = '';
        return;
    }

    // Verificar idade mínima (18 anos)
    const idade = hoje.getFullYear() - dataSelecionada.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = dataSelecionada.getMonth();
    
    if (idade < 18 || (idade === 18 && mesAtual < mesNascimento)) {
        alert('Você deve ter pelo menos 18 anos para se cadastrar.');
        e.target.value = '';
    }
});

// Botão Cancelar
const cancelBtn = document.getElementById('cancelBtn');
cancelBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja cancelar as alterações?')) {
        window.location.href = 'perfil-cliente-view.html';
    }
});

// Botão Salvar
const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', () => {
    // Validar campos obrigatórios
    const name = nameInput.value.trim();
    const cpf = cpfInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const email = document.getElementById('email').value.trim();
    const dataNascimento = dataNascimentoInput.value;

    // Validar nome
    if (!name || name.length < 3) {
        alert('Por favor, insira um nome válido (mínimo 3 caracteres).');
        nameInput.focus();
        return;
    }

    // Validar CPF (obrigatório)
    if (!cpf) {
        alert('Por favor, preencha o CPF.');
        cpfInput.focus();
        return;
    }

    if (!validarCPF(cpf)) {
        alert('Por favor, insira um CPF válido.');
        cpfInput.focus();
        return;
    }

    // Validar telefone (obrigatório)
    if (!telefone || telefone.replace(/\D/g, '').length < 10) {
        alert('Por favor, insira um telefone válido.');
        telefoneInput.focus();
        return;
    }

    // Validar email (obrigatório)
    if (!email || !validarEmail(email)) {
        alert('Por favor, insira um e-mail válido.');
        document.getElementById('email').focus();
        return;
    }

    // Validar data de nascimento (obrigatório)
    if (!dataNascimento) {
        alert('Por favor, preencha a data de nascimento.');
        dataNascimentoInput.focus();
        return;
    }

    // Coletar dados do formulário
    const profileData = {
        name: name,
        personalData: {
            cpf: cpf,
            telefone: telefone,
            email: email,
            dataNascimento: dataNascimento
        }
    };

    // Aqui você enviaria os dados para o servidor
    console.log('Dados do perfil do cliente:', profileData);
    console.log('CPF validado com sucesso!');

    // Simular salvamento
    alert('Perfil atualizado com sucesso!\nCPF validado: ' + cpf);
    
    // Redirecionar para visualização
    window.location.href = 'perfil-cliente-view.html';
});

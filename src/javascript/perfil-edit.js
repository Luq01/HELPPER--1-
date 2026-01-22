$(document).ready(function() {
    // Upload de foto de perfil
    $('.profile-photo.editable').click(function() {
        $('#photo-upload').click();
    });

    $('#photo-upload').change(function(e) {
        const file = e.target.files[0];
        if (file) {
            handlePhotoUpload(file, '#profile-image');
        }
    });

    // Upload de trabalhos
    $('.work-placeholder').click(function() {
        $(this).find('.work-upload').click();
    });

    $('.work-upload').change(function(e) {
        const file = e.target.files[0];
        const placeholder = $(this).parent();
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                placeholder.css({
                    'background-image': `url(${e.target.result})`,
                    'background-size': 'cover',
                    'background-position': 'center'
                });
                placeholder.find('i').hide();
            };
            reader.readAsDataURL(file);
        }
    });

    // Função para processar upload de foto
    function handlePhotoUpload(file, targetSelector) {
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
        reader.onload = function(e) {
            $(targetSelector).attr('src', e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Botão Cancelar
    $('.btn-cancel').click(function() {
        if (confirm('Tem certeza que deseja cancelar as alterações?')) {
            window.location.href = 'perfil-profissional-view.html';
        }
    });

    // Botão Salvar
    $('.btn-save').click(function() {
        // Validar campos obrigatórios
        const name = $('#profile-name-input').val().trim();
        const aboutMe = $('.edit-textarea').eq(0).val().trim();
        const experience = $('.edit-textarea').eq(1).val().trim();

        // Validar nome
        if (!name || name.length < 3) {
            alert('Por favor, insira um nome válido (mínimo 3 caracteres).');
            $('#profile-name-input').focus();
            return;
        }

        // Coletar dados do formulário
        const profileData = {
            name: name,
            aboutMe: aboutMe,
            experience: experience,
            photo: $('#profile-image').attr('src')
        };

        // Aqui você enviaria os dados para o servidor
        console.log('Dados do perfil:', profileData);

        // Simular salvamento
        alert('Perfil atualizado com sucesso!');
        
        // Redirecionar para visualização
        window.location.href = 'perfil-profissional-view.html';
    });

    // Contador de caracteres para textareas
    $('.edit-textarea').on('input', function() {
        const maxLength = $(this).attr('maxlength');
        const currentLength = $(this).val().length;
        
        // Você pode adicionar um contador visual aqui se desejar
        console.log(`${currentLength}/${maxLength} caracteres`);
    });

    // Botão Preencher Currículo
    $('.btn-add').eq(0).click(function() {
        alert('Funcionalidade de preenchimento de currículo em desenvolvimento');
        // Aqui você pode abrir um modal ou redirecionar para uma página de currículo
    });

    // Botão Adicionar Fotos
    $('.btn-add').eq(1).click(function() {
        // Simular clique no primeiro placeholder de upload
        $('.work-upload').first().click();
    });

    // Validação do nome em tempo real e atualização do header
    $('#profile-name-input').on('input', function() {
        let value = $(this).val();
        // Permitir apenas letras e espaços
        value = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        $(this).val(value);
        
        // Atualizar o nome no header em tempo real
        const displayName = value.trim() || 'Seu Nome';
        $('.profile-name h1').text(displayName);
    });

    // Prevenir envio de informações de contato
    $('.edit-textarea').on('blur', function() {
        const text = $(this).val().toLowerCase();
        const forbiddenPatterns = [
            /\b\d{10,11}\b/, // Telefone
            /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/, // Email
            /whatsapp/i,
            /telegram/i,
            /instagram/i,
            /facebook/i,
            /http/i,
            /www\./i
        ];

        let hasForbidden = false;
        forbiddenPatterns.forEach(pattern => {
            if (pattern.test(text)) {
                hasForbidden = true;
            }
        });

        if (hasForbidden) {
            alert('Atenção: Não é permitido incluir informações de contato ou links externos no perfil.');
            // Opcional: limpar o campo ou destacar o erro
        }
    });
});

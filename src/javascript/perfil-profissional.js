$(document).ready(function() {
    // Array para armazenar os trabalhos (fotos e vídeos)
    let trabalhos = [];

    // Upload de foto de perfil
    $('.profile-photo').click(function() {
        $('#photoUpload').click();
    });

    $('#photoUpload').change(function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('.profile-photo').html(`<img src="${e.target.result}" alt="Foto de perfil" style="width: 100%; height: 100%; object-fit: cover;">`);
            };
            reader.readAsDataURL(file);
        }
    });

    // Modal de edição de perfil
    $('#editProfileBtn').click(function() {
        // Preencher campos com dados atuais
        $('#editName').val($('#profileName').text());
        $('#editSpecialty').val($('#profileSpecialty').text());
        $('#editPhone').val($('#profilePhone').text().replace(/[^\d]/g, ''));
        $('#editAbout').val($('#aboutText').val());
        
        $('#editModal').addClass('active');
        $('body').css('overflow', 'hidden');
    });

    $('#closeModal, #cancelEdit').click(function() {
        $('#editModal').removeClass('active');
        $('body').css('overflow', 'auto');
    });

    // Fechar modal ao clicar fora
    $('#editModal').click(function(e) {
        if ($(e.target).is('#editModal')) {
            $('#editModal').removeClass('active');
            $('body').css('overflow', 'auto');
        }
    });

    // Salvar edições do perfil
    $('#editProfileForm').submit(function(e) {
        e.preventDefault();
        
        const nome = $('#editName').val();
        const especialidade = $('#editSpecialty').val();
        const telefone = $('#editPhone').val();
        const sobre = $('#editAbout').val();
        
        // Atualizar interface
        $('#profileName').text(nome);
        $('#profileSpecialty').text(especialidade);
        $('#profilePhone').html(`<i class="fa-solid fa-phone"></i> ${formatarTelefone(telefone)}`);
        $('#aboutText').val(sobre);
        
        // Atualizar link do WhatsApp
        $('#whatsappBtn').attr('href', `https://wa.me/55${telefone.replace(/\D/g, '')}`);
        
        // Fechar modal
        $('#editModal').removeClass('active');
        $('body').css('overflow', 'auto');
        
        alert('Perfil atualizado com sucesso!');
        
        // Aqui você enviaria os dados para o servidor
        // $.ajax({ ... });
    });

    // Formatar telefone
    function formatarTelefone(telefone) {
        const numeros = telefone.replace(/\D/g, '');
        if (numeros.length === 11) {
            return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`;
        }
        return telefone;
    }

    // Máscara de telefone no modal
    $('#editPhone').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        }
        
        $(this).val(value);
    });

    // Salvar "Sobre mim"
    $('#saveAboutBtn').click(function() {
        const sobre = $('#aboutText').val();
        
        if (sobre.trim() === '') {
            alert('Por favor, escreva algo sobre você.');
            return;
        }
        
        alert('Informações salvas com sucesso!');
        
        // Aqui você enviaria os dados para o servidor
        // $.ajax({ ... });
    });

    // ========================================
    // SEÇÃO DE TRABALHOS (FOTOS E VÍDEOS)
    // ========================================

    // Abrir seletor de arquivos
    $('#addWorkBtn').click(function() {
        $('#workUpload').click();
    });

    // Processar arquivos selecionados
    $('#workUpload').change(function(e) {
        const files = e.target.files;
        
        if (files.length === 0) return;
        
        // Processar cada arquivo
        Array.from(files).forEach(file => {
            // Verificar tipo de arquivo
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            
            if (!isImage && !isVideo) {
                alert(`Arquivo ${file.name} não é uma imagem ou vídeo válido.`);
                return;
            }
            
            // Verificar tamanho (máximo 50MB para vídeos, 10MB para imagens)
            const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
            if (file.size > maxSize) {
                alert(`Arquivo ${file.name} é muito grande. Máximo: ${isVideo ? '50MB' : '10MB'}`);
                return;
            }
            
            // Ler arquivo
            const reader = new FileReader();
            reader.onload = function(e) {
                const trabalho = {
                    type: isImage ? 'image' : 'video',
                    src: e.target.result,
                    name: file.name
                };
                
                trabalhos.push(trabalho);
                adicionarTrabalhoNaGaleria(trabalho);
            };
            reader.readAsDataURL(file);
        });
        
        // Limpar input
        $(this).val('');
    });

    // Adicionar trabalho na galeria
    function adicionarTrabalhoNaGaleria(trabalho) {
        const gallery = $('.work-gallery');
        
        // Remover placeholders se existirem
        if (gallery.find('.work-item i').length > 0) {
            gallery.empty();
        }
        
        let itemHtml = '';
        
        if (trabalho.type === 'image') {
            itemHtml = `
                <div class="work-item uploaded" data-index="${trabalhos.length - 1}">
                    <img src="${trabalho.src}" alt="${trabalho.name}">
                    <button class="remove-work-btn" title="Remover">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
        } else if (trabalho.type === 'video') {
            itemHtml = `
                <div class="work-item uploaded video-item" data-index="${trabalhos.length - 1}">
                    <video src="${trabalho.src}" controls></video>
                    <div class="video-overlay">
                        <i class="fa-solid fa-play"></i>
                    </div>
                    <button class="remove-work-btn" title="Remover">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
        }
        
        gallery.append(itemHtml);
        
        // Adicionar evento de remoção
        gallery.find('.work-item').last().find('.remove-work-btn').click(function(e) {
            e.stopPropagation();
            removerTrabalho($(this).closest('.work-item'));
        });
    }

    // Remover trabalho
    function removerTrabalho(item) {
        if (confirm('Deseja realmente remover este trabalho?')) {
            const index = item.data('index');
            trabalhos.splice(index, 1);
            item.remove();
            
            // Reindexar itens restantes
            $('.work-item.uploaded').each(function(i) {
                $(this).attr('data-index', i);
            });
            
            // Se não houver mais trabalhos, adicionar placeholders
            if (trabalhos.length === 0) {
                $('.work-gallery').html(`
                    <div class="work-item">
                        <i class="fa-solid fa-camera"></i>
                    </div>
                    <div class="work-item">
                        <i class="fa-solid fa-video"></i>
                    </div>
                    <div class="work-item">
                        <i class="fa-solid fa-camera"></i>
                    </div>
                    <div class="work-item">
                        <i class="fa-solid fa-camera"></i>
                    </div>
                    <div class="work-item">
                        <i class="fa-solid fa-video"></i>
                    </div>
                `);
            }
            
            alert('Trabalho removido com sucesso!');
        }
    }

    // Visualizar trabalho em tela cheia (opcional)
    $(document).on('click', '.work-item.uploaded img, .work-item.uploaded video', function() {
        const src = $(this).attr('src');
        const isVideo = $(this).is('video');
        
        // Criar modal de visualização
        const modalHtml = `
            <div class="work-viewer-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            ">
                <button class="close-viewer" style="
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.5rem;
                    z-index: 10001;
                ">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                ${isVideo ? 
                    `<video src="${src}" controls autoplay style="max-width: 90%; max-height: 90%; border-radius: 10px;"></video>` :
                    `<img src="${src}" style="max-width: 90%; max-height: 90%; border-radius: 10px;">`
                }
            </div>
        `;
        
        $('body').append(modalHtml);
        $('body').css('overflow', 'hidden');
        
        // Fechar visualizador
        $('.close-viewer, .work-viewer-modal').click(function(e) {
            if ($(e.target).is('.work-viewer-modal') || $(e.target).closest('.close-viewer').length) {
                $('.work-viewer-modal').remove();
                $('body').css('overflow', 'auto');
            }
        });
    });

    // Função para obter todos os trabalhos (para enviar ao servidor)
    window.getTrabalhos = function() {
        return trabalhos;
    };

    // Função para salvar trabalhos no servidor (exemplo)
    window.salvarTrabalhos = function() {
        if (trabalhos.length === 0) {
            alert('Adicione pelo menos um trabalho antes de salvar.');
            return;
        }
        
        // Aqui você enviaria os trabalhos para o servidor
        console.log('Trabalhos a serem salvos:', trabalhos);
        
        // Exemplo de envio via AJAX:
        /*
        const formData = new FormData();
        trabalhos.forEach((trabalho, index) => {
            // Converter base64 para blob
            fetch(trabalho.src)
                .then(res => res.blob())
                .then(blob => {
                    formData.append(`trabalho_${index}`, blob, trabalho.name);
                });
        });
        
        $.ajax({
            url: '/api/profissionais/upload-trabalhos',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                alert('Trabalhos salvos com sucesso!');
            },
            error: function() {
                alert('Erro ao salvar trabalhos');
            }
        });
        */
        
        alert('Trabalhos salvos com sucesso! (simulação)');
    };
});

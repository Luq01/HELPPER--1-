$(document).ready(function() {
    // Mobile menu toggle
    $('#mobile_barras').click(function() {
        $('#mobile_menu').toggleClass('active');
        $('#mobile_barras').toggleClass('active');
    });

    // Modal de Contratação - Funcionalidade
    let selectedProfessional = null;

    // Abrir modal ao clicar em "Contratar Serviço"
    $('.hire-button').click(function() {
        const card = $(this).closest('.professional-card');
        
        // Capturar informações do profissional
        const profName = card.find('.profile-info h3').text();
        const profProfession = card.find('.profile-info .profession').text();
        const profPhoto = card.find('.profile-photo img').attr('src');
        const profRating = card.find('.rating-count').text();
        const profLocation = card.find('.card-detail span').first().text();
        const profStars = card.find('.rating .stars').html();
        
        // Dados simulados do perfil (em produção, viriam do backend/perfil do profissional)
        const profAbout = card.data('about') || 'Profissional experiente com anos de atuação na área. Comprometido com a qualidade e satisfação do cliente. Atendimento personalizado e trabalho de excelência.';
        
        // Trabalhos realizados (fotos/vídeos do perfil)
        const profWorks = card.data('works') || [
            { type: 'image', src: '../src/images perfil/pedreiro.png' },
            { type: 'image', src: '../src/images perfil/Eletricista.png' },
            { type: 'image', src: '../src/images perfil/Pintor.png' }
        ];
        
        // Armazenar dados do profissional selecionado
        selectedProfessional = {
            name: profName,
            profession: profProfession,
            photo: profPhoto,
            rating: profRating,
            location: profLocation,
            stars: profStars,
            about: profAbout,
            works: profWorks
        };
        
        // Preencher modal com informações do profissional
        $('#modal-prof-name').text(profName);
        $('#modal-prof-profession').text(profProfession);
        $('#modal-prof-photo').attr('src', profPhoto);
        $('#modal-prof-rating').text(profRating);
        $('#modal-prof-location').text(profLocation);
        $('#modal-prof-stars').html(profStars);
        
        // Preencher "Sobre o Profissional"
        $('#modal-prof-about').text(profAbout);
        
        // Preencher "Trabalhos Realizados"
        const worksGrid = $('#modal-prof-works');
        worksGrid.empty();
        
        profWorks.forEach(function(work) {
            if (work.type === 'image') {
                worksGrid.append(`
                    <div class="work-item">
                        <img src="${work.src}" alt="Trabalho realizado">
                    </div>
                `);
            } else if (work.type === 'video') {
                worksGrid.append(`
                    <div class="work-item">
                        <video src="${work.src}" controls></video>
                        <div class="video-overlay">
                            <i class="fa-solid fa-play"></i>
                        </div>
                    </div>
                `);
            }
        });
        
        // Se não houver trabalhos, mostrar mensagem
        if (profWorks.length === 0) {
            worksGrid.append(`
                <div class="no-works-message">
                    <i class="fa-solid fa-image"></i>
                    <p>Nenhum trabalho cadastrado ainda</p>
                </div>
            `);
        }
        
        // Abrir modal
        $('#hire-modal').addClass('active');
        $('body').addClass('modal-open');
    });

    // Fechar modal ao clicar no X
    $('#close-modal').click(function() {
        closeModal();
    });

    // Fechar modal ao clicar no botão Cancelar
    $('#cancel-hire').click(function() {
        closeModal();
    });

    // Fechar modal ao clicar fora do container
    $('#hire-modal').click(function(e) {
        if ($(e.target).is('#hire-modal')) {
            closeModal();
        }
    });

    // Função para fechar modal
    function closeModal() {
        $('#hire-modal').removeClass('active');
        $('body').removeClass('modal-open');
        $('#hire-form')[0].reset();
        
        // Limpar foto selecionada
        selectedPhoto = null;
        $('#problem-photo').val('');
        $('#photo-preview').attr('src', '');
        $('#photo-preview-container').hide();
        $('#photo-upload-area').show();
        
        selectedProfessional = null;
    }

    // Prevenir fechamento ao clicar dentro do modal
    $('.modal-container').click(function(e) {
        e.stopPropagation();
    });

    // ========================================
    // FUNCIONALIDADE DE UPLOAD DE FOTO
    // ========================================
    
    let selectedPhoto = null;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB em bytes
    
    // Abrir seletor de arquivo ao clicar na área de upload
    $('#photo-upload-area').click(function() {
        $('#problem-photo').click();
    });
    
    // Processar arquivo selecionado
    $('#problem-photo').change(function(e) {
        const file = e.target.files[0];
        if (file) {
            handlePhotoUpload(file);
        }
    });
    
    // Drag and Drop - Prevenir comportamento padrão
    $('#photo-upload-area').on('dragover dragenter', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('drag-over');
    });
    
    $('#photo-upload-area').on('dragleave dragend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('drag-over');
    });
    
    // Drag and Drop - Processar arquivo solto
    $('#photo-upload-area').on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('drag-over');
        
        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            handlePhotoUpload(files[0]);
        }
    });
    
    // Função para processar upload de foto
    function handlePhotoUpload(file) {
        // Validar tipo de arquivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG ou JPEG).');
            return;
        }
        
        // Validar tamanho do arquivo
        if (file.size > MAX_FILE_SIZE) {
            alert('O arquivo é muito grande. O tamanho máximo permitido é 5MB.');
            return;
        }
        
        // Ler arquivo e mostrar preview
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedPhoto = {
                file: file,
                dataUrl: e.target.result,
                name: file.name,
                size: file.size
            };
            
            // Mostrar preview
            $('#photo-preview').attr('src', e.target.result);
            $('#photo-upload-area').hide();
            $('#photo-preview-container').show();
        };
        reader.readAsDataURL(file);
    }
    
    // Remover foto
    $('#remove-photo-btn').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        selectedPhoto = null;
        $('#problem-photo').val('');
        $('#photo-preview').attr('src', '');
        $('#photo-preview-container').hide();
        $('#photo-upload-area').show();
    });
    
    // Submissão do formulário
    $('#hire-form').submit(function(e) {
        e.preventDefault();
        
        // Capturar dados do formulário
        const formData = {
            professional: selectedProfessional,
            serviceDescription: $('#service-description').val(),
            problemPhoto: selectedPhoto,
            serviceDate: $('#service-date').val(),
            serviceTime: $('#service-time').val(),
            contactName: $('#contact-name').val(),
            contactPhone: $('#contact-phone').val(),
            contactEmail: $('#contact-email').val()
        };
        
        // Aqui você pode enviar os dados para o servidor
        console.log('Dados da contratação:', formData);
        
        // Mensagem de sucesso com informação sobre foto
        let successMessage = `Solicitação de contratação enviada com sucesso!\n\nProfissional: ${selectedProfessional.name}\nProblema: ${formData.serviceDescription.substring(0, 50)}...`;
        
        if (selectedPhoto) {
            successMessage += `\nFoto anexada: ${selectedPhoto.name}`;
        }
        
        successMessage += '\n\nEntraremos em contato em breve!';
        
        alert(successMessage);
        
        // Fechar modal
        closeModal();
    });

    // Máscara para telefone (formato brasileiro)
    $('#contact-phone').on('input', function() {
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

    // Definir data mínima como hoje
    const today = new Date().toISOString().split('T')[0];
    $('#service-date').attr('min', today);

    // Modal de Localização - Funcionalidade
    let currentLocation = 'Cidade';

    // Abrir modal de localização pelo botão de filtro
    $('#location-filter').click(function() {
        $('#location-modal').addClass('active');
        $('body').addClass('modal-open');
    });

    // Abrir modal de localização pelo ícone do header
    $('#header-map-icon').click(function() {
        $('#location-modal').addClass('active');
        $('body').addClass('modal-open');
    });

    // Fechar modal de localização
    $('#close-location-modal').click(function() {
        closeLocationModal();
    });

    // Fechar ao clicar fora do modal
    $('#location-modal').click(function(e) {
        if ($(e.target).is('#location-modal')) {
            closeLocationModal();
        }
    });

    // Prevenir fechamento ao clicar dentro do modal
    $('.location-modal-container').click(function(e) {
        e.stopPropagation();
    });

    // Função para fechar modal de localização
    function closeLocationModal() {
        $('#location-modal').removeClass('active');
        $('body').removeClass('modal-open');
        $('#location-search-input').val('');
        $('.location-item').show();
    }

    // Selecionar localização
    $('.location-item').click(function() {
        const location = $(this).data('location');
        
        // Remover seleção anterior
        $('.location-item').removeClass('selected');
        
        // Adicionar seleção atual
        $(this).addClass('selected');
        
        // Atualizar botão
        currentLocation = location;
        $('#location-filter').text(location);
        
        // Fechar modal após 300ms
        setTimeout(function() {
            closeLocationModal();
        }, 300);
        
        // Aqui você pode filtrar os profissionais por localização
        console.log('Localização selecionada:', location);
    });

    // Buscar localização
    $('#location-search-input').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('.location-item').each(function() {
            const locationText = $(this).find('span').text().toLowerCase();
            
            if (locationText.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});

$(document).ready(function() {
    // ========================================
    // MENU DO USUÁRIO LOGADO
    // ========================================
    
    // Simular dados do usuário (em produção, viriam do backend/sessão)
    const userData = {
        name: 'João Silva',
        type: 'cliente', // ou 'profissional'
        avatar: '../src/images perfil/modelo foto perfil.png'
    };
    
    // Atualizar informações do usuário na interface
    function updateUserInterface() {
        $('#user-name').text(userData.name);
        $('#mobile-user-name').text(userData.name);
        $('#user-avatar-img').attr('src', userData.avatar);
        $('.mobile-user-info .user-avatar img').attr('src', userData.avatar);
    }
    
    // Inicializar interface
    updateUserInterface();
    
    // Toggle do dropdown menu (Desktop)
    $('#user-profile-trigger').click(function(e) {
        e.stopPropagation();
        $(this).toggleClass('active');
        $('#user-dropdown-menu').toggleClass('active');
    });
    
    // Fechar dropdown ao clicar fora
    $(document).click(function(e) {
        if (!$(e.target).closest('.user-menu-container').length) {
            $('#user-profile-trigger').removeClass('active');
            $('#user-dropdown-menu').removeClass('active');
        }
    });
    
    // Prevenir fechamento ao clicar dentro do dropdown
    $('#user-dropdown-menu').click(function(e) {
        e.stopPropagation();
    });
    
    // ========================================
    // NAVEGAÇÃO DO MENU
    // ========================================
    
    // Menu Perfil (Desktop)
    $('#menu-perfil').click(function(e) {
        e.preventDefault();
        redirectToProfile();
    });
    
    // Menu Configurações (Desktop)
    $('#menu-configuracoes').click(function(e) {
        e.preventDefault();
        redirectToSettings();
    });
    
    // Menu Sair (Desktop)
    $('#menu-sair').click(function(e) {
        e.preventDefault();
        logout();
    });
    
    // Menu Perfil (Mobile)
    $('#mobile-menu-perfil').click(function(e) {
        e.preventDefault();
        redirectToProfile();
    });
    
    // Menu Configurações (Mobile)
    $('#mobile-menu-configuracoes').click(function(e) {
        e.preventDefault();
        redirectToSettings();
    });
    
    // Menu Sair (Mobile)
    $('#mobile-menu-sair').click(function(e) {
        e.preventDefault();
        logout();
    });
    
    // ========================================
    // FUNÇÕES DE NAVEGAÇÃO
    // ========================================
    
    function redirectToProfile() {
        // Redirecionar para o perfil correto baseado no tipo de usuário
        if (userData.type === 'cliente') {
            window.location.href = 'perfil-cliente.html';
        } else if (userData.type === 'profissional') {
            window.location.href = 'perfil-profissional.html';
        }
    }
    
    function redirectToSettings() {
        // Redirecionar para página de configurações
        // TODO: Criar página de configurações
        alert('Página de Configurações em desenvolvimento');
        // window.location.href = 'configuracoes.html';
    }
    
    function logout() {
        // Confirmar logout
        if (confirm('Tem certeza que deseja sair?')) {
            // Limpar dados de sessão (localStorage, sessionStorage, cookies, etc.)
            localStorage.removeItem('userData');
            sessionStorage.clear();
            
            // Redirecionar para página inicial
            window.location.href = '../index.html';
        }
    }
    
    // ========================================
    // VERIFICAÇÃO DE AUTENTICAÇÃO
    // ========================================
    
    // Verificar se o usuário está realmente logado
    function checkAuthentication() {
        // Em produção, verificar com o backend se a sessão é válida
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (!isLoggedIn) {
            // Se não estiver logado, redirecionar para login
            window.location.href = 'login.html';
        }
    }
    
    // Executar verificação ao carregar a página
    // checkAuthentication();
    
    // ========================================
    // ATUALIZAÇÃO DINÂMICA DO TIPO DE USUÁRIO
    // ========================================
    
    // Função para atualizar o tipo de usuário (pode ser chamada após login)
    window.setUserData = function(name, type, avatar) {
        userData.name = name;
        userData.type = type;
        userData.avatar = avatar || '../src/images perfil/modelo foto perfil.png';
        
        // Salvar no localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Atualizar interface
        updateUserInterface();
    };
    
    // Carregar dados do localStorage se existirem
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        userData.name = parsedData.name;
        userData.type = parsedData.type;
        userData.avatar = parsedData.avatar;
        updateUserInterface();
    }
});

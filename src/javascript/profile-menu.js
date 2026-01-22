$(document).ready(function() {
    // Toggle do menu dropdown
    $('#profile-menu-btn').click(function(e) {
        e.stopPropagation();
        $('#profile-dropdown').toggleClass('active');
        $(this).find('.fa-chevron-down').toggleClass('rotated');
    });

    // Fechar dropdown ao clicar fora
    $(document).click(function(e) {
        if (!$(e.target).closest('.profile-menu').length) {
            $('#profile-dropdown').removeClass('active');
            $('#profile-menu-btn').find('.fa-chevron-down').removeClass('rotated');
        }
    });

    // Prevenir fechamento ao clicar dentro do dropdown
    $('#profile-dropdown').click(function(e) {
        e.stopPropagation();
    });
});

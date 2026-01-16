// Professional Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data from localStorage
    loadProfileData();
    
    // Profile Photo Upload
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
                    const imageData = event.target.result;
                    profilePhoto.style.backgroundImage = `url(${imageData})`;
                    profilePhoto.style.backgroundSize = 'cover';
                    profilePhoto.style.backgroundPosition = 'center';
                    profilePhoto.innerHTML = '';
                    
                    // Save to localStorage
                    localStorage.setItem('profilePhoto', imageData);
                    showNotification('Foto de perfil atualizada com sucesso!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Edit Profile Modal
    const editModal = document.getElementById('editModal');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const editProfileForm = document.getElementById('editProfileForm');
    
    // Open modal
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            openEditModal();
        });
    }
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeEditModal();
        });
    }
    
    if (cancelEdit) {
        cancelEdit.addEventListener('click', function() {
            closeEditModal();
        });
    }
    
    // Close modal when clicking outside
    if (editModal) {
        editModal.addEventListener('click', function(e) {
            if (e.target === editModal) {
                closeEditModal();
            }
        });
    }
    
    // Handle form submission
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileData();
        });
    }
    
    // Save About Section
    const saveAboutBtn = document.getElementById('saveAboutBtn');
    const aboutText = document.getElementById('aboutText');
    
    if (saveAboutBtn && aboutText) {
        saveAboutBtn.addEventListener('click', function() {
            const text = aboutText.value.trim();
            if (text === '') {
                showNotification('Por favor, escreva algo sobre você antes de salvar.', 'error');
                return;
            }
            localStorage.setItem('aboutText', text);
            showNotification('Informações salvas com sucesso!', 'success');
        });
    }
    
    // Add Work Button
    const addWorkBtn = document.getElementById('addWorkBtn');
    const workUpload = document.getElementById('workUpload');
    const workGallery = document.querySelector('.work-gallery');
    
    if (addWorkBtn && workUpload) {
        addWorkBtn.addEventListener('click', function() {
            workUpload.click();
        });
        
        workUpload.addEventListener('change', function(e) {
            const files = e.target.files;
            if (files.length > 0) {
                Array.from(files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const workItem = document.createElement('div');
                        workItem.className = 'work-item';
                        workItem.style.backgroundImage = `url(${event.target.result})`;
                        workItem.style.backgroundSize = 'cover';
                        workItem.style.backgroundPosition = 'center';
                        workGallery.appendChild(workItem);
                    };
                    reader.readAsDataURL(file);
                });
                showNotification('Trabalhos adicionados com sucesso!', 'success');
            }
        });
    }
    
    // Work Item Click (View Full Size)
    if (workGallery) {
        workGallery.addEventListener('click', function(e) {
            if (e.target.classList.contains('work-item') && e.target.style.backgroundImage) {
                const imageUrl = e.target.style.backgroundImage.slice(5, -2);
                window.open(imageUrl, '_blank');
            }
        });
    }
});

// Open Edit Modal
function openEditModal() {
    const modal = document.getElementById('editModal');
    const profileName = document.getElementById('profileName').textContent;
    const profileSpecialty = document.getElementById('profileSpecialty').textContent;
    const profilePhone = document.getElementById('profilePhone').textContent.replace(/[^\d]/g, '');
    const aboutText = document.getElementById('aboutText').value;
    
    // Populate form with current data
    document.getElementById('editName').value = profileName;
    document.getElementById('editSpecialty').value = profileSpecialty;
    document.getElementById('editPhone').value = profilePhone;
    document.getElementById('editAbout').value = aboutText;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Edit Modal
function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Save Profile Data
function saveProfileData() {
    const name = document.getElementById('editName').value.trim();
    const specialty = document.getElementById('editSpecialty').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const about = document.getElementById('editAbout').value.trim();
    
    if (!name || !specialty || !phone) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Update profile display
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileSpecialty').textContent = specialty;
    document.getElementById('profilePhone').innerHTML = `<i class="fa-solid fa-phone"></i> ${formatPhone(phone)}`;
    document.getElementById('aboutText').value = about;
    
    // Update WhatsApp link
    const whatsappBtn = document.getElementById('whatsappBtn');
    const cleanPhone = phone.replace(/\D/g, '');
    whatsappBtn.href = `https://wa.me/55${cleanPhone}`;
    
    // Save to localStorage
    const profileData = {
        name: name,
        specialty: specialty,
        phone: phone,
        about: about
    };
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    closeEditModal();
    showNotification('Perfil atualizado com sucesso!', 'success');
}

// Load Profile Data from localStorage
function loadProfileData() {
    // Load profile data
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('profileName').textContent = data.name;
        document.getElementById('profileSpecialty').textContent = data.specialty;
        document.getElementById('profilePhone').innerHTML = `<i class="fa-solid fa-phone"></i> ${formatPhone(data.phone)}`;
        document.getElementById('aboutText').value = data.about;
        
        // Update WhatsApp link
        const whatsappBtn = document.getElementById('whatsappBtn');
        const cleanPhone = data.phone.replace(/\D/g, '');
        whatsappBtn.href = `https://wa.me/55${cleanPhone}`;
    }
    
    // Load profile photo
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
        const profilePhoto = document.querySelector('.profile-photo');
        profilePhoto.style.backgroundImage = `url(${savedPhoto})`;
        profilePhoto.style.backgroundSize = 'cover';
        profilePhoto.style.backgroundPosition = 'center';
        profilePhoto.innerHTML = '';
    }
    
    // Load about text
    const savedAbout = localStorage.getItem('aboutText');
    if (savedAbout) {
        document.getElementById('aboutText').value = savedAbout;
    }
}

// Format Phone Number
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
    }
    return phone;
}

// Show Notification
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

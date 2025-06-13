document.addEventListener('DOMContentLoaded', function() {
    const dropdownMenuToggle = document.getElementById('DropdownMenu'); // Измените на правильный ID
    const dropdownMenu = document.getElementById('dropdownMenu');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }

        if (!dropdownMenuToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none'; // Закрыть меню, если кликнули вне его
        }
    });

    dropdownMenuToggle.addEventListener('click', function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    const urlParams = new URLSearchParams(window.location.search);
    const recovery_token = urlParams.get('recovery_token');

    if (recovery_token) {
        fetch(`/api/confirmRecoveryToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ recovery_token: recovery_token })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Ошибка при проверке токена");
            }
            return res.json();
        })
        .then(data => {
            // Если токен недействителен, перенаправляем на главную страницу
            if (!data.success) {
                alert("Токен просрочен или недействителен.");
                window.location.href = "/public/Sofa.html"; 
            }
            // Если токен действителен, ничего не делаем
        })
        .catch(error => {
            console.error("Ошибка:", error);
            alert("Произошла ошибка при проверке токена.");
            window.location.href = "/public/Sofa.html";
        });
    } else {
        alert("Токен не найден!");
        window.location.href = "/public/Sofa.html";
    }    
});

new Vue({
    el: '#app',
    data: {
        isPasswordRecoveryVisible: false,
        isPasswordRecovery2Visible: false
    },
    methods: {
        showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerText = message;

            document.getElementById('notifications').appendChild(notification);
            notification.style.display = 'block';

            setTimeout(() => {
                notification.style.display = 'none';
                notification.remove();
            }, 3000);
        },
        submitRecovery() {
            const RecoveryPassword = document.getElementById('RecoveryPassword').value;
            const RecoveryPassword2 = document.getElementById('RecoveryPassword2').value;
        
            if (RecoveryPassword !== RecoveryPassword2) {
                this.showNotification('Пароли не совпадают!', 'error');
                return;
            }
        
            const urlParams = new URLSearchParams(window.location.search);
            const recovery_token = urlParams.get('recovery_token');
        
            fetch('/api/SubmitRecovery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    RecoveryPassword: RecoveryPassword,
                    recovery_token: recovery_token,
                }),
            })
            .then(response => {
                if (!response.ok) {
                    this.showNotification('Пароль слишком слабый!', 'error'); 
                } else {
                    this.showNotification('Пароль успешно изменен!', 'success');
                    window.location.href = '/public/Sofa.html';
                }
            })
            .catch((error) => {
                console.error('Ошибка:', error);
                this.showNotification('Ошибка изменения пароля: ' + error.message, 'error');
            });
        },
        togglePasswordRecoveryVisibility() {
            this.isPasswordRecoveryVisible = !this.isPasswordRecoveryVisible;
        },
        togglePasswordRecovery2Visibility() {
            this.isPasswordRecovery2Visible = !this.isPasswordRecovery2Visible;
        },
    }
});

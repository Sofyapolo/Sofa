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
    Authenticate();
});

const channel = new BroadcastChannel('auth_channel');

channel.onmessage = (event) => {
    if (event.data === 'logout') {
        window.location.href = '/public/Sofa.html';
    }
};

function Authenticate() {
    fetch('/api/authenticate')
        .then(response => {
            if (!response.ok) {
                window.location.href = '/public/Sofa.html';
            }
            return response.json();
        })
        .then(authData => {
            if (authData && authData.success) {
                console.log(authData);
                document.getElementById('username').value = authData.login;
                document.getElementById('email').value = authData.email;
                checkUserFields(authData.login);
            } else {
                handleLogout();
            }
        })
        .catch(error => {
            window.location.href = '/public/Sofa.html';
            console.error("Ошибка при загрузке:", error);
        });
}

function handleLogout() {
    fetch('/api/logout', {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            channel.postMessage('logout');
            window.location.href = '/public/Sofa.html';
        } else {
            console.error("Ошибка при выходе:", response.statusText);
        }
    })
    .catch(error => {
        console.error("Ошибка при выходе:", error);
    });
}

function checkUserFields(login) {
    fetch(`/api/checkUserFields?login=${encodeURIComponent(login)}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Ошибка при получении данных пользователя');
        })
        .then(data => {
            if (data.nickname && data.vk) {
                document.getElementById('vk').style.display = 'block';
                document.getElementById('vk_label').style.display = 'block';
                document.getElementById('nickname').style.display = 'block';
                document.getElementById('nickname_label').style.display = 'block';
                document.getElementById('vk').value = data.vk;
                document.getElementById('nickname').value = data.nickname;
            } else {
                document.getElementById('vk').style.display = 'none';
                document.getElementById('nickname').style.display = 'none';
            }
        })
        .catch(error => {
            console.error("Ошибка при проверке полей пользователя:", error);
        });
}


new Vue({
    el: '#app',
    methods: {
        submitProfile(){
            const username = document.getElementById('username').value;
            fetch('/api/changeLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login: username }),
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        if (text.includes('Unauthorized')) {
                            handleLogout();
                            return this.showNotification('Пользователь неавторизован', 'error');
                        } else if (text.includes('Login already exists')) {
                            return this.showNotification('Пользователь с таким именем уже существует.', 'error');
                        } else if (text.includes('Badrequest')) {
                            return this.showNotification('Ошибка базы данных. Попробуйте позже.', 'error');
                        } else if (text.includes('InternalServerError')) {
                            return this.showNotification('Ошибка сервера. Попробуйте позже.', 'error');
                        } else {
                            return this.showNotification('Неизвестная ошибка. Попробуйте снова.', 'error');
                        } 
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.newLogin) {
                    this.showNotification('Логин успешно изменён!', 'success');
                } else {
                    this.showNotification('Ошибка при изменении логина', 'error');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
        },
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
        }
    }
});
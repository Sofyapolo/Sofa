// Функция для удаления товара из корзины
function removeFromBasket(itemId) {
    fetch(`/api/removeFromBasket/${itemId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при удалении товара из корзины');
        }
        // Обновляем корзину после удаления
        updateBasket();
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

// Функция для обновления корзины
function updateBasket() {
    fetch('/api/getBasketItems', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при получении товаров из корзины');
        }
        return response.json();
    })
    .then(data => {
        const basketItemsDiv = document.getElementById('basket-items');
        basketItemsDiv.innerHTML = ''; // Очистка контейнера перед добавлением новых элементов

        // Проверка, что data не null и является массивом
        if (Array.isArray(data) && data.length === 0) {
            basketItemsDiv.innerHTML = '<p>Ваша корзина пуста.</p>';
        } else if (Array.isArray(data)) {
            console.log(data);
            let totalPrice = 0; // Переменная для хранения общей стоимости
            data.forEach(item => {
                const itemPrice = item.price * item.quantity; // Общая стоимость для этого товара
                totalPrice += itemPrice; // Добавляем к общей стоимости

                // Создаем карточку товара
                const itemDiv = document.createElement('div');
                itemDiv.className = 'card';
                if (item.imageData){
                    itemDiv.innerHTML = `
                        <div class="card-image-block">
                            <img src="${item.photo}" alt="${item.name}" class="card-image" />
                        </div>
                        <h3 class="card-title">${item.name}</h3>
                        <p>${item.description || 'Нет описания'}</p>
                        <div class="card-image-block">
                            <img src="data:image/png;base64,${item.imageData}" alt="${item.name}" class="card-image-small" />
                        </div>
                        <p class="card-price">${item.price} ₽</p>
                        <p>Количество: ${item.quantity}</p>
                        <p>Итого: ${itemPrice} ₽</p>
                        <button onclick="removeFromBasket(${item.id})">Удалить из корзины</button>
                    `;
                    basketItemsDiv.appendChild(itemDiv);
                } else{
                    itemDiv.innerHTML = `
                        <div class="card-image-block">
                            <img src="${item.photo}" alt="${item.name}" class="card-image" />
                        </div>
                        <h3 class="card-title">${item.name}</h3>
                        <p>${item.description || 'Нет описания'}</p>
                        <p class="card-price">${item.price} ₽</p>
                        <p>Количество: ${item.quantity}</p>
                        <p>Итого: ${itemPrice} ₽</p>
                        <button onclick="removeFromBasket(${item.id})">Удалить из корзины</button>
                    `;
                    basketItemsDiv.appendChild(itemDiv);
                }
            });

            // Кнопка для оплаты
            const totalDiv = document.createElement('div');
            totalDiv.innerHTML = `
                <h3>Общая стоимость: ${totalPrice} ₽</h3>
                <button onclick="payForItems()">Оплатить</button>
            `;
            basketItemsDiv.appendChild(totalDiv);
        } else {
            // Если data не является массивом
            basketItemsDiv.innerHTML = '<p>Ваша корзина пуста</p>';
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        document.getElementById('basket-items').innerHTML = '<p>Ошибка при загрузке корзины.</p>';
    });
}


// Инициализация корзины при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
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
    updateBasket();
});


// Функция для оплаты товаров
function payForItems() {
    fetch('/api/payForItems', {
        method: 'POST',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при оплате');
        }
        alert('Оплата прошла успешно!');
        // Можно перенаправить на страницу подтверждения оплаты или очистить корзину
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

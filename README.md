# Инструкция по установке Проекта:
1. Скачать папку с проектом и разархивировать его в удобное для вас место
2. Скачать PostgreSQL с официального сайта https://www.postgresql.org/download/
3. Запустить установищик PostgreSQL.
   
3.1 Установить на диск с проектом(желательно)

3.2 При установке поставить галочку рядом с pgAdmin 4

3.4 Убедиться, что порт для установки:
```
5432
```
3.3 В качестве логина и пароля использовать(если берете другой логин и пароль то следующие шаги могут работать некорректно)

Логин
```
postgres
```
Пароль
```
12345
```
3.4 Stack Builder для работы не требуется!

4. Написать в поиске компьютера
```
CMD
```
5. Открыть Command Promt и написать следующую команду
```
psql -U postgres
```
> Вы должны увидеть что теперь работаете с postgres, если нет, то попробуйте написать в Command Promt следующую команду
> ```
> pg_ctl -D "C:\Program Files\PostgreSQL\<версия>\data" start
> ```
6. В Command Promt написать следующую команду
```
CREATE DATABASE sofa;
```
7. Перезапустите CMD и напишите следующую команду
```
psql -U postgres -d sofa
```
8. В Command Promt написать следующую команду
```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    is_banned BOOLEAN DEFAULT FALSE,
    nickname TEXT,
    vk TEXT,
    sign_up_token VARCHAR(255),
    sign_up_token_del_time TIMESTAMP,
    recovery_token VARCHAR(255),
    recovery_token_del_time TIMESTAMP
);
```
8.1 В Command Promt написать следующую команду
```
CREATE TABLE basket (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    article VARCHAR(255),
    quantity INT,
    image_data BYTEA
);
```
8.2 В Command Promt написать следующую команду
```
CREATE TABLE goods (
    id SERIAL PRIMARY KEY,          
    name VARCHAR(255) NOT NULL,     
    price DECIMAL(10, 2) NOT NULL,  
    photo VARCHAR(255),
    article VARCHAR(255) NOT NULL,
    min_order_quantity INT NOT NULL,
    multiplicity INT NOT NULL,
    description TEXT NOT NULL,
    original_link TEXT,
    tipography TEXT,
    need_maket BOOLEAN DEFAULT FALSE,
    maket_format TEXT,
    color_profile TEXT
);
```
8.3 В Command Promt написать следующую команду
```
INSERT INTO goods (
    name, price, photo, article, min_order_quantity, multiplicity, 
    description, original_link, tipography, need_maket, maket_format, color_profile
) 
VALUES 
(
    'Футболка', 19.99, 
    'https://sun9-4.userapi.com/impg/u3VEwypfjzjd9WAeEI8Z4ogg9gsCoOcLAddTVQ/FbEhP9AXOjw.jpg?size=2560x2560&quality=95&sign=0e628df426a44ed6d3c08ccbc3d189fe&type=album', 
    'TSHIRT001', 10, 5, 
    'Мягкая и дышащая футболка для повседневной носки.', 
    'https://example.com/design1', 'Arial, 12pt, Bold', TRUE, 'png', 'CMYK'
),
(
    'Джинсы', 49.99, 
    'https://sun9-11.userapi.com/impg/hCF3Uqij0AXAjnOf1PVxHx2gqWhQD_aA69uBgg/zMA9R7Ny_tg.jpg?size=2560x2560&quality=95&sign=795961b1b8c35f14f7b47f372462feeb&type=album', 
    'JEANS002', 4, 2, 
    'Классические синие джинсы с удобным кроем.', 
    'https://example.com/design2', 'Times New Roman, 14pt', FALSE, NULL, NULL
),
(
    'Кроссовки', 89.99, 
    'https://sun9-57.userapi.com/impg/U0eoWlY7GRqc-MfaE_yN24hmGG-4BqzZspIYaw/q_Zado_0-wo.jpg?size=2560x2560&quality=95&sign=e2e490539c61983a9f010dd59ca3a2ee&type=album', 
    'SNEAKERS003', 3, 1, 
    'Легкие и удобные кроссовки для спорта и повседневной носки.', 
    'https://example.com/design3', 'Helvetica, 10pt, Regular', TRUE, 'png', 'RGB'
),
(
    'Рюкзак', 39.99, 
    'https://sun9-58.userapi.com/impg/d8X55p95r_LssTVS5ZHauleLUrbVgEMGnd2zng/bvmNA4D5tGI.jpg?size=2560x2560&quality=95&sign=fb6dbf685d7423542f57c9301f34ed6f&type=album', 
    'BACKPACK004', 2, 1, 
    'Стильный и вместительный рюкзак с несколькими отделениями.', 
    'https://example.com/design4', 'Verdana, 11pt, Italic', FALSE, NULL, NULL
),
(
    'Часы', 129.99, 
    'https://sun9-7.userapi.com/impg/3JjqlZB5xhvkar32RbYIuF0eQN1tDhdO6S5gEQ/m1ZXcpa9xLQ.jpg?size=2560x2560&quality=95&sign=f6ebc4a486e1e85705a62c963c5d048d&type=album', 
    'WATCH005', 1, 1, 
    'Элегантные наручные часы с кожаным ремешком.', 
    'https://example.com/design5', 'Georgia, 13pt, Bold', TRUE, 'jpg', 'Pantone 123C'
);
```

9. В Command Promt написать следующую команду и закрыть Command Promt
```
/q
```
10. Открыть приложение pgAdmin 4.
11. Найти базу данных sofa в выпадающем списке слева и развернуть её -> развернуть Schemas -> развернуть public -> развернуть Tables
12. Найти users и нажать пкм -> View/Edit Data -> All Rows -> В окне справа появится таблица, обновляйте её видимость с помощью View/Edit Data.
> Если у вас возникла проблема то попробуйте перечитать инструкцию, проверить версию PostgreSQL
> ```
> psql --version
> ```
> или проверить переменную PATH
> Открой панель управления -> "Система и безопасность" -> "Система" -> "Дополнительные параметры системы" -> "Переменные среды" -> Найдите переменную Path в разделе "Системные переменные" и нажмите "Изменить". -> Добавьте новый путь к папке bin PostgreSQL и сохраните изменения(Если его там нет).
> ```
> C:\Program Files\PostgreSQL\<версия(например 14)>\bin
> ```
13. Скачать GO с официального сайта https://go.dev/dl/
14. Запустить установищик GO и установить на диск с проектом
15. Открыть vs code
16. Открыть в vs code папку с проектом(File -> Open Folder)
17. Открыть терминал(убедитесь, что путь в терминале ведет к папке с проектом)
18. Написать команду в терминале
```
go version
```
> Вы должны увидеть версию GO, например go version go1.23.4 windows/amd64
19. Написать команду в терминале
```
go mod init server.go
```
> Создает go.mod
20. Написать команду в терминале
```
go get github.com/lib/pq
go get github.com/gorilla/sessions
```
> Создает go.sum

21. Написать команду в терминале
```
go run server.go
```
> Запускает проект
22. Перейти во вкладку ports рядом с терминалом
23. Нажать Forward a Port
24. Написать в поле Port
```
8080
``` 
25. Нажать Enter
26. Перейти по ссылке предоставленной в Forwarded Address

Если у вас возникли проблемы с установкой, то перечитайте инструкцию, спросите чат гпт или напишите Кириллу(В крайнем случае).

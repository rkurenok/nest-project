<h1>Nestjs+Ts сервер с регистрацией/авторизаций, ролями и CRUD операциями для пользователей, ролей, блоков, файлов</h1>

Для запуска сервера необходимо установить npm-пакеты, создать пустую БД и настроить её в конф. файлу .env<br />После первого запуска автоматически создаются роли admin и user, и пользователь { name: admin, password: adminadmin } с ролью admin

Запросы в postman для тестирования:

<ul>Роли
<li>'GET' http://localhost:5000/roles/user - получаем роль user</li>
<li>'POST' http://localhost:5000/roles </br> body: {"value": "test", "description": "Роль для теста"} - добавляем роль test</li>
<li>'GET' http://localhost:5000/roles/test - получаем новую роль test</li>
</ul>
</br>
<ul>Профиль
<li>'POST' http://localhost:5000/profile/registration </br> body: {"email": "user", "password": "user", "name": "Name", "surname": "R", "patronymic": "A", "phone": "327"} - регистрируем пользователя</li>
<li>'GET' http://localhost:5000/auth/logout - разлогиниваемся (возвращается удаленный токен)</li>
<li>'POST' http://localhost:5000/auth/login </br> body: {"email": "user", "password": "user"} - логинимся (получаем новую пару токенов)</li>
<li>'POST' http://localhost:5000/auth/login </br> body: {"email": "user", "password": "user"} - логинимся под админом и копируем refreshToken</li>
<li>'GET' http://localhost:5000/users - вставляем токен в Authorization (Type: Bearer) и получаем всех пользователей</li>
<li>'POST' http://localhost:5000/users/role </br> body: {"userId": "2", "value": "admin"} - добавляем пользователю роль админа</li>
<li>'GET' http://localhost:5000/users - проверяем, что у пользователя добавилась роль</li>
<li>'POST' http://localhost:5000/users/update </br> body: {"email": "admin1", "password": "adminadmin", "name": "admin1", "surname": "admin1", "patronymic": "admin1", "phone": "32712"} - изменяем профиль текущего пользователя</li>
<li>'PUT' http://localhost:5000/users/update/2 </br> body: {"email": "user1", "password": "user", "name": "Name1", "surname": "Name1", "patronymic": "A12", "phone": "37777"} - изменяем профиль пользователя по id (не забудьте про авторизационный токен)</li>
<li>'GET' http://localhost:5000/users - проверяем, что у пользователя добавилась роль</li>
<li>'DELETE' http://localhost:5000/users/delete/2 - удаляем текущего пользователя (лучше протестировать в конце, чтобы не перезапускать приложение, если никому не назначили админа)</li>
<li>'DELETE' http://localhost:5000/users/delete/2 - удаляем пользователя по id (не забудьте про авторизационный токен)</li>
</ul>
<ul>Токен
<li>'GET' http://localhost:5000/token/refresh - получаем обновленную пару токенов</li>
</ul>
<ul>Text-Block
<li>'POST' http://localhost:5000/textBlock </br> body: {"name": "main-hero-text", "title": "Title", "text": "Description", "group": "main-page", "image": Выбрать файл} - добавляем Text-Block через form-data, чтобы можно было прикрепить файл (не забудьте про авторизационный токен)</li>
<li>'GET' http://localhost:5000/textBlock - получаем все Text-Block</li>
<li>'GET' http://localhost:5000/textBlock/main-hero-text - получаем Text-Block по имени</li>
<li>'GET'http://localhost:5000/textBlock/filter?group=main-page - фильтруем все Text-Block по группе</li>
<li>'PUT' http://localhost:5000/textBlock/update/main-hero-text </br> body: {"name": "main-hero-text", "title": "Title", "text": "Description", "group": "main-page", "image": Выбрать другой файл} - изменяем Text-Block по имени через form-data, чтобы можно было прикрепить файл (не забудьте про авторизационный токен)</li>
<li>'DELETE' http://localhost:5000/textBlock/delete/main-hero-text - удаляем Text-Block по имени (не забудьте про авторизационный токен)</li>
</ul>
<ul>Files
<li>'GET' http://localhost:5000/files/deleteFiles - удаляем все не используемые файлы (заранее в бд измените updateAt на час раньше и обнулите сущности Table/Id, если не удаляли Text-Block)</li>
</ul>

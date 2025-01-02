// Получение текущего пользователя
function getCurrentUser() {
    fetch('http://localhost:8088/api/user')
        .then(response => response.json())
        .then(user => {
            document.getElementById('usernamePlaceholder').textContent = user.email;
            document.getElementById('userRoles')
                .textContent = user.roles ? user.roles
                .map(role => role.role.substring(5))
                .join(", ") : "";

            checkUserRoleAndAdjustUI(user); // Проверяем роль и настраиваем UI
        })
        .catch(error => console.error("Ошибка при получении текущего пользователя:", error));
}

// Функция для проверки роли и настройки UI
function checkUserRoleAndAdjustUI(user) {
    const adminLink = document.querySelector('a[href="/admin"]').parentElement; // Находим элемент с ссылкой на админ панель

    if (user.roles && user.roles.some(role => role.role === "ROLE_ADMIN")) {
        adminLink.style.display = 'block'; // Показываем кнопку "Admin" для админа
    } else {
        adminLink.style.display = 'none'; // Скрываем кнопку "Admin" для пользователя
    }
}

getCurrentUser();

document.addEventListener('DOMContentLoaded', () => {
    const userUrl = 'http://localhost:8088/api/user';

    function getUserPage() {
        fetch(userUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(user => {
                getInformationAboutUser(user);
            })
            .catch(error => console.error("Ошибка при получении данных пользователя:", error));
    }

    function getInformationAboutUser(user) {
        let result = '';
        if (user) {
            result +=
                `<tr>
                <td>${user.id}</td>
                <td>${user.userName}</td>
                <td>${user.email}</td>
                <td>${user.roles ? user.roles.map(role => " " + role.role.substring(5)).join(', ') : ""}</td>
              </tr>`;
        }

        document.getElementById('userTableBody').innerHTML = result;
    }

    getUserPage();
});
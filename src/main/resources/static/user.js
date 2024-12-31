document.addEventListener('DOMContentLoaded', () => {

    const userUrl = 'http://localhost:8088/api/user';

    function getUserPage() {
        fetch(userUrl)
            .then(response => response.json())
            .then(user => {
                getInformationAboutUser(user);
            })
            .catch(error => console.error("Ошибка при получении данных пользователя:", error));
    }

    function getInformationAboutUser(user) {
        let result = '';
        result +=
            `<tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.roles ? user.roles.map(role => " " + role.name.substring(5)) : ""}</td>
            </tr>`;
        document.getElementById('userTableBody').innerHTML = result;
    }

    function getCurrentUser() {
        fetch(userUrl)
            .then(res => res.json())
            .then(user => {
                document.getElementById('usernamePlaceholder').textContent = user.email;
                document.getElementById('userRoles').textContent = user.roles ? user.roles.map(role => role.name.substring(5)).join(", ") : "";
            })
            .catch(error => console.error("Ошибка при получении текущего пользователя:", error));
    }

    getUserPage();
    getCurrentUser();
});
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

    function getCurrentUser() {
        fetch(userUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json()
            })
            .then(user => {
                document.getElementById('usernamePlaceholder').textContent = user.email;
                document.getElementById('userRoles').textContent = user.roles ? user.roles.map(role => role.role.substring(5)).join(", ") : "";
            })
            .catch(error => console.error("Ошибка при получении текущего пользователя:", error));
    }

    getUserPage();
    getCurrentUser();
});
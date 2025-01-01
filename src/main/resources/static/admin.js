const url = 'http://localhost:8088/api/admin';

// Получение ролей
function getRoles() {
    return fetch(url + '/roles')
        .then(response => response.json())
        .catch(error => console.error("Ошибка при получении ролей:", error));
}

// Заполнение ролей в выпадающих списках
function listRoles() {
    getRoles().then(roles => {
        let tmp = '';
        roles.forEach(role => {
            tmp += `<option value="${role.id}">${role.role}</option>`;
        });
        document.getElementById('editRole').innerHTML = tmp;
        document.getElementById('deleteRole').innerHTML = tmp;
        document.getElementById('role_select').innerHTML = tmp;
    });
}

listRoles();

// Получение данных всех пользователей
function getAllUsers() {
    fetch(url)
        .then(response => response.json())
        .then(data => loadTable(data))
        .catch(error => console.error("Ошибка при получении пользователей:", error));
}

// Загрузка данных в таблицу
function loadTable(users) {
    let res = '';
    users.forEach(user => {
        res += `
            <tr>
                <td>${user.id}</td>
                <td>${user.userName}</td>
                <td>${user.email}</td>
                <td>${user.roles ? user.roles.map(role => role.role.substring(5)).join(', ') : ""}</td>
                <td><button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editModal(${user.id})">Edit</button></td>
                <td><button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="deleteModal(${user.id})">Delete</button></td>
            </tr>`;
    });
    document.getElementById('tableBodyAdmin').innerHTML = res;
}

getAllUsers();

// Создание нового пользователя
document.getElementById('newUserForm').addEventListener('submit', (e) => {
    e.preventDefault();
    let roles = [];
    Array.from(document.getElementById('role_select').options).forEach(option => {
        if (option.selected) {
            roles.push({ id: option.value, role: 'ROLE_' + option.text });
        }
    });
    fetch(url + '/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName: document.getElementById('newName').value,
            email: document.getElementById('newEmail').value,
            password: document.getElementById('newPassword').value,
            roles: roles
        })
    })
        .then(response => {
            if (response.ok) {
                getAllUsers();
                document.getElementById("show-users-table").click();
            }
        })
        .catch(error => console.error("Ошибка при создании пользователя:", error));
});

// Редактирование пользователя
function editModal(id) {
    fetch(url + '/users/' + id)
        .then(response => response.json())
        .then(user => {
            document.getElementById('editId').value = user.id;
            document.getElementById('editNameU').value = user.userName;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editPassword').value = user.password;
            const rolesSelect = document.getElementById('editRole');
            rolesSelect.innerHTML = '';
            getRoles().then(roles => {
                roles.forEach(role => {
                    const option = document.createElement('option');
                    option.value = role.id;
                    option.textContent = role.role;
                    option.selected = user.roles && user.roles.some(userRole => userRole.id === role.id);
                    rolesSelect.appendChild(option);
                });
            });
        })
        .catch(error => console.error("Ошибка при получении пользователя:", error));
}

function editUser() {
    const user = {
        id: document.getElementById('editId').value,
        userName: document.getElementById('editNameU').value,
        email: document.getElementById('editEmail').value,
        password: document.getElementById('editPassword').value,
        roles: Array.from(document.getElementById('editRole').options)
            .filter(option => option.selected)
            .map(option => ({ id: option.value }))
    };
    fetch(url + '/users/' + user.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.ok) {
                closeModal();
                getAllUsers();
            }
        })
        .catch(error => console.error("Ошибка при обновлении пользователя:", error));
}

// Удаление пользователя
function deleteModal(id) {
    fetch(url + '/users/' + id)
        .then(response => response.json())
        .then(user => {
            document.getElementById('deleteId').value = user.id;
            document.getElementById('deleteNameU').value = user.userName;
            document.getElementById('deleteEmail').value = user.email;
            const rolesContainer = document.getElementById('deleteRole');
            rolesContainer.innerHTML = '';
            user.roles.forEach(role => {
                const option = document.createElement('option');
                option.textContent = role.role;
                rolesContainer.appendChild(option);
            });
        })
        .catch(error => console.error("Ошибка при получении пользователя:", error));
}

function deleteUser() {
    const id = document.getElementById('deleteId').value;
    fetch(url + '/users/' + id, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                closeModal();
                getAllUsers();
            }
        })
        .catch(error => console.error("Ошибка при удалении пользователя:", error));
}

// Закрытие модальных окон
function closeModal() {
    document.querySelectorAll(".btn-close").forEach(btn => btn.click());
}



document.addEventListener('DOMContentLoaded', () => {

    const url = 'http://localhost:8088/api/admin';
    const userUrl = 'http://localhost:8088/api/user';

    async function getRoles() {
        try {
            const response = await fetch("http://localhost:8088/api/admin/roles");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Ошибка при получении ролей:", error);
            return [];
        }
    }

    function listRoles() {
        let tmp = '';
        getRoles().then(roles => {
            roles.forEach(role => {
                tmp += `<option value="${role.id}">${role.role}</option>`;
            });
            document.getElementById('editRole').innerHTML = tmp;
            document.getElementById('deleteRole').innerHTML = tmp;
            document.getElementById('role_select').innerHTML = tmp;
        });
    }

    listRoles();

    function getUserData() {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    loadTable(data);
                } else {
                    console.error("Ожидался массив, но получено:", data);
                }
            })
            .catch(error => console.error("Ошибка при получении данных пользователя:", error));
    }


    function getAllUsers() {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    loadTable(data);
                } else {
                    console.error("Ожидался массив, но получено:", data);
                }
            })
            .catch(error => console.error("Ошибка при получении всех пользователей:", error));
    }

    function loadTable(listAllUsers) {
        let res = '';
        if (Array.isArray(listAllUsers)) {
            listAllUsers.forEach(user => {
                res += `
              <tr>
                  <td>${user.id}</td>
                  <td>${user.userName}</td>
                  <td>${user.email}</td>
                  <td>${user.roles ? user.roles.map(role => " " + role.role.substring(5)).join(', ') : ""}</td>
                  <td><button class="btn btn-info" type="button" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editModal(${user.id})">Edit</button></td>
                  <td><button class="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="deleteModal(${user.id})">Delete</button></td>
              </tr>`;
            });
        } else {
            console.error("Ожидался массив, но получено:", listAllUsers);
        }
        document.getElementById('tableBodyAdmin').innerHTML = res;
    }


    getAllUsers();

    document.getElementById('newUserForm').addEventListener('submit', (e) => {
        e.preventDefault();
        let role = document.getElementById('role_select');
        let rolesAddUser = [];
        for (let i = 0; i < role.options.length; i++) {
            if (role.options[i].selected) {
                rolesAddUser.push({ id: role.options[i].value, role: 'ROLE_' + role.options[i].innerHTML });
            }
        }
        fetch('http://localhost:8088/api/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                userName: document.getElementById('newName').value,
                email: document.getElementById('newEmail').value,
                password: document.getElementById('newPassword').value,
                roles: rolesAddUser
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                getUserData();
                document.getElementById("show-users-table").click();
            })
            .catch(error => console.error("Ошибка при создании пользователя:", error));
    });

    async function editModal(id) {
        try {
            const response = await fetch('http://localhost:8088/api/admin/users/' + id, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const u = await response.json();
            document.getElementById('editId').value = u.id;
            document.getElementById('editNameU').value = u.userName;
            document.getElementById('editEmail').value = u.email;
            document.getElementById('editPassword').value = u.password;
            const allRoles = await getRoles();

            const rolesSelect = document.getElementById('editRole');
            rolesSelect.innerHTML = '';

            allRoles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.role;
                option.selected = u.roles && u.roles.some(userRole => userRole.id === role.id);
                rolesSelect.appendChild(option);
            });

        }
        catch (error) {
            console.error("Ошибка при получении пользователя для редактирования:", error);
        }
    }

    async function editUser() {
        let idValue = document.getElementById("editId").value;
        let nameValue = document.getElementById('editNameU').value;
        let emailValue = document.getElementById('editEmail').value;
        let passwordValue = document.getElementById("editPassword").value;
        let listOfRole = [];

        const roleSelect = document.getElementById('editRole');

        for (let i = 0; i < roleSelect.options.length; i++) {
            if (roleSelect.options[i].selected) {
                let tmp = {};
                tmp["id"] = roleSelect.options[i].value;
                listOfRole.push(tmp);
            }
        }

        let user = {
            id: idValue,
            userName: nameValue,
            email: emailValue,
            password: passwordValue,
            roles: listOfRole
        };

        try {
            const response = await fetch('http://localhost:8088/api/admin/users/' + user.id, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(user)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            closeModal();
            getUserData();
        }
        catch (error) {
            console.error("Ошибка при обновлении пользователя:", error);
        }
    }

    async function deleteModal(id) {
        try {
            const response = await fetch('http://localhost:8088/api/admin/users/' + id, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const u = await response.json();
            document.getElementById('deleteId').value = u.id;
            document.getElementById('deleteNameU').value = u.userName;
            document.getElementById('deleteEmail').value = u.email;
            const rolesContainer = document.getElementById('deleteRole');
            rolesContainer.innerHTML = '';
            u.roles.forEach(role => {
                const option = document.createElement('option');
                option.textContent = role.role;
                rolesContainer.appendChild(option);
            });
        }
        catch (error) {
            console.error("Ошибка при получении пользователя для удаления:", error);
        }
    }

    async function deleteUser() {
        const id = document.getElementById("deleteId").value;
        let urlDel = 'http://localhost:8088/api/admin/users/' + id;
        let method = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await fetch(urlDel, method);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            closeModal();
            getUserData();
        }
        catch(error){
            console.error("Ошибка при удалении пользователя:", error)
        }
    }

    function closeModal() {
        document.querySelectorAll(".btn-close").forEach((btn) => btn.click());
    }

    function getCurrentUser() {
        fetch(userUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(user => {
                document.getElementById('usernamePlaceholder').textContent = user.email;
                document.getElementById('userRoles').textContent = user.roles ? user.roles.map(role => role.role.substring(5)).join(", ") : "";
            })
            .catch(error => console.error("Ошибка при получении текущего пользователя:", error));
    }

    getCurrentUser();

});
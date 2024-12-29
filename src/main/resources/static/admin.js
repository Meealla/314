
$(document).ready(function () {
    //  Заполнение шапки
    fetch('/user/current')
        .then(response => response.json())
        .then(user => {
            console.log(user);
            $('#user-name-header').text(user.userName);
            let roles = user.roles.map(role => role.role).join(', ');
            $('#user-roles-header').text(roles);
        });
    // Заполнение таблицы пользователей
    function fetchAndFillTable() {
        fetch('/api/admin/users')
            .then(response => response.json())
            .then(users => {
                const tableBody = document.getElementById('usersTableBody');
                tableBody.innerHTML = '';

                users.forEach(user => {
                    const row = tableBody.insertRow();
                    row.innerHTML = `
                        <th scope="row">${user.id}</th>
                        <td>${user.userName}</td>
                        <td>${user.email}</td>
                        <td>${user.roles.map(role => role.role).join(', ')}</td>
                        <td>
                             <a href="#" class="btn btn-info edit-user-btn" data-user-id="${user.id}" data-bs-toggle="modal" data-bs-target="#editUserModal">
                                 <i class="fas fa-edit"></i>
                            </a>
                        </td>
                        <td>
                            <a href="#" class="btn btn-danger delete-user-btn" data-user-id="${user.id}"  data-bs-toggle="modal" data-bs-target="#deleteUserModal">
                                  <i class="fas fa-trash"></i>
                             </a>
                        </td>
                     `;
                });
            })
            .catch(error => console.error('Ошибка получения пользователей:', error));
    }
    fetchAndFillTable();
    // Заполнение модального окна редактирования
    $(document).on('click', '.edit-user-btn', function () {
        const userId = $(this).data('user-id');

        fetch(`/api/admin/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                $('#editUserId').val(user.id);
                $('#editUserName').val(user.userName);
                $('#editUserEmail').val(user.email);
                $('#editUserPassword').val(user.password);
                fillRoles(user.roles, 'editRoles');
            })
            .catch(error => console.error('Ошибка получения пользователя для редактирования:', error));
    });
    // Сохранение изменений пользователя
    $('#saveChangesButton').on('click', function () {
        const userId = $('#editUserId').val();
        const formData = {
            id: userId,
            userName: $('#editUserName').val(),
            email: $('#editUserEmail').val(),
            password: $('#editUserPassword').val(),
            roles: $('#editRoles').val().map(id => ({id: parseInt(id)}))
        };
        const csrfToken = document.querySelector('meta[name="_csrf"]').content;
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

        fetch(`/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    $('#editUserModal').modal('hide');
                    fetchAndFillTable(); // Обновить таблицу
                } else {
                    console.error('Ошибка при обновлении пользователя');
                }
            })
            .catch(error => console.error('Ошибка при отправке запроса:', error));
    });


    // Заполнение модального окна удаления
    $(document).on('click', '.delete-user-btn', function () {
        const userId = $(this).data('user-id');
        fetch(`/api/admin/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                $('#deleteUserId').val(user.id);
                $('#deleteUserName').val(user.userName);
                $('#deleteUserEmail').val(user.email);
                $('#deleteUserPassword').val(user.password);

                fillRoles(user.roles, 'deleteUserRoles');
            })
            .catch(error => console.error('Ошибка получения пользователя для удаления:', error));
    });
    //  Удаление пользователя
    $('#deleteUserButton').on('click', function () {
        const userId = $('#deleteUserId').val();

        const csrfToken = document.querySelector('meta[name="_csrf"]').content;
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

        fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                [csrfHeader]: csrfToken
            }
        })
            .then(response => {
                if (response.ok) {
                    $('#deleteUserModal').modal('hide');
                    fetchAndFillTable(); // Обновить таблицу
                } else {
                    console.error('Ошибка при удалении пользователя');
                }
            })
            .catch(error => console.error('Ошибка при отправке запроса:', error));
    });

    // Функция для получения и заполнения ролей
    function fillRoles(selectedRoles, selectId) {
        fetch('/api/admin/roles')
            .then(response => response.json())
            .then(roles => {
                const selectElement = document.getElementById(selectId);
                selectElement.innerHTML = '';

                roles.forEach(role => {
                    const option = document.createElement('option');
                    option.value = role.id;
                    option.text = role.role;
                    if (selectedRoles && selectedRoles.some(selectedRole => selectedRole.id === role.id)) {
                        option.selected = true;
                    }
                    selectElement.appendChild(option);
                });

            })
            .catch(error => console.error('Ошибка получения ролей:', error));
    }

});

package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> getAllUser();

    void createUser(User user);

    void updateUser(Long id, User user);

    void deleteUser(Long id);

    User showUser(Long id);

    User findUserByUserName(String username);

}


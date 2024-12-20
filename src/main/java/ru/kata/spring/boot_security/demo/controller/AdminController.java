package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    // Отображение всех пользователей
    @GetMapping
    public String getAllUsers(Model model, Principal principal) {
        model.addAttribute("users", userService.getAllUser());

        String username = principal.getName();
        User user = userService.findUserByUserName(username);
        if (user != null) {
            model.addAttribute("userh", user);
        }

        // Передаем роли для выпадающего списка в модальном окне
        model.addAttribute("roles", roleService.getAllRoles());

        return "allUser"; // Возвращаем только одно представление
    }

    // Форма для создания нового пользователя
    @GetMapping("/new")
    public String createUserForm(Model model, Principal principal) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.getAllRoles());

        String username = principal.getName();
        User user = userService.findUserByUserName(username);
        if (user != null) {
            model.addAttribute("userh", user);
        }

        return "new";
    }

    // Создание нового пользователя
    @PostMapping
    public String createUser(@ModelAttribute("user") User user, @RequestParam("roles") Long[] roleIds) {
        List<Role> roles = roleService.getRolesByIds(roleIds); // Используем метод из RoleService
        user.setRoles(roles);
        userService.createUser(user);
        return "redirect:/admin";
    }

    // Обновление пользователя (POST-запрос)
    @PostMapping("/edit")
    public String updateUser(@ModelAttribute("user") User user, @RequestParam("id") Long id, @RequestParam("roles") Long[] roleIds) {
        List<Role> roles = roleService.getRolesByIds(roleIds); // Используем метод из RoleService
        user.setRoles(roles);
        userService.updateUser(id, user);
        return "redirect:/admin";
    }

    // Удаление пользователя
    @PostMapping("/delete")
    public String deleteUser(@RequestParam("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
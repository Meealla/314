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

    @GetMapping
    public String getAllUsers(Model model, Principal principal) {
        model.addAttribute("users", userService.getAllUser());
        model.addAttribute("roles", roleService.getAllRoles());

        String username = principal.getName();
        User user = userService.findUserByUserName(username);
        if (user != null) {
            model.addAttribute("userh", user);
        }

        return "allUser";
    }
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
    @PostMapping
    public String createUser(@ModelAttribute("user") User user, @RequestParam("roles") Long[] roleIds) {
        List<Role> roles = roleService.getRolesByIds(roleIds);
        user.setRoles(roles);
        userService.createUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/edit")
    public String updateUser(@ModelAttribute("user") User user,
                             @RequestParam("id") Long id,
                             @RequestParam("roles") Long[] roleIds) {
        List<Role> roles = roleService.getRolesByIds(roleIds);
        user.setRoles(roles);
        userService.updateUser(id, user);
        return "redirect:/admin";
    }

    @PostMapping("/delete")
    public String deleteUser(@RequestParam("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
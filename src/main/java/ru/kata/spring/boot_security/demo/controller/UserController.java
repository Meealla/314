package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.Optional;

@Controller
@RequestMapping("/user")
@PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String getUserPage(Principal principal, Model model) {
        String username = principal.getName();
        User user = userService.findUserByUserName(username);

        if (user != null) {
            model.addAttribute("userh", user);

            // Проверяем, есть ли у пользователя роль ADMIN
            boolean isAdmin = user.getRoles().stream()
                    .anyMatch(role -> "ROLE_ADMIN".equals(role.getRole()));
            model.addAttribute("isAdmin", isAdmin);

            return "user";
        } else {
            return "redirect:/login";
        }
    }
}

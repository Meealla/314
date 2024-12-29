package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    // Главная страница администратора
    @GetMapping("/admin")
    public String adminPage() {
        return "allUser"; // Возвращает HTML-шаблон admin.html
    }

    // Страница создания нового пользователя
    @GetMapping("/admin/new")
    public String newUserPage() {
        return "new"; // Возвращает HTML-шаблон newUser.html
    }
}
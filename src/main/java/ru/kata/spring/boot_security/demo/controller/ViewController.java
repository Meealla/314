package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class ViewController {

    /* Главная страница администратора */
    @GetMapping("/admin")
    public String adminPage() {
        return "admin"; /* Возвращает HTML-шаблон admin.html */
    }
}
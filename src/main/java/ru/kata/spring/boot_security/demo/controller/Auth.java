package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Auth {

    @GetMapping("/login")
    public String login() {
        return "/login";
    }
    public String redirectLogin(){
        return "/index";
    }
}

package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Autowired
    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository, UserService userService) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }


    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Role adminRole = new Role("ROLE_ADMIN");
            Role userRole = new Role("ROLE_USER");
            roleRepository.saveAll(Arrays.asList(adminRole, userRole));
        } else {
            if (roleRepository.findByRole("ROLE_ADMIN") == null) {
                roleRepository.save(new Role("ROLE_ADMIN"));
            }
            if (roleRepository.findByRole("ROLE_USER") == null) {
                roleRepository.save(new Role("ROLE_USER"));
            }
        }
        User user = userRepository.findByUserName("user");
        if (user == null) {
            user = new User("1234", "user@mail", "User");
            user.setRoles(List.of(roleRepository.findByRole("ROLE_USER")));
            userService.createUser(user);
        }
        User admin = userRepository.findByUserName("admin");
        if (admin == null) {
            admin = new User("1234", "admin@mail", "admin");
            admin.setRoles(List.of(roleRepository.findByRole("ROLE_ADMIN"), roleRepository.findByRole("ROLE_USER")));
            userService.createUser(admin);
        }
    }
}

//package ru.kata.spring.boot_security.demo.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//import ru.kata.spring.boot_security.demo.model.Role;
//import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
//
//import java.util.Arrays;
//
//@Component
//public class DataInitializer implements CommandLineRunner {
//
//    private final RoleRepository roleRepository;
//
//    @Autowired
//    public DataInitializer(RoleRepository roleRepository) {
//        this.roleRepository = roleRepository;
//    }
//
//
//
//    @Override
//    public void run(String... args) throws Exception {
//        if (roleRepository.count() == 0) {
//            Role adminRole = new Role("ROLE_ADMIN");
//            Role userRole = new Role("ROLE_USER");
//            roleRepository.saveAll(Arrays.asList(adminRole, userRole));
//        } else {
//            // Можно добавить проверку на наличие ролей
//            if (roleRepository.findByRole("ROLE_ADMIN") == null) {
//                roleRepository.save(new Role("ROLE_ADMIN"));
//            }
//            if (roleRepository.findByRole("ROLE_USER") == null) {
//                roleRepository.save(new Role("ROLE_USER"));
//            }
//        }
//        }
//}
//
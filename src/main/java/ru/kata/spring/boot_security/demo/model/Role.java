package ru.kata.spring.boot_security.demo.model;


import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;



@Entity
@Table(name = "roles")
public class Role implements GrantedAuthority {

    @Column(name = "role")
    private String role;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;


    @Transient
    @ManyToMany(mappedBy = "roles")
    private List<User> users;

    public Role(String role) {
        this.role = role;
    }

    public Role() {
    }

    @Override
    public String getAuthority() {
        return role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    @Override
    public String toString() {
        return "Role{" +
               "role='" + this.role + '\'' +
               ", id=" + id +
               ", users=" + users +
               '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Role role1 = (Role) o;
        return Objects.equals(role, role1.role) && Objects.equals(id, role1.id) && Objects.equals(users, role1.users);
    }

    @Override
    public int hashCode() {
        return Objects.hash(role, id, users);
    }
}

package com.example.mobi.controller;

import com.example.mobi.model.Roles;
import com.example.mobi.service.RolesService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/roles")
public class RolesController {

    private final RolesService rolesService;

    public RolesController(RolesService rolesService) {
        this.rolesService = rolesService;
    }

    @GetMapping
    public List<Roles> getAllRoles() {
        return rolesService.getAllRoles();
    }

    @GetMapping("/{id}")
    public Optional<Roles> getRoleById(@PathVariable Integer id) {
        return rolesService.getRoleById(id);
    }

    @PostMapping
    public Roles createRole(@RequestBody Roles role) {
        return rolesService.createRole(role);
    }
}

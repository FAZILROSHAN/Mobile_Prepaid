package com.example.mobi.service.impl;

import com.example.mobi.model.Roles;
import com.example.mobi.repository.RolesRepository;
import com.example.mobi.service.RolesService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RolesServiceImpl implements RolesService {

    private final RolesRepository rolesRepository;

    public RolesServiceImpl(RolesRepository rolesRepository) {
        this.rolesRepository = rolesRepository;
    }

    @Override
    public List<Roles> getAllRoles() {
        return rolesRepository.findAll();
    }

    @Override
    public Optional<Roles> getRoleById(Integer id) {
        return rolesRepository.findById(id);
    }

    @Override
    public Roles createRole(Roles role) {
        return rolesRepository.save(role);
    }
}

package com.example.mobi.service;

import com.example.mobi.model.Roles;
import java.util.List;
import java.util.Optional;

public interface RolesService {
    List<Roles> getAllRoles();
    Optional<Roles> getRoleById(Integer id);
    Roles createRole(Roles role);
}

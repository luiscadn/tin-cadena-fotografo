package com.icesi.PhotoMarketApplication.mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.icesi.PhotoMarketApplication.dto.RoleDTO;
import com.icesi.PhotoMarketApplication.entity.Permission;
import com.icesi.PhotoMarketApplication.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "permissionIds", expression = "java(mapPermissionIds(role.getPermissions()))")
    @Mapping(target = "permissionNames", expression = "java(mapPermissionNames(role.getPermissions()))")
    RoleDTO entityToDto(Role role);

    @Mapping(target = "permissions", ignore = true)
    Role dtoToEntity(RoleDTO dto);

    default Set<Long> mapPermissionIds(Set<Permission> permissions) {
        if (permissions == null) {
            return null;
        }
        return permissions.stream().map(Permission::getId).collect(Collectors.toSet());
    }

    default Set<String> mapPermissionNames(Set<Permission> permissions) {
        if (permissions == null) {
            return null;
        }
        return permissions.stream().map(Permission::getName).collect(Collectors.toSet());
    }
}

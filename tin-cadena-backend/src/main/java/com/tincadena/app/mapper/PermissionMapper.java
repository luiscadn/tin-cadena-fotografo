package com.tincadena.app.mapper;

import org.mapstruct.Mapper;

import com.tincadena.app.dto.PermissionDTO;
import com.tincadena.app.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    PermissionDTO entityToDto(Permission permission);

    Permission dtoToEntity(PermissionDTO dto);
}

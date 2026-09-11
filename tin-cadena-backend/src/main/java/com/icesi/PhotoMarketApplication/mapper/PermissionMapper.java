package com.icesi.PhotoMarketApplication.mapper;

import org.mapstruct.Mapper;

import com.icesi.PhotoMarketApplication.dto.PermissionDTO;
import com.icesi.PhotoMarketApplication.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    PermissionDTO entityToDto(Permission permission);

    Permission dtoToEntity(PermissionDTO dto);
}

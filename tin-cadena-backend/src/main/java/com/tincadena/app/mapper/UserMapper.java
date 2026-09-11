package com.tincadena.app.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.tincadena.app.dto.UserDTO;
import com.tincadena.app.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roleName", source = "role.name")
    UserDTO entityToDto(User user);

    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    User dtoToEntity(UserDTO dto);
}

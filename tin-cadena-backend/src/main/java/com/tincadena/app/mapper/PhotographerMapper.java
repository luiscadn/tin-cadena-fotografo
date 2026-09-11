package com.tincadena.app.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.tincadena.app.dto.PhotographerDTO;
import com.tincadena.app.entity.Photographer;

@Mapper(componentModel = "spring")
public interface PhotographerMapper {

    @Mapping(target = "userId", source = "user.id")
    PhotographerDTO entityToDto(Photographer photographer);

    @Mapping(target = "user", ignore = true)
    Photographer dtoToEntity(PhotographerDTO dto);
}

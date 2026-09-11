package com.icesi.PhotoMarketApplication.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.icesi.PhotoMarketApplication.dto.PhotographerDTO;
import com.icesi.PhotoMarketApplication.entity.Photographer;

@Mapper(componentModel = "spring")
public interface PhotographerMapper {

    @Mapping(target = "userId", source = "user.id")
    PhotographerDTO entityToDto(Photographer photographer);

    @Mapping(target = "user", ignore = true)
    Photographer dtoToEntity(PhotographerDTO dto);
}

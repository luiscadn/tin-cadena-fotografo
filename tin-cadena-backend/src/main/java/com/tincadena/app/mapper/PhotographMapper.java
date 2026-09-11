package com.tincadena.app.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.tincadena.app.dto.PhotographDTO;
import com.tincadena.app.entity.Photograph;

@Mapper(componentModel = "spring")
public interface PhotographMapper {

    @Mapping(target = "status", expression = "java(photo.getStatus() != null ? photo.getStatus().name() : null)")
    @Mapping(target = "photographerId", source = "photographer.id")
    @Mapping(target = "categoryId", source = "category.id")
    PhotographDTO entityToDto(Photograph photo);

    @Mapping(target = "status", ignore = true)
    @Mapping(target = "photographer", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Photograph dtoToEntity(PhotographDTO dto);
}

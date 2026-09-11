package com.tincadena.app.mapper;

import org.mapstruct.Mapper;

import com.tincadena.app.dto.CategoryDTO;
import com.tincadena.app.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDTO entityToDto(Category category);

    Category dtoToEntity(CategoryDTO dto);
}

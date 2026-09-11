package com.icesi.PhotoMarketApplication.mapper;

import org.mapstruct.Mapper;

import com.icesi.PhotoMarketApplication.dto.CategoryDTO;
import com.icesi.PhotoMarketApplication.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDTO entityToDto(Category category);

    Category dtoToEntity(CategoryDTO dto);
}

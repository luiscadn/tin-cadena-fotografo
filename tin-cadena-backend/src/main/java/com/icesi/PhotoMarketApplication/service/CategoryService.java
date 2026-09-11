package com.icesi.PhotoMarketApplication.service;

import com.icesi.PhotoMarketApplication.dto.CategoryDTO;
import com.icesi.PhotoMarketApplication.entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> getAll();
    Optional<Category> getById(Long id);
    Category create(CategoryDTO dto);
    Category update(Long id, CategoryDTO dto);
    void delete(Long id);
}

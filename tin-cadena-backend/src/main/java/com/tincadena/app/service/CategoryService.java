package com.tincadena.app.service;

import com.tincadena.app.dto.CategoryDTO;
import com.tincadena.app.entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> getAll();
    Optional<Category> getById(Long id);
    Category create(CategoryDTO dto);
    Category update(Long id, CategoryDTO dto);
    void delete(Long id);
}

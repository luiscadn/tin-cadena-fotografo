package com.icesi.PhotoMarketApplication.controller.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icesi.PhotoMarketApplication.dto.CategoryDTO;
import com.icesi.PhotoMarketApplication.entity.Category;
import com.icesi.PhotoMarketApplication.mapper.CategoryMapper;
import com.icesi.PhotoMarketApplication.service.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import com.icesi.PhotoMarketApplication.config.SecurityTestConfig;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoryRestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CategoryRestControllerTest extends SecurityTestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CategoryService categoryService;

    @MockitoBean
    private CategoryMapper categoryMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Category category;
    private CategoryDTO categoryDTO;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1L);
        category.setName("Nature");
        category.setDescription("Nature photos");

        categoryDTO = new CategoryDTO(1L, "Nature", "Nature photos");
    }

    @Test
    void getAll_ShouldReturnListOfCategories() throws Exception {
        Mockito.when(categoryService.getAll()).thenReturn(Arrays.asList(category));
        Mockito.when(categoryMapper.entityToDto(category)).thenReturn(categoryDTO);

        mockMvc.perform(get("/api/v1/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(categoryDTO.getId()))
                .andExpect(jsonPath("$[0].name").value(categoryDTO.getName()));
    }

    @Test
    void getById_ShouldReturnCategory() throws Exception {
        Mockito.when(categoryService.getById(1L)).thenReturn(Optional.of(category));
        Mockito.when(categoryMapper.entityToDto(category)).thenReturn(categoryDTO);

        mockMvc.perform(get("/api/v1/categories/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(categoryDTO.getId()))
                .andExpect(jsonPath("$.name").value(categoryDTO.getName()));
    }

    @Test
    void create_ShouldReturnCreatedCategory() throws Exception {
        Mockito.when(categoryService.create(any(CategoryDTO.class))).thenReturn(category);
        Mockito.when(categoryMapper.entityToDto(category)).thenReturn(categoryDTO);

        mockMvc.perform(post("/api/v1/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(categoryDTO.getId()))
                .andExpect(jsonPath("$.name").value(categoryDTO.getName()));
    }

    @Test
    void update_ShouldReturnUpdatedCategory() throws Exception {
        Mockito.when(categoryService.update(eq(1L), any(CategoryDTO.class))).thenReturn(category);
        Mockito.when(categoryMapper.entityToDto(category)).thenReturn(categoryDTO);

        mockMvc.perform(put("/api/v1/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(categoryDTO.getId()))
                .andExpect(jsonPath("$.name").value(categoryDTO.getName()));
    }

    @Test
    void delete_ShouldReturnNoContent() throws Exception {
        Mockito.doNothing().when(categoryService).delete(1L);

        mockMvc.perform(delete("/api/v1/categories/1"))
                .andExpect(status().isNoContent());
    }
}

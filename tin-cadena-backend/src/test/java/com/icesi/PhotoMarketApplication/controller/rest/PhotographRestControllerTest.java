package com.icesi.PhotoMarketApplication.controller.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icesi.PhotoMarketApplication.config.SecurityTestConfig;
import com.icesi.PhotoMarketApplication.dto.PhotographDTO;
import com.icesi.PhotoMarketApplication.entity.Category;
import com.icesi.PhotoMarketApplication.entity.Photograph;
import com.icesi.PhotoMarketApplication.entity.Photographer;
import com.icesi.PhotoMarketApplication.entity.PhotographStatus;
import com.icesi.PhotoMarketApplication.mapper.PhotographMapper;
import com.icesi.PhotoMarketApplication.service.PhotographService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PhotographRestController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("PhotographRestController - Pruebas Unitarias")
class PhotographRestControllerTest extends SecurityTestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PhotographService photographService;

    @MockitoBean
    private PhotographMapper photographMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Photograph samplePhotograph;
    private PhotographDTO samplePhotographDTO;

    @BeforeEach
    void setUp() {
        Photographer photographer = new Photographer();
        photographer.setId(1L);

        Category category = new Category();
        category.setId(1L);
        category.setName("Paisajes");

        samplePhotograph = new Photograph();
        samplePhotograph.setId(1L);
        samplePhotograph.setTitle("Atardecer");
        samplePhotograph.setDescription("Hermoso atardecer en la playa");
        samplePhotograph.setPrice(new BigDecimal("50.00"));
        samplePhotograph.setEdition(10);
        samplePhotograph.setStatus(PhotographStatus.AVAILABLE);
        samplePhotograph.setPhotographer(photographer);
        samplePhotograph.setCategory(category);
        samplePhotograph.setCreatedAt(LocalDateTime.now());

        samplePhotographDTO = new PhotographDTO(1L, "Atardecer", "Hermoso atardecer en la playa",
                new BigDecimal("50.00"), 10, "AVAILABLE", 1L, 1L, LocalDateTime.now());
    }

    @Test
    @DisplayName("POST /api/photographs - Crear fotografía exitoso retorna 201 CREATED")
    void create_exitoso_retorna201() throws Exception {
        PhotographDTO createDTO = new PhotographDTO(null, "Atardecer", "Hermoso atardecer",
                new BigDecimal("50.00"), 10, "AVAILABLE", 1L, 1L, null);

        when(photographService.create(any(PhotographDTO.class))).thenReturn(samplePhotograph);
        when(photographMapper.entityToDto(samplePhotograph)).thenReturn(samplePhotographDTO);

        mockMvc.perform(post("/api/photographs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Atardecer"))
                .andExpect(jsonPath("$.price").value(50.00));
    }

    @Test
    @DisplayName("GET /api/photographs - Listar todas las fotografías retorna 200 OK")
    void getAll_retorna200YLista() throws Exception {
        when(photographService.getAll()).thenReturn(List.of(samplePhotograph));
        when(photographMapper.entityToDto(samplePhotograph)).thenReturn(samplePhotographDTO);

        mockMvc.perform(get("/api/photographs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("Atardecer"));
    }

    @Test
    @DisplayName("GET /api/photographs/{id} - Obtener fotografía existente retorna 200 OK")
    void getById_existente_retorna200() throws Exception {
        when(photographService.getById(1L)).thenReturn(Optional.of(samplePhotograph));
        when(photographMapper.entityToDto(samplePhotograph)).thenReturn(samplePhotographDTO);

        mockMvc.perform(get("/api/photographs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Atardecer"))
                .andExpect(jsonPath("$.status").value("AVAILABLE"));
    }

    @Test
    @DisplayName("GET /api/photographs/{id} - Obtener fotografía inexistente retorna 404 NOT FOUND")
    void getById_inexistente_retorna404() throws Exception {
        when(photographService.getById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/photographs/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/photographs/{id} - Actualizar fotografía retorna 200 OK")
    void update_retorna200() throws Exception {
        PhotographDTO updateDTO = new PhotographDTO(null, "Amanecer", "Hermoso amanecer",
                new BigDecimal("60.00"), 5, "SOLD", 1L, 1L, null);

        Photograph updatedPhotograph = new Photograph();
        updatedPhotograph.setId(1L);
        updatedPhotograph.setTitle("Amanecer");
        updatedPhotograph.setPrice(new BigDecimal("60.00"));
        updatedPhotograph.setStatus(PhotographStatus.SOLD);

        PhotographDTO updatedDTO = new PhotographDTO(1L, "Amanecer", "Hermoso amanecer",
                new BigDecimal("60.00"), 5, "SOLD", 1L, 1L, LocalDateTime.now());

        when(photographService.update(eq(1L), any(PhotographDTO.class))).thenReturn(updatedPhotograph);
        when(photographMapper.entityToDto(updatedPhotograph)).thenReturn(updatedDTO);

        mockMvc.perform(put("/api/photographs/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Amanecer"))
                .andExpect(jsonPath("$.price").value(60.00))
                .andExpect(jsonPath("$.status").value("SOLD"));
    }

    @Test
    @DisplayName("DELETE /api/photographs/{id} - Eliminar fotografía existente retorna 204 NO CONTENT")
    void delete_existente_retorna204() throws Exception {
        doNothing().when(photographService).delete(1L);

        mockMvc.perform(delete("/api/photographs/1"))
                .andExpect(status().isNoContent());
    }
}

package com.icesi.PhotoMarketApplication.controller.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icesi.PhotoMarketApplication.dto.PhotographerDTO;
import com.icesi.PhotoMarketApplication.entity.Photographer;
import com.icesi.PhotoMarketApplication.mapper.PhotographerMapper;
import com.icesi.PhotoMarketApplication.service.PhotographerService;
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

@WebMvcTest(PhotographerRestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class PhotographerRestControllerTest extends SecurityTestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PhotographerService photographerService;

    @MockitoBean
    private PhotographerMapper photographerMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Photographer photographer;
    private PhotographerDTO photographerDTO;

    @BeforeEach
    void setUp() {
        photographer = new Photographer();
        photographer.setId(1L);
        photographer.setBio("A bio");
        photographer.setWebsite("www.website.com");

        photographerDTO = new PhotographerDTO(1L, 1L, "A bio", "www.website.com", "123456789");
    }

    @Test
    void getAll_ShouldReturnListOfPhotographers() throws Exception {
        Mockito.when(photographerService.getAll()).thenReturn(Arrays.asList(photographer));
        Mockito.when(photographerMapper.entityToDto(photographer)).thenReturn(photographerDTO);

        mockMvc.perform(get("/api/v1/photographers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(photographerDTO.getId()))
                .andExpect(jsonPath("$[0].bio").value(photographerDTO.getBio()));
    }

    @Test
    void getById_ShouldReturnPhotographer() throws Exception {
        Mockito.when(photographerService.getById(1L)).thenReturn(Optional.of(photographer));
        Mockito.when(photographerMapper.entityToDto(photographer)).thenReturn(photographerDTO);

        mockMvc.perform(get("/api/v1/photographers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(photographerDTO.getId()))
                .andExpect(jsonPath("$.bio").value(photographerDTO.getBio()));
    }

    @Test
    void create_ShouldReturnCreatedPhotographer() throws Exception {
        Mockito.when(photographerService.create(any(PhotographerDTO.class))).thenReturn(photographer);
        Mockito.when(photographerMapper.entityToDto(photographer)).thenReturn(photographerDTO);

        mockMvc.perform(post("/api/v1/photographers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(photographerDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(photographerDTO.getId()))
                .andExpect(jsonPath("$.bio").value(photographerDTO.getBio()));
    }

    @Test
    void update_ShouldReturnUpdatedPhotographer() throws Exception {
        Mockito.when(photographerService.update(eq(1L), any(PhotographerDTO.class))).thenReturn(photographer);
        Mockito.when(photographerMapper.entityToDto(photographer)).thenReturn(photographerDTO);

        mockMvc.perform(put("/api/v1/photographers/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(photographerDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(photographerDTO.getId()))
                .andExpect(jsonPath("$.bio").value(photographerDTO.getBio()));
    }

    @Test
    void delete_ShouldReturnNoContent() throws Exception {
        Mockito.doNothing().when(photographerService).delete(1L);

        mockMvc.perform(delete("/api/v1/photographers/1"))
                .andExpect(status().isNoContent());
    }
}

package com.icesi.PhotoMarketApplication.controller.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icesi.PhotoMarketApplication.dto.SaleDTO;
import com.icesi.PhotoMarketApplication.entity.Sale;
import com.icesi.PhotoMarketApplication.mapper.SaleMapper;
import com.icesi.PhotoMarketApplication.service.SaleService;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SaleRestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class SaleRestControllerTest extends SecurityTestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SaleService saleService;

    @MockitoBean
    private SaleMapper saleMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Sale sale;
    private SaleDTO saleDTO;

    @BeforeEach
    void setUp() {
        sale = new Sale();
        sale.setId(1L);
        sale.setTotalAmount(new BigDecimal("100.00"));

        saleDTO = new SaleDTO(1L, 1L, 1L, LocalDateTime.now(), new BigDecimal("100.00"));
    }

    @Test
    void getAll_ShouldReturnListOfSales() throws Exception {
        Mockito.when(saleService.getAll()).thenReturn(Arrays.asList(sale));
        Mockito.when(saleMapper.entityToDto(sale)).thenReturn(saleDTO);

        mockMvc.perform(get("/api/v1/sales"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(saleDTO.getId()))
                .andExpect(jsonPath("$[0].totalAmount").value(100.00));
    }

    @Test
    void getById_ShouldReturnSale() throws Exception {
        Mockito.when(saleService.getById(1L)).thenReturn(Optional.of(sale));
        Mockito.when(saleMapper.entityToDto(sale)).thenReturn(saleDTO);

        mockMvc.perform(get("/api/v1/sales/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saleDTO.getId()))
                .andExpect(jsonPath("$.totalAmount").value(100.00));
    }

    @Test
    void create_ShouldReturnCreatedSale() throws Exception {
        Mockito.when(saleService.create(any(SaleDTO.class))).thenReturn(sale);
        Mockito.when(saleMapper.entityToDto(sale)).thenReturn(saleDTO);

        mockMvc.perform(post("/api/v1/sales")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saleDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(saleDTO.getId()))
                .andExpect(jsonPath("$.totalAmount").value(100.00));
    }

    @Test
    void update_ShouldReturnUpdatedSale() throws Exception {
        Mockito.when(saleService.update(eq(1L), any(SaleDTO.class))).thenReturn(sale);
        Mockito.when(saleMapper.entityToDto(sale)).thenReturn(saleDTO);

        mockMvc.perform(put("/api/v1/sales/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saleDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saleDTO.getId()))
                .andExpect(jsonPath("$.totalAmount").value(100.00));
    }

    @Test
    void delete_ShouldReturnNoContent() throws Exception {
        Mockito.doNothing().when(saleService).delete(1L);

        mockMvc.perform(delete("/api/v1/sales/1"))
                .andExpect(status().isNoContent());
    }
}

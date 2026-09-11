package com.tincadena.app.controller.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tincadena.app.dto.BuyerDTO;
import com.tincadena.app.entity.Buyer;
import com.tincadena.app.mapper.BuyerMapper;
import com.tincadena.app.service.BuyerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import com.tincadena.app.config.SecurityTestConfig;
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

@WebMvcTest(BuyerRestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class BuyerRestControllerTest extends SecurityTestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BuyerService buyerService;

    @MockitoBean
    private BuyerMapper buyerMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Buyer buyer;
    private BuyerDTO buyerDTO;

    @BeforeEach
    void setUp() {
        buyer = new Buyer();
        buyer.setId(1L);
        buyer.setAddress("123 Street");
        buyer.setPhone("123456789");

        buyerDTO = new BuyerDTO(1L, 1L, "123 Street", "123456789");
    }

    @Test
    void getAll_ShouldReturnListOfBuyers() throws Exception {
        Mockito.when(buyerService.getAll()).thenReturn(Arrays.asList(buyer));
        Mockito.when(buyerMapper.entityToDto(buyer)).thenReturn(buyerDTO);

        mockMvc.perform(get("/api/v1/buyers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(buyerDTO.getId()))
                .andExpect(jsonPath("$[0].address").value(buyerDTO.getAddress()));
    }

    @Test
    void getById_ShouldReturnBuyer() throws Exception {
        Mockito.when(buyerService.getById(1L)).thenReturn(Optional.of(buyer));
        Mockito.when(buyerMapper.entityToDto(buyer)).thenReturn(buyerDTO);

        mockMvc.perform(get("/api/v1/buyers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(buyerDTO.getId()))
                .andExpect(jsonPath("$.address").value(buyerDTO.getAddress()));
    }

    @Test
    void create_ShouldReturnCreatedBuyer() throws Exception {
        Mockito.when(buyerService.create(any(BuyerDTO.class))).thenReturn(buyer);
        Mockito.when(buyerMapper.entityToDto(buyer)).thenReturn(buyerDTO);

        mockMvc.perform(post("/api/v1/buyers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buyerDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(buyerDTO.getId()))
                .andExpect(jsonPath("$.address").value(buyerDTO.getAddress()));
    }

    @Test
    void update_ShouldReturnUpdatedBuyer() throws Exception {
        Mockito.when(buyerService.update(eq(1L), any(BuyerDTO.class))).thenReturn(buyer);
        Mockito.when(buyerMapper.entityToDto(buyer)).thenReturn(buyerDTO);

        mockMvc.perform(put("/api/v1/buyers/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buyerDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(buyerDTO.getId()))
                .andExpect(jsonPath("$.address").value(buyerDTO.getAddress()));
    }

    @Test
    void delete_ShouldReturnNoContent() throws Exception {
        Mockito.doNothing().when(buyerService).delete(1L);

        mockMvc.perform(delete("/api/v1/buyers/1"))
                .andExpect(status().isNoContent());
    }
}

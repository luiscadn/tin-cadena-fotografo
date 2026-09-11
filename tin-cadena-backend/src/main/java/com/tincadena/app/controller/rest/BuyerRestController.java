package com.tincadena.app.controller.rest;

import com.tincadena.app.dto.BuyerDTO;
import com.tincadena.app.mapper.BuyerMapper;
import com.tincadena.app.service.BuyerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/buyers")
@Tag(name = "Buyer REST Controller", description = "Endpoints for managing buyers")
public class BuyerRestController {

    private final BuyerService buyerService;
    private final BuyerMapper buyerMapper;

    public BuyerRestController(BuyerService buyerService, BuyerMapper buyerMapper) {
        this.buyerService = buyerService;
        this.buyerMapper = buyerMapper;
    }

    @Operation(summary = "Get all buyers")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @GetMapping
    public ResponseEntity<List<BuyerDTO>> getAll() {
        List<BuyerDTO> buyers = buyerService.getAll().stream()
                .map(buyerMapper::entityToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(buyers);
    }

    @Operation(summary = "Get buyer by ID")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @ApiResponse(responseCode = "404", description = "Buyer not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @GetMapping("/{id}")
    public ResponseEntity<BuyerDTO> getById(@PathVariable Long id) {
        return buyerService.getById(id)
                .map(buyerMapper::entityToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @Operation(summary = "Create a new buyer")
    @ApiResponse(responseCode = "201", description = "Buyer created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @PostMapping
    public ResponseEntity<BuyerDTO> create(@RequestBody BuyerDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(buyerMapper.entityToDto(buyerService.create(dto)));
    }

    @Operation(summary = "Update an existing buyer")
    @ApiResponse(responseCode = "200", description = "Buyer updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "404", description = "Buyer not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @PutMapping("/{id}")
    public ResponseEntity<BuyerDTO> update(@PathVariable Long id, @RequestBody BuyerDTO dto) {
        return ResponseEntity.ok(buyerMapper.entityToDto(buyerService.update(id, dto)));
    }

    @Operation(summary = "Delete a buyer by ID")
    @ApiResponse(responseCode = "204", description = "Buyer deleted successfully")
    @ApiResponse(responseCode = "404", description = "Buyer not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        buyerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

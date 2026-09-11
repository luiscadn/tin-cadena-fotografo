package com.tincadena.app.controller.rest;

import com.tincadena.app.dto.PhotographerDTO;
import com.tincadena.app.mapper.PhotographerMapper;
import com.tincadena.app.service.PhotographerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/photographers")
@Tag(name = "Photographer REST Controller", description = "Endpoints for managing photographers")
public class PhotographerRestController {

    private final PhotographerService photographerService;
    private final PhotographerMapper photographerMapper;

    public PhotographerRestController(PhotographerService photographerService, PhotographerMapper photographerMapper) {
        this.photographerService = photographerService;
        this.photographerMapper = photographerMapper;
    }

    @Operation(summary = "Get all photographers")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @GetMapping
    public ResponseEntity<List<PhotographerDTO>> getAll() {
        List<PhotographerDTO> photographers = photographerService.getAll().stream()
                .map(photographerMapper::entityToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(photographers);
    }

    @Operation(summary = "Get photographer by ID")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @ApiResponse(responseCode = "404", description = "Photographer not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @GetMapping("/{id}")
    public ResponseEntity<PhotographerDTO> getById(@PathVariable Long id) {
        return photographerService.getById(id)
                .map(photographerMapper::entityToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @Operation(summary = "Create a new photographer")
    @ApiResponse(responseCode = "201", description = "Photographer created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @PostMapping
    public ResponseEntity<PhotographerDTO> create(@RequestBody PhotographerDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(photographerMapper.entityToDto(photographerService.create(dto)));
    }

    @Operation(summary = "Update an existing photographer")
    @ApiResponse(responseCode = "200", description = "Photographer updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "404", description = "Photographer not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @PutMapping("/{id}")
    public ResponseEntity<PhotographerDTO> update(@PathVariable Long id, @RequestBody PhotographerDTO dto) {
        return ResponseEntity.ok(photographerMapper.entityToDto(photographerService.update(id, dto)));
    }

    @Operation(summary = "Delete a photographer by ID")
    @ApiResponse(responseCode = "204", description = "Photographer deleted successfully")
    @ApiResponse(responseCode = "404", description = "Photographer not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        photographerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

package com.tincadena.app.controller.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tincadena.app.dto.PhotographDTO;
import com.tincadena.app.mapper.PhotographMapper;
import com.tincadena.app.service.PhotographService;

@RestController
@RequestMapping("/api/photographs")
public class PhotographRestController {

    private final PhotographService photographService;
    private final PhotographMapper photographMapper;

    public PhotographRestController(PhotographService photographService, PhotographMapper photographMapper) {
        this.photographService = photographService;
        this.photographMapper = photographMapper;
    }

    @PostMapping
    public ResponseEntity<PhotographDTO> create(@RequestBody PhotographDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(photographMapper.entityToDto(photographService.create(dto)));
    }

    @GetMapping
    public ResponseEntity<List<PhotographDTO>> getAll() {
        List<PhotographDTO> photos = photographService.getAll().stream()
                .map(photographMapper::entityToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(photos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhotographDTO> getById(@PathVariable Long id) {
        return photographService.getById(id)
                .map(photographMapper::entityToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhotographDTO> update(@PathVariable Long id, @RequestBody PhotographDTO dto) {
        return ResponseEntity.ok(photographMapper.entityToDto(photographService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        photographService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

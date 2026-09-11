package com.icesi.PhotoMarketApplication.controller.rest;

import com.icesi.PhotoMarketApplication.dto.SaleDTO;
import com.icesi.PhotoMarketApplication.mapper.SaleMapper;
import com.icesi.PhotoMarketApplication.service.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/sales")
@Tag(name = "Sale REST Controller", description = "Endpoints for managing sales")
public class SaleRestController {

    private final SaleService saleService;
    private final SaleMapper saleMapper;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;
    private final com.icesi.PhotoMarketApplication.service.PdfService pdfService;

    public SaleRestController(SaleService saleService, SaleMapper saleMapper, 
                              org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate,
                              com.icesi.PhotoMarketApplication.service.PdfService pdfService) {
        this.saleService = saleService;
        this.saleMapper = saleMapper;
        this.messagingTemplate = messagingTemplate;
        this.pdfService = pdfService;
    }

    @Operation(summary = "Get all sales")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @GetMapping
    public ResponseEntity<List<SaleDTO>> getAll() {
        List<SaleDTO> sales = saleService.getAll().stream()
                .map(saleMapper::entityToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(sales);
    }

    @Operation(summary = "Get sale by ID")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @ApiResponse(responseCode = "404", description = "Sale not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @GetMapping("/{id}")
    public ResponseEntity<SaleDTO> getById(@PathVariable Long id) {
        return saleService.getById(id)
                .map(saleMapper::entityToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @Operation(summary = "Create a new sale")
    @ApiResponse(responseCode = "201", description = "Sale created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @PostMapping
    public ResponseEntity<SaleDTO> create(@RequestBody SaleDTO dto) {
        com.icesi.PhotoMarketApplication.entity.Sale createdSale = saleService.create(dto);
        
        // Notify via WebSocket
        messagingTemplate.convertAndSend("/topic/wishlist", 
            "La obra de arte con ID " + createdSale.getPhotograph().getId() + " ha sido vendida.");
            
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(saleMapper.entityToDto(createdSale));
    }

    @Operation(summary = "Update an existing sale")
    @ApiResponse(responseCode = "200", description = "Sale updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "404", description = "Sale not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @PutMapping("/{id}")
    public ResponseEntity<SaleDTO> update(@PathVariable Long id, @RequestBody SaleDTO dto) {
        return ResponseEntity.ok(saleMapper.entityToDto(saleService.update(id, dto)));
    }

    @Operation(summary = "Delete a sale by ID")
    @ApiResponse(responseCode = "204", description = "Sale deleted successfully")
    @ApiResponse(responseCode = "404", description = "Sale not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        saleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Download authenticity certificate")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @ApiResponse(responseCode = "404", description = "Sale not found")
    @GetMapping("/{id}/certificate")
    public ResponseEntity<org.springframework.core.io.InputStreamResource> downloadCertificate(@PathVariable Long id) {
        return saleService.getById(id).map(sale -> {
            java.io.ByteArrayInputStream bis = pdfService.generateCertificate(sale);
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=certificate_" + sale.getId() + ".pdf");
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                    .body(new org.springframework.core.io.InputStreamResource(bis));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}

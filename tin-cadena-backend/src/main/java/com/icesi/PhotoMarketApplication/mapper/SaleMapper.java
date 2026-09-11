package com.icesi.PhotoMarketApplication.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.icesi.PhotoMarketApplication.dto.SaleDTO;
import com.icesi.PhotoMarketApplication.entity.Sale;

@Mapper(componentModel = "spring")
public interface SaleMapper {

    @Mapping(target = "buyerId", source = "buyer.id")
    @Mapping(target = "photographId", source = "photograph.id")
    SaleDTO entityToDto(Sale sale);

    @Mapping(target = "buyer", ignore = true)
    @Mapping(target = "photograph", ignore = true)
    Sale dtoToEntity(SaleDTO dto);
}

package com.tincadena.app.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.tincadena.app.dto.BuyerDTO;
import com.tincadena.app.entity.Buyer;

@Mapper(componentModel = "spring")
public interface BuyerMapper {

    @Mapping(target = "userId", source = "user.id")
    BuyerDTO entityToDto(Buyer buyer);

    @Mapping(target = "user", ignore = true)
    Buyer dtoToEntity(BuyerDTO dto);
}

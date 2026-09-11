package com.icesi.PhotoMarketApplication.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.icesi.PhotoMarketApplication.dto.BuyerDTO;
import com.icesi.PhotoMarketApplication.entity.Buyer;

@Mapper(componentModel = "spring")
public interface BuyerMapper {

    @Mapping(target = "userId", source = "user.id")
    BuyerDTO entityToDto(Buyer buyer);

    @Mapping(target = "user", ignore = true)
    Buyer dtoToEntity(BuyerDTO dto);
}

package com.icesi.PhotoMarketApplication.dto;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {
    private Long id;
    private String name;
    private Set<Long> permissionIds;
    private Set<String> permissionNames;
}

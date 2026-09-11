package com.icesi.PhotoMarketApplication.controller.rest;

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

import com.icesi.PhotoMarketApplication.dto.UserCreateUpdateDTO;
import com.icesi.PhotoMarketApplication.dto.UserDTO;
import com.icesi.PhotoMarketApplication.entity.User;
import com.icesi.PhotoMarketApplication.mapper.UserMapper;
import com.icesi.PhotoMarketApplication.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserRestController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserCreateUpdateDTO dto) {
        if (dto.getRoleId() == null) {
            throw new RuntimeException("User must have a role assigned");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setEmail(dto.getEmail());

        User created = userService.createUser(user, dto.getRoleId());
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.entityToDto(created));
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers().stream()
                .map(userMapper::entityToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(userMapper::entityToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserCreateUpdateDTO dto) {
        User updated = new User();
        updated.setName(dto.getName());
        updated.setEmail(dto.getEmail());
        updated.setPassword(dto.getPassword());

        User result = userService.updateUser(id, updated);
        return ResponseEntity.ok(userMapper.entityToDto(result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

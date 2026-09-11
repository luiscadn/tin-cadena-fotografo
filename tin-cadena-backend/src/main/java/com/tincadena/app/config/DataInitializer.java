package com.tincadena.app.config;

import com.tincadena.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Credenciales:
 *   username: admin
 *   password: admin
 */
@Component
public class DataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        userRepository.findByUsername("admin").ifPresent(admin -> {
            String expectedHash = passwordEncoder.encode("admin");
            // Solo actualiza si la contraseña actual no corresponde a "admin"
            if (!passwordEncoder.matches("admin", admin.getPassword())) {
                admin.setPassword(expectedHash);
                userRepository.save(admin);
                log.info("Admin password updated to 'admin'");
            } else {
                log.info("Admin password already correct");
            }
        });
    }
}

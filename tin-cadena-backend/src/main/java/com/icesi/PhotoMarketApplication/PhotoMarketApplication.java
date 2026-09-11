package com.icesi.PhotoMarketApplication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class PhotoMarketApplication extends SpringBootServletInitializer {

	// Punto de entrada para Tomcat externo (despliegue WAR)
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(PhotoMarketApplication.class);
	}

	// Punto de entrada normal (ejecución local con java -jar)
	public static void main(String[] args) {
		SpringApplication.run(PhotoMarketApplication.class, args);
	}

}

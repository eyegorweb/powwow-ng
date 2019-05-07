package com.docapost.powwow.uiserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class UIServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(UIServerApplication.class, args);
	}
}

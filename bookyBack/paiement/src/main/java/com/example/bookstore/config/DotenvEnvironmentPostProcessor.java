package com.example.bookstore.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.HashMap;
import java.util.Map;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {
    @Override
    public void postProcessEnvironment(ConfigurableEnvironment env,
                                       SpringApplication application) {
        Dotenv dotenv = Dotenv.configure().load();
        Map<String, Object> props = new HashMap<>();

        dotenv.entries().forEach(e ->
                props.put(e.getKey(), e.getValue()));

        env.getPropertySources()
                .addFirst(new MapPropertySource("dotenvProperties", props));
    }
}
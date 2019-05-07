package com.docapost.powwow.uiserver.configuration;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.GzipResourceResolver;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class WebMvcConfigure implements WebMvcConfigurer {

    @Value("${cache.period}")
    private Integer cachePeriod;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(
                "*.ico",
                "**/css/**",
                "**/js/**",
                "**/img/**",
                "**/fonts/**")
        .addResourceLocations("classpath:/public/")
        .setCachePeriod(cachePeriod)
        .resourceChain(true)
        .addResolver(new GzipResourceResolver())
        .addResolver(new PathResourceResolver() {
            @Override
            protected Resource getResource(String resourcePath, Resource location) throws IOException {
                return super.getResource(resourcePath, location);
            }
        });

        // The first call to "/" in the browser comes to a "forward:index.html" in the spring dispatcher
        // So mapping "/" is useless, only "index.html" is required
        registry.addResourceHandler("/", "index.html", "/callback*")
        .addResourceLocations("classpath:/public/index.html")
        .setCachePeriod(0)
        .setCacheControl(CacheControl.noStore().mustRevalidate())
        .resourceChain(false)
        .addResolver(new PathResourceResolver() {
            @Override
            protected Resource getResource(String resourcePath, Resource location) throws IOException {
              return location.exists() && location.isReadable() ? location : null;
            }
          });
    }
   
}

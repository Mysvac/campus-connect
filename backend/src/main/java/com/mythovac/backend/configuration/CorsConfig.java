package com.mythovac.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    /**
     * 配置跨域请求
     * 允许来自特定源的跨域请求
     * @return WebMvcConfigurer
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  // 允许所有路径
                        .allowedOriginPatterns("http://localhost:*", "http://campus.mythovac.com", "https://api.mythovac.com")  // 允许的源
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 允许的方法
                        .allowedHeaders("*")  // 允许所有头
                        .allowCredentials(true)  // 是否允许发送cookie
                        .maxAge(3600);  // 预检请求的缓存时间(秒)
            }
        };
    }

}

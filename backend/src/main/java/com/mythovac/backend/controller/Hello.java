package com.mythovac.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@RestController("hello-controller")
@RequestMapping("/")
public class Hello{

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> hello(){
        Map<String,String> map = new HashMap<>();
        map.put("message", "Hello, World!");

        return ResponseEntity.ok(map);
    }
}


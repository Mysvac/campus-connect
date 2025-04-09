package com.mythovac.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    private Long tid;
    private Long uid;
    private Integer money;
    private String name;
    private String contact;
    private String details;
    private Integer status;
    private String tag;
    private Long time;
}

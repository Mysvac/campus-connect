package com.mythovac.backend.entity;

import lombok.*;


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

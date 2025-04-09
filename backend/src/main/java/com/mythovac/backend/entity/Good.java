package com.mythovac.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Good {
    private Long gid;
    private Long uid;
    private Integer price;
    private String name;
    private String image;
    private Integer tag;
    private String intro;
    private Integer quantity;
    private Integer sales;
    private Long time;
}

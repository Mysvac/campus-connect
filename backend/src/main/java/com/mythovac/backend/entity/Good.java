package com.mythovac.backend.entity;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Good {
    private Long gid;
    private Long uid;
    private Integer price;
    private String name;
    private String image;
    private String tag;
    private String intro;
    private Integer quantity;
    private Integer sales;
    private Long time;

}

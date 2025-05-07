package com.mythovac.backend.entity;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private Long mid;
    private Long uid;
    private String content;
    private String title;
    private Integer praise;
    private String tag;
    private Long time;

}

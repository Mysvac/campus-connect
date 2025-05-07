package com.mythovac.backend.entity;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessagesComment {
    private Long cid;
    private Long mid;
    private Long uid;
    private String content;
    private Integer praise;
    private Long time;

}

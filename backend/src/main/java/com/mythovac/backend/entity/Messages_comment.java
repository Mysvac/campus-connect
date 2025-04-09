package com.mythovac.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Messages_comment {
    private Long cid;
    private Long mid;
    private Long uid;
    private String content;
    private Integer praise;
    private Long time;
}

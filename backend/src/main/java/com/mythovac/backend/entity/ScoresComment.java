package com.mythovac.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScoresComment {
    private Long sid;
    private Long uid;
    private Integer score;
    private String comment;
    private Long time;
}

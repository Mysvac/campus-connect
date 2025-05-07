package com.mythovac.backend.entity;

import lombok.*;


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

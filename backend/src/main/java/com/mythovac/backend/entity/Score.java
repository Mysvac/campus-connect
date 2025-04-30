package com.mythovac.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Score {
    private Long sid;
    private String tag;
    private Integer num;
    private String goal;
    private String intro;
    private String image;
    private Double score;
}

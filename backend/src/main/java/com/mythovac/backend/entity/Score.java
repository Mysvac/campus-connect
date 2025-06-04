package com.mythovac.backend.entity;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Score {
    private Long sid;
    private Long status;
    private String tag;
    private Integer num;
    private String goal;
    private String intro;
    private String image;
    private Double score;

}

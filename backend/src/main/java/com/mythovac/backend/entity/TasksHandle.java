package com.mythovac.backend.entity;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class TasksHandle {
    private Long tid;
    private Long uid;
    private Integer status;
    private String notes;
    private Long time;

}

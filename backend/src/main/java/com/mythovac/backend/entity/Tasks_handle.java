package com.mythovac.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tasks_handle {
    private Long tid;
    private Long uid;
    private Integer status;
    private String notes;
    private Long time;
}

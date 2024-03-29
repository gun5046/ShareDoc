package com.ShareDoc.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommandDto {
    private String user;
    private String command;
    private String type;
    private String value;
    private int index;
}

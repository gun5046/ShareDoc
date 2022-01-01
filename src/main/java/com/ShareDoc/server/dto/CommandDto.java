package com.ShareDoc.server.dto;

import lombok.Data;

@Data
public class CommandDto {
    private String user;
    private String command;
    private String type;
    private String value;
    private int index;
}

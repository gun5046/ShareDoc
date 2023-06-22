package com.ShareDoc.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Message {
    private String id;
    private String element;
    private String type;
    private int index;
    private int timestamp;
}

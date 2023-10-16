package com.jong.lwwtest.data;

import lombok.*;

@AllArgsConstructor
@Data
public class LWWRegister<T> {
    private String peer;
    private int timestamp;
    private T value;
}

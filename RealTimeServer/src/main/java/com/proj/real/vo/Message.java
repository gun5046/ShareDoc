package com.proj.real.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
public class Message {
	private String id;
	private String userId;
	private String text;
}

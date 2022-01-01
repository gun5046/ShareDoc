package com.ShareDoc.server.model;

import com.ShareDoc.server.dto.CommandDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Command {
	private String user;
	private String command;
	private String type;
	private char value;
	private int index;

	public Command (CommandDto cd){
		this.user=cd.getUser();
		this.command=cd.getCommand();
		this.type=cd.getType();
		this.index=cd.getIndex();
		this.value=(char)(Integer.parseInt(cd.getValue())+32);
	}
}

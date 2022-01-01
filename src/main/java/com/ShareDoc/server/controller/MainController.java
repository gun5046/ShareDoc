package com.ShareDoc.server.controller;

import com.ShareDoc.server.dto.CommandDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ShareDoc.server.model.Command;

import lombok.RequiredArgsConstructor;

import java.util.LinkedList;
import java.util.Queue;

@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/")
public class MainController{

	private final SimpMessagingTemplate spmt;

	Queue<Command> q = new LinkedList<>();
	@GetMapping("/")
	public String main() {
			return "main";
	}
	
	@MessageMapping("/chat.send")
	public void sendCommand(CommandDto commanddto) {
		int ttl = 0 ;
		System.out.println(commanddto.getCommand());

		Command command = new Command(commanddto);

		q.add(command);
		while(q.peek().getUser()!=command.getUser()){
			try {
				Thread.sleep(10);
				System.out.println(ttl++);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}

		spmt.convertAndSend("/topic/doc", q.poll());

	}
	
}

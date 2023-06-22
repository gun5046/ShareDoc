package com.ShareDoc.server.controller;

import com.ShareDoc.server.dto.CommandDto;
import com.ShareDoc.server.model.LamportClock;
import com.ShareDoc.server.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/")
public class MainController{
	private final List<String> document = new ArrayList<>();
	private final LamportClock lamportClock = new LamportClock();
	private final SimpMessagingTemplate spmt;

//	Queue<Command> q = new LinkedList<>();
	@GetMapping("/")
	public String main() {
			return "main";
	}

	@MessageMapping("/add")
	public void addElement(Message message) {
		lamportClock.update(message.getTimestamp());
		lamportClock.tick();

		String element = message.getElement();
		int index = message.getIndex();

		if (index < 0 || index > document.size()) {
			index = document.size(); // 마지막 위치에 추가
		}

		document.add(index, element);
		document.forEach(e -> System.out.print((char)(Integer.parseInt(e))));
		System.out.println();

		spmt.convertAndSend("/topic/doc", new Message(message.getId(), element,"ADD", index, lamportClock.getTime()));

	}

	@MessageMapping("/remove")
	public void removeElement(Message message) {
		lamportClock.update(message.getTimestamp());
		lamportClock.tick();
		int index = message.getIndex();
		if (index >= 0 && index <= document.size()) {

			String element = document.remove(index-1);
			document.forEach(e -> System.out.print((char)(Integer.parseInt(e))));
			System.out.println();
			spmt.convertAndSend("/topic/doc", new Message(message.getId(), element, "REMOVE", index, lamportClock.getTime()));
		}



	}
}

package com.proj.real.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.proj.real.service.ChatService;
import com.proj.real.vo.Message;
import com.proj.real.vo.Room;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
public class MainController {
	
	private final ChatService chatService;
	
	@PostMapping("/room")
	public ResponseEntity<?> makeRoom(@RequestBody Room room){
		chatService.makeRoom(room);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@GetMapping("/rooms")
	public ResponseEntity<?> getRooms(){
		List<Room> list = chatService.getRooms();

		return new ResponseEntity<List<Room>>(list, HttpStatus.OK);
	}
	
	
	
	@MessageMapping("/chat/message")
	public String sendMessage(@RequestBody Message msg) {
		return "index";
	}
	
	

}

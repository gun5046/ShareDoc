package com.jong.lwwtest.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jong.lwwtest.data.LWWRegister;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/")
public class LWWController {

    private List<String> user = new ArrayList<>();
    private final SimpMessagingTemplate spmt;

    @MessageMapping("/chat.send")
    @SendTo("/topic/doc")
    public LWWRegister<String> sendCommand(LWWRegister<String> msg) {
        System.out.println("Send : " + msg);
        return msg;
    }

    @MessageMapping("/chat.enter")
    public void enterChattingRoom(String msg) throws JsonProcessingException {

        if(!user.contains(msg)){
            System.out.println("Enter Room : " + msg);
            user.add(msg);
            spmt.convertAndSend("/topic/room", msg);
        }

    }


}

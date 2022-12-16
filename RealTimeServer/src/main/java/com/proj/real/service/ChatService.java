package com.proj.real.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import com.proj.real.vo.Room;

@Service
public class ChatService {
	List<Room> roomList;
	
	@PostConstruct
	public void init() {
		 roomList = new ArrayList<Room>();
	}
	
	public void makeRoom(Room room) {

		roomList.add(new Room(room.getRoomName()));
	}
	
	public List<Room> getRooms() {
		return roomList;
	}
	
	
}

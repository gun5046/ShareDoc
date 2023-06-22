package com.ShareDoc.server.model;

public class AddMessage extends Message{
    public AddMessage(){
        super();
    }

    public AddMessage(String id, String element, int index, int timestamp) {
        super(id, element,"ADD", index, timestamp);
    }
}

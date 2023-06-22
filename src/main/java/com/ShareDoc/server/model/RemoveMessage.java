package com.ShareDoc.server.model;

public class RemoveMessage extends Message{
    public RemoveMessage(){
        super();
    }

    public RemoveMessage(String id, String element, int index, int timestamp) {
        super(id, element,"REMOVE", index, timestamp);
    }
}

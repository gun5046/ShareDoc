package com.ShareDoc.server.model;

public class LamportClock {
    private int time = 0;

    public void tick() {
        time += 1;
    }

    public void update(int remoteTime) {
        time = Math.max(time, remoteTime) + 1;
    }

    public int getTime() {
        return time;
    }
}

package com.c43.portfolio_manager.model;
import java.sql.Timestamp;

public class FriendRequest {
	public int request_id;
	public int sender_id;
	public int receiver_id;
	public String username;
	public String status;
	public Timestamp last_updated;
	
	public FriendRequest(int request_id, int sender_id, int receiver_id, String username, String status, Timestamp last_updated) {
		this.request_id = request_id;
		this.sender_id = sender_id;
		this.receiver_id = receiver_id;
		this.username = username;
		this.status = status;
		this.last_updated = last_updated;
	}
}
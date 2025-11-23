package com.c43.portfolio_manager.model;
import java.sql.Date;

public class FriendRequest {
	private int request_id;
	private int sender_id;
	private int receiver_id;
	private String status;
	private Date last_updated;
	
	public FriendRequest(int request_id, int sender_id, int receiver_id, String status, Date last_updated) {
		this.request_id = request_id;
		this.sender_id = sender_id;
		this.receiver_id = receiver_id;
		this.status = status;
		this.last_updated = last_updated;
	}
}

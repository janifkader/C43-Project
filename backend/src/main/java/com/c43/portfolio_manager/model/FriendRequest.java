package com.c43.portfolio_manager.model;
import java.sql.Timestamp;

import jakarta.validation.constraints.*;

public class FriendRequest {
	
	@Min(value = 0, message = "Request ID must be positive")
	public int request_id;
	
	@Min(value = 0, message = "Sender ID must be positive")
	public int sender_id;
	
	@Min(value = 0, message = "Receiver ID must be positive")
	public int receiver_id;
	
	@NotBlank(message = "Username cannot be empty")
	@Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username can only contain letters and numbers")
	public String username;
	
	@NotBlank(message = "Username cannot be empty")
	@Pattern(regexp = "ACCEPTED|CANCELLED|PENDING|REMOVED|REJECTED", message = "Invalid friend request status")
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
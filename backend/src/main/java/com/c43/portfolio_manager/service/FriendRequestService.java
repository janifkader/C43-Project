package com.c43.portfolio_manager.service;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.model.FriendRequest;
import com.c43.portfolio_manager.repository.FriendRequestRepo;

@Service
public class FriendRequestService {	
	
	private FriendRequestRepo repo = new FriendRequestRepo();
	
	public int createFriendRequest(int sender_id, int receiver_id, String status, Date last_updated) {
		return repo.createFriendRequest(sender_id, receiver_id, status, last_updated);
	}
	
	public List<FriendRequest> getFriendRequests(int user_id) {
		return repo.getFriendRequests(user_id);
	}
}

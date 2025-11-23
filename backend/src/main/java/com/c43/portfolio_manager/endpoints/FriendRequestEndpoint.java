package com.c43.portfolio_manager.endpoints;

import java.sql.Date;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.FriendRequest;
import com.c43.portfolio_manager.service.FriendRequestService;

@RestController
@RequestMapping("/friends")
public class FriendRequestEndpoint {
	private final FriendRequestService service;
	
	public FriendRequestEndpoint(FriendRequestService service) {
		this.service = service;
	}
	
	@PostMapping("/")
	public int create(@RequestParam int sender_id, @RequestParam int receiver_id, @RequestParam String status, @RequestParam Date last_updated) {
		return service.createFriendRequest(sender_id, receiver_id, status, last_updated);
	}
	
	@GetMapping("/")
	public List<FriendRequest> get(@RequestParam int user_id) {
		return service.getFriendRequests(user_id);
	}
}

package com.c43.portfolio_manager.endpoints;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.c43.portfolio_manager.model.FriendRequest;
import com.c43.portfolio_manager.service.FriendRequestService;

import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("/friends")
public class FriendRequestEndpoint {
    private final FriendRequestService service;
    
    public FriendRequestEndpoint(FriendRequestService service) {
        this.service = service;
    }
    
    @PostMapping("/")
    public int sendFriendRequest(@CookieValue(value = "user_id", defaultValue = "-1") int sender_id, @RequestParam @Min(value = 1, message = "Receiver ID must be positive") int receiver_id) {
        return service.sendFriendRequest(sender_id, receiver_id);
    }
    
    @GetMapping("/incoming/")
    public List<FriendRequest> getIncomingRequests(@CookieValue(value = "user_id", defaultValue = "-1") int user_id) {
        return service.getIncomingFriendRequests(user_id);
    }
    
    @GetMapping("/outgoing/") 
    public List<FriendRequest> getOutgoingRequests(@CookieValue(value = "user_id", defaultValue = "-1") int user_id) {
        return service.getOutgoingFriendRequests(user_id);
    }
    
    @PostMapping("/accept/")
    public boolean acceptRequest(@RequestParam @Min(value = 1, message = "Request ID must be positive") int request_id) {
        return service.acceptFriendRequest(request_id);
    }
    
    @PostMapping("/reject/")
    public boolean rejectRequest(@RequestParam @Min(value = 1, message = "Request ID must be positive") int request_id) {
        return service.rejectFriendRequest(request_id);
    }
    
    @PostMapping("/remove/")
    public boolean removeFriend(@RequestParam @Min(value = 1, message = "Request ID must be positive") int request_id, @CookieValue(value = "user_id", defaultValue = "-1") int user_id) {
        return service.removeFriend(request_id, user_id);
    }
    
    @PostMapping("/unsend/")
    public boolean unsendRequest(@RequestParam @Min(value = 1, message = "Request ID must be positive") int request_id, @CookieValue(value = "user_id", defaultValue = "-1") int user_id) {
        return service.unsendFriendRequest(request_id, user_id);
    }
    
    @GetMapping("/")
    public List<FriendRequest> getFriends(@CookieValue(value = "user_id", defaultValue = "-1") int user_id) {
        return service.showFriends(user_id);
    }
    
    @GetMapping("/can-resend/")
    public boolean canResendRequest(@CookieValue(value = "user_id", defaultValue = "-1") int sender_id, @RequestParam @Min(value = 1, message = "Receiver ID must be positive") int receiver_id) {
        return service.canResendRequest(sender_id, receiver_id);
    }
}
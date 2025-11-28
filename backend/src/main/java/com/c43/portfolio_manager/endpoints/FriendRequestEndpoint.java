package com.c43.portfolio_manager.endpoints;

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
    
    @PostMapping("/send")
    public int sendFriendRequest(@RequestParam int sender_id, @RequestParam int receiver_id) {
        return service.sendFriendRequest(sender_id, receiver_id);
    }
    
    @GetMapping("/incoming")
    public List<FriendRequest> getIncomingRequests(@RequestParam int user_id) {
        return service.getIncomingFriendRequests(user_id);
    }
    
    @GetMapping("/outgoing") 
    public List<FriendRequest> getOutgoingRequests(@RequestParam int user_id) {
        return service.getOutgoingFriendRequests(user_id);
    }
    
    @PostMapping("/accept")
    public boolean acceptRequest(@RequestParam int request_id) {
        return service.acceptFriendRequest(request_id);
    }
    
    @PostMapping("/reject")
    public boolean rejectRequest(@RequestParam int request_id) {
        return service.rejectFriendRequest(request_id);
    }
    
    @PostMapping("/remove")
    public boolean removeFriend(@RequestParam int request_id, @RequestParam int user_id) {
        return service.removeFriend(request_id, user_id);
    }
    
    @PostMapping("/unsend")
    public boolean unsendRequest(@RequestParam int request_id, @RequestParam int user_id) {
        return service.unsendFriendRequest(request_id, user_id);
    }
    
    @GetMapping("/list")
    public List<Integer> getFriends(@RequestParam int user_id) {
        return service.showFriends(user_id);
    }
    
    @GetMapping("/can-resend")
    public boolean canResendRequest(@RequestParam int sender_id, @RequestParam int receiver_id) {
        return service.canResendRequest(sender_id, receiver_id);
    }
}
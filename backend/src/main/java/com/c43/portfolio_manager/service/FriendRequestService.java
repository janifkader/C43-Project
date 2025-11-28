package com.c43.portfolio_manager.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.c43.portfolio_manager.model.FriendRequest;
import com.c43.portfolio_manager.repository.FriendRequestRepo;

@Service
public class FriendRequestService {	
    
    private FriendRequestRepo repo = new FriendRequestRepo();
    
    public int sendFriendRequest(int sender_id, int receiver_id) {
        return repo.sendFriendRequest(sender_id, receiver_id);
    }
    
    public List<FriendRequest> getIncomingFriendRequests(int user_id) {
        return repo.getIncomingFriendRequests(user_id);
    }
    
    public List<FriendRequest> getOutgoingFriendRequests(int user_id) {
        return repo.getOutgoingFriendRequests(user_id);
    }
    
    public boolean acceptFriendRequest(int request_id) {
        return repo.acceptFriendRequest(request_id);
    }
    
    public boolean rejectFriendRequest(int request_id) {
        return repo.rejectFriendRequest(request_id);
    }
    
    public boolean removeFriend(int request_id, int user_id) {
        return repo.removeFriend(request_id, user_id);
    }
    
    public boolean unsendFriendRequest(int request_id, int user_id) {
        return repo.unsendFriendRequest(request_id, user_id);
    }
    
    public List<Integer> showFriends(int user_id) {
        return repo.showFriends(user_id);
    }
    
    public boolean canResendRequest(int sender_id, int receiver_id) {
        return repo.canResendRequest(sender_id, receiver_id);
    }
}
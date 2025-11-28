package com.c43.portfolio_manager.repository;

import java.sql.Connection;
import java.sql.Timestamp;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.c43.portfolio_manager.Database;
import com.c43.portfolio_manager.model.FriendRequest;

public class FriendRequestRepo {
	
	// Check if 5 minutes passed to resend a friend request.
	public boolean canResendRequest(int sender_id, int receiver_id) {
        String sql = "SELECT last_updated, status FROM FriendRequest WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND status IN ('REJECTED', 'REMOVED', 'CANCELLED') ORDER BY last_updated DESC LIMIT 1";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = Database.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, sender_id);
            pstmt.setInt(2, receiver_id);
            pstmt.setInt(3, receiver_id);
            pstmt.setInt(4, sender_id);
            rs = pstmt.executeQuery();
            
            if (rs.next()) {
                Timestamp last_update_time = rs.getTimestamp("last_updated");
                long five_mins_ago = System.currentTimeMillis() - (5*60*1000);
                return last_update_time.getTime() < five_mins_ago;
            }
            return true;
        } 
        catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
        finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
    }
	
	
	// Creates and sends a friend request to the other user.
	public int sendFriendRequest(int sender_id, int receiver_id) {
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    
	    try {
	        conn = Database.getConnection();
	        
	        // avoiding duplicate request
	        String check_duplicate_sql = "SELECT request_id, status FROM FriendRequest WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND status IN ('ACCEPTED', 'PENDING')";
	        pstmt = conn.prepareStatement(check_duplicate_sql);
	        pstmt.setInt(1, sender_id);
	        pstmt.setInt(2, receiver_id);
	        pstmt.setInt(3, receiver_id);
	        pstmt.setInt(4, sender_id);
	        rs = pstmt.executeQuery();
	        
	        if (rs.next()) {
	            String existingStatus = rs.getString("status");
	            if ("ACCEPTED".equals(existingStatus)) {
	                return -1;
	            } else if ("PENDING".equals(existingStatus)) {
	                return -1;
	            }
	        }
	        rs.close();
	        pstmt.close();
	        
	        // Check 5 mins.
	        if (!canResendRequest(sender_id, receiver_id)) {
	            return -1;
	        }
	        
	        // 3. Check if there's an existing row we can reuse (REJECTED, REMOVED, CANCELLED)
	        String findExistingSql = "SELECT request_id FROM FriendRequest " +
	                                "WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) " +
	                                "AND status IN ('REJECTED', 'REMOVED', 'CANCELLED') " +
	                                "ORDER BY last_updated DESC LIMIT 1";
	        pstmt = conn.prepareStatement(findExistingSql);
	        pstmt.setInt(1, sender_id);
	        pstmt.setInt(2, receiver_id);
	        pstmt.setInt(3, receiver_id);
	        pstmt.setInt(4, sender_id);
	        rs = pstmt.executeQuery();
	        
	        if (rs.next()) { // update previous entry row instead of making new new request_id.
	            int old_request_id = rs.getInt("request_id");
	            rs.close();
	            pstmt.close();
	            
	            String updateSql = "UPDATE FriendRequest SET status = 'PENDING', last_updated = ? WHERE request_id = ?";
	            pstmt = conn.prepareStatement(updateSql);
	            pstmt.setTimestamp(1, new Timestamp(System.currentTimeMillis()));
	            pstmt.setInt(2, old_request_id);
	            
	            int rows_updated = pstmt.executeUpdate();
	            if (rows_updated > 0) {
	                return old_request_id;
	            }
	        } else {
	            rs.close();
	            pstmt.close();
	            
	            //create new entry
	            String sql = "INSERT INTO FriendRequest (sender_id, receiver_id, status, last_updated) VALUES (?, ?, 'PENDING', ?) RETURNING request_id";
	            pstmt = conn.prepareStatement(sql);
	            pstmt.setInt(1, sender_id);
	            pstmt.setInt(2, receiver_id);
	            pstmt.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
	            
	            rs = pstmt.executeQuery();
	            if (rs.next()) {
	                return rs.getInt("request_id");
	            }
	        }
	    }
	    catch (SQLException e) {
	        e.printStackTrace();
	    }
	    finally {
	        try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
	    }
	    return -1;
	}
	
	
	// Gets all the incoming friend requests for the user.
	public List<FriendRequest> getIncomingFriendRequests(int user_id) {
	    String sql = "SELECT U.username, U.user_id AS id, Fr.* FROM FriendRequest Fr JOIN Users U ON Fr.sender_id = U.user_id WHERE Fr.receiver_id = ? AND Fr.status = 'PENDING'";
	    List<FriendRequest> requests = new ArrayList<>();
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	int request_id = rs.getInt("request_id");
	    		int sender_id = rs.getInt("sender_id");
	    		int receiver_id = rs.getInt("receiver_id");
	    		String username = rs.getString("username");
	    		String status = rs.getString("status");
	    		Timestamp last_updated = rs.getTimestamp("last_updated");
                requests.add(new FriendRequest(request_id, sender_id, receiver_id, username, status, last_updated));
	        }
	    }
	    catch (SQLException e) {
	        e.printStackTrace();
	    }
	    finally {
	        try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
	    }

	    return requests;
	}
	
	
	// Gets all the outgoing friend requests for the user.
	public List<FriendRequest> getOutgoingFriendRequests(int user_id) {
	    String sql = "SELECT U.username, U.user_id AS id, Fr.* FROM FriendRequest Fr JOIN Users U ON Fr.receiver_id = U.user_id WHERE Fr.sender_id = ? AND Fr.status != 'CANCELLED' AND Fr.status != 'ACCEPTED' AND Fr.status != 'REMOVED'";
	    List<FriendRequest> requests = new ArrayList<>();
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	int request_id = rs.getInt("request_id");
	    		int sender_id = rs.getInt("sender_id");
	    		int receiver_id = rs.getInt("receiver_id");
	    		String username = rs.getString("username");
	    		String status = rs.getString("status");
	    		Timestamp last_updated = rs.getTimestamp("last_updated");
	            requests.add(new FriendRequest(request_id, sender_id, receiver_id, username, status, last_updated));
	        }
	    }
	    catch (SQLException e) {
	        e.printStackTrace();
	    }
	    finally {
	        try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
	    }

	    return requests;
	}
	
	
	// Accept the incoming friend request for the user.
	public boolean acceptFriendRequest(int request_id) {
	    String sql = "UPDATE FriendRequest SET status = 'ACCEPTED', last_updated = ? WHERE request_id = ?";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    try {
	        conn = Database.getConnection();
	        pstmt = conn.prepareStatement(sql);
	        pstmt.setTimestamp(1, new Timestamp(System.currentTimeMillis()));
	        pstmt.setInt(2, request_id);
	        
	        int rowsUpdated = pstmt.executeUpdate();
	        return rowsUpdated > 0;
	    }
	    catch (SQLException e) {
	        e.printStackTrace();
	        return false;
	    }
	    finally {
	        try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
	    }
	}
	
	
	// Reject the incoming friend request for the user.
	public boolean rejectFriendRequest(int request_id) {
	    String sql = "UPDATE FriendRequest SET status = 'REJECTED', last_updated = ? WHERE request_id = ?";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    try {
	        conn = Database.getConnection();
	        pstmt = conn.prepareStatement(sql);
	        pstmt.setTimestamp(1, new Timestamp(System.currentTimeMillis()));
	        pstmt.setInt(2, request_id);
	        
	        int rowsUpdated = pstmt.executeUpdate();
	        return rowsUpdated > 0;
	    }
	    catch (SQLException e) {
	        e.printStackTrace();
	        return false;
	    }
	    finally {
	        try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
	    }
	}
	
	
	// Remove an existing friend for the user.
	public boolean removeFriend(int request_id, int user_id) {
		String sql = "UPDATE FriendRequest SET status = 'REMOVED', last_updated = ? WHERE request_id = ? AND (sender_id = ? OR receiver_id = ?) AND status = 'ACCEPTED'";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    try {
            conn = Database.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setTimestamp(1, new Timestamp(System.currentTimeMillis()));
            pstmt.setInt(2, request_id);
            pstmt.setInt(3, user_id);
            pstmt.setInt(4, user_id);
            
            int rowsUpdated = pstmt.executeUpdate();
            return rowsUpdated > 0;
        }
	    catch (SQLException e) {
	        e.printStackTrace();
	        return false;
	    }
	    finally {
	        try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
	    }
	}
	
	
	// Unsend a sent friend request before it is accepted by the other user.
	public boolean unsendFriendRequest(int request_id, int user_id) {
		String sql = "UPDATE FriendRequest SET status = 'CANCELLED', last_updated = ? WHERE request_id = ? AND sender_id = ? AND status = 'PENDING' OR status = 'REJECTED'";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    try {
            conn = Database.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setTimestamp(1, new Timestamp(System.currentTimeMillis()));
            pstmt.setInt(2, request_id);
            pstmt.setInt(3, user_id);
            
            int rowsUpdated = pstmt.executeUpdate();
            return rowsUpdated > 0;
        }
	    catch (SQLException e) {
	        e.printStackTrace();
	        return false;
	    }
	    finally {
	        try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
	    }
	}
	
	
	// Show all friends of the user.
	public List<FriendRequest> showFriends(int user_id) {
		String sql = "SELECT U.username, U.user_id AS friend_id, fr.* FROM FriendRequest fr JOIN Users U ON (fr.sender_id = U.user_id OR fr.receiver_id = U.user_id) WHERE (fr.sender_id = ? OR fr.receiver_id = ?) AND fr.status = 'ACCEPTED' AND U.user_id != ?";
	    List<FriendRequest> friends_list = new ArrayList<>();
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);
	        pstmt.setInt(2, user_id);
	        pstmt.setInt(3, user_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	int request_id = rs.getInt("request_id");
	    		int sender_id = rs.getInt("sender_id");
	    		int receiver_id = rs.getInt("receiver_id");
	    		String username = rs.getString("username");
	    		String status = rs.getString("status");
	    		Timestamp last_updated = rs.getTimestamp("last_updated");
	            friends_list.add(new FriendRequest(request_id, sender_id, receiver_id, username, status, last_updated));
	        }
	    }
	    catch (SQLException e) {
	        e.printStackTrace();
	    }
	    finally {
	        try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace(); }
	        try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace(); }
	    }

	    return friends_list;
	}
	
}
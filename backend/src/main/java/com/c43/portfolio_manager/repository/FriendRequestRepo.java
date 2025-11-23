package com.c43.portfolio_manager.repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.c43.portfolio_manager.Database;
import com.c43.portfolio_manager.model.FriendRequest;

public class FriendRequestRepo {
	public int createFriendRequest(int sender_id, int receiver_id, String status, Date last_updated) {
	    String sql = "INSERT INTO FriendRequest (sender_id, receiver_id, status, last_updated) VALUES (?, ?. ?, ?) RETURNING request_id;";

	    try {
	    	Connection conn = Database.getConnection(); 
	    	PreparedStatement pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, sender_id);
	        pstmt.setInt(2, receiver_id);
	        pstmt.setString(3, status);
	        pstmt.setDate(4, last_updated);

	        ResultSet rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("request_id");
	        }
	    } catch (SQLException e) {
	        e.printStackTrace();
	    }

	    return -1;
	}
	public List<FriendRequest> getFriendRequests(int user_id) {
	    String sql = "SELECT request_id FROM FriendRequest WHERE sender_id = ? OR receiver_id = ?;";
	    List<FriendRequest> requests = new ArrayList<>();

	    try {
	    	Connection conn = Database.getConnection(); 
	    	PreparedStatement pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);

	        ResultSet rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	int request_id = rs.getInt("request_id");
	    		int sender_id = rs.getInt("sender_id");
	    		int receiver_id = rs.getInt("receiver_id");
	    		String status = rs.getString("status");
	    		Date last_updated = rs.getDate("last_updated");
	            requests.add(new FriendRequest(request_id, sender_id, receiver_id, status, last_updated));
	        }
	    } 
	    catch (SQLException e) {
	        e.printStackTrace();
	    }

	    return requests;
	}
	/*public boolean changeFriendRequest(Connection conn, int request_id, String status, Date date) {
		String sql = "UPDATE FriendRequest SET status = ? AND last_updated = ? WHERE request_id = ?";
		
		try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
			pstmt.setString(1, status);
			pstmt.setDate(2, date);
			pstmt.setInt(3, request_id);
			
			pstmt.executeQuery();
			return true;
		}
		catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}*/
}

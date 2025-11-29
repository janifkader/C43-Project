package com.c43.portfolio_manager.repository;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.c43.portfolio_manager.Database;

public class UserRepo {
	
	// Create a new user upon registering.
	public int createUser(String username, String password) {
	    String sql = "INSERT INTO Users (username, password) VALUES (?, ?) RETURNING user_id;";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setString(1, username);
	        pstmt.setString(2, password);

	        rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("user_id");
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
	
	
	// Use to check if login details are correct.
	public int getUser(String username, String password) {
		String sql = "SELECT user_id FROM Users WHERE username = ? AND password = ?";
		Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
		try {
			conn = Database.getConnection(); 
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, username);
			pstmt.setString(2, password);
			
			rs = pstmt.executeQuery();
			
			if (rs.next()) {
				return rs.getInt("user_id");
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
	
	
	// Get user's details (username) using user_id.
	public String getUsername(int user_id) {
        String sql = "SELECT username FROM Users WHERE user_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = Database.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, user_id);
            
            rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getString("username");
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
        return null;
    }

}

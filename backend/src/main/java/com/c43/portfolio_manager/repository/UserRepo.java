package com.c43.portfolio_manager.repository;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.c43.portfolio_manager.Database;

public class UserRepo {
	public int createUser(String username, String password) {
	    String sql = "INSERT INTO Users (username, password) VALUES (?, ?) RETURNING user_id;";
	    try {
	    	Connection conn = Database.getConnection(); 
	    	PreparedStatement pstmt = conn.prepareStatement(sql);
	        pstmt.setString(1, username);
	        pstmt.setString(2, password);

	        ResultSet rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("user_id");
	        }
	    } 
	    catch (SQLException e) {
	        e.printStackTrace();
	    }

	    return -1;
	}
	
	public int getUser(String username, String password) {
		String sql = "SELECT user_id FROM Users WHERE username = ? AND password = ?";
		
		try {
			Connection conn = Database.getConnection(); 
			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, username);
			pstmt.setString(2, password);
			
			ResultSet rs = pstmt.executeQuery();
			
			if (rs.next()) {
				return rs.getInt("user_id");
			}
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		return -1;
	}
}

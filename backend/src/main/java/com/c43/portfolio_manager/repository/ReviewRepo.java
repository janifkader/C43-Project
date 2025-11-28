package com.c43.portfolio_manager.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.c43.portfolio_manager.Database;
import com.c43.portfolio_manager.model.ReviewText;

public class ReviewRepo {
	
	public int createReview(int user_id, int sl_id, String text) {
	    String sql = "INSERT INTO Review (user_id, sl_id, text) VALUES (?, ?, ?) RETURNING review_id;";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);
	        pstmt.setInt(2, sl_id);
	        pstmt.setString(3, text);

	        rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("review_id");
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
	
	public List<ReviewText> getReviews(int sl_id) {
	    String sql = "SELECT u.username, r.text FROM Review r JOIN Users u ON r.user_id = u.user_id WHERE r.sl_id = ?;";
	    List<ReviewText> reviews = new ArrayList<>();
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection();
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, sl_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	String username = rs.getString("username");
	        	String text = rs.getString("text");
	            reviews.add(new ReviewText(username, text));
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

	    return reviews;
	}
	
	/*public boolean deleteReview(Connection conn, int review_id) {
		String sql = "DELETE FROM Review WHERE review_id = ?";
		
		try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
			pstmt.setInt(1, review_id);
			
			pstmt.executeQuery();
			return true;
		}
		catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}*/
}

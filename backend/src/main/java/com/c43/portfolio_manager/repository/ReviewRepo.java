package com.c43.portfolio_manager.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.c43.portfolio_manager.Database;
import com.c43.portfolio_manager.model.Review;

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
	
	public List<Review> getReviews(int sl_id) {
		String sql = "SELECT r.review_id, r.user_id, r.text FROM Review r WHERE r.sl_id = ?";
		List<Review> reviews = new ArrayList<>();
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection();
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, sl_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	int review_id = rs.getInt("review_id");
	        	int user_id = rs.getInt("user_id");
	            String text = rs.getString("text");
	            reviews.add(new Review(review_id, user_id, sl_id, text));
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
	
	public boolean deleteReview(int review_id, int user_id) {
		// delete review only if (1. Deleter is the person who wrote review) or (2. Deleter owns Stocklist)
        String sql = "DELETE FROM Review WHERE review_id = ? AND (user_id = ? OR sl_id IN (SELECT sl_id FROM StockList WHERE user_id = ?))";
        Connection conn = null;
        PreparedStatement pstmt = null;
        try {
            conn = Database.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, review_id);
            pstmt.setInt(2, user_id);
            pstmt.setInt(3, user_id);
            
            int rowsDeleted = pstmt.executeUpdate();
            return rowsDeleted > 0;
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
	
	public boolean editReview(int review_id, int user_id, String new_text) {
        String sql = "UPDATE Review SET text = ? WHERE review_id = ? AND user_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        try {
            conn = Database.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, new_text);
            pstmt.setInt(2, review_id);
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
	
}

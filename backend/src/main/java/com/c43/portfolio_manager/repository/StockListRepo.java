package com.c43.portfolio_manager.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.c43.portfolio_manager.Database;
import com.c43.portfolio_manager.model.StockList;

public class StockListRepo {
	public int createStockList(int user_id, String visibility) {
	    String sql = "INSERT INTO StockList (user_id, visibility) VALUES (?, ?) RETURNING sl_id;";

	    try {
	    	Connection conn = Database.getConnection(); 
	    	PreparedStatement pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);
	        pstmt.setString(2, visibility);

	        ResultSet rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("sl_id");
	        }
	    } 
	    catch (SQLException e) {
	        e.printStackTrace();
	    }

	    return -1;
	}
	
	public List<StockList> getStockLists(int user_id) {
	    String sql = "SELECT * FROM StockList WHERE user_id = ? UNION SELECT s.sl_id, sl.user_id, sl.visibility FROM sharedto s INNER JOIN StockList sl ON s.sl_id = sl.sl_id WHERE s.user_id = ?;";
	    List<StockList> lists = new ArrayList<>();

	    try {
	    Connection conn = Database.getConnection(); 
	    	PreparedStatement pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);
	        pstmt.setInt(2, user_id);

	        ResultSet rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	int sl_id = rs.getInt("sl_id");
	        	int u_id = rs.getInt("user_id");
	        	String visibility = rs.getString("visibility");
	            lists.add(new StockList(sl_id, u_id, visibility));
	        }
	    } catch (SQLException e) {
	        e.printStackTrace();
	    }

	    return lists;
	}
	
	/*public int shareStockList(Connection conn, int sl_id, String visibility) {
		String sql = "UPDATE StockList SET visibility = ? WHERE sl_id = ? RETURNING sl_id;";
		try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
			pstmt.setString(1, visibility);
			pstmt.setInt(2, sl_id);
			
			ResultSet rs = pstmt.executeQuery();
			
			if (rs.next()) {
	            return rs.getInt("sl_id");
	        }
		}
		catch(SQLException e) {
			e.printStackTrace();
		}
		return -1;
	}
	
	public boolean createContains(Connection conn, int sl_id, String symbol, int num_of_shares) {
	    String sql = "INSERT INTO contains (sl_id, symbol, num_of_shares) VALUES (?, ?, ?)";

	    try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
	        pstmt.setInt(1, sl_id);
	        pstmt.setString(2, symbol);
	        pstmt.setInt(3, num_of_shares);

	        pstmt.executeQuery();
	        return true;

	    } catch (SQLException e) {
	        e.printStackTrace();
	        return false;
	    }
	}
	
	public boolean createSharedTo(Connection conn, int sl_id, int user_id) {
	    String sql = "INSERT INTO sharedto (sl_id, user_id) VALUES (?, ?)";

	    try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
	        pstmt.setInt(1, sl_id);
	        pstmt.setInt(2, user_id);

	        ResultSet rs = pstmt.executeQuery();
	        return true;

	    } catch (SQLException e) {
	        e.printStackTrace();
	        return false;
	    }
	}*/
}

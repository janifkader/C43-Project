package com.c43.portfolio_manager.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.c43.portfolio_manager.Database;
import com.c43.portfolio_manager.model.StockList;
import com.c43.portfolio_manager.model.User;
import com.c43.portfolio_manager.model.SharedStockList;
import com.c43.portfolio_manager.model.Stock;

public class StockListRepo {
	public int createStockList(int user_id, String visibility) {
	    String sql = "INSERT INTO StockList (user_id, visibility) VALUES (?, ?) RETURNING sl_id;";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);
	        pstmt.setString(2, visibility);

	        rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("sl_id");
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
	
	public List<StockList> getStockLists(int user_id) {
	    String sql = "SELECT * FROM StockList WHERE user_id = ?;";
	    List<StockList> lists = new ArrayList<>();
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	int sl_id = rs.getInt("sl_id");
	        	String visibility = rs.getString("visibility");
	            lists.add(new StockList(sl_id, visibility));
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

	    return lists;
	}
	
	public List<SharedStockList> getSharedStockLists(int user_id) {
	    String sql = "SELECT s.sl_id, sl.user_id, sl.visibility, u.username "
	    		+ "FROM sharedto s INNER JOIN StockList sl "
	    		+ "ON s.sl_id = sl.sl_id JOIN Users u "
	    		+ "ON sl.user_id = u.user_id WHERE s.user_id = ? "
	    		+ "UNION "
	    		+ "SELECT sl.sl_id, sl.user_id, sl.visibility, u.username FROM StockList sl "
	    		+ "JOIN Users u ON sl.user_id = u.user_id WHERE sl.visibility = 'public' AND sl.user_id != ?;";
	    List<SharedStockList> lists = new ArrayList<>();
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);
	        pstmt.setInt(2, user_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	int sl_id = rs.getInt("sl_id");
	        	int u_id = rs.getInt("user_id");
	        	String username = rs.getString("username");
	        	String visibility = rs.getString("visibility");
	            lists.add(new SharedStockList(sl_id, u_id, username, visibility));
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

	    return lists;
	}
	
	public StockList getStockList(int sl_id) {
	    String sql = "SELECT * FROM StockList WHERE sl_id = ?";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, sl_id);

	        rs = pstmt.executeQuery();

	        if (rs.next()) {
	        	String visibility = rs.getString("visibility");
	            return new StockList(sl_id, visibility);
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
	
	public List<Stock> getStockListStocks(int sl_id) {
	    String sql = "SELECT symbol, num_of_shares FROM contains WHERE sl_id = ?;";
	    List<Stock> stocks = new ArrayList<>();
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, sl_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	String symbol = rs.getString("symbol");
	        	int num_of_shares = rs.getInt("num_of_shares");
	            stocks.add(new Stock(sl_id, symbol, num_of_shares));
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

	    return stocks;
	}
	
	public int insertStock(int sl_id, String symbol, int num_of_shares) {
	    String sql = "INSERT INTO contains (sl_id, symbol, num_of_shares) VALUES (?, ?, ?) RETURNING sl_id;";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, sl_id);
	        pstmt.setString(2, symbol);
	        pstmt.setInt(3, num_of_shares);

	        rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("sl_id");
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
	
	public int deleteStock(int sl_id, String symbol) {
	    String sql = "DELETE FROM contains WHERE sl_id = ? and symbol = ? RETURNING sl_id;";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, sl_id);
	        pstmt.setString(2, symbol);

	        rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("sl_id");
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
	
	public int deleteStockList(int sl_id) {
		String sql = "DELETE FROM contains WHERE sl_id = ?";
		String sql2 = "DELETE FROM StockList WHERE sl_id = ? RETURNING sl_id";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, sl_id);
	        pstmt.executeUpdate();
	        pstmt.close();
	        pstmt = conn.prepareStatement(sql2);
	        pstmt.setInt(1, sl_id);
	        rs = pstmt.executeQuery();
	        if (rs.next()) {
	        	return rs.getInt("sl_id");
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
	
	public int updateStockListVisibility(int sl_id, String visibility) {
		String sql = "UPDATE StockList SET visibility = ? WHERE sl_id = ? RETURNING sl_id;";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection();
	        pstmt = conn.prepareStatement(sql);
	        pstmt.setString(1, visibility);
	        pstmt.setInt(2, sl_id);
	        rs = pstmt.executeQuery();
	        if (rs.next()) {
	        	return rs.getInt("sl_id");
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
	
	public int shareStockList(int sl_id, int user_id) {
		String sql = "INSERT INTO sharedto (sl_id, user_id) VALUES (?, ?) RETURNING sl_id";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection();
	        pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, sl_id);
	        pstmt.setInt(2, user_id);
	        rs = pstmt.executeQuery();
	        if (rs.next()) {
	        	return rs.getInt("sl_id");
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
	
	public int unshareStockList(int sl_id, int user_id) {
		String sql = "DELETE FROM sharedto WHERE sl_id = ? and user_id = ? RETURNING sl_id";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection();
	        pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, sl_id);
	        pstmt.setInt(2, user_id);
	        rs = pstmt.executeQuery();
	        if (rs.next()) {
	        	return rs.getInt("sl_id");
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
	
	public List<User> getSharedWith(int sl_id) {
		String sql = "SELECT U.username, U.user_id FROM Users U JOIN sharedto S ON U.user_id = s.user_id WHERE sl_id = ?";
		Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    List<User> users = new ArrayList<>();
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, sl_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	int u_id = rs.getInt("user_id");
	        	String username = rs.getString("username");
	            users.add(new User(u_id, username, null));
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
	    return users;
	}
}

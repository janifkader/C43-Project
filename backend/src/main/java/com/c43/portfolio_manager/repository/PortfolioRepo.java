package com.c43.portfolio_manager.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.c43.portfolio_manager.Database;
import com.c43.portfolio_manager.model.Portfolio;
import com.c43.portfolio_manager.model.Stock;

public class PortfolioRepo {
	public int createPortfolio(int user_id, double cash_amt) {
	    String sql = "INSERT INTO Portfolio (user_id, cash_amt) VALUES (?, ?) RETURNING port_id;";
	    
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection();
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);
	        pstmt.setDouble(2, cash_amt);

	        rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("port_id");
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
	
	public boolean createStockHoldings(String symbol, int port_id, int num_of_shares) {
	    String sql = "INSERT INTO stock_holdings (symbol, port_id, num_of_shares) VALUES (?, ?, ?)";
	    
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection();
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setString(1, symbol);
	        pstmt.setInt(2, port_id);
	        pstmt.setInt(3, num_of_shares);

	        pstmt.executeQuery();
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
	
	public List<Portfolio> getPortfolios(int user_id) {
	    String sql = "SELECT port_id, cash_amt FROM Portfolio WHERE user_id = ?;";
	    List<Portfolio> ports = new ArrayList<>();
	    
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection();
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, user_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	int port_id = rs.getInt("port_id");
	        	double cash_amt = rs.getDouble("cash_amt");
	            ports.add(new Portfolio(port_id, user_id, cash_amt));
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
	    return ports;
	}
	
	public Portfolio getPortfolio(int port_id) {
	    String sql = "SELECT user_id, cash_amt FROM Portfolio WHERE port_id = ?;";
	    
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection();
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, port_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	int user_id = rs.getInt("user_id");
	        	double cash_amt = rs.getDouble("cash_amt");
	            return new Portfolio(port_id, user_id, cash_amt);
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
	
	public List<Stock> getStockHoldings(int port_id) {
	    String sql = "SELECT symbol, num_of_shares FROM stock_holdings WHERE port_id = ?;";
	    List<Stock> stocks = new ArrayList<>();
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, port_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	String symbol = rs.getString("symbol");
	        	int num_of_shares = rs.getInt("num_of_shares");
	            stocks.add(new Stock(port_id, symbol, num_of_shares));
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
	
	public int insertStock(int port_id, String symbol, int num_of_shares) {
	    String sql = "INSERT INTO stock_holdings (port_id, symbol, num_of_shares) VALUES (?, ?, ?) RETURNING port_id;";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, port_id);
	        pstmt.setString(2, symbol);
	        pstmt.setInt(3, num_of_shares);

	        rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("port_id");
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
	
	public int updatePortfolio(int port_id, double cash_amt) {
	    String sql = "UPDATE Portfolio SET cash_amt = ? WHERE port_id = ? RETURNING port_id;";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setDouble(1, cash_amt);
	        pstmt.setInt(2, port_id);

	        rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("port_id");
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
	
	/*public List<Portfolio> viewStockHoldings(Connection conn, int port_id) {
		String sql = "SELECT symbol, num_of_shares FROM stock_holdings WHERE port_id = ?;";
		List<Portfolio> stocks = new ArrayList<>();
		
		try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
			pstmt.setInt(1, port_id);
			
			ResultSet rs = pstmt.executeQuery();
			
			while (rs.next()) {
				String symbol = rs.getString("symbol");
				int num_of_shares = rs.getInt("num_of_shares");
				stocks.add(new Portfolio(symbol, num_of_shares));
			}
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		return stocks;
	}*/
}

package com.c43.portfolio_manager.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.c43.portfolio_manager.Database;
import com.c43.portfolio_manager.model.Portfolio;

public class PortfolioRepo {
	
	// Create a new portfolio for the user with selected cash amount (amt > 0).
	public int createPortfolio(int user_id, double cash_amt) {
		
		if (cash_amt < 0) {return -1;}
		
	    String sql = "INSERT INTO Portfolio (user_id, cash_amt) VALUES (?, ?) RETURNING port_id";
	    
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
	
	
	// Get all portfolios made by the user.
	public List<Portfolio> getPortfolios(int user_id) {
	    String sql = "SELECT port_id, cash_amt FROM Portfolio WHERE user_id = ?";
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
	
	
	// Get a singular requested portfolio associated with port_id.
	public Portfolio getPortfolio(int port_id) {
	    String sql = "SELECT user_id, cash_amt FROM Portfolio WHERE port_id = ?";
	    
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
	
	
	// Add a stock to portfolio.
	public boolean createStockHoldings(String symbol, int port_id, int num_of_shares) {
	    String sql = "INSERT INTO stock_holdings (symbol, port_id, num_of_shares) VALUES (?, ?, ?)";
	    
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    try {
	    	conn = Database.getConnection();
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setString(1, symbol);
	        pstmt.setInt(2, port_id);
	        pstmt.setInt(3, num_of_shares);

	        int rowsInserted = pstmt.executeUpdate();
            return rowsInserted > 0;

	    }
	    catch (SQLException e) {
	        e.printStackTrace();
	        return false;
	    }
	    finally {
	        try { if (pstmt != null) pstmt.close(); } catch (SQLException e) { e.printStackTrace();}
	        try { if (conn != null) conn.close(); } catch (SQLException e) { e.printStackTrace();}
	    }
	}
	
	
	// Get all the stocks and its shares in a portfolio.
	public List<Object[]> getStockHoldings(int port_id) {
		String sql = "SELECT symbol, num_of_shares FROM stock_holdings WHERE port_id = ?";
		List<Object[]> stock_detail = new ArrayList<>();
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
                stock_detail.add(new Object[]{symbol, num_of_shares});
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
		return stock_detail;
	}

	
	// Update cash amount in portfolio after transaction.
	public boolean updateCash(int port_id, double new_cash_amt) {
        
		if (new_cash_amt < 0) {return false;}
        
        String sql = "UPDATE Portfolio SET cash_amt = ? WHERE port_id = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        try {
            conn = Database.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setDouble(1, new_cash_amt);
            pstmt.setInt(2, port_id);
            
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

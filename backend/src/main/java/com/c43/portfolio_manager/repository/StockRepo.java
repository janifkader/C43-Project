package com.c43.portfolio_manager.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.c43.portfolio_manager.Database;

public class StockRepo {
	public List<String> getStocks(String search) {
	    String sql = "SELECT * FROM Stock WHERE symbol LIKE UPPER(?);";
	    List<String> stocks = new ArrayList<>();
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	    	String searchPattern = "%" + search + "%";
	        pstmt.setString(1, searchPattern);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	            stocks.add(rs.getString("symbol"));
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
}

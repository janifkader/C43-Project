package com.c43.portfolio_manager.repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.c43.portfolio_manager.Database;
import com.c43.portfolio_manager.model.Transaction;

public class TransactionRepo {
	
	// Makes a new transaction with cash (buy/sell) for the portfolio.
	public int createTransaction(String symbol, int port_id, String type, int amount, double unit_cost) {
	    String sql = "INSERT INTO Transaction (symbol, port_id, type, amount, unit_cost, date) VALUES (?, ?, ?, ?, ?, ?) RETURNING transaction_id";
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setString(1, symbol);
	        pstmt.setInt(2, port_id);
	        pstmt.setString(3, type);
	        pstmt.setInt(4, amount);
	        pstmt.setDouble(5, unit_cost);
	        pstmt.setDate(6, new Date(System.currentTimeMillis()));

	        rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("transaction_id");
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
	
	
	// Get all transactions related to a portfolio.
	public List<Transaction> getTransactions(int port_id) {
	    String sql = "SELECT transaction_id, symbol, type, amount, unit_cost, date FROM Transaction WHERE port_id = ?";
	    List<Transaction> transactions = new ArrayList<>();
	    Connection conn = null;
	    PreparedStatement pstmt = null;
	    ResultSet rs = null;
	    try {
	    	conn = Database.getConnection(); 
	    	pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, port_id);

	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	            int transaction_id = rs.getInt("transaction_id");
	            String symbol = rs.getString("symbol");
	            String type = rs.getString("type");
	            int amount = rs.getInt("amount");
	            double unit_cost = rs.getDouble("unit_cost");
	            Date date = rs.getDate("date");
	            transactions.add(new Transaction(transaction_id, symbol, port_id, type, amount, unit_cost, date));
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

	    return transactions;
	}
	
	
	// Get all transaction history over time related to a particular stock in the portfolio.
	public List<Transaction> getTransactionHistory(int port_id, String symbol) {
        String sql = "SELECT transaction_id, type, amount, unit_cost, date FROM Transaction WHERE port_id = ? AND symbol = ? ORDER BY date DESC";
        List<Transaction> transactions = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = Database.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, port_id);
            pstmt.setString(2, symbol);

            rs = pstmt.executeQuery();

            while (rs.next()) {
                int transaction_id = rs.getInt("transaction_id");
                String type = rs.getString("type");
                int amount = rs.getInt("amount");
                double unit_cost = rs.getDouble("unit_cost");
                Date date = rs.getDate("date");
                transactions.add(new Transaction(transaction_id, symbol, port_id, type, amount, unit_cost, date));
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
        return transactions;
    }
	
}
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
	public int createTransaction(String symbol, int port_id, String type, int amount, double unit_cost, Date date) {
	    String sql = "INSERT INTO Transaction (symbol, port_id, type, amount, unit_cost, date) VALUES (?, ?, ?, ?, ?, ?) RETURNING transaction_id;";

	    try {
	    	Connection conn = Database.getConnection(); 
	    	PreparedStatement pstmt = conn.prepareStatement(sql);
	        pstmt.setString(1, symbol);
	        pstmt.setInt(2, port_id);
	        pstmt.setString(3, type);
	        pstmt.setInt(4, amount);
	        pstmt.setDouble(5, unit_cost);
	        pstmt.setDate(6, date);

	        ResultSet rs = pstmt.executeQuery();

	        if (rs.next()) {
	            return rs.getInt("transaction_id");
	        }
	    } catch (SQLException e) {
	        e.printStackTrace();
	    }

	    return -1;
	}
	
	public List<Transaction> getTransactions(int port_id) {
	    String sql = "SELECT transaction_id, symbol, type, amount, unit_cost, date FROM Transaction WHERE port_id = ?;";
	    List<Transaction> transactions = new ArrayList<>();

	    try {
	    	Connection conn = Database.getConnection(); 
	    	PreparedStatement pstmt = conn.prepareStatement(sql);
	        pstmt.setInt(1, port_id);

	        ResultSet rs = pstmt.executeQuery();

	        while (rs.next()) {
	            int t_id = rs.getInt("transaction_id");
	            String symbol = rs.getString("symbol");
	            String type = rs.getString("type");
	            int amount = rs.getInt("amount");
	            double unit_cost = rs.getDouble("unit_cost");
	            Date date = rs.getDate("date");
	            transactions.add(new Transaction(t_id, symbol, port_id, type, amount, unit_cost, date));
	        }
	    } catch (SQLException e) {
	        e.printStackTrace();
	    }

	    return transactions;
	}
}

package com.c43.portfolio_manager.repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.c43.portfolio_manager.Database;

public class StockRepo {
	
	
	// Search for stocks by its symbol (case insensitive, shows all stocks beginning with "search").
	// Note: It contains historic data stocks and also new user created stocks.
	public List<String> getStocks(String search) {
        String sql = "SELECT symbol FROM (SELECT DISTINCT symbol FROM Stock UNION SELECT DISTINCT symbol FROM NewDailyStock) AS all_stocks WHERE UPPER(symbol) LIKE UPPER(?)";
        List<String> stocks = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = Database.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, search + "%");

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
	
	
	// Get latest close (i.e. current) price of the stock (look at both historic and user added).
	public double getCurrentPrice(String symbol) {
        String sql = "SELECT close FROM (SELECT close, timestamp FROM DailyStock WHERE symbol = ? UNION ALL SELECT close, timestamp FROM NewDailyStock WHERE symbol = ?) AS combined_data ORDER BY timestamp DESC LIMIT 1";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = Database.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, symbol);
            pstmt.setString(2, symbol);

            rs = pstmt.executeQuery();

            if (rs.next()) {
                return rs.getDouble("close");
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
        return 0.0;
    }
	
	
	// Get a list of daily close price of the stock for the given duration (historical + current data used for graph).
	public List<Object[]> getStockHistory(String symbol, Date start_date, Date end_date) {
        String sql = "SELECT timestamp, close FROM DailyStock WHERE symbol = ? AND timestamp BETWEEN ? AND ? UNION ALL SELECT timestamp, close FROM NewDailyStock WHERE symbol = ? AND timestamp BETWEEN ? AND ? ORDER BY timestamp";
        List<Object[]> history = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = Database.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, symbol);
            pstmt.setDate(2, start_date);
            pstmt.setDate(3, end_date);
            pstmt.setString(4, symbol);
            pstmt.setDate(5, start_date);
            pstmt.setDate(6, end_date);

            rs = pstmt.executeQuery();

            while (rs.next()) {
                Date timestamp = rs.getDate("timestamp");
                double close = rs.getDouble("close");
                history.add(new Object[]{timestamp, close});
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
        return history;
    }
	
	public boolean addDailyStockData(Date timestamp, double open, double high, double low, double close, long volume, String symbol) {

	
	// Add new daily stock data (data beyond the given historical data, added by the user). This data is added to NewDailyStock table and has no duplicates in DailyStock.
	public boolean addDailyStockData(String symbol, Date timestamp, double open, double high, double low, double close, long volume) {
        
		Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = Database.getConnection();

            
            String check_historical_sql = "SELECT 1 FROM DailyStock WHERE symbol = ? AND timestamp = ?";
            pstmt = conn.prepareStatement(check_historical_sql);
            pstmt.setString(1, symbol);
            pstmt.setDate(2, timestamp);
            rs = pstmt.executeQuery();
            if (rs.next()) {return false;} // user added data already exists in historical data, can't modify.
            rs.close();
            pstmt.close();
            
            
            String upsertSql = "INSERT INTO NewDailyStock (symbol, timestamp, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (symbol, timestamp) DO UPDATE SET (open, high, low, close, volume) = (?, ?, ?, ?, ?)";
            pstmt = conn.prepareStatement(upsertSql);
            pstmt.setString(1, symbol);
            pstmt.setDate(2, timestamp);
            pstmt.setDouble(3, open);
            pstmt.setDouble(4, high);
            pstmt.setDouble(5, low);
            pstmt.setDouble(6, close);
            pstmt.setLong(7, volume);
            pstmt.setDouble(8, open);
            pstmt.setDouble(9, high);
            pstmt.setDouble(10, low);
            pstmt.setDouble(11, close);
            pstmt.setLong(12, volume);

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
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
	
}

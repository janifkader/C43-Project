package com.c43.portfolio_manager.service;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.repository.StockRepo;

@Service
public class StockService {
	
	private StockRepo repo = new StockRepo();
	
	public List<String> getStocks(String search) {
		return repo.getStocks(search);
	}
	
	public List<Object[]> getStockHistory(String symbol, Date start_date, Date end_date) {
        return repo.getStockHistory(symbol, start_date, end_date);
    }
	
	public boolean addDailyStockData(Date timestamp, double open, double high, double low, double close, long volume, String symbol) {
		return repo.addDailyStockData(timestamp, open, high, low, close, volume, symbol);
	}
	
	public List<Object[]> predictFuturePrices(String symbol, int days_to_predict) {
	    return repo.predictFuturePrices(symbol, days_to_predict);
	}
	
}

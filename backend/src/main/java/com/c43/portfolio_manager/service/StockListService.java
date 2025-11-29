package com.c43.portfolio_manager.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.model.StockList;
import com.c43.portfolio_manager.model.SharedStockList;
import com.c43.portfolio_manager.model.Stock;
import com.c43.portfolio_manager.repository.StockListRepo;

@Service
public class StockListService {
	
	private StockListRepo repo = new StockListRepo();
	
	public int createStockList(int user_id, String visibility) {
		return repo.createStockList(user_id, visibility);
	}
	
	public List<StockList> getStockLists(int user_id) {
		return repo.getStockLists(user_id);
	}
	
	public List<SharedStockList> getSharedStockLists(int user_id) {
		return repo.getSharedStockLists(user_id);
	}
	
	public StockList getStockList(int sl_id) {
		return repo.getStockList(sl_id);
	}
	
	public List<Stock> getStockListStocks(int sl_id) {
		return repo.getStockListStocks(sl_id);
	}
	
	public int insertStock(int sl_id, String symbol, int num_of_shares) {
		return repo.insertStock(sl_id, symbol, num_of_shares);
	}
	
	public int deleteStock(int sl_id, String symbol) {
		return repo.deleteStock(sl_id, symbol);
	}
	
	public int deleteStockList(int sl_id) {
		return repo.deleteStockList(sl_id);
	}
	
	public int updateVisibility(int sl_id, String visibility) {
		return repo.updateStockListVisibility(sl_id, visibility);
	}
	
	public int share(int sl_id, int user_id) {
		return repo.shareStockList(sl_id, user_id);
	}
}

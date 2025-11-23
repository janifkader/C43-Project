package com.c43.portfolio_manager.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.c43.portfolio_manager.model.StockList;
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
}

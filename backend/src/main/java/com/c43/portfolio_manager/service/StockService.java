package com.c43.portfolio_manager.service;

import java.sql.Connection;
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
}

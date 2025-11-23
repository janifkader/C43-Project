package com.c43.portfolio_manager.endpoints;

import java.sql.Date;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.c43.portfolio_manager.model.Transaction;
import com.c43.portfolio_manager.service.TransactionService;

@RestController
@RequestMapping("/transactions")
public class TransactionEndpoint {
	private final TransactionService service;
	
	public TransactionEndpoint(TransactionService service) {
		this.service = service;
	}
	
	@PostMapping("/")
	public int create(@RequestParam String symbol, @RequestParam int port_id, @RequestParam String type, @RequestParam int amount, @RequestParam double unit_cost, @RequestParam Date date) {
		return service.createTransaction(symbol, port_id, type, amount, unit_cost, date);
	}
	
	@GetMapping("/")
	public List<Transaction> get(@RequestParam int port_id) {
		return service.getTransactions(port_id);
	}
}
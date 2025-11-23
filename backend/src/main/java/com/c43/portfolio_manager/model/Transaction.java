package com.c43.portfolio_manager.model;
import java.sql.Date;

public class Transaction {
	private int transaction_id;
	private String symbol;
	private int port_id;
	private String type;
	private int amount;
	private double unit_cost;
	private Date date;
	
	public Transaction(int transaction_id, String symbol, int port_id, String type, int amount, double unit_cost, Date date) {
		this.transaction_id = transaction_id;
		this.symbol = symbol;
		this.port_id = port_id;
		this.type = type;
		this.amount = amount;
		this.unit_cost = unit_cost;
		this.date = date;
	}
	
}

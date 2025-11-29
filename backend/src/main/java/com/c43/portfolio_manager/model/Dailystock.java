package com.c43.portfolio_manager.model;

import java.sql.Date;

public class Dailystock {
	public Date timestamp;
	public double open;
	public double high;
	public double low;
	public double close;
	public int volume;
	public String symbol;
	
	public Dailystock(Date timestamp, double open, double high, double low, double close, int volume, String symbol) {
		this.timestamp = timestamp;
		this.open = open;
		this.high = high;
		this.low = low;
		this.close = close;
		this.volume = volume;
		this.symbol = symbol;
	}
}

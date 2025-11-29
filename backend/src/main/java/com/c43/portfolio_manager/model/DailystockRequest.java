package com.c43.portfolio_manager.model;

public class DailystockRequest {
	public String timestamp;
    public double open;
    public double high;
    public double low;
    public double close;
    public int volume;
    public String symbol;
    
    public DailystockRequest(String timestamp, double open, double high, double low, double close, int volume, String symbol) {
    	this.timestamp = timestamp;
    	this.open = open;
    	this.high = high;
    	this.low = low;
    	this.close = close;
    	this.symbol = symbol;
    }
}

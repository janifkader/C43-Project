package com.c43.portfolio_manager.model;

public class DailystockRequest {
    public double open;
    public double high;
    public double low;
    public double close;
    public int volume;
    public String symbol;
    
    public DailystockRequest(double open, double high, double low, double close, int volume, String symbol) {
    	this.open = open;
    	this.high = high;
    	this.low = low;
    	this.close = close;
    	this.volume = volume;
    	this.symbol = symbol;
    }
}

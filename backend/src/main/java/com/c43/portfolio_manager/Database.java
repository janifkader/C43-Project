package com.c43.portfolio_manager;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    private static final String URL = "jdbc:postgresql://34.134.132.127:5432/mydb";
    private static final String USERNAME = "postgres";
    private static final String PASSWORD = "c43";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }
}
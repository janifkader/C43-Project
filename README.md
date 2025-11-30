# PROJECT REPORT
# Run Instructions:
1. Clone the repo
2. ```cd C43-Project/c43-project``` (frontend)
3. Run ```npm install```
4. Run ```npm run build```
5. Run ```npm start```
Frontend should now be running on http://localhost:3000

6. Open another terminal
7. ```cd C43-Project/backend``` (backend)
8. Run ```mvn clean install```
9. Run ```java -jar target/portfolio_manager-0.0.1-SNAPSHOT.jar```
Backend should now be running on http://localhost:8080

# Frontend:

The frontend is written in TypeScript React and makes use of Material UI styled components. Each major entity has its own component and page. The simple and functional interface allows the user to have a clean experience while browsing their portfolios.

# Calculation of Stock Price:

The stock price is calculated using an external open-source API called Finnhub to get the latest close price, the information from this API also facilitates the new daily stock record. If the price cannot be retrieved from the api, we fall back on a getCurrentPrice function to handle it manually.

# SQL Queries:

## User:

Create new User with given username and password (Database creates user_id): 

INSERT INTO Users (username, password) VALUES (?, ?)

Get user_id with correct login information: 

SELECT user_id FROM Users WHERE username = ? AND password = ?

Retrieve username given user_id of a user: 

SELECT username FROM Users WHERE user_id = ?

Retrieve user_id and username of all users in the database: 

SELECT user_id, username FROM Users

## Portfilio:

Create a new Portfolio given a user_id and cash_amt: 

INSERT INTO Portfolio (user_id, cash_amt) VALUES (?, ?)

Create a new stock holding givern a port_id, symbol and num_of_shares. If there is a conflict (stock holding with symbol and port_id already exists) then we simply add these num_of_shares to the stock holding existing in the database: 

INSERT INTO stock_holdings (port_id, symbol, num_of_shares) VALUES (?, ?, ?) ON CONFLICT (port_id, symbol) DO UPDATE SET num_of_shares = stock_holdings.num_of_shares + EXCLUDED.num_of_shares

Retrieve information about a Portfilio based on port_id: 

SELECT user_id, cash_amt FROM Portfolio WHERE port_id = ?

Retrieve the number of shares in a stock holding given a port_id and a symbol: 

SELECT num_of_shares FROM stock_holdings WHERE port_id = ? AND symbol = ?

When selling a stock holding, if we don't sell all shares, just subtract them from the existing holding at the given port_id and symbol: 

UPDATE stock_holdings SET num_of_shares = num_of_shares - ? WHERE port_id = ? AND symbol = ?

Delete a stock holding when a user sells all shares of a stock: 

DELETE FROM stock_holdings WHERE port_id = ? AND symbol = ?

Add the cash amount gained from selling a stock at the given port_id:

UPDATE Portfolio SET cash_amt = cash_amt + ? WHERE port_id = ? RETURNING port_id

Add a specific cash amount to ones portfolio based on port_id: 

UPDATE Portfolio SET cash_amt = ? WHERE port_id = ? RETURNING port_id

## Transaction:

Create a new transaction based on the given symbol, port_id, type, amount, unit_cost, date: 

INSERT INTO Transaction (symbol, port_id, type, amount, unit_cost, date) VALUES (?, ?, ?, ?, ?, ?)

Retrieve Transaction information of a specific stock with a given symbol in a given portfolio with port_id, the returning rows are in descending order: 

SELECT transaction_id, type, amount, unit_cost, date FROM Transaction WHERE port_id = ? AND symbol = ? ORDER BY date DESC


## StockList:

Create new Stock List with a given user_id and visibility: 

INSERT INTO StockList (user_id, visibility) VALUES (?, ?)

Select all Stock Lists of a particular user with user_id: 

SELECT * FROM StockList WHERE user_id = ?

Retrieve the Stock List information and the username from a table where sharedTo and StockList are joined on matching sl_id's which is joined on Users with matching user_ids to get all Stock Lists shared with the user. This is combined with the retrieval of Stock List information and username from StockList joined on Users with matching user_ids and where the Stock List has 'public' visibility and the user doesn't own the Stock List to see all the public Stock Lists of other users. This shows a shared view of all Stock Lists that the user can see, but do not own: 

SELECT s.sl_id, sl.user_id, sl.visibility, u.username FROM sharedto s INNER JOIN StockList sl ON s.sl_id = sl.sl_id JOIN Users u ON sl.user_id = u.user_id WHERE s.user_id = ? UNION SELECT sl.sl_id, sl.user_id, sl.visibility, u.username FROM StockList sl "JOIN Users u ON sl.user_id = u.user_id WHERE sl.visibility = 'public' AND sl.user_id != ?

Retrieve all of the information with a Stock List which matches the give sl_id:
 
SELECT * FROM StockList WHERE sl_id = ?

Get a the symbol and num_of_shares held in a Stock List matching the given sl_id: 

SELECT symbol, num_of_shares FROM contains WHERE sl_id = ?

Insert a new stock with a certain symbol and num_of_shares into a Stock List matching the given sl_id: 

INSERT INTO contains (sl_id, symbol, num_of_shares) VALUES (?, ?, ?)

Remove a stock with the given symbol from the Stock List with the given sl_id: 

DELETE FROM contains WHERE sl_id = ? and symbol = ?

Delete all of the stocks in a Stock List with sl_id: 

DELETE FROM contains WHERE sl_id = ?

Delete a Stock List with sl_id: 

DELETE FROM StockList WHERE sl_id = ?

Update the visibility of a Stock List with sl_id based on the given value: 

UPDATE StockList SET visibility = ? WHERE sl_id = ?

Share the Stock List with the given sl_id to user with the given user_id: 

INSERT INTO sharedto (sl_id, user_id) VALUES (?, ?)

Unshare the Stock List with the given sl_id to user with the given user_id: 

DELETE FROM sharedto WHERE sl_id = ? and user_id = ? RETURNING sl_id

## Review:

Create a review by user with user_id in Stock List with sl_id with text being the review content: 

INSERT INTO Review (user_id, sl_id, text) VALUES (?, ?, ?)

Delete a review with a given review_id if the user_id of the deleting user is the same as the user who wrote the review or if the user is the owner of the Stock List the review belongs to: 

DELETE FROM Review WHERE review_id = ? AND (user_id = ? OR sl_id IN (SELECT sl_id FROM StockList WHERE user_id = ?))

Edit a review at review_id written by a user with user_id with the new text: 

UPDATE Review SET text = ? WHERE review_id = ? AND user_id = ?

## FriendRequest:


Get the most recent rejected, removed, or cancelled friend request between two users to determine if enough time (5 mins) has passed for resending another request:

SELECT last_updated, status FROM FriendRequest WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND status IN ('REJECTED', 'REMOVED', 'CANCELLED') ORDER BY last_updated DESC LIMIT 1

Check if the a friend request betwwen two users is already sent, or if two users are already freinds to avoid duplicate friend requests.

SELECT request_id, status FROM FriendRequest WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND status IN ('ACCEPTED', 'PENDING')

Check if the most latest status is rejected, removed, or cancelled friend request so that we can update it to pending instead of crreating a new request between the same two users:

SELECT request_id FROM FriendRequest WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND status IN ('REJECTED', 'REMOVED', 'CANCELLED') ORDER BY last_updated DESC LIMIT 1

Update an old friend request by changing its status to pending and updating the last updated timestamp:

UPDATE FriendRequest SET status = 'PENDING', last_updated = ? WHERE request_id = ?

Create a totally new friend request with pending status and current timestamp:

INSERT INTO FriendRequest (sender_id, receiver_id, status, last_updated) VALUES (?, ?, 'PENDING', ?)

Get all incoming friend requests for a user, by joining FriendRequest table with the Users table, to get the sender's information as well:

SELECT U.username, U.user_id AS id, Fr.* FROM FriendRequest Fr JOIN Users U ON Fr.sender_id = U.user_id WHERE Fr.receiver_id = ? AND Fr.status = 'PENDING'

Get all outgoing friend requests for a user that are not already accepted/rejected/removed by the receiver, by joining FriendRequest table with Users table, to get the receiver's information:

SELECT U.username, U.user_id AS id, Fr.* FROM FriendRequest Fr JOIN Users U ON Fr.receiver_id = U.user_id WHERE Fr.sender_id = ? AND Fr.status != 'CANCELLED' AND Fr.status != 'ACCEPTED' AND Fr.status != 'REMOVED'

Accept friend request by updating its status and timestamp:

UPDATE FriendRequest SET status = 'ACCEPTED', last_updated = ? WHERE request_id = ?

Reject friend request by updating its status and timestamp:

UPDATE FriendRequest SET status = 'REJECTED', last_updated = ? WHERE request_id = ?

Remove a friend by updating its status and timestamp, and make sure the user was priviously a freind (can't remove if not a friend):

UPDATE FriendRequest SET status = 'REMOVED', last_updated = ? WHERE request_id = ? AND (sender_id = ? OR receiver_id = ?) AND status = 'ACCEPTED'

Cancel a sent friend request by updating its status and timestamp, and make sure the user is the sender and the request is in pending state:

UPDATE FriendRequest SET status = 'CANCELLED', last_updated = ? WHERE request_id = ? AND sender_id = ? AND status = 'PENDING' OR status = 'REJECTED'

Get all friends of a user by finding the currently accepted friend requests and joining with Users table to get friend's details, make sure the user themself is not shown in their friends list:

SELECT U.username, U.user_id AS friend_id, fr.* FROM FriendRequest fr JOIN Users U ON (fr.sender_id = U.user_id OR fr.receiver_id = U.user_id) WHERE (fr.sender_id = ? OR fr.receiver_id = ?) AND fr.status = 'ACCEPTED' AND U.user_id != ?

## Stock:

Search for stock symbols from both historical data and user-added stocks where the symbol matches the search pattern (case insensitive):

SELECT symbol FROM (SELECT DISTINCT symbol FROM Stock UNION SELECT DISTINCT symbol FROM NewDailyStock) AS all_stocks WHERE UPPER(symbol) LIKE UPPER(?)

Get the most recent closing price for a stock by combining data from both historical and user-added tables and selecting the latest entry:

SELECT close FROM (SELECT close, timestamp FROM DailyStock WHERE symbol = ? UNION ALL SELECT close, timestamp FROM NewDailyStock WHERE symbol = ?) AS combined_data ORDER BY timestamp DESC LIMIT 1

Retrieve historical data for a stock, ordered with most recent data at the top within a date range, by combining records from both historical and user-added tables:

SELECT timestamp, close FROM DailyStock WHERE symbol = ? AND timestamp BETWEEN ? AND ? UNION ALL SELECT timestamp, close FROM NewDailyStock WHERE symbol = ? AND timestamp BETWEEN ? AND ? ORDER BY timestamp

Check if a stock's record already exists in the historical data for a specific symbol and timestamp to prevent user from overwriting it:

SELECT 1 FROM DailyStock WHERE symbol = ? AND timestamp = ?

Insert new user-added daily stock data into the table, or update existing (user-added) records if the same symbol and timestamp already exist in the table:

INSERT INTO NewDailyStock (symbol, timestamp, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (symbol, timestamp) DO UPDATE SET (open, high, low, close, volume) = (?, ?, ?, ?, ?)


# Appendix


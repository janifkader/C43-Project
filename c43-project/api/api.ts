function send(method: string, url: string, data?: unknown){
    return fetch(`http://localhost:8080${url}`, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: (data)? JSON.stringify(data): null,
        credentials: "include"
    })
    .then(x => x.json())
}

export function signup(user_id: number, username: string, password: string) {
    return send("POST", `/signup/`, {user_id, username, password});
}

export function signin(user_id: number, username: string, password: string) {
    return send("POST", `/signin/`, {user_id, username, password});
}

export function getUsers() {
    return send("GET", `/users/`);
}

export function getUser(user_id: number) {
    return send("GET", `/user/?user_id=${user_id}`);
}

export function createPortfolio(port_id: number, user_id: number, cash_amt: number) {
    return send("POST", `/portfolios/`, {port_id, user_id, cash_amt});
}

export function getPortfolios(user_id: number) {
    return send("GET", `/portfolios/?user_id=${user_id}`);
}

export function getPortfolio(port_id: number) {
    return send("GET", `/portfolios/portfolio/?port_id=${port_id}`);
}

export function updatePortfolio(port_id: number, user_id: number, cash_amt: number) {
    return send("POST", `/portfolios/portfolio/`, {port_id, user_id, cash_amt})
}

export function createStockList(sl_id: number, user_id: number, visibility: string) {
    return send("POST", `/stocklist/`, {sl_id, user_id, visibility});
}

export function getStockLists(user_id: number) {
    return send("GET", `/stocklist/?user_id=${user_id}`);
}

export function getStockList(sl_id: number) {
    return send("GET", `/stocklist/sl/?sl_id=${sl_id}`);
}

export function insertSLStock(id: number, symbol: string, num_of_shares: number) {
    return send("POST", `/stocklist/contains/`, {id, symbol, num_of_shares});
}

export function getStockListStocks(sl_id: number) {
    return send("GET", `/stocklist/contains/?sl_id=${sl_id}`);
}

export function insertPortfolioStock(id: number, symbol: string, num_of_shares: number) {
    return send("POST", `/portfolios/holdings/`, {id, symbol, num_of_shares});
}

export function getPortfolioStocks(port_id: number) {
    return send("GET", `/portfolios/holdings/?port_id=${port_id}`);
}

export function getStocks(search: string) {
    return send("GET", `/stocks/?search=${search}`, null);
}

export function getPrice(symbol: string) {
    return send("GET", `/price/?symbol=${symbol}`, null);
}

export function addTransaction(transaction_id: number, symbol: string, port_id: number, type: string, num_of_shares: number, price: number, date: Date) {
    return send("POST", `/transactions/`, {transaction_id, symbol, port_id, type, num_of_shares, price, date});
}

export function writeReview(review_id: number, user_id: number, sl_id: number, text: string) {
    return send("POST", `/reviews/`, {review_id, user_id, sl_id, text});
}

export function getReviews(sl_id: number) {
    return send("GET", `/reviews/?sl_id=${sl_id}`);
}

export function getFriends(user_id: number) {
    return send("GET", `/friends/?user_id=${user_id}`);
}

export function removeFriend(request_id: number, user_id: number) {
    return send("POST", `/friends/remove/?request_id=${request_id}&user_id=${user_id}`);
}

export function getIncomingRequests(user_id: number) {
    return send("GET", `/friends/incoming/?user_id=${user_id}`);
}

export function getOutgoingRequests(user_id: number) {
    return send("GET", `/friends/outgoing/?user_id=${user_id}`);
}

export function sendFriendRequest(sender_id: number, receiver_id: number) {
    return send("POST", `/friends/?sender_id=${sender_id}&receiver_id=${receiver_id}`);
}

export function acceptFriendRequest(request_id: number) {
    return send("POST", `/friends/accept/?request_id=${request_id}`);
}

export function rejectFriendRequest(request_id: number) {
    return send("POST", `/friends/reject/?request_id=${request_id}`);
}

export function unsendFriendRequest(request_id: number, user_id: number) {
    return send("POST", `/friends/unsend/?request_id=${request_id}&user_id=${user_id}`);
}
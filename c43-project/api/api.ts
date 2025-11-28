function send(method: string, url: string, data?: unknown){
    return fetch(`http://localhost:8080${url}`, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: (data)? JSON.stringify(data): null,
        credentials: "include"
    })
    .then(x => x.json())
}

export function signup(username: string, password: string) {
    return send("POST", `/signup`, {username, password});
}

export function signin(username: string, password: string) {
    return send("POST", `/signin`, {username, password});
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
function send(method: string, url: string, data?: unknown){
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND}${url}`, {
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

export function createPortfolio(port_id: int, user_id: int, cash_amt: double) {
    return send("POST", `/portfolios/`, {port_id, user_id, cash_amt});
}

export function getPortfolios(user_id: int) {
    return send("GET", `/portfolios/?user_id=${user_id}`);
}

export function createStockList(sl_id: int, user_id: int, visibility: string) {
    return send("POST", `/stocklist/`, {sl_id, user_id, visibility});
}

export function getStockLists(user_id: int) {
    return send("GET", `/stocklist/?user_id=${user_id}`);
}
"use client";

import { useRef, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { krona, tomorrow } from "../app/fonts";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import NumberField from './NumberField';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { List, RowComponentProps } from 'react-window';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FormControlLabel from '@mui/material/FormControlLabel';
import HistoryDialog from './HistoryDialog'
import { getPortfolio, getStocks, getPortfolioStocks, insertPortfolioStock, sellPortfolioStock, getPrice, getPortfolioPrices, updatePortfolio, addTransaction, logStock, getHistory, getPrediction } from '../api/api';
import { useRouter } from "next/navigation";

const Title = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,
  color: '#2798F5',
  fontFamily: krona.style.fontFamily,
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  color: '#2798F5',
  fontFamily: krona.style.fontFamily,
}));

const DialogField = styled(TextField)(({ theme }) => ({
  width: "500px",
  "& .MuiInputBase-input": {
    color: "#8FCAFA",
    fontFamily: tomorrow.style.fontFamily,
  },
  "& .MuiInputLabel-root": {
    color: "#8FCAFA",
    fontFamily: tomorrow.style.fontFamily,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#8FCAFA"
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#8FCAFA" 
  },
  "& .MuiOutlinedInput-root fieldset": { borderColor: "#8FCAFA" },
  "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "#8FCAFA" },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#8FCAFA" }
}));

interface Portfolio {
	port_id: number;
	user_id: number;
	cash_amt: number;
}

interface Stock {
	port_id: number;
	symbol: string;
	num_of_shares: number;
}

interface Dailystock {
	timestamp: Date;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	symbol: string;
}


function Portfolio() {
	const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
	const [stockTotal, setStockTotal] = useState(0);
	const [stocks, setStocks] = useState<Stock[]>([]);
	const [symbol, setSymbol] = useState('');
	const [price, setPrice] = useState(0);
	const [shares, setShares] = useState(0);
	const [total, setTotal] = useState(0);
	const [allStocks, setAllStocks] = useState<string[]>([]);
	const [search, setSearch] = useState(false);
	const [allStocksTotal, setAllStocksTotal] = useState(0);
	const [insertDialog, setInsertDialog] = useState(false);
	const [dialogSymbol, setDialogSymbol] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openTime, setOpenTime] = useState(false);
	const [invalid, setInvalid] = useState(false);
	const [dialogText, setDialogText] = useState("");
	const [sell, setSell] = useState(false);
	const [allPrices, setAllPrices] = useState<Dailystock[]>([]);
	const [historyOpen, setHistoryOpen] = useState(false);
	const [historyData, setHistoryData] = useState<Dailystock[]>([]);
	const [selectedSymbol, setSelectedSymbol] = useState("");
	const searchRef = useRef<HTMLInputElement>(null);
	const sharesRef = useRef<HTMLInputElement>(null);
	const sellRef = useRef<HTMLInputElement>(null);
	const cashAmtRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const handleTrans = function () {
		router.push("/transaction");
	}

	const handleOpenSell = function () {
		setSell(true);
	}

	const handleCloseSell = function () {
		setSell(false);
	}

	const handleSubmitSell = async function (e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const num = sellRef.current?.value || 0;
    let mult = price*num;
    mult = Number(mult.toFixed(2))
    const s = await sellPortfolioStock(portfolio.port_id, symbol, num, mult);
    if (s != -1) {
    	setDialogText(num + " shares of " + symbol + " were sold for $" + mult + "!");
    	const update = getPortfolioStocks(portfolio.port_id);
    	await addTransaction(0, symbol, portfolio.port_id, "SELL", num, mult, new Date());
    	setStocks(update);
    	setStockTotal(update.length);
    	setPortfolio(prev => {
            if (!prev) return null;
            return {
                ...prev,
                cash_amt: Number((prev.cash_amt + mult).toFixed(2))
            };
        });
    }
    else{
    	setDialogText("Could not sell stock.");
    }
    handleInvalidOpen();
    handleCloseSell();
	}

	const handleSellStock = async function (sym: string, num_of_shares: number) {
		const p = await getPrice(sym);
		setPrice(p);
		setShares(num_of_shares);
		setSymbol(sym);
		handleOpenSell();
	}

	const handleClose = function () {
		setOpen(false);
	}

	const handleInvalid = function () {
		setInvalid(false);
	}

	const handleInvalidOpen = function () {
		setInvalid(true);
	}

	const handleOpen = function () {
		setOpen(true);
	}

	const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cash = cashAmtRef.current?.value || 0;
    addCash(cash);
    handleClose();
	}

	const addCash = async function (cash: number) {
		portfolio.cash_amt = Number(portfolio.cash_amt) + Number(cash);
		const up = await updatePortfolio(portfolio.port_id, portfolio.user_id, portfolio.cash_amt);
		if (up != -1){
			setDialogText("Portfolio successfully updated!");
		}
		else{
			setDialogText("Portfolio was not updated.");
		}
		
		handleInvalidOpen();

	}

	const handleHome = function () {
		router.push('/home');
	}

	const handleOpenSearch = function() {
    setSearch(true);
  }

  const handleCloseSearch = function() {
    setSearch(false);
  }

  const handleSubmitSearch = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selection = searchRef.current?.value || "";
    handleSearch(selection);
    handleCloseSearch();
  };

  const handleSearch = async function (selection: string) {
    const searchResult = await getStocks(selection);
    setAllStocks(searchResult);
    setAllStocksTotal(searchResult.length);
  };

  const handleInsertDialog = async function(symbol: string) {
		setDialogSymbol(symbol);
		const stockPrice = await getPrice(symbol);
		setPrice(stockPrice);
		setInsertDialog(true);
	};

	const handleCloseInsert = function() {
		setInsertDialog(false);
	};

	const handleInsertSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const shares = sharesRef.current?.value || 0;
    handleInsertStock(dialogSymbol, shares);
    handleCloseInsert();
  };

  const handleInsertStock = async function (symbol: string, num_of_shares: number) {
  	if (price*num_of_shares < portfolio.cash_amt) {
	  	const insert = await insertPortfolioStock(portfolio.port_id, symbol, num_of_shares);
	  	const refresh = await getPortfolioStocks(portfolio.port_id);
	  	const refreshPrices = await getPortfolioPrices(portfolio.port_id);
	  	const diff = portfolio.cash_amt - price*num_of_shares;
	  	portfolio.cash_amt = Number(diff.toFixed(2))
	  	await updatePortfolio(portfolio.port_id, portfolio.user_id, portfolio.cash_amt);
	  	await addTransaction(0, symbol, portfolio.port_id, "BUY", num_of_shares, price, new Date());
	  	setStocks(refresh);
	  	setStockTotal(refresh.length);
	  	setAllPrices(refreshPrices);
	  }
  };

  const handleCloseTime = function () {
  	setOpenTime(false);
  }

  const handleOpenTime = function (symbol: string) {
  	setSelectedSymbol(symbol);
  	setOpenTime(true);
  }

  const handleHistory = async function (time: number) {
  	const today = new Date();
  	const todayStr = today.toISOString().split('T')[0];
  	const to = new Date(today);
  	if (time == 0) {
  		to.setDate(today.getDate() - 7);
  	}
  	else if (time == 1){
  		to.setDate(today.getDate() - 30);	
  	}
  	else if (time == 2){
  		to.setDate(today.getDate() - 120);
  	}
  	else if (time == 3){
  		to.setFullYear(today.getFullYear() - 1);
  	}
  	else if (time == 4){
  		to.setFullYear(today.getFullYear() - 5);
  	}
  	else if (time == 5){
  		to.setFullYear(today.getFullYear() - 10);
  	}
  	const toStr = to.toISOString().split('T')[0];
  	const his = await getHistory(selectedSymbol, toStr, todayStr);
  	handleCloseTime();
  	setHistoryData(his);
    setHistoryOpen(true)
  }

  const handlePredict = async function (symbol: string) {
  	setSelectedSymbol(symbol);
  	const pred = await getPrediction(symbol, 30);
  	setHistoryData(pred);
    setHistoryOpen(true)
  }

  const handleLog = async function () {
  	let ret = true;
  	for (let i = 0; i < stockTotal; i++) {
  		let r = await logStock(allPrices[i].open, allPrices[i].high, allPrices[i].low, allPrices[i].close, allPrices[i].volume, allPrices[i].symbol);
  		if (r == false) {
  			ret = false;
  		}
  	}
  	if (ret == true) {
  		setDialogText("Logged Daily Stock Information!");
  	}
  	else{
  		setDialogText("Couldn't log Daily Stock Information.");
  	}
  	handleInvalidOpen();
  }

  function PortRow({ index, stocks, style }: RowComponentProps<{ stocks: Stock[], allPrices: Dailystock[] }>) {
	  const h = stocks[index];
	  const priceData = allPrices.find((p: any) => p.symbol === h.symbol);
  	const priceDisplay = priceData ? `$${priceData.close}` : "Loading...";
  	const text = h.symbol + ": " + h.num_of_shares + " shares: " + priceDisplay;
	  return (
	    <ListItem style={style} key={index} component="div" secondaryAction={
	              <Button edge="end" onClick={() => handleSellStock(h.symbol, h.num_of_shares)} >
	                SELL
	              </Button>
	            }>
	        <Button edge="end" onClick={() => handlePredict(h.symbol)} >
	           PREDICT
	         </Button>
	       <ListItemButton onClick={() => handleOpenTime(h.symbol)}>
		       <ListItemText primary={text} primaryTypographyProps={{ 
					    sx: { 
					      fontFamily: krona.style.fontFamily, 
					      textAlign: 'center',
					    } 
					  }} />
				 </ListItemButton>
	    </ListItem>
	  );
	}

  function StockRow({ index, allStocks, style }: RowComponentProps<{ stocks: string[] }>) {
	  const text = allStocks[index];
	  return (
	    <ListItem style={style} key={index} component="div" disablePadding>
	      <ListItemButton onClick={() => handleInsertDialog(text)}>
	        <ListItemText primary={text} />
	      </ListItemButton>
	    </ListItem>
	  );
	}

	useEffect(() => {
		const fetchPort = async function () {
			const p = await getPortfolio(localStorage.getItem("port_id"));
	    	setPortfolio(p);
		}
		fetchPort();
	  }, []);

	useEffect(function () {
	    async function load() {
	    	const port_id = localStorage.getItem("port_id");
	      const result = await getPortfolioStocks(port_id);
	      setStocks(result);
	      setStockTotal(result.length);
	      const res = await getPortfolioPrices(port_id);
	      setAllPrices(res);
	    }
	    load();
	  }, []);

	useEffect(function () {
			let tot = 0
			for (let i = 0; i < stockTotal; i++){
				const h = stocks[i];
				let priceData = allPrices.find((p: any) => p.symbol === h.symbol);
				tot = Number((tot + h.num_of_shares*priceData?.close).toFixed(2));
			}
			setTotal(tot);

	  }, [allPrices, stocks]);


	const portHeight = Math.min(stockTotal * 46, 368);
	const stockHeight = Math.min(allStocksTotal * 46, 368);

	return (
		<div style={{ backgroundColor: "#8FCAFA" }}>
			<Dialog 
				open={openTime} 
				onClose={handleCloseTime}
				PaperProps={{
          sx: {
            backgroundColor: "#2798F5",
            color: "#8FCAFA",
            fontFamily: tomorrow.style.fontFamily,
          },
        }}
			>
        <DialogTitle sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>Add new Stock List</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>
          	Select your stock list's visibility
          </DialogContentText>
            <ButtonGroup variant="contained">
						  <Button sx={{ backgroundColor: "#2798F5" }} onClick={() => handleHistory(0)}>Week</Button>
						  <Button sx={{ backgroundColor: "#2798F5" }} onClick={() => handleHistory(1)}>Month</Button>
						  <Button sx={{ backgroundColor: "#2798F5" }} onClick={() => handleHistory(2)}>Quarter</Button>
						  <Button sx={{ backgroundColor: "#2798F5" }} onClick={() => handleHistory(3)}>Year</Button>
						  <Button sx={{ backgroundColor: "#2798F5" }} onClick={() => handleHistory(4)}>5 Years</Button>
						  <Button sx={{ backgroundColor: "#2798F5" }} onClick={() => handleHistory(5)}>10 Years</Button>
						</ButtonGroup>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleCloseTime}>Cancel</Button>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
			<Dialog 
				open={sell} 
				onClose={handleCloseSell}
				PaperProps={{
          sx: {
            backgroundColor: "#2798F5",
            color: "#8FCAFA",
            fontFamily: tomorrow.style.fontFamily,
          },
        }}
			>
        <DialogTitle sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>Add new Portfolio</DialogTitle>
        <form onSubmit={handleSubmitSell}>
        <DialogContent>
          <DialogContentText sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>
          	{"How many shares would you like to sell (Price per Share: $" + price + ")"}
          </DialogContentText>
          <NumberField sx={{ color: "#FFFFFF" }}label="" min={1} max={shares} inputRef={sellRef}/>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleCloseSell}>Cancel</Button>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} type="submit">Submit</Button>
        </DialogActions>
        </form>
      </Dialog>
			<Dialog
        open={invalid}
        onClose={handleInvalid}
        PaperProps={{
          sx: {
            backgroundColor: "#8FCAFA",
            color: "#2798F5",
            fontFamily: tomorrow.style.fontFamily,
          },
        }}
      >
        <DialogTitle sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }}>
          {dialogText}
        </DialogTitle>
        <DialogActions>
          <Button sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }} onClick={handleInvalid}>Close</Button>
        </DialogActions>
      </Dialog>
			<Dialog 
				open={open} 
				onClose={handleClose}
				PaperProps={{
          sx: {
            backgroundColor: "#2798F5",
            color: "#8FCAFA",
            fontFamily: tomorrow.style.fontFamily,
          },
        }}
			>
        <DialogTitle sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>Add new Portfolio</DialogTitle>
        <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>
          	How much cash would you like to insert into this portfolio?
          </DialogContentText>
            <DialogField
              required
              margin="dense"
              label="Cash Amount"
              variant="standard"
              fullWidth
              inputRef={cashAmtRef}
            />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleClose}>Cancel</Button>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} type="submit">Submit</Button>
        </DialogActions>
        </form>
      </Dialog>
			<Dialog 
				open={insertDialog} 
				onClose={handleCloseInsert}
				PaperProps={{
          sx: {
            backgroundColor: "#2798F5",
            color: "#8FCAFA",
            fontFamily: tomorrow.style.fontFamily,
          },
        }}
			>
        <DialogTitle sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>Add new Stock</DialogTitle>
        <form onSubmit={handleInsertSubmit}>
        <DialogContent>
          <DialogContentText sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>
          	{"How many shares of " + dialogSymbol + " would you like to by. Price: $" + price}
          </DialogContentText>
            <DialogField
              required
              margin="dense"
              label="# of Shares"
              variant="standard"
              fullWidth
              inputRef={sharesRef}
            />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleCloseInsert}>Cancel</Button>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} type="submit">Submit</Button>
        </DialogActions>
        </form>
      </Dialog>
			<Dialog 
        open={search} 
        onClose={handleCloseSearch}
        PaperProps={{
          sx: {
            backgroundColor: "#2798F5",
            color: "#8FCAFA",
            fontFamily: tomorrow.style.fontFamily,
          },
        }}
      >
        <DialogTitle sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>Search for Stock</DialogTitle>
        <form onSubmit={handleSubmitSearch}>
        <DialogContent>
            <DialogField
              required
              margin="dense"
              label="Stock Symbol"
              variant="standard"
              fullWidth
              inputRef={searchRef}
            />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleCloseSearch}>Cancel</Button>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} type="submit">Submit</Button>
        </DialogActions>
        </form>
      </Dialog>
			<Grid 
		      container 
		      spacing={3}
		      justifyContent="center"
		      alignItems="center"
		      sx={{ minHeight: '100vh', pb: 5 }}
		    >
			<Grid size={12} display="flex" justifyContent="center"><Title>{"Portfolio"}</Title></Grid>
			<Grid size={12} display="flex" justifyContent="center" sx={{ gap: 4 }}><Subtitle>{"Cash Amount: $" + portfolio.cash_amt}</Subtitle><Button onClick={handleOpen}>Add Cash</Button></Grid>
			<Grid size={6} display="flex" justifyContent="center"><Subtitle>{"Current Holdings"}</Subtitle></Grid>
			<Grid size={6} display="flex" justifyContent="center">
        <Subtitle>{"Buy a Stock"}</Subtitle>
         <IconButton onClick={handleOpenSearch} ><SearchIcon sx={{ color: "#2798F5", fontSize: 30 }}/></IconButton>
      </Grid>
      <Grid size={6} display="flex" justifyContent="center">
		  	<Box sx={{ width: "100%", height: portHeight, maxWidth: 600, bgcolor: "#8FCAFA", color: "#2798F5" }}>
		      <List
		        rowHeight={46}
		        rowCount={stockTotal}
		        style={{ height: portHeight, width: 600 }}
		        rowProps={{ stocks, allPrices }}
		        overscanCount={5}
		        rowComponent={PortRow}
		      />
		    </Box>
		  </Grid>
      <Grid size={6} display="flex" justifyContent="center">
		  	<Box sx={{ width: "100%", height: stockHeight, maxWidth: 360, bgcolor: "#8FCAFA", color: "#2798F5" }}>
		      <List
		        rowHeight={46}
		        rowCount={allStocksTotal}
		        style={{ height: stockHeight, width: 360 }}
		        rowProps={{ allStocks }}
		        overscanCount={5}
		        rowComponent={StockRow}
		      />
		    </Box>
		  </Grid>
		  <Grid size={12} display="flex" justifyContent="center"><Subtitle>{"Total Value: $" + total}</Subtitle></Grid>
		  <Grid size={12} display="flex" justifyContent="center"><Button onClick={handleLog}>Record Daily Information</Button></Grid>
		  <Grid size={12} display="flex" justifyContent="center"><Button onClick={handleTrans}>View Transactions</Button></Grid>
			<Grid size={12} display="flex" justifyContent="center"><Button onClick={handleHome}>← Home</Button></Grid>
			</Grid>
			<HistoryDialog 
			    open={historyOpen} 
			    onClose={() => setHistoryOpen(false)} 
			    data={historyData}
			    symbol={selectedSymbol}
			/>
		</div>
	
	);
}

export default Portfolio;
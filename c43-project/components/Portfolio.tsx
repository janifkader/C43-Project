"use client";

import { useRef, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { krona, tomorrow } from "../app/fonts";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
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
import { getPortfolio, getStocks, getPortfolioStocks, insertPortfolioStock, getPrice } from '../api/api';
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


function Portfolio() {
	const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
	const [stockTotal, setStockTotal] = useState(0);
	const [stocks, setStocks] = useState<Stock[]>([]);
	const [price, setPrice] = useState(0);
	const [allStocks, setAllStocks] = useState<string[]>([]);
	const [search, setSearch] = useState(false);
	const [allStocksTotal, setAllStocksTotal] = useState(0);
	const [insertDialog, setInsertDialog] = useState(false);
	const [dialogSymbol, setDialogSymbol] = useState<string>('');
	const searchRef = useRef<HTMLInputElement>(null);
	const sharesRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

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
	  	portfolio.cash_amt = portfolio.cash_amt - price*num_of_shares;
	  	setStocks(refresh);
	  	setStockTotal(refresh.length);
	  }
  };

  function PortRow({ index, stocks, style }: RowComponentProps<{ stocks: Stock[] }>) {
	  const h = stocks[index];
	  const text = h.symbol + ": " + h.num_of_shares + " shares";
	  return (
	    <ListItem style={style} key={index} component="div" disablePadding>
	       <ListItemText primary={text} primaryTypographyProps={{ 
				    sx: { 
				      fontFamily: krona.style.fontFamily, 
				      textAlign: 'center',
				    } 
				  }} />
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
	    }
	    load();
	  }, []);

	const portHeight = Math.min(stockTotal * 46, 368);
	const stockHeight = Math.min(allStocksTotal * 46, 368);

	return (
		<div style={{ backgroundColor: "#8FCAFA" }}>
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
		      sx={{ height: '100vh' }}
		    >
			<Grid size={12} display="flex" justifyContent="center"><Title>{"Portfolio"}</Title></Grid>
			<Grid size={12} display="flex" justifyContent="center"><Subtitle>{"Cash Amount: $" + portfolio.cash_amt}</Subtitle></Grid>
			<Grid size={6} display="flex" justifyContent="center"><Subtitle>{"Current Holdings"}</Subtitle></Grid>
			<Grid size={6} display="flex" justifyContent="center">
        <Subtitle>{"Add a Stock"}</Subtitle>
         <IconButton onClick={handleOpenSearch} ><SearchIcon sx={{ color: "#2798F5", fontSize: 30 }}/></IconButton>
      </Grid>
      <Grid size={6} display="flex" justifyContent="center">
		  	<Box sx={{ width: "100%", height: portHeight, maxWidth: 360, bgcolor: "#8FCAFA", color: "#2798F5" }}>
		      <List
		        rowHeight={46}
		        rowCount={stockTotal}
		        style={{ portHeight, width: 360 }}
		        rowProps={{ stocks }}
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
		        style={{ stockHeight, width: 360 }}
		        rowProps={{ allStocks }}
		        overscanCount={5}
		        rowComponent={StockRow}
		      />
		    </Box>
		  </Grid>
			<Grid size={12} display="flex" justifyContent="center"><Button onClick={handleHome}>← Home</Button></Grid>
			</Grid>
		</div>
	
	);
}

export default Portfolio;
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
import { insertStock, getStockList, getStockListStocks, getStocks } from '../api/api';
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

interface StockList {
	sl_id: number;
	user_id: number;
	visibility: string;
}

interface Stock {
	sl_id: number;
	symbol: string;
	num_of_shares: number;
}


function StockList() {
	const [stocklist, setStocklist] = useState<StockList[]>([]);
	const [stockTotal, setStockTotal] = useState(0);
	const [stocks, setStocks] = useState<Stock[]>([]);
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

	const handleInsertDialog = function(symbol: string) {
		setDialogSymbol(symbol);
		setInsertDialog(true);
	}

	const handleCloseInsert = function() {
		setInsertDialog(false);
	}

	const handleOpenSearch = function() {
    setSearch(true);
  }

  const handleCloseSearch = function() {
    setSearch(false);
  }

  const handleInsertSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const shares = sharesRef.current?.value || 0;
    handleInsertStock(dialogSymbol, shares);
    handleCloseInsert();
  };

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

  const handleInsertStock = async function (symbol: string, num_of_shares: number) {
  	const insert = await insertStock(stocklist.sl_id, symbol, num_of_shares);
  	const refresh = await getStockListStocks(stocklist.sl_id);
  	setStocks(refresh);
  	setStockTotal(refresh.length);
  }


	function SLRow({ index, stocks, style }: RowComponentProps<{ stocks: Stock[] }>) {
	  const s = stocks[index];
	  const text = s.symbol + ": " + s.num_of_shares + " shares";
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
		const fetchSl = async function () {
			const sl = await getStockList(localStorage.getItem("sl_id"));
	    	setStocklist(sl);
		}
		fetchSl();
	  }, []);

	useEffect(function () {
	    async function load() {
	    	const sl_id = localStorage.getItem("sl_id");
	      const result = await getStockListStocks(sl_id);
	      setStocks(result);
	      setStockTotal(result.length);
	    }
	    load();
	  }, []);

	const slHeight = Math.min(stockTotal * 46, 368);
	const stockHeight = Math.min(allStocksTotal * 46, 368);
	console.log("POT: " + allStocksTotal*46);
	console.log("AC HEIGHT: " + stockHeight)

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
          	{"How many shares of " + dialogSymbol + " would you like to add."}
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
			<Grid size={12} display="flex" justifyContent="center"><Title>{"Stock List"}</Title></Grid>
			<Grid size={6} display="flex" justifyContent="center"><Subtitle>{"Stocks"}</Subtitle></Grid>
			<Grid size={6} display="flex" justifyContent="center">
        <Subtitle>{"Add a Stock"}</Subtitle>
         <IconButton onClick={handleOpenSearch} ><SearchIcon sx={{ color: "#2798F5", fontSize: 30 }}/></IconButton>
      </Grid>
			<Grid size={6} display="flex" justifyContent="center">
		  	<Box sx={{ width: "100%", height: slHeight, maxWidth: 360, bgcolor: "#8FCAFA", color: "#2798F5" }}>
		      <List
		        rowHeight={46}
		        rowCount={stockTotal}
		        style={{ slHeight, width: 360 }}
		        rowProps={{ stocks }}
		        overscanCount={5}
		        rowComponent={SLRow}
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
			<Grid size={12} display="flex" justifyContent="center"><Subtitle>{"Visibility: " + stocklist.visibility}</Subtitle></Grid>
			<Grid size={12} display="flex" justifyContent="center"><Button onClick={handleHome}>← Home</Button></Grid>
			</Grid>
		</div>
	
	);
}

export default StockList;
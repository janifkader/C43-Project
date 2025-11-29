"use client";

import { useRef, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { krona, tomorrow } from "../app/fonts";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { List, RowComponentProps } from 'react-window';
import Drawer from '@mui/material/Drawer';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FormControlLabel from '@mui/material/FormControlLabel';
import Review from './Review'
import { insertSLStock, getStockList, getStockListStocks, getStocks, deleteStockList, deleteStockListStock, shareStockList, unshareStockList, getFriends, updateStockListVisibility } from '../api/api';
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

interface FriendRequest {
	request_id: Number;
	sender_id: Number;
	receiver_id: Number;
	username: String
	status: String;
	last_updated: Date;
}


function StockList() {
	const [stocklist, setStocklist] = useState<StockList[]>([]);
	const [currentUser, setCurrentUser] = useState(0);
	const [stockTotal, setStockTotal] = useState(0);
	const [stocks, setStocks] = useState<Stock[]>([]);
	const [allStocks, setAllStocks] = useState<string[]>([]);
	const [search, setSearch] = useState(false);
	const [allStocksTotal, setAllStocksTotal] = useState(0);
	const [insertDialog, setInsertDialog] = useState(false);
	const [dialogSymbol, setDialogSymbol] = useState<string>('');
	const [reviews, setReviews] = useState(false);
	const [open, setOpen] = useState(false);
	const [unshare, setUnshare] = useState(false);
	const [friends, setFriends] = useState<FriendRequest[]>([]);
	const [friendsTotal, setFriendsTotal] = useState(0);
	const [invalid, setInvalid] = useState(false);
	const [dialogText, setDialogText] = useState("");
	const [openSL, setOpenSL] = useState(false);
	const searchRef = useRef<HTMLInputElement>(null);
	const sharesRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const handleOpenSL = function() {
		setOpenSL(true);
	}

	const handleCloseSL = function() {
		setOpenSL(false);
	}

	const handleOpenUnshare = function() {
		setUnshare(true);
	}

	const handleCloseUnshare = function() {
		setUnshare(false);
	}

	const handleVisibility = async function (newVisibility: string) {
		const vis = await updateStockListVisibility(stocklist.sl_id, newVisibility);
		if (vis != -1) {
			setDialogText("Successfully changed stock list visibility!");
			stocklist.visibility = newVisibility;
		}
		else {
			setDialogText("Couldn't change stock list visibility.");
		}
		handleCloseSL();
		handleInvalidOpen();
	};

	const handleHome = function () {
		router.push('/home');
	}

	const handleClose = function () {
		setOpen(false);
	}

	const handleOpen = function () {
		setOpen(true);
	}

	const handleInvalid = function () {
		setInvalid(false);
	}

	const handleInvalidOpen = function () {
		setInvalid(true);
	}

	const handleShare = async function (user_id: string) {
		const share = await shareStockList(stocklist.sl_id, user_id);
		handleClose();
		if (share != -1){
			setDialogText("Stock List Successfully shared!");
		}
		else{
			setDialogText("There was an error trying to share the Stock List.");
		}
		handleInvalidOpen();
	}

	const handleUnshare = async function (user_id: string) {
		const share = await unshareStockList(stocklist.sl_id, user_id);
		handleCloseUnshare();
		if (share != -1){
			setDialogText("Stock List Successfully unshared!");
		}
		else{
			setDialogText("There was an error trying to unshare the Stock List.");
		}
		handleInvalidOpen();
	}

	const handleOpenReviews = function () {
		setReviews(true);
	}

	const handleCloseReviews = function () {
		setReviews(false);
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

  const handleDelete = async function() {
  	const sl_id = localStorage.getItem("sl_id");
  	const del = await deleteStockList(sl_id);
  	if (del == -1){
			setDialogText("There was an error trying to delete the Stock List.");
			handleInvalidOpen();
		}
		else{
			handleHome();
		}
  }

  const handleDeleteStock = async function(symbol: string) {
  	const sl_id = stocklist.sl_id;
  	await deleteStockListStock(sl_id, symbol);
  	const refresh = await getStockListStocks(sl_id);
  	setStocks(refresh);
  	setStockTotal(refresh.length);
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
  	const insert = await insertSLStock(stocklist.sl_id, symbol, num_of_shares);
  	const refresh = await getStockListStocks(stocklist.sl_id);
  	setStocks(refresh);
  	setStockTotal(refresh.length);
  }


	function SLRow({ index, stocks, style }: RowComponentProps<{ stocks: Stock[] }>) {
	  const s = stocks[index];
	  const text = s.symbol + ": " + s.num_of_shares + " shares";
	  const user = localStorage.getItem("user_id");
	  if (stocklist.user_id == user){
		  return (
		    <ListItem style={style} key={index} component="div" secondaryAction={
	              <IconButton edge="end" onClick={() => handleDeleteStock(s.symbol)} >
	                <CloseIcon sx={{ color: "#2798F5" }} />
	              </IconButton>
	            }>
		       <ListItemText primary={text} primaryTypographyProps={{ 
					    sx: { 
					      fontFamily: krona.style.fontFamily, 
					      textAlign: 'center',
					    } 
					  }} />
		    </ListItem>
		  );
		}
		else{
			return (
		    <ListItem style={style} key={index} component="div" >
		       <ListItemText primary={text} primaryTypographyProps={{ 
					    sx: { 
					      fontFamily: krona.style.fontFamily, 
					      textAlign: 'center',
					    } 
					  }} />
		    </ListItem>
		  );
		}
	}

	function StockRow({ index, allStocks, style }: RowComponentProps<{ stocks: string[] }>) {
	  const text = allStocks[index];
		  return (
		    <ListItem style={style} key={index} component="div" >
		      <ListItemButton onClick={() => handleInsertDialog(text)}>
		        <ListItemText primary={text} />
		      </ListItemButton>
		    </ListItem>
		  );
	}

	function FriendRow({ index, friends, style }: RowComponentProps<{ friends: FriendRequest[] }>) {
	  const friend = friends[index];
	  const friend_id = (currentUser == friend.receiver_id) ? friend.sender_id : friend.receiver_id;
	  return (
	    <ListItem style={style} key={index} component="div">
	    	<ListItemButton onClick={() => handleShare(friend_id)}>
	        <ListItemText primary={friend.username} />
	      </ListItemButton>
	    </ListItem>
	  );
	}

	function UnshareRow({ index, friends, style }: RowComponentProps<{ friends: FriendRequest[] }>) {
	  const friend = friends[index];
	  const friend_id = (currentUser == friend.receiver_id) ? friend.sender_id : friend.receiver_id;
	  return (
	    <ListItem style={style} key={index} component="div">
	    	<ListItemButton onClick={() => handleUnshare(friend_id)}>
	        <ListItemText primary={friend.username} />
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
	    	const user_id = localStorage.getItem("user_id");
	    	setCurrentUser(user_id);
	      const result = await getStockListStocks(sl_id);
	      setStocks(result);
	      setStockTotal(result.length);
	      const f = await getFriends(user_id);
	      setFriends(f);
	      setFriendsTotal(f.length);
	    }
	    load();
	  }, []);

	const slHeight = Math.min(stockTotal * 46, 368);
	const stockHeight = Math.min(allStocksTotal * 46, 368);
	const friendsHeight = Math.min(friendsTotal * 46, 368);

	return (
		<div style={{ backgroundColor: "#8FCAFA", minHeight: "100vh", display: "flow-root" }}>
			<Dialog 
				open={openSL} 
				onClose={handleCloseSL}
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
						  <Button onClick={() => handleVisibility("private")}>private</Button>
						  <Button onClick={() => handleVisibility("public")}>public</Button>
						</ButtonGroup>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleCloseSL}>Cancel</Button>
        </DialogActions>
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
        <DialogTitle sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>Share Stock List</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>
          	Select a friend to share your stock list.
          </DialogContentText>
            <Box sx={{ width: "100%", height: friendsHeight, maxWidth: 360, bgcolor: "#2798F5" }}>
			      <List
			        rowHeight={46}
			        rowCount={friendsTotal}
			        style={{ friendsHeight, width: 360 }}
			        rowProps={{ friends }}
			        overscanCount={5}
			        rowComponent={FriendRow}
			      />
			    </Box>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
				open={unshare} 
				onClose={handleCloseUnshare}
				PaperProps={{
          sx: {
            backgroundColor: "#2798F5",
            color: "#8FCAFA",
            fontFamily: tomorrow.style.fontFamily,
          },
        }}
			>
        <DialogTitle sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>Unshare Stock List</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>
          	Select a friend to unshare your stock list.
          </DialogContentText>
            <Box sx={{ width: "100%", height: friendsHeight, maxWidth: 360, bgcolor: "#2798F5" }}>
			      <List
			        rowHeight={46}
			        rowCount={friendsTotal}
			        style={{ friendsHeight, width: 360 }}
			        rowProps={{ friends }}
			        overscanCount={5}
			        rowComponent={UnshareRow}
			      />
			    </Box>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
			<Drawer
				anchor="bottom"
				open={reviews}
				onClose={handleCloseReviews}
			>
				<Review onClose={handleCloseReviews}/>
			</Drawer>
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
		      sx={{ minHeight: '100vh', pb: 5 }}
		    >
			<Grid size={12} display="flex" justifyContent="center"><Title>{"Stock List"}</Title></Grid>
			{ (currentUser == stocklist.user_id) ?
			(<>
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
		  </>) : (
		  <>
		  <Grid size={12} display="flex" justifyContent="center"><Subtitle>{"Stocks"}</Subtitle></Grid>
		  <Grid size={12} display="flex" justifyContent="center">
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
		  </Grid></>)}
			<Grid size={12} display="flex" justifyContent="center"><Subtitle>{"Visibility: " + stocklist.visibility + ", Total Value: "}</Subtitle></Grid>
			<Grid size={12} display="flex" justifyContent="center"><Button onClick={handleOpenReviews}>View Reviews</Button></Grid>
			<Grid size={3} display="flex" justifyContent="center"><Button onClick={handleOpen}>Share Stock List</Button></Grid>
			<Grid size={3} display="flex" justifyContent="center"><Button onClick={handleOpenUnshare}>Unshare Stock List</Button></Grid>
			<Grid size={3} display="flex" justifyContent="center"><Button onClick={handleDelete}>Delete Stock List</Button></Grid>
			<Grid size={3} display="flex" justifyContent="center"><Button onClick={handleOpenSL}>Update Visibility</Button></Grid>
			<Grid size={12} display="flex" justifyContent="center"><Button onClick={handleHome}>← Home</Button></Grid>
			</Grid>
		</div>
	
	);
}

export default StockList;
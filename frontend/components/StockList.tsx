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
import { insertSLStock, getStockList, getStockListStocks, getStocks, deleteStockList, deleteStockListStock, shareStockList, unshareStockList, getFriends, updateStockListVisibility, getSharedTo } from '../api/api';
import { useRouter, useParams } from "next/navigation";

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
	request_id: number;
	sender_id: number;
	receiver_id: number;
	username: string;
	status: string;
	last_updated: Date;
}

interface Friend {
	user_id: number;
	username: string;
}


function StockList() {
	const [stocklist, setStocklist] = useState<StockList | null>(null);
	const [sl_id, setSlId] = useState(-1);
	const [owner, setOwner] = useState(false);
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
	const [unshareFriend, setUnshareFriend] = useState<Friend[]>([]);
	const [unshareFriendTotal, setUnshareFriendTotal] = useState(0);
	const [friends, setFriends] = useState<FriendRequest[]>([]);
	const [friendsTotal, setFriendsTotal] = useState(0);
	const [invalid, setInvalid] = useState(false);
	const [dialogText, setDialogText] = useState("");
	const [openSL, setOpenSL] = useState(false);
	const searchRef = useRef<HTMLInputElement>(null);
	const sharesRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const params = useParams();

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
		if (!stocklist) return;
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

	const handleShare = async function (user_id: number) {
		if (!stocklist) return;
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

	const handleUnshare = async function (user_id: number) {
		if (!stocklist) return;
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
  	if (!stocklist) return;
  	const sl_id = stocklist.sl_id;
  	await deleteStockListStock(sl_id, symbol);
  	const refresh = await getStockListStocks(sl_id);
  	setStocks(refresh);
  	setStockTotal(refresh.length);
  }

  const handleInsertSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const shares = Number(sharesRef.current?.value) || 0;
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
  	if (!stocklist) return;
  	const insert = await insertSLStock(stocklist.sl_id, symbol, num_of_shares);
  	const refresh = await getStockListStocks(stocklist.sl_id);
  	setStocks(refresh);
  	setStockTotal(refresh.length);
  }


	function SLRow({ index, stocks, style }: RowComponentProps<{ stocks: Stock[] }>) {
	  const s = stocks[index];
	  const text = s.symbol + ": " + s.num_of_shares + " shares";
	  if (owner){
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

	function StockRow({ index, allStocks, style }: RowComponentProps<{ allStocks: string[] }>) {
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

	function UnshareRow({ index, unshareFriend, style }: RowComponentProps<{ unshareFriend: Friend[] }>) {
	  const friend = unshareFriend[index];
	  return (
	    <ListItem style={style} key={index} component="div">
	    	<ListItemButton onClick={() => handleUnshare(friend.user_id)}>
	        <ListItemText primary={friend.username} />
	      </ListItemButton>
	    </ListItem>
	  );
	}

	useEffect(() => {
		const fetchSl = async function () {
			if (params.id) {
				const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
	  		const id = rawId.split('_');
	  		const own = id[1] != 'shared';
				setSlId(Number(id[0]));
				setOwner(own);
				const sl = await getStockList(Number(id[0]));
		    setStocklist(sl);
		  }
		}
		fetchSl();
	  }, [params.id]);

	useEffect(function () {
	    async function load() {
	    	if (sl_id != -1) {
		      const result = await getStockListStocks(sl_id);
		      setStocks(result);
		      setStockTotal(result.length);
		      const f = await getFriends();
		      const g = await getSharedTo(sl_id);
		      setUnshareFriend(g);
		      setUnshareFriendTotal(g.length);
					const friendUsernames = new Set(g.map(friend => friend.username));
					const filteredRequests = f.filter(req => !friendUsernames.has(req.username));
					setFriends(filteredRequests);
		      setFriendsTotal(filteredRequests.length);
		    }
	    }
	    load();
	  }, [sl_id]);

	const slHeight = Math.min(stockTotal * 46, 368);
	const isSLScroll = (stockTotal * 46) > 368;
	const stockHeight = Math.min(allStocksTotal * 46, 368);
	const isStockScroll = (allStocksTotal * 46) > 368;
	const friendsHeight = Math.min(friendsTotal * 46, 368);
	const isFriendScroll = (friendsTotal * 46) > 368;
	const unshareFriendHeight = Math.min(unshareFriendTotal * 46, 368);
	const isUnshareScroll = (unshareFriendTotal * 46) > 368;

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
			        style={{ height: friendsHeight, width: 360, overflowY: isFriendScroll ? 'auto' : 'hidden' }}
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
            <Box sx={{ width: "100%", height: unshareFriendHeight, maxWidth: 360, bgcolor: "#2798F5" }}>
			      <List
			        rowHeight={46}
			        rowCount={unshareFriendTotal}
			        style={{ height: unshareFriendHeight, width: 360, overflowY: isUnshareScroll ? 'auto' : 'hidden' }}
			        rowProps={{ unshareFriend }}
			        overscanCount={5}
			        rowComponent={UnshareRow}
			      />
			    </Box>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleCloseUnshare}>Cancel</Button>
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
			{ owner ?
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
		        style={{ height: slHeight, width: 360, overflowY: isSLScroll ? 'auto' : 'hidden' }}
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
		        style={{ height: stockHeight, width: 360, overflowY: isStockScroll ? 'auto' : 'hidden' }}
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
		        style={{ height: slHeight, width: 360, overflowY: isSLScroll ? 'auto' : 'hidden' }}
		        rowProps={{ stocks }}
		        overscanCount={5}
		        rowComponent={SLRow}
		      />
		    </Box>
		  </Grid></>)}
			<Grid size={12} display="flex" justifyContent="center"><Subtitle>{"Visibility: " + stocklist?.visibility}</Subtitle></Grid>
			<Grid size={12} display="flex" justifyContent="center"><Button sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }} onClick={handleOpenReviews}>View Reviews</Button></Grid>
			{owner && <>
			<Grid size={3} display="flex" justifyContent="center"><Button sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }} onClick={handleOpen}>Share Stock List</Button></Grid>
			<Grid size={3} display="flex" justifyContent="center"><Button sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }} onClick={handleOpenUnshare}>Unshare Stock List</Button></Grid>
			<Grid size={3} display="flex" justifyContent="center"><Button sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }} onClick={handleDelete}>Delete Stock List</Button></Grid>
			<Grid size={3} display="flex" justifyContent="center"><Button sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }} onClick={handleOpenSL}>Update Visibility</Button></Grid>
			</>}
			<Grid size={12} display="flex" justifyContent="center"><Button sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }} onClick={handleHome}>← Home</Button></Grid>
			</Grid>
		</div>
	
	);
}

export default StockList;
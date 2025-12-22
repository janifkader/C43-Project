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
import FormControlLabel from '@mui/material/FormControlLabel';
import { createPortfolio, getPortfolios, createStockList, getStockLists, getSharedStockLists, getUser, signout } from '../api/api';
import { useRouter } from "next/navigation";

interface Portfolio {
	port_id: number;
	cash_amt: number;
}

interface StockList {
	sl_id: number;
	user_id: number;
	visibility: string;
}

interface SharedStockList {
	sl_id: number;
	user_id: number;
	username: string;
	visibility: string;
}

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
  "& .MuiOutlinedInput-root fieldset": { borderColor: "#8FCAFA" },
  "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "#8FCAFA" },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#8FCAFA" }
}));

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

function Home() {

	const logout = async function() {
		const res = await signout();
		if (res == 0){
			router.push("/");
		}
	}

	const handlePortfolioPage = function(port_id: number) {
		router.push(`/portfolio/${port_id}`);
	}

	const handleSLPage = function(sl_id: number) {
		router.push(`/stocklist/${sl_id}`);
	}

	const handleSLShared = function(sl_id: number) {
		router.push(`/stocklist/${sl_id}_shared`);
	}

	const handleOpenPort = function() {
		setOpenPort(true);
	}

	const handleClosePort = function() {
		setOpenPort(false);
	}

	const handleOpenSL = function() {
		setOpenSL(true);
	}

	const handleCloseSL = function() {
		setOpenSL(false);
		setVisibility("");
	}

	const handleFriend = function() {
		router.push("/friends");
	}

	const handleSubmitPort = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cash_amt = Number(cashAmtRef.current?.value) || 0;
    handlePortfolio(cash_amt);
    handleClosePort();
  };

  const handleSubmitSL = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleStockList(visibility);
    handleCloseSL();
  };

  const handleVisibility = (newVisibility: string) => {
    setVisibility(newVisibility);
	};

	const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
	const [stockLists, setStockLists] = useState<StockList[]>([]);
	const [shared, setShared] = useState<SharedStockList[]>([]);
	const [portTotal, setPortTotal] = useState<number>(0);
	const [slTotal, setSLTotal] = useState<number>(0);
	const [sharedTotal, setSharedTotal] = useState<number>(0);
	const [openPort, setOpenPort] = useState(false);
	const [openSL, setOpenSL] = useState(false);
	const [visibility, setVisibility] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const cashAmtRef = useRef<HTMLInputElement>(null)
	const router = useRouter();

	const handlePortfolio = async function (cash_amt: number) {
		let port_id = await createPortfolio(0, cash_amt);
		const refreshPorts = await getPortfolios();
		setPortfolios(refreshPorts);
		setPortTotal(refreshPorts.length);
	}

	const handleStockList = async function (visibility: string) {
		let sl_id = await createStockList(0, visibility);
		const refreshSls = await getStockLists();
		setStockLists(refreshSls);
		setSLTotal(refreshSls.length);
	}

	function PortRow({ index, portfolios, style }: RowComponentProps<{ portfolios: Portfolio[] }>) {
	  const port = portfolios[index];
	  const text = index+1 + ". Cash Amount: $" + port.cash_amt;
	  return (
	    <ListItem style={style} key={index} component="div" disablePadding >
	      <ListItemButton onClick={() => handlePortfolioPage(port.port_id)}>
	        <ListItemText primary={text} primaryTypographyProps = {{ color: "#2798F5", align: 'center', fontFamily: tomorrow.style.fontFamily, fontWeight: 'bold' }} />
	      </ListItemButton>
	    </ListItem>
	  );
	}

	function SLRow({ index, stockLists, style }: RowComponentProps<{ stockLists: StockList[] }>) {
	  const sl = stockLists[index];
	  const text = index+1 + ". Visibility: " + sl.visibility;
	  return (
	    <ListItem style={style} key={index} component="div" disablePadding>
	      <ListItemButton onClick={() => handleSLPage(sl.sl_id)}>
	        <ListItemText primary={text} primaryTypographyProps = {{ color: "#2798F5", align: 'center', fontFamily: tomorrow.style.fontFamily, fontWeight: 'bold' }} />
	      </ListItemButton>
	    </ListItem>
	  );
	}

	function SharedRow({ index, shared, style }: RowComponentProps<{ shared: SharedStockList[] }>) {
	  const sl = shared[index];
	  const text = sl.username + "'s Stock List: Visibility: " + sl.visibility;
	  return (
	    <ListItem style={style} key={index} component="div" disablePadding>
	      <ListItemButton onClick={() => handleSLShared(sl.sl_id)}>
	        <ListItemText primary={text} primaryTypographyProps = {{ color: "#2798F5", align: 'center', fontFamily: tomorrow.style.fontFamily, fontWeight: 'bold' }} />
	      </ListItemButton>
	    </ListItem>
	  );
	}


	  useEffect(function () {
	    async function load() {
	      const result = await getPortfolios();
	      setPortfolios(result);
	      setPortTotal(result.length);
	      const slResult = await getStockLists();
	      setStockLists(slResult);
	      setSLTotal(slResult.length);
	      const sharedResult = await getSharedStockLists();
	      setShared(sharedResult);
	      setSharedTotal(sharedResult.length);
	      const uName = await getUser();
	      setUsername(uName.username);
	    }
	    load();
	  }, []);

	const portHeight = Math.min(portTotal * 46, 368);
	const isPortScroll = (portTotal * 46) > 368;
	const slHeight = Math.min(slTotal * 46, 368);
	const isSLScroll = (slTotal * 46) > 368;
	const sharedHeight = Math.min(sharedTotal * 46, 368);
	const isSharedScroll = (sharedTotal * 46) > 368;

	return (
		<div style={{ backgroundColor: "#8FCAFA" }}>
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
        <form onSubmit={handleSubmitSL}>
        <DialogContent>
          <DialogContentText sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>
          	Select your stock list's visibility
          </DialogContentText>
            <ButtonGroup variant="contained">
						  <Button sx={{ backgroundColor: visibility == "private" ? "#1565C0" : "#2798F5" }} onClick={() => handleVisibility("private")}>private</Button>
						  <Button sx={{ backgroundColor: visibility == "public" ? "#1565C0" : "#2798F5" }} onClick={() => handleVisibility("public")}>public</Button>
						</ButtonGroup>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleCloseSL}>Cancel</Button>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} type="submit">Submit</Button>
        </DialogActions>
        </form>
      </Dialog>
			<Dialog 
				open={openPort} 
				onClose={handleClosePort}
				PaperProps={{
          sx: {
            backgroundColor: "#2798F5",
            color: "#8FCAFA",
            fontFamily: tomorrow.style.fontFamily,
          },
        }}
			>
        <DialogTitle sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>Add new Portfolio</DialogTitle>
        <form onSubmit={handleSubmitPort}>
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
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleClosePort}>Cancel</Button>
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
			<Grid size={12} display="flex" justifyContent="center"><Title>{username ? (username + "'s Portfolio Manager") : "Portfolio Manager"}</Title></Grid>
			<Grid size={4} display="flex" justifyContent="center"><Subtitle>{"Portfolios"}</Subtitle></Grid>
			<Grid size={4} display="flex" justifyContent="center"><Subtitle>{"Stock Lists"}</Subtitle></Grid>
			<Grid size={4} display="flex" justifyContent="center"><Subtitle>{"Shared Stock Lists"}</Subtitle></Grid>
			<Grid size={4} display="flex" justifyContent="center">
				<Box sx={{ width: "100%", height: portHeight, maxWidth: 360, bgcolor: "#8FCAFA" }}>
		      <List
		        rowHeight={46}
		        rowCount={portTotal}
		        style={{ height: portHeight, width: 360, overflowY: isPortScroll ? 'auto' : 'hidden'  }}
		        rowProps={{ portfolios }}
		        overscanCount={5}
		        rowComponent={PortRow}
		      />
		    </Box>
		   </Grid>
		  <Grid size={4} display="flex" justifyContent="center">
		  	<Box sx={{ width: "100%", height: slHeight, maxWidth: 360, bgcolor: "#8FCAFA" }}>
		      <List
		        rowHeight={46}
		        rowCount={slTotal}
		        style={{ height: slHeight, width: 360, overflowY: isSLScroll ? 'auto' : 'hidden'  }}
		        rowProps={{ stockLists }}
		        overscanCount={5}
		        rowComponent={SLRow}
		      />
		    </Box>
		  </Grid>
		  <Grid size={4} display="flex" justifyContent="center">
		  	<Box sx={{ width: "100%", height: sharedHeight, maxWidth: 360, bgcolor: "#8FCAFA" }}>
		      <List
		        rowHeight={46}
		        rowCount={sharedTotal}
		        style={{ height: sharedHeight, width: 360, overflowY: isSharedScroll ? 'auto' : 'hidden'  }}
		        rowProps={{ shared }}
		        overscanCount={5}
		        rowComponent={SharedRow}
		      />
		    </Box>
		  </Grid>
			<Grid size={4} display="flex" justifyContent="center"><Button onClick={handleOpenPort} sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }} >{"Add Portfolio"}</Button></Grid>
			<Grid size={4} display="flex" justifyContent="center"><Button onClick={handleOpenSL} sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }}>{"Add Stock List"}</Button></Grid>
			<Grid size={4} display="flex" justifyContent="center"><Button onClick={handleFriend} sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }}>{"View Friends"}</Button></Grid>
			
			<Grid size={12} display="flex" justifyContent="center">
				
		   </Grid>
		   <Grid size={12} display="flex" justifyContent="center">
        <Button sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }} onClick={logout}>Log Out</Button>
       </Grid>
  	</Grid>
    </div>
	);
}

export default Home;
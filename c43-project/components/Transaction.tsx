"use client";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { useRouter } from "next/navigation";
import { styled } from '@mui/material/styles';
import { List, RowComponentProps } from 'react-window';
import { krona, tomorrow } from "../app/fonts";
import { useRef, useEffect, useState } from "react";
import { getTransactions } from '../api/api'

const Title = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,
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

const Subtitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  color: '#2798F5',
  fontFamily: krona.style.fontFamily,
}));

interface Transaction {
	symbol: string;
	port_id: number;
	type: string;
	amount: number; 
	unit_cost: number; 
	date: Date;
}

function Transaction () {

	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [transactionsTotal, setTransactionsTotal] = useState(0);
	const editRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const handlePort = function () {
		router.push('/portfolio');
	}

	function Row({ index, transactions, style }: RowComponentProps<{ transactions: Transaction[] }>) {
	  const trans = transactions[index];
	  const text = `${trans.date}: ${trans.type} ${trans.amount} shares of ${trans.symbol} for ${trans.unit_cost} per share.`;
		  return (
		    <ListItem style={style} key={index} component="div" >
		        <ListItemText primary={text} primaryTypographyProps={{ 
				    sx: { 
				      fontFamily: krona.style.fontFamily, 
				      textAlign: 'center',
				    } 
				  }}/>
		    </ListItem>
		  );
	}

	useEffect(function () {
	    async function load() {
	    	const port_id = Number(localStorage.getItem("port_id")) || 0;
	    	const result = await getTransactions(port_id);
	      setTransactions(result);
	      setTransactionsTotal(result.length);
	    }
	    load();
	  }, []);

	const transactionsHeight = Math.min(transactionsTotal * 46, 368);

	return(
		<div style={{ backgroundColor: "#8FCAFA" }}>
      <Grid 
		      container 
		      spacing={3}
		      justifyContent="center"
		      alignItems="center"
		      sx={{ minHeight: '100vh', pb: 5 }}
		    >
		   <Grid size={12} display="flex" justifyContent="center"><Title>{"Transactions"}</Title></Grid>
		   <Grid size={12} display="flex" justifyContent="center">
		  	<Box sx={{ width: "100%", height: transactionsHeight, maxWidth: 600, bgcolor: "#8FCAFA", color: "#2798F5" }}>
		      <List
		        rowHeight={46}
		        rowCount={transactionsTotal}
		        style={{ height: transactionsHeight, width: 600 }}
		        rowProps={{ transactions }}
		        overscanCount={5}
		        rowComponent={Row}
		      />
		    </Box>
		  </Grid>
		  <Grid size={12} display="flex" justifyContent="center"><Button onClick={handlePort}>← Portfolio</Button></Grid>
			</Grid>
		 </div>
	);
}

export default Transaction;
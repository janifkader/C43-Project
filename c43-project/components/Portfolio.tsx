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
import { createPortfolio, getPortfolio, createStockList, getStockLists } from '../api/api';
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

interface Portfolio {
	port_id: number;
	user_id: number;
	cash_amt: number;
}

function Portfolio() {
	const [portfolio, setPortfolio] = useState<Portfolio[]>([]);

	useEffect(() => {
		const fetchPort = async function () {
			const p = await getPortfolio(localStorage.getItem("port_id"));
	    	setPortfolio(p);
		}
		fetchPort();
	  }, []);

	return (
		<div style={{ backgroundColor: "#8FCAFA" }}>
			<Grid 
		      container 
		      spacing={3}
		      justifyContent="center"
		      alignItems="center"
		      sx={{ height: '100vh' }}
		    >
			<Grid size={12} display="flex" justifyContent="center"><Title>{"Portfolio"}</Title></Grid>
			<Grid size={12} display="flex" justifyContent="center"><Subtitle>{"Cash Amount: " + portfolio.cash_amt}</Subtitle></Grid>
			</Grid>
		</div>
	
	);
}

export default Portfolio;
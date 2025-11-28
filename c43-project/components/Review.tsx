"use client";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { List, RowComponentProps } from 'react-window';
import { tomorrow } from "../app/fonts";
import { useRef, useEffect, useState } from "react";
import { getReviews, writeReview } from '../api/api'

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

interface Review {
	username: string
	text: string
}

function Review() {

	const [reviews, setReviews] = useState<Review[]>([]);
	const [reviewsTotal, setReviewsTotal] = useState(0);
	const [open, setOpen] = useState(false);
	const reviewRef = useRef<HTMLInputElement>(null);

	const handleClose = function () {
		setOpen(false);
	}

	const handleOpen = function () {
		setOpen(true);
	}

	const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = reviewRef.current?.value || "";
    handleReview(text);
    handleClose();
	}

	const handleReview = async function (text: string) {
		const sl = localStorage.getItem("sl_id");
		const uid = localStorage.getItem("user_id");
		await writeReview(0, uid, sl, text);
		const update = await getReviews(sl);
		setReviews(update);
	}

	function Row({ index, reviews, style }: RowComponentProps<{ reviews: Review[] }>) {
	  const r = reviews[index];
	  const content = r.username + ": " + r.text;
	  return (
	    <ListItem style={style} key={index} component="div" disablePadding sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
            }}>
	       <ListItemText primary={content} primaryTypographyProps={{ 
				    sx: { 
				      fontFamily: tomorrow.style.fontFamily, 
				      textAlign: 'center',
				    } 
				  }} />
	    </ListItem>
	  );
	}

	useEffect(function () {
	    async function load() {
	    	const sl_id = localStorage.getItem("sl_id");
	      const result = await getReviews(sl_id);
	      setReviews(result);
	      setReviewsTotal(result.length);
	    }
	    load();
	  }, []);

	const height = Math.min(reviewsTotal * 46, 368);

	return(
		<div style={{ backgroundColor: "#8FCAFA" }}>
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
        <DialogTitle sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>Write a Review</DialogTitle>
        <form onSubmit={handleSubmit}>
        <DialogContent>
            <DialogField
              required
              margin="dense"
              label="Write a review"
              variant="standard"
              fullWidth
              inputRef={reviewRef}
            />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleClose}>Cancel</Button>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} type="submit">Submit</Button>
        </DialogActions>
        </form>
      </Dialog>
		<Box sx={{ display:"flex", justifyContent:"center", width: "100%", height: height, maxWidth: 360, bgcolor: "#2798F5", color: "#8FCAFA" }}>
		      <List
		        rowHeight={46}
		        rowCount={reviewsTotal}
		        style={{ height, width: 360 }}
		        rowProps={{ reviews }}
		        overscanCount={5}
		        rowComponent={Row}
		      />
		 </Box>
		 <Button sx={{ display:"flex", justifyContent:"center", width: "100%" }} onClick={handleOpen}>Write a Review</Button>
		 </div>
	);
}

export default Review;
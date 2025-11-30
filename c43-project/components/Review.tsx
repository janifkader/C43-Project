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
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { List, RowComponentProps } from 'react-window';
import { krona, tomorrow } from "../app/fonts";
import { useRef, useEffect, useState } from "react";
import { getReviews, writeReview, getStockList, editReview, deleteReview} from '../api/api'

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

interface Review {
	review_id: number;
	user_id: number;
	sl_id: number;
	text: string;
	username: string;
}

interface StockList {
	sl_id: number;
	user_id: number;
	visibility: string;
}

function Review({ onClose }: { onClose: () => void }) {

	const [reviews, setReviews] = useState<Review[]>([]);
	const [reviewsTotal, setReviewsTotal] = useState(0);
	const [currentUser, setCurrentUser] = useState(0);
	const [open, setOpen] = useState(false);
	const [stocklist, setStocklist] = useState<StockList | null>(null);
	const [currentReview, setCurrentReview] = useState<Review | null>(null);
	const [edit, setEdit] = useState(false);
	const reviewRef = useRef<HTMLInputElement>(null);
	const editRef = useRef<HTMLInputElement>(null);

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
		const sl = Number(localStorage.getItem("sl_id")) || 0;
		const uid = Number(localStorage.getItem("user_id")) || 0;
		await writeReview(0, uid, sl, text, "");
		const update = await getReviews(sl);
		setReviews(update);
		setReviewsTotal(update.length);
	}

	const getItemSize = function (index: number) {
    const review = reviews[index];
    const textLength = review.text.length;
    return 50 + (Math.floor(textLength / 60) * 10); 
	};

	const handleOpenEdit = function () {
		setEdit(true);
	}

	const handleCloseEdit = function () {
		setEdit(false);
	}

	const handleSubmitEdit = function (e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = editRef.current?.value || "";
    handleEditReview(text);
    handleCloseEdit();
	}

	const handleEditReview = async function (text: string) {
		if (!currentReview || !stocklist) return;
		const rev = currentReview;
		rev.text = text;
		setCurrentReview(rev);
		const e = await editReview(currentReview.review_id, currentReview.user_id, text);
		const update = await getReviews(stocklist.sl_id);
		setReviews(update);
		setReviewsTotal(update.length);
	}

	const handleEdit = function (review: Review) {
		setEdit(true);
		setTimeout(() => {
      if (editRef.current) {
      	editRef.current.value = review.text;
      }
			setCurrentReview(review);
    }, 0);
	}

	const handleDelete = async function (review_id: number, user_id: number) {
		if (!stocklist) return;
		await deleteReview(review_id, user_id);
		const update = await getReviews(stocklist.sl_id);
		setReviews(update);
		setReviewsTotal(update.length);
	}

	function Row({ index, reviews, style }: RowComponentProps<{ reviews: Review[] }>) {
	  const r = reviews[index];
	  const content = r.username + ": " + r.text;
	  if (currentUser == r.user_id){
		  return (
		    <ListItem style={style} key={index} component="div" sx={{
	                borderBottom: "5px solid #8FCAFA",
	                boxSizing: "border-box",
	                position: "relative"
	            }} secondaryAction={
	              <IconButton edge="end" onClick={() => handleDelete(r.review_id, r.user_id)}>
	                <CloseIcon sx={{ color: "#8FCAFA" }} />
	              </IconButton>
	            }>
		       <ListItemButton onClick={() => handleEdit(r)}>
		       <ListItemText primary={content} primaryTypographyProps={{ 
					    sx: { 
					      fontFamily: tomorrow.style.fontFamily, 
					      textAlign: 'center',
					    } 
					  }} />
					</ListItemButton>
		    </ListItem>
	  	);
	  }
	  else if (currentUser == stocklist?.user_id){
	  	return (
		    <ListItem style={style} key={index} component="div" sx={{
	                borderBottom: "5px solid #8FCAFA",
	                boxSizing: "border-box",
	                position: "relative"
	            }} secondaryAction={
	              <IconButton edge="end" onClick={() => handleDelete(r.review_id, r.user_id)}>
	                <CloseIcon sx={{ color: "#8FCAFA" }} />
	              </IconButton>
	            }>
		       <ListItemText primary={content} primaryTypographyProps={{ 
					    sx: { 
					      fontFamily: tomorrow.style.fontFamily, 
					      textAlign: 'center',
					    } 
					  }} />
		    </ListItem>
	  	);
	  }
	  else{
	  	return (
		    <ListItem style={style} key={index} component="div" sx={{
	                display: "flex",
	                justifyContent: "center",
	                alignItems: "center",
	                width: "100%",
	                borderBottom: "5px solid #8FCAFA",
	                boxSizing: "border-box"
	            }} >
		       <ListItemText primary={content} primaryTypographyProps={{ 
					    sx: { 
					      fontFamily: tomorrow.style.fontFamily, 
					      textAlign: 'center',
					    } 
					  }} />
		    </ListItem>
	  	);
	  }
	}

	useEffect(function () {
	    async function load() {
	    	const user_id = Number(localStorage.getItem("user_id")) || 0;
	    	const sl_id = Number(localStorage.getItem("sl_id")) || 0;
	      const result = await getReviews(sl_id);
	      const sl = await getStockList(sl_id);
	      setStocklist(sl);
	      setCurrentUser(user_id);
	      setReviews(result);
	      setReviewsTotal(result.length);
	    }
	    load();
	  }, []);

	const height = Math.min(reviewsTotal * 46, 368);
	console.log(height);

	return(
		<div style={{ backgroundColor: "#8FCAFA" }}>
			<Dialog 
				open={edit} 
				onClose={handleCloseEdit}
				PaperProps={{
          sx: {
            backgroundColor: "#2798F5",
            color: "#8FCAFA",
            fontFamily: tomorrow.style.fontFamily,
          },
        }}
			>
        <DialogTitle sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>Edit your Review</DialogTitle>
        <form onSubmit={handleSubmitEdit}>
        <DialogContent>
            <DialogField
              required
              margin="dense"
              label="Edit Review"
              variant="standard"
              fullWidth
              inputRef={editRef}
            />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleCloseEdit}>Cancel</Button>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} type="submit">Submit</Button>
        </DialogActions>
        </form>
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
      <Grid 
		      container 
		      spacing={3}
		      justifyContent="center"
		      alignItems="center"
		      sx={{ minHeight: '100vh', pb: 5 }}
		    >
      <Grid size={12} display="flex" justifyContent="center">
      	<Subtitle sx={{ display:"flex", justifyContent:"center", width: "100%" }}>{"Reviews"}</Subtitle>
      	<IconButton sx={{ position: "absolute", right: 0, color: "#2798F5" }} onClick={onClose}><CloseIcon /></IconButton></Grid>
      <Grid size={12} display="flex" justifyContent="center"><Typography sx={{ display:"flex", justifyContent:"center", width: "100%", color: "#2798F5" }}>{"Click on a Review to Edit"}</Typography></Grid>
			<Grid size={12} display="flex" justifyContent="center">
				<Box sx={{ display:"flex", justifyContent:"center", alignItems: "center", width: "100%", height: "100%", minWidth: 360, bgcolor: "#2798F5", color: "#8FCAFA" }}>
				      <List
				        rowHeight={getItemSize}
				        rowCount={reviewsTotal}
				        style={{ height: "100%", width: 360 }}
				        rowProps={{ reviews }}
				        overscanCount={5}
				        rowComponent={Row}
				      />
				 </Box>
			</Grid>
		 <Grid size={12} display="flex" justifyContent="center"><Button sx={{ display:"flex", justifyContent:"center", width: "100%" }} onClick={handleOpen}>Write a Review</Button></Grid>
		</Grid>
		 </div>
	);
}

export default Review;
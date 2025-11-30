"use client";

import { useRef, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { krona, tomorrow } from "../app/fonts";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
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
import CloseIcon from '@mui/icons-material/Close';
import { getUsers, getUser, getFriends, getIncomingRequests, getOutgoingRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, unsendFriendRequest, removeFriend } from '../api/api';
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

interface FriendRequest {
	request_id: number;
	sender_id: number;
	receiver_id: number;
	username: string
	status: string;
	last_updated: Date;
}

interface User {
	user_id: number;
	username: string;
	password: string;
}

function Friend() {

	const [friends, setFriends] = useState<FriendRequest[]>([]);
	const [friendsTotal, setFriendsTotal] = useState(0);
	const [requests, setRequests] = useState<FriendRequest[]>([]);
	const [requestsTotal, setRequestsTotal] = useState(0);
	const [sent, setSent] = useState<FriendRequest[]>([]);
	const [sentTotal, setSentTotal] = useState(0);
	const [users, setUsers] = useState<User[]>([]);
	const [usersTotal, setUsersTotal] = useState(0);
	const [open, setOpen] = useState(false);
	const [invalid, setInvalid] = useState(false);
	const requestRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const handleHome = function () {
		router.push('/home');
	}

	const handleInvalid = function() {
		setInvalid(false);
	}

	const handleClose = function () {
		setOpen(false);
	}

	const handleOpen = function () {
		setOpen(true);
	}

	const handleSend = async function (receiver_id: number) {
		const user_id = Number(localStorage.getItem("user_id")) || 0;
		const ret = await sendFriendRequest(user_id, receiver_id);
		if (ret == -1) {
			setInvalid(true);
		}
		else{
			const sUpdate = await getOutgoingRequests(user_id);
		  setSent(sUpdate);
		  setSentTotal(sUpdate.length);
		}
    handleClose();
	}

	const handleAccept = async function (request_id: number) {
		await acceptFriendRequest(request_id);
		const user_id = Number(localStorage.getItem("user_id")) || 0;
		const update = await getFriends(user_id);
		setFriends(update);
		setFriendsTotal(update.length);
		const rUpdate = await getIncomingRequests(user_id);
	  setRequests(rUpdate);
	  setRequestsTotal(rUpdate.length);
	}

	const handleReject = async function (request_id: number) {
		await rejectFriendRequest(request_id);
		const user_id = Number(localStorage.getItem("user_id")) || 0;
		const rUpdate = await getIncomingRequests(user_id);
	  setRequests(rUpdate);
	  setRequestsTotal(rUpdate.length);
	}

	const handleUnsend = async function (request_id: number) {
		const user_id = Number(localStorage.getItem("user_id")) || 0;
		await unsendFriendRequest(request_id, user_id);
		const sUpdate = await getOutgoingRequests(user_id);
	  setSent(sUpdate);
	  setSentTotal(sUpdate.length);
	}

	const handleRemove = async function (request_id: number) {
		const user_id = Number(localStorage.getItem("user_id")) || 0;
		await removeFriend(request_id, user_id);
		const update = await getFriends(user_id);
		setFriends(update);
		setFriendsTotal(update.length);
	}

	const getReqItemSize = function (index: number) {
    const req = requests[index];
    const text = req.username + ". Status: " + req.status + ", Last Updated: " + new Date(req.last_updated).toLocaleString() + ". Accept?";
    const textLength = text.length;
    return 50 + (Math.floor(textLength / 60) * 20); 
	};

	const getSentItemSize = function (index: number) {
    const req = sent[index];
    const text = req.username + ". Status: " + req.status + ", Last Updated: " + new Date(req.last_updated).toLocaleString() + ". Accept?";
    const textLength = text.length;
    return 50 + (Math.floor(textLength / 60) * 10); 
	};

	function FriendRow({ index, friends, style }: RowComponentProps<{ friends: FriendRequest[] }>) {
	  const friend = friends[index];
	  return (
	    <ListItem style={style} key={index} component="div" secondaryAction={
              <IconButton edge="end" onClick={() => handleRemove(friend.request_id)} >
                <CloseIcon sx={{ color: "#FFFFFF" }} />
              </IconButton>
            }>
	        <ListItemText primary={friend.username} />
	    </ListItem>
	  );
	}

	function RequestRow({ index, requests, style }: RowComponentProps<{ requests: FriendRequest[] }>) {
	  const req = requests[index];
	  const text = req.username + ". Status: " + req.status + ", Last Updated: " + new Date(req.last_updated).toLocaleString() + ". Accept?";
	  return (
	    <ListItem style={style} key={index} component="div" secondaryAction={
              <IconButton edge="end" onClick={() => handleReject(req.request_id)} >
                <CloseIcon sx={{ color: "#FFFFFF" }} />
              </IconButton>
            }>
	      <ListItemButton onClick={() => handleAccept(req.request_id)}>
	        <ListItemText primary={text} />
	      </ListItemButton>
	    </ListItem>
	  );
	}

		function SentRow({ index, sent, style }: RowComponentProps<{ sent: FriendRequest[] }>) {
		  const req = sent[index];
		  const text = req.username + ". Status: " + req.status + ", Last Updated: " + new Date(req.last_updated).toLocaleString()
		  return (
		    <ListItem style={style} key={index} component="div" secondaryAction={
	              <IconButton edge="end" onClick={() => handleUnsend(req.request_id)} >
	                <CloseIcon sx={{ color: "#FFFFFF" }} />
	              </IconButton>
	            }>
		       <ListItemText primary={text} />
		    </ListItem>
		  );
		}

	function UserRow({ index, users, style }: RowComponentProps<{ users: User[] }>) {
	  const user = users[index];
	  return (
	    <ListItem style={style} key={index} component="div" >
	      <ListItemButton onClick={() => handleSend(user.user_id)}>
	        <ListItemText primary={user.username} />
	      </ListItemButton>
	    </ListItem>
	  );
	}


	  useEffect(function () {
	    async function load() {
	    	const user_id = Number(localStorage.getItem("user_id")) || 0;
	      const result = await getFriends(user_id);
	      setFriends(result);
	      setFriendsTotal(result.length);
	      const inResults = await getIncomingRequests(user_id);
	      setRequests(inResults);
	      setRequestsTotal(inResults.length);
	      const outResults = await getOutgoingRequests(user_id);
	      setSent(outResults);
	      setSentTotal(outResults.length);
	      const uResults = await getUsers();
	      setUsers(uResults);
	      setUsersTotal(uResults.length);
	    }
	    load();
	  }, []);

	const friendsHeight = Math.min(friendsTotal * 46, 368);
	const requestsHeight = Math.min(requestsTotal * 60, 368);
	const sentHeight = Math.min(sentTotal * 60, 368);
	const usersHeight = Math.min(usersTotal * 60, 368);

	return (
		<div style={{ backgroundColor: "#8FCAFA" }}>
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
          You must wait 5 minutes before you can send another request!
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
        <DialogContent>
          <DialogContentText sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>
          	Select a user to send a friend request.
          </DialogContentText>
            <Box sx={{ width: "100%", height: usersHeight, maxWidth: 360, bgcolor: "#2798F5" }}>
			      <List
			        rowHeight={46}
			        rowCount={usersTotal}
			        style={{ height: usersHeight, width: 360 }}
			        rowProps={{ users }}
			        overscanCount={5}
			        rowComponent={UserRow}
			      />
			    </Box>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }} onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
		<Grid 
      container 
      spacing={3}
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100vh' }}
    >
			<Grid size={12} display="flex" justifyContent="center"><Title>{"Friends"}</Title></Grid>
			<Grid size={12} display="flex" justifyContent="center"><Button onClick={handleOpen}>Send a Friend Request</Button></Grid>
			<Grid size={4} display="flex" justifyContent="center"><Subtitle>{"Friends"}</Subtitle></Grid>
			<Grid size={4} display="flex" justifyContent="center"><Subtitle>{"Requests Sent"}</Subtitle></Grid>
			<Grid size={4} display="flex" justifyContent="center"><Subtitle>{"Requests"}</Subtitle></Grid>
			<Grid size={4} display="flex" justifyContent="center">
				<Box sx={{ width: "100%", height: friendsHeight, maxWidth: 360, bgcolor: "#2798F5" }}>
		      <List
		        rowHeight={46}
		        rowCount={friendsTotal}
		        style={{ height: friendsHeight, width: 360 }}
		        rowProps={{ friends }}
		        overscanCount={5}
		        rowComponent={FriendRow}
		      />
		    </Box>
		   </Grid>
		   <Grid size={4} display="flex" justifyContent="center">
				<Box sx={{ width: "100%", height: sentHeight, maxWidth: 360, bgcolor: "#2798F5" }}>
		      <List
		        rowHeight={getSentItemSize}
		        rowCount={sentTotal}
		        style={{ height: sentHeight, width: 360 }}
		        rowProps={{ sent }}
		        overscanCount={5}
		        rowComponent={SentRow}
		      />
		    </Box>
		   </Grid>
		  <Grid size={4} display="flex" justifyContent="center">
		  	<Box sx={{ width: "100%", height: requestsHeight, maxWidth: 360, bgcolor: "#2798F5" }}>
		      <List
		        rowHeight={getReqItemSize}
		        rowCount={requestsTotal}
		        style={{ height: requestsHeight, width: 360 }}
		        rowProps={{ requests }}
		        overscanCount={5}
		        rowComponent={RequestRow}
		      />
		    </Box>
		  </Grid>
		   <Grid size={12} display="flex" justifyContent="center">
        <Button sx={{ color: "#2798F5" }} onClick={handleHome}>← Home</Button>
       </Grid>
  	</Grid>
    </div>
	);
}

export default Friend;
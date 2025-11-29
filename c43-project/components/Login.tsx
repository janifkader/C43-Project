"use client";

import { useRef, useState } from "react";
import { styled } from '@mui/material/styles';
import { krona, tomorrow } from "../app/fonts";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { signup, signin, createPortfolio } from '../api/api';
import { useRouter } from "next/navigation";

const Title = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,
  color: '#2798F5',
  fontFamily: krona.style.fontFamily,
}));

const LoginField = styled(TextField)(({ theme }) => ({
  width: "500px",
  "& .MuiInputBase-input": {
    color: "#2798F5",
    fontFamily: tomorrow.style.fontFamily,
  },
  "& .MuiInputLabel-root": {
    color: "#2798F5",
    fontFamily: tomorrow.style.fontFamily,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#2798F5"
  },
  "& .MuiOutlinedInput-root fieldset": { borderColor: "#2798F5" },
  "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "#2798F5" },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#2798F5" }
}));

function Login() {

  const [invalid, setInvalid] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleInvalid = function () {
    setInvalid(false);
  }

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    const submitButton = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    const action = submitButton.value;
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    let response;
    if (action === "signin") {
      response = await signin(0, username, password);
    } 
    else if (action === "signup") {
      response = await signup(0, username, password);
    }
    if (response && response != -1){
      console.log(response);
      localStorage.setItem("user_id", response);
      if (action === "signup") {
        await createPortfolio(0, response, 0);
      }
      router.push("/home");
    }
    else{
      setInvalid(true);
    }
    form.reset();
  };

  return (
    <>
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
          Your usename/password is incorrect
        </DialogTitle>
        <DialogActions>
          <Button sx={{ color: "#2798F5", fontFamily: tomorrow.style.fontFamily }} onClick={handleInvalid}>Close</Button>
        </DialogActions>
      </Dialog>
    <Box component="form" onSubmit={handleSubmit}
      sx={{ bgcolor: "#8FCAFA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, height: "100vh" }}
    >
      <Title>Sign In</Title>

      <LoginField label="Username" inputRef={usernameRef} />
      <LoginField label="Password" type="password" inputRef={passwordRef} />

      <Button type="submit" value="signin" sx={{ color: "#2798F5" }}>Login</Button>
      <Button type="submit" value="signup" sx={{ color: "#2798F5" }}>Register</Button>
    </Box>
    </>
  );
}

export default Login;
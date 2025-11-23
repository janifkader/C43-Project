"use client";

import { useRef } from "react";
import { styled } from '@mui/material/styles';
import { krona, tomorrow } from "../app/fonts";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { signup, signin } from '../api/api';
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

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    const submitButton = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    const action = submitButton.value;
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    let response;
    if (action === "signin") {
      response = await signin(username, password);
    } 
    else if (action === "signup") {
      response = await signup(username, password);
    }
    if (response && response.user_id) {
      localStorage.setItem("user_id", response.user_id.toString());
      console.log(response.user_id.toString());
    }
    else if (response){
      localStorage.setItem("user_id", response);
      console.log("LOGGED");
    }
    else{
      console.log("what");
    }
    form.reset();
    router.push("/home");
  };

  return (
    <Box component="form" onSubmit={handleSubmit}
      sx={{ bgcolor: "#8FCAFA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, height: "100vh" }}
    >
      <Title>Sign In</Title>

      <LoginField label="Username" inputRef={usernameRef} />
      <LoginField label="Password" type="password" inputRef={passwordRef} />

      <Button type="submit" value="signin" sx={{ color: "#2798F5" }}>Login</Button>
      <Button type="submit" value="signup" sx={{ color: "#2798F5" }}>Register</Button>
    </Box>
  );
}

export default Login;
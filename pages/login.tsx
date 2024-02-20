import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { validationText } from "@/utils/validationtext";
import { useRouter } from "next/router";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase";
import { toast } from "sonner";
// import { User as FirebaseUser, signOut as firebaseSignOut, browserLocalPersistence } from "firebase/auth";
// import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import assets from "@/json/assets";
import { setCookie } from "cookies-next";
// import { setCookies } from 'cookies-next';


interface loggedData {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup.string().required(validationText.error.enter_email),
    password: yup.string().required(validationText.error.enter_password),
  })
  .required();

export function useUser() {
  const [currentUser, setCurrentUser] = useState<User | null | false>(false);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => setCurrentUser(currentUser));
  }, []);
  return currentUser;
}

const Login = () => {
  const router = useRouter();
  // const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loggedData>({
    resolver: yupResolver(schema),
  });

  // const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  //   const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
  //     try {
  //         const res = await signInWithEmailAndPassword(data.email, data.password);
  //         console.log({ res });
  //         sessionStorage.setItem('user', JSON.stringify(res?.user?.uid))
  //         sessionStorage.setItem('loginstatus', "true")
  //         alert("Login Sucessfully")
  //         router.push('/')
  //     } catch (e) {
  //         console.error(e)
  //     }

  // };

  type userProps = {
    id: string;
  };
  const onSubmit: SubmitHandler<loggedData> = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;
      if (window !== undefined) {
        // onAuthStateChanged(auth, (user) => {
        //   if (user) {
        //     const uid = user.uid;
        //     localStorage.setItem("uid", uid);
        //     router.push("/");
        //   }
        // });

        window.localStorage.setItem("uid", user?.uid);
        toast.success("You are logged in");

        console.log("User created:", user);
        // setCookie('uid', true);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      alert(error.message);
      toast.error("Email id or password not found");
    }
  };

  return (
    <div>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={6} md={6} sx={{mt:10}}>
            <Typography
              variant="h4"
              sx={{ my: 2, textAlign: "center", fontWeight: "bold" }}
            >
              Login Form
            </Typography>
            <Paper sx={{ p: 5, m: 2, 
            
            backgroundImage: 'linear-gradient(to top,  lightblue, brown)'}}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  sx={{ my: 2 }}
                  label="Email"
                  {...register("email", { required: true, maxLength: 20 })}
                  error={Boolean(errors?.email)}
                  helperText={errors?.email?.message}
                />
                <TextField
                  fullWidth
                  sx={{ my: 2 }}
                  label="Password"
                  {...register("password", { required: true, maxLength: 20 })}
                  type="password"
                  error={Boolean(errors?.password)}
                  helperText={errors?.password?.message}
                />
                <div style={{ textAlign: "center" }}>
                  <Button variant="contained" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={6} md={6} sx={{mt:10}}>
            <Box sx={{m:2, px:6}}>
              <img src={assets.loginimg} height={360} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Login;

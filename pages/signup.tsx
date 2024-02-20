// const Wrapper = dynamic(() => import("@/layout/wrapper/Wrapper"), { ssr: false })
import React, { ChangeEvent, useState } from "react";
import {
  Box,
  Button,
  Container,
  Input,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, storage } from "@/firebase";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationText } from "@/utils/validationtext";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/compat/app";
import { addDoc, collection } from "firebase/firestore";

interface SigninData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // profileimage: Blob | Uint8Array | string;
}
// const firestore = firebase.firestore();

// const userRef = firestore.collection();

// userRef.set({
//   profileImageUrl: uploadTask.snapshot.ref.getDownloadURL(),
// });

const schema = yup
  .object({
    firstName: yup.string().required(validationText.error.enter_firstName),
    lastName: yup.string().required(validationText.error.enter_lastName),
    email: yup.string().trim().required(validationText.error.enter_email),
    password: yup.string().required(validationText.error.enter_password),
    // profileimage: yup.string().required(validationText.error.enter_image),
  })
  .required();

const signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninData>({
    resolver: yupResolver(schema),
  });

  //   console.log(errors, "Error");

  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmit: SubmitHandler<SigninData> = async (data) => {
    try {
      // const imageRef = storageRef(storage, `images/${uuidv4()}`);
      // await uploadBytes(imageRef, image);
      // const imageUrl = await getDownloadURL(imageRef);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // await addDoc(collection(tldb, "users"), {

      // })
      console.log("User created:", user);
      router.push("/login");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <Container>
        <Box>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ color: "orange", marginTop: "20px" }}
          >
            <b>Register Form</b>
          </Typography>
          <Paper
            sx={{
              width: "50%",
              height: "500px",
              margin: " 50px auto",
              backgroundImage: 'linear-gradient(to top, lightblue , lightgreen)'
            }}
          >
            <Box
              component="form"
              gap={1}
              display="flex"
              flexDirection="column"
              justifyContent={"space-evenly"}
              sx={{ width: "80%", margin: " 50px auto", paddingTop: "50px" }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextField
                label="First Name"
                {...register("firstName")}
                error={Boolean(errors?.firstName)}
                helperText={errors?.firstName?.message}
                sx={{my:2}}
              />

              <TextField
                label="Last Name"
                {...register("lastName")}
                error={Boolean(errors?.lastName)}
                helperText={errors?.lastName?.message}
                sx={{my:2}}
              />

              <TextField
                label="Email"
                {...register("email")}
                error={Boolean(errors?.email)}
                helperText={errors?.email?.message}
                sx={{my:2}}
              />

              <TextField
                type="password"
                label="Password"
                {...register("password")}
                error={Boolean(errors?.password)}
                helperText={errors?.password?.message}
                sx={{my:2}}
              />
              {/* <Input type="file" value={image} onChange={handleImageChange} /> */}
              <div style={{textAlign:'center', marginTop:'5px'}}>
                <Button type="submit" variant="contained" sx={{
                  backgroundImage: 'linear-gradient(to right, violet , orange)'
                  }}>
                  Submit
                </Button>
              </div>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default signup;

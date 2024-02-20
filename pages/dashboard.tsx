"use client";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Input,
  TextField,
  Typography,
} from "@mui/material";
// import styles from "@/styles/Home.module.css";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { ChangeEvent, FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { db, storage } from "@/firebase";
import { v4 as uuidv4 } from "uuid";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Editor, useEditor } from "@tldraw/tldraw";
import { getAuth } from "firebase/auth";
import { useUser } from "./login";

const inter = Inter({ subsets: ["latin"] });
// export const storage = firebase.storage();

interface DrawingPost {
  name: string;
  createdAt: number;
  id: string;
  userToken: string;
  imageUrl: string,
  snapshot: any
}

interface Props {
  allDrawings: DrawingPost[];
}

export default function Home({ allDrawings }: Props) {
  // const auth = getAuth();

  console.log("AllDrawing", allDrawings);

  const userID = localStorage.getItem("uid");

  console.log("userId", userID);

  const filterdata = allDrawings.filter((item) => item.userToken === userID);

  console.log("FilterData by User Id", filterdata);
  
  return (
    <>
      <Container>
        {/* <Typography sx={{ my: 5, textAlign: "center" }}>Home Page</Typography> */}

        <Typography variant="h3" sx={{ my: 2, textAlign: "center" }}>
          {/* {`${auth.currentUser?.email?.charAt(0).toUpperCase()}`} */}
          {/* {`${auth.currentUser?.email?.slice(1, 5)}`}'s Drawings */}
        </Typography>

        <Box></Box>
        <Grid container spacing={2}>
          <Card sx={{ width: "380px" }}>
            <CardContent>
              <CardActionArea component={Link} href={`/draw`}>
                <Box sx={{ height: "200px", border: "1px solid black", mt: 2 }}>
                  <Typography variant="h6" sx={{ textAlign: "center", mt: 10 }}>
                    Add New Project (+)
                  </Typography>
                </Box>
              </CardActionArea>
              {/* <br />&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+</Typography> */}
            </CardContent>
          </Card>
          {filterdata.map((picture, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <CardActionArea
                    component={Link}
                    href={`/single/${picture.id}`}
                  >
                    <CardMedia 
                    image={picture.imageUrl}
                    sx={{height:'200px'}}
                    />
                   
                  </CardActionArea>

                  <Typography>
                    Created at: {new Date(picture.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const q = query(
    collection(db, "drawDatabase"),
    orderBy("createdAt", "desc"),
    limit(8)
  );
  const querySnapshot = await getDocs(q);
  // console.log(querySnapshot);
  const allDrawings: any = querySnapshot.docs.map((docSnap) => ({
    ...docSnap.data(),
    // editor?.store?.loadSnapshot(snaps?.data),
    createdAt: docSnap.data().createdAt.toMillis(),
    id: docSnap.id,
  }));

  return {
    props: { allDrawings },
  };
};

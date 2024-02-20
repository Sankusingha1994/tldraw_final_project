
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "@/firebase";
import { v4 as uuidv4 } from "uuid";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const TldrawWrapper = dynamic(
  () => import("@/components/Tldraw/TldrawWrapper"),
  {
    ssr: false,
  }
);
const fetchDrawings = async (slug:string) => {
  if(typeof slug==='string'){
     const drawDoc = doc(db, "drawDatabase", slug);
     const docSnap = await getDoc(drawDoc);
     console.log(docSnap?.id, "docSnap test");
     if (docSnap.exists()) {
        return docSnap.data();
     }
   }

   return undefined
 };


type keyType = "inferDarkMode" | "hideUi";




const Single = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [snapshot,setSnapshot]=useState(undefined)



  
  const setData=async()=>{
    const res=await fetchDrawings(slug as string)

    setSnapshot(res as any)


  }


  useEffect(() => {

    setData()

    
  }, [slug]);



 

  return (
    <Container sx={{ my: 5 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          
          <Grid item xs={8}>
            {
              !!snapshot && <TldrawWrapper initialSnapshot={snapshot} />
            }
            
          </Grid>
          
        </Grid>
      </Container>
  );
};

export default Single;

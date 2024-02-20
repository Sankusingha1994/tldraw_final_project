import { Box, Button, Card, Container, Grid, TextField } from "@mui/material";
import { Typography } from "@mui/material/styles/createTypography";
import dynamic from "next/dynamic";
import { auth, storage } from "@/firebase";
// import firebase from 'firebase/app';
import { Canvas, TLUiOverrides, useEditor } from "@tldraw/tldraw";
import Drawing from "@tldraw/tldraw";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ChangeEvent, useCallback, useEffect, useState } from "react";


const TldrawWrapper = dynamic(
  () => import("@/components/Tldraw/TldrawWrapper"),
  {
    ssr: false,
  }
);

export function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    });
  });
}

const Draw = ({}) => {
 
  // const [drawing, setDrawing] = useState<CanvasDrawImage | null>(null);

  // const saveDrawingToFirebase = async () => {
  //   if (!drawing) return;

  //   const drawingRef = storageRef(storage, "drawings/drawing.png");

    
  // };

  // const [image, setImage] = useState<string[] | {}>();
  // const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) setImage(e.target.files[0]);
  // };

  
  return (
    <>
      <Container sx={{ my: 5 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          
          <Grid item xs={8}>
            <TldrawWrapper />
          </Grid>
          <Grid item xs={2}>
            {/* <Button variant="contained" sx={{mx:1}} onClick={()=>setBtn(localStorage.setItem(TLDRAW_DB_NAME_INDEX_v2))}>Save</Button>

            <Button variant="contained">Load</Button> */}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Draw;

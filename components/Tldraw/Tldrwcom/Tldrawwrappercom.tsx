import {
    DefaultColorStyle,
    Editor,
    TLEditorComponents,
    Tldraw,
    toDomPrecision,
    useTransform,
  } from "@tldraw/tldraw";
  import React, { useEffect, useRef, useState } from "react";
  import dayjs from "dayjs";
  import {
    Box,
    Button,
    Chip,
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
  import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
  } from "firebase/firestore";
  import { useRouter } from "next/router";
  
  type keyType = "inferDarkMode" | "hideUi";
  
  interface propsType {
    slug?: any;
  }
  
  const components: TLEditorComponents = {
    Brush: function MyBrush({ brush }) {
      const rSvg = useRef<SVGSVGElement>(null);
  
      useTransform(rSvg, brush.x, brush.y);
  
      const w = toDomPrecision(Math.max(1, brush.w));
      const h = toDomPrecision(Math.max(1, brush.h));
  
      return (
        <svg ref={rSvg} className="tl-overlays__item">
          <rect
            className="tl-brush"
            stroke="red"
            fill="none"
            width={w}
            height={h}
          />
        </svg>
      );
    },
    Scribble: ({ scribble, opacity, color }) => {
      return (
        <svg className="tl-overlays__item">
          <polyline
            points={scribble.points.map((p) => `${p.x},${p.y}`).join(" ")}
            stroke={color ?? "black"}
            opacity={opacity ?? "1"}
            fill="none"
          />
        </svg>
      );
    },
    SnapIndicator: null,
    LoadingScreen: () => {
      return <div>Loading</div>;
    },
  };
  interface propsType {
    data?: any,
    drawdata: any,
    save: any
  }
  
  const SingleDrawing = (props: propsType) => {
  //   const router = useRouter();
  //   const { props. } = router.query;
  console.log('ggg',props.data);
  
  
    const [config, setConfig] = useState({
      inferDarkMode: false,
      hideUi: false,
      snapshot: undefined,
    });
    const [editor, setEditor] = useState<Editor | null>(null);
    const [savedSnapshopts, setSavedSnapShot] = useState<any>([]);
  
    //   const pageId=editor?.getPageShapeIds()[0];
  
    const handleConfigChange = (key: keyType) => {
      setConfig({
        ...config,
        [key]: !config[key],
      });
    };
  
    const handleSaveSnapshot = async () => {
      const snapshot = editor?.store.getSnapshot();
      // if (editor !== null) alert("Please draw something");
      setSavedSnapShot([
        ...savedSnapshopts,
        {
          id: dayjs().toISOString(),
          data: snapshot,
        },
      ]);
  
      try {
        await addDoc(collection(db, "drawDatabase"), {
          snapshot: JSON.stringify(snapshot),
          createdAt: serverTimestamp(),
        });
  
        alert("drawing created successfully");
      } catch (error) {
        console.error("Error creating drawing:", error);
        alert("Failed to create drawings");
      }
    };
  
    useEffect(() => {
      const fetchDrawings = async () => {
        if (typeof props?.slug === "string") {
          const drawDoc = doc(db, "drawDatabase", props?.slug);
          const docSnap = await getDoc(drawDoc);
          console.log(docSnap?.id, "docSnap test");
          if (docSnap.exists()) {
            setSavedSnapShot([
              ...savedSnapshopts,
              {
                id: docSnap.id,
                data: JSON.parse(docSnap.data().snapshot),
              },
            ]);
          }
        }
      };
  
      fetchDrawings();
    }, [props?.slug]);
  
    useEffect(() => {
      if (savedSnapshopts.length > 0) {
        const snapshot = savedSnapshopts[savedSnapshopts.length - 1].data;
        editor?.store.loadSnapshot(snapshot);
      }
    }, [savedSnapshopts, editor]);
  
    return (
      <div>

        <div
          style={{
            position: "fixed",
            inset: 0,
            height: "80%",
            width: "100%",
            marginTop: "80px",
          }}
        >
          <Grid container>
            <Grid item md={2}>
              <Stack p={1} direction="column" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => handleConfigChange("hideUi")}
                >
                  <span>Show hide ui</span>
                </Button>
  
                <Button variant="outlined" onClick={() => handleSaveSnapshot()}>
                  <span>Save snapshots</span>
                </Button>
              </Stack>
            </Grid>
            <Grid item md={10} height="80vh">
              <Tldraw
                hideUi={config.hideUi}
                inferDarkMode={config.inferDarkMode}
                components={components}
                onMount={(e) => setEditor(e)}
              />
            
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };
  
  export default SingleDrawing;
  
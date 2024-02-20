import {
  DefaultColorStyle,
  Editor,
  StoreSnapshot,
  TLEditorComponents,
  TLRecord,
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
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "@/firebase";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { toast } from "sonner";

// import {TLDrawColor} from '@/config/';
type keyType = "inferDarkMode" | "hideUi";

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

export interface FirebaseSnapshot {
  snapshot: StoreSnapshot<TLRecord>;
  createdAt: string;
}

interface TldrawWrapperProps {
  initialSnapshot?: FirebaseSnapshot;
}

type snapsType = {
  id: string;
  data: StoreSnapshot<TLRecord>;
  name: string;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const TldrawWrapper = ({ initialSnapshot }: TldrawWrapperProps) => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [config, setConfig] = useState({
    inferDarkMode: false,
    hideUi: false,
    snapshot: undefined,
  });
  const [editor, setEditor] = useState<Editor | null>(null);
  const [savedSnapshopts, setSavedSnapShot] = useState<snapsType[]>([]);
  const [name, setName] = useState<string>("");

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
      ...(savedSnapshopts as any),
      {
        id: dayjs().toISOString(),
        data: snapshot,
        name: name,
      },
    ]);

    try {
      await addDoc(collection(db, "drawDatabase"), {
        snapshot,
        name,
        createdAt: serverTimestamp(),
      });

      toast.success("Drawing created Successfully");
      router.push('/dashboard')
      console.log("drawing", snapshot);
    } catch (error) {
      console.error("Error creating drawing:", error);
      alert("Failed to create drawings");
    }
  };

  useEffect(() => {
    if (!!initialSnapshot && editor) {
      setSavedSnapShot([
        {
          id: dayjs().toISOString(),
          data: initialSnapshot.snapshot,
          name: name,
        },
      ]);

      editor?.store.loadSnapshot(initialSnapshot.snapshot);
    }
    console.log(initialSnapshot, "init");
  }, [
    initialSnapshot?.snapshot,
    initialSnapshot?.createdAt,
    JSON.stringify(initialSnapshot?.snapshot),
    editor,
  ]);

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
                onClick={() => handleConfigChange("inferDarkMode")}
              >
                <span>Toggle Darkmode</span>
              </Button>

              <Button
                variant="outlined"
                onClick={() => handleConfigChange("hideUi")}
              >
                <span>Show hide ui</span>
              </Button>

              <Button variant="outlined" onClick={() => handleOpen()}>
                {/* handleSaveSnapshot() */}
                <span>Save snapshots</span>
              </Button>
            </Stack>
          </Grid>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <TextField value={name} onChange={(e)=>setName(e.target.value)}/>

              </Typography>
              <Button variant="contained" onClick={()=>handleSaveSnapshot()}>Save</Button>
            </Box>
          </Modal>
          <Grid item md={8} height="80vh">
            <Tldraw
              hideUi={config.hideUi}
              inferDarkMode={config.inferDarkMode}
              components={components}
              onMount={(e) => setEditor(e)}

              // onUiEvent={(e) => console.log(e, "ui events")}
            />
          </Grid>
          <Grid item md={2}>
            <Box>
              <Paper
                sx={{
                  padding: "10px 20px",
                }}
              >
                <Typography color="black">
                  <b>Saved snapshots</b>
                </Typography>
                <Divider />
                <Stack p={1}>
                  <Stack
                    direction="column"
                    justifyContent="start"
                    spacing={1}
                    flexWrap="wrap"
                    alignItems="start"
                  >
                    {savedSnapshopts?.map((snaps: any, index: number) => (
                      <Chip
                        label={`${snaps.name}`}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setConfig({
                            ...config,
                            snapshot: snaps.data,
                          });
                          // router.push(`${router.pathname}/edit?snapshot=${snaps.id}`);

                          editor?.store?.loadSnapshot(snaps?.data);
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TldrawWrapper;
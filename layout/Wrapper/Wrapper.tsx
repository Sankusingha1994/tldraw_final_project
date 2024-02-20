'use client';
import React from "react";

import { Box } from "@mui/material";
import Footer from "../Footer/Footer";
import { useUser } from "@/pages/login";
import { useRouter } from "next/router";
import Navbar from "../Header/Navbar";

interface wrapperprops {
  children: JSX.Element | JSX.Element[];
}
const Wrapper = (props: wrapperprops) => {
  const { children } = props

  return (
    <>
      <Navbar />
      <Box height={"auto"} className="body_content">
        {children}
      </Box>
      {/* <Footer /> */}
    </>
  );
};
export default Wrapper;

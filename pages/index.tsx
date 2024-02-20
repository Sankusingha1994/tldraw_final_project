import React, { useEffect, useState } from "react";
import styles from "../styles/index.module.css";
import Link from "next/link";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";

const index = () => {
  const router=useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    setIsLoggedIn(!!uid);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('uid');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <div className={styles.main_body}>
      <h1 className={styles.heading}>
        WelCome To Our <b style={{ color: "blue" }}>Drawing Sheet</b>
      </h1>
      <p className={styles.sub_heading}>
        Learn drawing your won and make a good drawing.
      </p>
      {!isLoggedIn ? (
        <>
          <Link href="/signup">
            <button className={styles.signin_button}>Signup</button>
          </Link>
          <Link href="/login">
            <button className={styles.login_button}>Login</button>
          </Link>
        </>
      ) : (
        
          <Typography sx={{textAlign:'center', fontSize:'20px'}}>You can <Button component={Link} href={'/login'} onClick={handleLogout}>Logout</Button></Typography>
      )}
    </div>
  );
};

export default index;

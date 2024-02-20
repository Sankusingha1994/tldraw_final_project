
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { deleteCookie } from 'cookies-next';


const DarkModeToggle = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => {
     return (
     <Button onClick={toggleDarkMode}>
           {darkMode ? <LightModeIcon/> : <DarkModeIcon/>}
         </Button>
       );
      };

const Navbar = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const toggleDarkMode = () => {
              setDarkMode((prev) => !prev);
            };
        
            const theme = createTheme({
              palette: {
                mode: darkMode ? "dark" : "light",
              },
            });



  useEffect(() => {
    const uid = localStorage.getItem('uid');
    //  onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     const uid = user.uid;
    //     localStorage.setItem("uid", uid);
    //     router.push("/");
    //   }
    // });
    setIsLoggedIn(!!uid);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('uid');
    setIsLoggedIn(false);
    // deleteCookie("uid");
    router.push('/login');
  };

  

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar sx={{background:"#722be3"}}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
            <Link href="/">
              <Button sx={{ color: 'White', textDecoration: 'none', fontSize:"40px", fontWeight:"20px" }}>TLDRAW</Button>
            </Link>
          </Typography>
          <Button color="inherit">
                <Link href="/">
                  <Button sx={{ color: 'White', textDecoration: 'none' }} >Home</Button>
                </Link>
              </Button>
          {!isLoggedIn ? (
            <>
              <Button color="inherit">
                <Link href="/signup">
                  <Button sx={{ color: 'White', textDecoration: 'none' }} >Signup</Button>
                </Link>
              </Button>
              <Button color="inherit">
                <Link href="/login">
                  <Button sx={{ color: 'White', textDecoration: 'none' }}>Login</Button>
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit">
                <Link href="/dashboard">
                  <Button sx={{ color: 'White', textDecoration: 'none' }}>Dashboard</Button>
                </Link>
              </Button>
              <Button color="inherit">
                <Link href="/draw">
                  <Button sx={{ color: 'White', textDecoration: 'none' }}>Draw</Button>
                </Link>
              </Button>
              <Button sx={{color:"White"}} onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
          <CssBaseline />
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
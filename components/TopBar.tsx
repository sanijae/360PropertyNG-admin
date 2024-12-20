import React, { useEffect, useState } from "react";
import { Stack, IconButton, AppBar, Box, Toolbar } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import {
  Logo,
  SearchBar,
  TopBarNotifications,
  TopBarProfile,
  MobileNavigation,
} from ".";
import api from "utils/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "lib/store";
import { fetchAdminProfile } from "lib/features/admins/adminsSlices";

interface IProps {
  setMode: (val: PaletteMode) => void;
  admin: any | null;
  loading: boolean;
}

function TopBar({ setMode }: IProps) {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch()
  const {currentAdmin,loading} = useSelector((state: RootState)=>state.admins)

  useEffect(() => {
    dispatch(fetchAdminProfile())
  }, [dispatch]);
  
  
    const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <Box>
      <AppBar
        component="nav"
        sx={{
          px: "1.25rem",
          py: "0.5rem",
          backgroundColor: "cardBg",
        }}
        elevation={0}
      >
        <Toolbar
          disableGutters={true}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction="row"
            sx={{
              flexGrow: { xs: 1, lg: 0 },
              alignItems: "center",
              gap: { lg: "6.4rem" },
            }}
          >
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: "0.25rem", display: { lg: "none" } }}
            >
              {/* @ts-ignore */}
              <MenuIcon color="textPrimary" />
            </IconButton>

            <Logo />

            {/* <SearchBar /> */}
          </Stack>

          <Stack
            direction="row"
            sx={{ mr: { lg: 2 } }}
            spacing={{ lg: "0.5rem" }}
            alignItems="center"
          >
            {/* <TopBarNotifications /> */}
            <TopBarProfile admin={currentAdmin} loading={loading} setMode={setMode} />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Makes sure fixed Appbar is not on top of another element */}
      <Box sx={{ py: "0.5rem" }}>
        <Toolbar />
      </Box>

      <MobileNavigation mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
    </Box>
  );
}

export default TopBar;

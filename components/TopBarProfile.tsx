import React from "react";
import {
  Stack,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import userAvatar from "public/assets/profile.jpg";
import { useRouter } from "next/router";
import { AppDispatch } from "lib/store";
import { useDispatch } from "react-redux";
import { logout } from "lib/features/admins/adminsSlices";
import { adminImageURL } from "utils/api";

interface IProps {
  admin: any | null;
  loading: boolean;
  setMode: (val: PaletteMode) => void;
}

function TopBarProfile({ setMode, admin, loading }: IProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter()
  const dispatch: AppDispatch = useDispatch()
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditPorfile = () => {
    setAnchorEl(null)
    router.push('/profile/edit');
  };
  const handleSettings = () => {
    setAnchorEl(null)
    router.push('/profile');
  };
  const handleLogout = () =>{
    try {
      dispatch(logout());
      router.push('/login');
      setAnchorEl(null);
    } catch (error: any) {
      alert(error.message)
    }
  }

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          textTransform: "none",
          px: "0.75rem",
          borderRadius: "0.625rem",
          marginRight: { xs: "-0.5rem !important", md: "0 !important" },
        }}
        // @ts-ignore
        color="textPrimary"
      >
        {admin?.imageUrl ? <img alt={admin?.name} src={admin?.imageUrl} width={40} height={40} style={{borderRadius:'50%'}}  />
        :<Avatar />}

        <Stack
          sx={{
            textAlign: "left",
            paddingLeft: "0.625rem",
            display: { xs: "none", md: "flex" },
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: "initial" }}>
            {admin?.name}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: "initial" }}>
            {admin?.email}
          </Typography>
        </Stack>
      </Button>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          variant: "outlined",
          sx: {
            backgroundColor: "cardBg",
            marginTop: "1.25rem",
            minWidth: "11.25rem",
            boxShadow:
              theme.palette.mode === "light"
                ? "0px 40px 50px 1px rgba(120, 114, 114, 0.15)"
                : "0px 60px 30px -10px rgba(0, 0, 0, 0.2)",
            borderRadius: "0.625rem",
            padding: "0.625rem",
            "& .MuiMenu-list": {
              py: 0,
            },
            "& .MuiListItemIcon-root": {
              minWidth: "2rem",
              color: "#808191",
            },
            "& .MuiMenuItem-root": {
              color: "#808191",
              fontWeight: 500,
              fontSize: "0.875rem",
              p: "0.625rem",
            },
            "& .MuiMenuItem-root.Mui-selected": {
              color: "primary.main",
              fontWeight: 600,
              background: "none",
            },
            "& .Mui-selected .MuiListItemIcon-root": {
              color: "primary.main",
            },
            "& .dark-mode-check": {
              color: theme.palette.mode === "dark" ? "primary.main" : "#808191",
            },
          },
        }}
      >
        <MenuItem onClick={handleEditPorfile} selected>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Edit Profile
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
        <MenuItem
          onClick={() =>
            // @ts-ignore
            setMode((prevMode: PaletteMode) =>
              prevMode === "light" ? "dark" : "light"
            )
          }
        >
          {theme.palette.mode === "light" ? (
            <ListItemIcon className="dark-mode-check">
              <ToggleOffIcon fontSize="small" />
            </ListItemIcon>
          ) : (
            <ListItemIcon className="dark-mode-check">
              <ToggleOnIcon fontSize="small" />
            </ListItemIcon>
          )}
          Dark Mode
        </MenuItem>
      </Menu>
    </>
  );
}

export default TopBarProfile;

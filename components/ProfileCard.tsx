import Image from "next/image";
import { useState } from "react";
import {
  Stack,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import profileImage from "public/assets/profile-card.jpg";
import { adminImageURL } from "utils/api";
import axios from "axios"; // For API calls
import { AppDispatch, RootState } from "lib/store";
import { useDispatch, useSelector } from "react-redux";
import { deleteAdmin, logout } from "lib/features/admins/adminsSlices";

interface Props {
  admin: {
    id: string;
    _id: string;
    name: string;
    email: string;
    address: string;
    phone: number | any;
    password: string;
    imageUrl?: string;
    createdAt: string;
  };
}

function ProfileCard({ admin }: any) {
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const open = Boolean(anchorEl);
  const dispatch : AppDispatch = useDispatch()
  const {success, error} = useSelector((state: RootState)=> state.admins)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditProfile = () => router.push("/profile/edit");
  const handleUpdatePassword = () => router.push("/profile/edit/password");
  const handleUpdateProfileImage = () => router.push("/profile/edit/profile-image");


  const handleDelete = () =>{
    dispatch(deleteAdmin(admin?._id))
    .unwrap()
    .then(()=>{
      dispatch(logout())
      setOpenDialog(false);
      router.push('/login');
    })
    .catch((err) => <Alert>{err.message}</Alert>);
}
  const Detail = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
    <Stack spacing="0.375rem" sx={{ width: "100%" }}>
      <Typography variant="body2" sx={{ fontSize: "0.875rem !important", fontWeight: "500 !important" }}>
        {title}
      </Typography>
      <Stack
        direction="row"
        spacing="0.625rem"
        sx={{
          p: "0.625rem",
          border: `1px solid ${theme.palette.mode === "light" ? "#E4E4E4" : "#272B30"}`,
          borderRadius: "0.375rem",
          alignItems: "center",
        }}
      >
        {icon}
        <Typography variant="body1" sx={{ fontSize: "0.875rem !important" }}>
          {value}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      sx={{ bgcolor: "cardBg", borderRadius: "1rem", width: "100%", alignItems: { md: "flex-end", xs: "flex-start" }, gap: "3.75rem" }}
    >
      <Box sx={{ position: "relative", p: { xs: "0", md: "1rem 0 1rem 1rem" } }}>
        <Box
          sx={{
            overflow: "hidden",
            borderRadius: { xs: "1rem", md: "1rem 0 0 1rem" },
            width: { xs: "100%", md: "240px", lg: "280px", xl: "340px" },
            height: { xs: "280px", md: "340px", lg: "360px", xl: "340px" },
          }}
        >
          <Image src={profileImage} alt="" style={{ width: "100%", objectFit: "cover" }} />
        </Box>

        <Box
          sx={{
            position: "absolute",
            left: { xs: "1.125rem", md: "calc(100% - 2.5rem)" },
            top: { xs: "calc(100% - 2.5rem)", md: "calc(50% -  2.5rem)" },
          }}
        >
          {admin?.imageUrl ?
          <img
            src={admin?.imageUrl}
            width={30}
            height={20}
            style={{ width: "5rem", height: "5rem", borderRadius: "50%" }}
            
          /> : <Avatar sx={{ width: "5rem", height: "5rem", borderRadius: "50%" }} />
        }
        </Box>
      </Box>

      <Stack spacing="1rem" direction="row" flex={1} sx={{ width: "100%", p: { xs: "0 1rem 1.5rem 1rem", md: "1rem 1rem 1rem 0" } }}>
        <Stack flex={1} spacing="1.875rem">
          <Stack spacing="0.375rem">
            <Typography sx={{ fontSize: { xs: "1rem", md: "1.375rem" }, fontWeight: { xs: "600 !important", md: "500 !important" } }}>
              {admin?.name}
            </Typography>
            <Typography sx={{ fontSize: { xs: "0.875rem", md: "1rem" }, color: "textSecondary.main" }}>Admin</Typography>
          </Stack>

          <Stack spacing={{ xs: "1.25rem", md: "1rem", xl: "1.375rem" }}>
            <Detail title="Address" value={admin?.address} icon={<LocationOnIcon fontSize="small" />} />
            <Stack direction={{ lg: "column", xl: "row" }} spacing={{ xs: "1.25rem", md: "1rem", xl: "1.375rem" }}>
              <Detail title="Phone Number" value={admin?.phone} icon={<LocalPhoneRoundedIcon fontSize="small" />} />
              <Detail title="Email" value={admin?.email} icon={<EmailRoundedIcon fontSize="small" />} />
            </Stack>
          </Stack>
        </Stack>

        <Box>
          <IconButton size="small" onClick={handleClick}>
            <MoreHorizIcon sx={{ color: "textSecondary.main" }} />
          </IconButton>

          <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
            <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
            <MenuItem onClick={handleUpdateProfileImage}>Profile Image</MenuItem>
            <MenuItem onClick={handleUpdatePassword}>Update Password</MenuItem>
            <MenuItem onClick={() => setOpenDialog(true)}>Delete Account</MenuItem>
          </Menu>
        </Box>
      </Stack>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Admin - {admin?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this admin? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="success">Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default ProfileCard;

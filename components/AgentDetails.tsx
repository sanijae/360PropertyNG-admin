import Image from "next/image";
import { useEffect, useState } from "react";
import {Stack,  Typography,  IconButton,  Box, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "lib/store";
import { useRouter } from "next/router";
import { deleteUser, fetchUsers } from "lib/features/users/userSlices";

function AgentDetails({ id,name, role,image, email, phone, address, posts}: any) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch : AppDispatch = useDispatch()
  const {currentAdmin} = useSelector((state: RootState)=> state.admins)


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = () =>{
    dispatch(deleteUser(id))
    .unwrap()
    .then(()=>{
      setOpenDialog(false);
      dispatch(fetchUsers());
    })
    .catch((err) => <Alert>{err.message}</Alert>);
  }

  return (
    <Stack
      sx={{ p: "1.25rem", backgroundColor: "cardBg", borderRadius: "0.625rem" }}
      spacing="1.25rem"
      direction={{
        xs: "column",
        sm: "row",
      }}
    >
      <Box
        sx={{
          maxWidth: {
            xs: "300px",
            sm: "225px",
            md: "250px",
          },
        }}
      >
      {image ? 
      <img alt={name} src={image} />
      :
      <Image
          src="/assets/male.png" 
          alt={name}
          width={200}
          height={200}
          style={{
            borderRadius: "0.5rem",
            objectFit: "cover",
          }}
        />
      }
      </Box>

      <Stack direction="row" spacing="1.25rem" flex={1}>
        <Stack
          sx={{ flex: 1, justifyContent: "space-between", py: "0.25rem" }}
          spacing="1.5rem"
        >
          <Stack
            direction="row"
            spacing="1.25rem"
            justifyContent="space-between"
          >
            <Stack spacing="0.5rem">
              <Typography
                variant="h2"
                sx={{
                  md: {
                    fontSize: "1.375rem",
                  },
                  xs: {
                    fontSize: "0.875rem",
                  },
                }}
              >
                {name}
              </Typography>

              <Typography variant="body2">{role}</Typography>
            </Stack>

            {currentAdmin?.role === 'super-admin' &&
            <Box>
              <IconButton
                aria-label="open more"
                aria-haspopup="true"
                size="small"
                onClick={() => setOpenDialog(true)}
              >
                <Delete sx={{ color: "textSecondary.main" }} />
              </IconButton>
            </Box>}
          </Stack>

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              lg: "repeat(2, 1fr)",
            }}
            gap={2}
          >
            <Stack
              direction="row"
              spacing="0.625rem"
              alignItems="center"
              gridColumn="span 1"
              sx={{ color: "textSecondary.main" }}
            >
              <MailIcon sx={{ width: "1.125rem", height: "1.125rem" }} />
              <Typography variant="body2">{email}</Typography>
            </Stack>

            <Stack
              direction="row"
              spacing="0.625rem"
              alignItems="center"
              gridColumn="span 1"
              sx={{ color: "textSecondary.main" }}
            >
              <LocationOnIcon sx={{ width: "1.125rem", height: "1.125rem" }} />
              <Typography variant="body2">{address}</Typography>
            </Stack>

            <Stack
              direction="row"
              spacing="0.625rem"
              alignItems="center"
              gridColumn="span 1"
              sx={{ color: "textSecondary.main" }}
            >
              <LocalPhoneIcon sx={{ width: "1.125rem", height: "1.125rem" }} />
              <Typography variant="body2">{phone}</Typography>
            </Stack>

            <Stack
              direction="row"
              spacing="0.625rem"
              alignItems="center"
              gridColumn="span 1"
              sx={{ color: "textSecondary.main" }}
            >
              <ApartmentIcon sx={{ width: "1.125rem", height: "1.125rem" }} />
              <Typography variant="body2">{posts.length} Properties</Typography>
            </Stack>
          </Box>
        </Stack>
      </Stack>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Agent - {name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this agent? This action is irreversible.
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

export default AgentDetails;

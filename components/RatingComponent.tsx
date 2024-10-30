import Image from "next/image";
import { Stack, Typography, Button, Box, Alert,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
 } from "@mui/material";
import { Download } from "@mui/icons-material";
import { AppDispatch } from "lib/store";
import { useDispatch } from "react-redux";
import { deleteNotification, fetchNotifications } from "lib/features/notifications/notificationSlices";
import { useState } from "react";
import { updateUser } from "lib/features/users/userSlices";


function formatDate(dateString: string | number | Date) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}


function RatingComponent({ title, message, sender, _id, createdAt }: any) {
  const dispatch : AppDispatch = useDispatch()
  const [openDeleteDialog, setOpenDelete] = useState(false);
  const [openApprovedDialog, setOpenApproved] = useState(false);
  const [isError, setIsError] = useState('')

  
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleClickOpenApproved = () => {
    setOpenApproved(true);
  };

  const handleCloseApproved = () => {
    setOpenApproved(false);
  };

  const handleDownload = async()=>{
    try {
      console.log('downloaded');
      
    } catch (error: any) {
      console.log(error.message);
      
    }
  }
  const handleReject = async () => {
    try {
      await dispatch(deleteNotification(_id)).unwrap();
      await dispatch(
        updateUser({
          id: sender._id,
          data: {
            note: "Your application has been rejected. Please review the requirements and try again."
          }
        })
      ).unwrap();
  
      dispatch(fetchNotifications());
    } catch (error: any) {
      console.error(error.message);
      setIsError(error.message);
    }
  };
  
  
  const handleApproved = async () => {
    try {
      await dispatch(deleteNotification(_id)).unwrap();
      await dispatch(
        updateUser({
          id: sender._id,
          data: {
            isVerified: true,
            note: "Your application has been approved. You can now continue to share your properties.",
           }
        })
      ).unwrap();
      setOpenApproved(false); 
      dispatch(fetchNotifications());
    } catch (error: any) {
      console.error(error.message);
      setIsError(error.message); 
    }
  };

  
  return (
    <Stack
      sx={{
        backgroundColor: "cardBg",
        borderRadius: "1.25rem",
        px: { xs: "10px", sm: "1.5rem" },
        py: "1.5rem",
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: "1.5rem", md: "0" },
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {/* Profile Information Section */}
      <Stack direction="row" spacing="1rem" alignItems="center" bgcolor={'transparent'} padding={'10px'}
       sx={{width:{xs:'100%', md:'fit-content'}}}>
        <Image
          src="/assets/male.png"
          alt={title}
          width={70}
          height={70}
          style={{ borderRadius: "0.625rem" }}
        />

        <Stack>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {sender?.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {sender?.email}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Send on {formatDate(createdAt)}
          </Typography>
        </Stack>
      </Stack>
      <Stack flexDirection={'column'} alignItems={'left'} 
       sx={{width:{xs:'100%', md:'50%'}}}>
        <Box bgcolor={'transparent'} sx={{padding:'20px', margin:"10px auto", width:'100%', textAlign:"left"}}>
          <Typography component={'p'} variant="body1">{message}</Typography>
        </Box>
        <Stack
          direction="row"
          spacing="1rem"
          bgcolor={'transparent'}
          sx={{
            width: '100%',
            justifyContent: 'right',
            alignItems: "center",
            mt:"10px"
          }}
        >
          <Stack direction="row" spacing="0.625rem">
            <Button endIcon={<Download />}
              variant="contained"
              color="info"
              sx={{ textTransform: "none", borderRadius: "10px" }}
              onClick={handleDownload}
            >
              License
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ textTransform: "none", borderRadius: "10px" }}
              onClick={handleClickOpenDelete}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{
                textTransform: "none",
                borderRadius: "10px"
              }}
              onClick={handleClickOpenApproved}
            >
              Approve
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
        <DialogTitle>Delete Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this? This action is irreversible.
            {isError && <Alert>{isError}</Alert>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="success">Cancel</Button>
          <Button onClick={handleReject} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openApprovedDialog} onClose={handleCloseApproved}>
        <DialogTitle>Application Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approved this? This action is allow the user to host properties in this platform.
            {isError && <Alert>{isError}</Alert>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproved} color="error">Cancel</Button>
          <Button onClick={handleApproved} color="success" autoFocus>Approved</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default RatingComponent;

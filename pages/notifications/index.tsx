import { useEffect, useState } from "react";
import { PageContainer, RatingComponent } from "components";
import { Stack, Box, Tabs, Tab, Alert } from "@mui/material";
import { reviews } from "utils/data";
import { AppDispatch, RootState } from "lib/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "lib/features/notifications/notificationSlices";

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

export default function Review() {
  const [value, setValue] = useState(0);
  const dispatch: AppDispatch = useDispatch()
  const {notifications, error, loading} = useSelector((state: RootState)=>state.notifications)

  useEffect(()=>{
    dispatch(fetchNotifications())
    window.document.title = "360PropertyNG - Notifications"
  },[dispatch])
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  

  if(error) return <PageContainer title="Error occur">
    <Alert>{error}</Alert>
  </PageContainer>


  if(loading) return <PageContainer title="Data is loading">
    <Alert>loading......</Alert>
  </PageContainer>

  return (
    <PageContainer title="Notifications">
      <Stack spacing="1.5rem">
        <Box
          sx={{
            bgcolor: "cardBg",
            borderRadius: "1rem",
            px: {
              xs: "0.75rem",
              sm: "1rem",
            },
            mx: {
              xs: "1rem",
              sm: 0,
            },
            width: {
              sm: "fit-content",
            },
            "& .MuiTabs-flexContainer": {
              justifyContent: "center",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              color: "textSecondary.main",
              px: {
                xs: "0.5rem",
                sm: "1rem",
              },
              minWidth: {
                xs: "70px",
                sm: "90px",
              },
            },
            "& .MuiTab-root.Mui-selected": {
              color: "primary.main",
              fontWeight: 700,
            },
          }}
        >
        
        </Box>
        <Stack spacing="1.5rem">
            {notifications.map((item, index) => (
              <RatingComponent key={`rating-${index}`} {...item} />
            ))}
          </Stack>
      </Stack>
    </PageContainer>
  );
}

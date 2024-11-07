import { PageContainer, PropertyListHome, ProfileCard } from "components";
import { Box, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "lib/store";
import { useEffect } from "react";
import { fetchAdminProfile } from "lib/features/admins/adminsSlices";


export default function Profile() {
  const {currentAdmin} = useSelector((state: RootState)=>state.admins)
  const dispatch: AppDispatch = useDispatch()
  

  useEffect(()=>{
    dispatch(fetchAdminProfile())
    window.document.title = "360PropertyNG - Profile"
  },[dispatch])
  
  return (
    <PageContainer title="My Profile">
      <Stack spacing="1.25rem" sx={{minHeight:'100vh',display:"flex",justifyContent:"center", alignItems:"bottom"}}>
        <Box sx={{width:"100%", height:"100%"}}>
          <ProfileCard admin = {currentAdmin} />
          {/* <PropertyListHome /> */}
        </Box>
      </Stack>
    </PageContainer>
  );
}

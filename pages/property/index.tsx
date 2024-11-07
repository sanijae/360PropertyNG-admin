'use client'

import {
  PageContainer,
  PropertyList,
  PropertyListFilter,
} from "components";
import { Alert, Stack } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AppDispatch, RootState } from "lib/store";
import { fetchPosts } from "lib/features/properties/propertiesSlices";


export default function Property() {
  const dispatch: AppDispatch = useDispatch();
  const { posts, currentPage, totalPages, loading, error } = useSelector((state: RootState) => state.properties);

  const router = useRouter();
  const { query } = router;
  const page = parseInt(query.page as string || "1", 10); 


  useEffect(() => {
    dispatch(fetchPosts(page)); 
    window.document.title = "360PropertyNG - Properties"
  }, [dispatch, page]);
  
  if(!posts){
    return <Alert>Fetching properties...</Alert>
  }
  return (
    <PageContainer title="Property List">
      <Stack
        spacing="1.625rem"
        sx={{ padding: "1.25rem", bgcolor: "cardBg", borderRadius: "1rem" }}
      >
        <PropertyListFilter />
        <PropertyList posts={posts} currentPage={currentPage} totalPages={totalPages} />
      </Stack>
    </PageContainer>
  );
}

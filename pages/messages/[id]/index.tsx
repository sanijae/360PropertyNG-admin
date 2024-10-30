'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, CircularProgress, Button, Container, Box, IconButton, Alert } from '@mui/material';
import { AppDispatch, RootState } from 'lib/store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteContact, fetchContact, resetDeleteSuccess } from 'lib/features/contacts/contactSlice';
import { PageContainer } from 'components';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Detail() {
  const dispatch: AppDispatch = useDispatch();
  const { contact, error, loading, deleteSuccess } = useSelector((state: RootState) => state.contacts);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) dispatch(fetchContact(id as string));
  }, [dispatch, id]);

  useEffect(()=>{
    window.document.title = `360PropertyNG - ${contact?.subject}`
  },[contact])

  useEffect(() => {
    if (deleteSuccess) {
      router.push('/messages');
      dispatch(resetDeleteSuccess());
    }
  }, [deleteSuccess, router, dispatch]);


  const handleDelete = ()=>{
    dispatch(deleteContact(id as string))
  }
  

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <PageContainer title={contact?.name || 'Contact Details'}>
      <Container>
        <Stack spacing={2} sx={{ p: 3 }}>
          {deleteSuccess && <Alert severity="success">The item has been deleted.</Alert>}
          <Button 
            variant="outlined" 
            onClick={() => router.back()} 
            sx={{ alignSelf: 'flex-start' }}
          >
            Back
          </Button>

          <Typography variant="h4" fontWeight="bold">
            {contact?.subject}
          </Typography>

          <Typography variant="body1" color="textSecondary">
            From: {contact?.name} ({contact?.email})
          </Typography>

          <Typography variant="body2" color="textSecondary">
            Sent on: {contact && new Date(contact.createdAt).toLocaleDateString()}
          </Typography>
          <hr/>

          <Typography variant="body1" sx={{ mt: 2 }}>
            {contact?.message}
          </Typography>
          <Box sx={{display:'flex',justifyContent:"right", alignItems:"center", margin:"10px auto"}}>
            <IconButton onClick={handleDelete} sx={{display:'flex', borderRadius:"8px",justifyContent:"right", alignItems:"center", background:"inherit"}}>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>Delete</Button>
            </IconButton>
          </Box>
        </Stack>
      </Container>
    </PageContainer>
  );
}

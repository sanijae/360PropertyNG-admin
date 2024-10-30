import React, { useEffect, useState } from 'react';
import { Button, TextField, Stack, Typography, Alert, InputAdornment } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from 'components/AuthLayout'; 
import { AppDispatch, RootState } from 'lib/store';
import { fetchAdminProfile, updateAdmin } from 'lib/features/admins/adminsSlices';
import { Email, LocationCity, Person, Phone } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { resetSuccess } from 'lib/features/contacts/contactSlice';

const profileUpdateSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('address is required'),
  phone: yup.number().required('Phone is required'),
});

interface ProfileUpdateFormInputs {
  name: string;
  email: string;
  address: string;
  phone: number;
}

const AdminProfileUpdate: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter()
  const { currentAdmin, loading, error, success } = useSelector((state: RootState) => state.admins);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileUpdateFormInputs>({
    resolver: yupResolver(profileUpdateSchema),
  });

  useEffect(()=>{
    window.document.title = "360PropertyNG - Edit profile"
  },[])

  useEffect(() => {
    const token = document.cookie.split('=')[1];
    dispatch(resetSuccess())
    if (token) {
      dispatch(fetchAdminProfile()); 
    }
  }, [dispatch]);

  useEffect(() => {
    if (currentAdmin) {
      setValue('name', currentAdmin.name);
      setValue('email', currentAdmin.email);
      setValue('phone', currentAdmin.phone);
      setValue('address', currentAdmin.address);
    }
  }, [currentAdmin, setValue]);

  const onSubmit: SubmitHandler<any> = (data) => {
    dispatch(updateAdmin({admin:data,id:currentAdmin?._id}))
    .unwrap()
      .then(()=>router.push('/profile'))
      .catch((error)=> <Alert>{error.message}</Alert>)
  };
  
  return (
    <AuthLayout title="Update Profile">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>

          {/* {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Profile updated successfully!</Alert>} */}

          <TextField
            label="Name"
            variant="standard"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputProps={{
              startAdornment:(
                <InputAdornment position='start'>
                  <Person/>
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="Email"
            variant="standard"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment:(
                <InputAdornment position='start'>
                  <Email/>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Phone"
            variant="standard"
            fullWidth
            {...register('phone')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment:(
                <InputAdornment position='start'>
                  <Phone/>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Address"
            variant="standard"
            fullWidth
            {...register('address')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment:(
                <InputAdornment position='start'>
                  <LocationCity/>
                </InputAdornment>
              )
            }}
          />

          <Button variant="contained" sx={{textTransform:"sentence"}} color="primary" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default AdminProfileUpdate;

import React, { useEffect } from 'react';
import { Button, TextField, Stack, Typography, Alert, InputAdornment } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'lib/store';
import { addContact, resetAddSuccess } from 'lib/features/contacts/contactSlice';
import { Email, Person, Phone, Message as MessageIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { PageContainer } from 'components';

const contactFormSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  subject: yup.string().typeError('Please provided a subject here').required('Subject is required'),
  message: yup.string().required('Message is required'),
});

interface Contact {
    name: string;
    email: string;
    subject: string;
    message: string;
  }

  const ContactUsForm: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    const { loading, error, addSuccess } = useSelector((state: RootState) => state.contacts);
  
    const { register, handleSubmit, formState: { errors } } = useForm<Contact>({
      resolver: yupResolver(contactFormSchema),
    });
    useEffect(()=>{
      window.document.title = "360PropertyNG - New message"
    },[])
  
    const onSubmit: SubmitHandler<Contact> = (data) => {
      dispatch(addContact(data))
        .unwrap()
        .then(() => router.push('/messages'))
        .catch((err) => <Alert>{err.message}</Alert>);
    };
    
  
    return (
      <PageContainer title="Send Message">
        <Stack
          spacing={3}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ maxWidth: 500, mx: { xs: '20px', sm: 'auto' }, mt: 5 }}
        >
          <Button variant="outlined" sx={{ width: 'fit-content' }} onClick={() => router.back()}>
            Back
          </Button>
  
          {error && <Alert severity="error">{error}</Alert>}
          {addSuccess && <Alert severity="success">Message sent successfully!</Alert>}
  
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
  
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
  
          <TextField
            label="Subject"
            variant="outlined"
            fullWidth
            {...register('subject')}
            error={!!errors.subject}
            helperText={errors.subject?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
          />
  
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            {...register('message')}
            error={!!errors.message}
            helperText={errors.message?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MessageIcon />
                </InputAdornment>
              ),
            }}
          />
  
          <Button variant="contained" type="submit" color="primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </Stack>
      </PageContainer>
    );
  };
  
  export default ContactUsForm;
  

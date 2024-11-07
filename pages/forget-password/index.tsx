'use client'
import React, { useState, useEffect } from "react";
import { 
  Button, 
  TextField, 
  Stack, 
  Alert, 
  Box, 
  CircularProgress, 
  Typography
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthLayout from "components/AuthLayout";
import { sendResetLink } from "utils/api";
import Link from "next/link";

interface LoginFormInputs {
  email: string;
}

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const SendResetToken: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isError, setIsError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);
    try {
      const res = await sendResetLink(data)
      if(res.data.message){
        setEmailSent(true);
        setCanResend(false);
        setCountdown(60);
      }else{
        setIsError((res.data.error))
      }
    } catch (error: any) {
      setIsError(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && emailSent) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, emailSent]);

  return (
    <AuthLayout title="Send Reset Token">
      <Box
        sx={{
          maxWidth: 500,
          margin: "auto",
          padding: 4,
          backgroundColor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {emailSent && (
              <Alert severity="success">
                A reset link has been sent to your email. Please follow the link to reset your password. 
                If you didn’t receive the email, you can resend it after {countdown} seconds.
              </Alert>
            )}

            <TextField
              label="Email"
              variant="standard"
              fullWidth
              required
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ padding: '10px', my: '1em' }}
            />
           {isError && <Alert variant="filled" color="error">{isError}</Alert>}

            <Button
              variant="contained"
              type="submit"
              fullWidth
              size="large"
              sx={{
                paddingY: 1.5,
                fontWeight: "bold",
                backgroundColor: "primary.main",
                ":hover": { backgroundColor: "primary.dark" },
              }}
              disabled={loading || emailSent}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Sending..." : "Send Token"}
            </Button>

            {emailSent && canResend && (
              <Button
                variant="outlined"
                fullWidth
                size="large"
                sx={{
                  paddingY: 1.5,
                  fontWeight: "bold",
                  marginTop: 2,
                }}
                onClick={() => handleSubmit(onSubmit)()}
              >
                Resend Token
              </Button>
            )}
            <Box textAlign="right">
              <Link href="/login" passHref>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Remember Password login?
                </Typography>
              </Link>
            </Box>
          </Stack>
        </form>
      </Box>
    </AuthLayout>
  );
};

export default SendResetToken;

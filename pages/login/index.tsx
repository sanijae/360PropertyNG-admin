'use client'
import React, { useEffect } from "react";
import { 
  Button, 
  TextField, 
  Stack, 
  Alert, 
  IconButton, 
  Box, 
  Typography, 
  CircularProgress 
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthLayout from "components/AuthLayout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "lib/features/admins/adminsSlices";
import { RootState, AppDispatch } from "lib/store";
import Link from 'next/link';  // Import Link from Next.js

interface LoginFormInputs {
  email: string;
  password: string;
}

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required(),
});

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const { error, success, loading, isAuthenticated } = useSelector((state: RootState) => state.admins);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    window.document.title = "360PropertyNG - Login"
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [router, isAuthenticated]);

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    dispatch(loginAdmin(data));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <AuthLayout title="Welcome Back">
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
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

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
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="standard"
              fullWidth
              required
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ padding: '10px', my: '1em' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box textAlign="right">
              <Link href="/forget-password" passHref>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Forgot Password?
                </Typography>
              </Link>
            </Box>

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
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Stack>
        </form>
      </Box>
    </AuthLayout>
  );
};

export default AdminLogin;

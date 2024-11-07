import React, { useEffect, useState } from "react";
import { Button, TextField, Stack, Alert, CircularProgress, Typography, InputAdornment, IconButton } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/router";
import axios from "axios";
import AuthLayout from "components/AuthLayout";
import { resetPassword, resetPasswordVerification } from "utils/api";

interface IFormInputs {
  newPassword: string;
  confirmPassword: string;
}

const UpdatePassword: React.FC = () => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<IFormInputs>();
  const newPassword = watch("newPassword");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true); 
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    const verifyToken = async () => {
      setIsVerifyingToken(true);
      try {
        const response = await resetPasswordVerification(token);
        if (response.status === 200) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch (error: any) {
        console.error("Invalid token:", error.message);
        setTokenValid(false);
      } finally {
        setIsVerifyingToken(false);
      }
    };
    verifyToken();
  },[token, tokenValid]);

  useEffect(() => {
    window.document.title = "360Property - Update Password";
  }, []);
console.log(tokenValid)
  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      await resetPassword({
        token,
        newPassword: data.newPassword,
      });
      router.push("/login");
    } catch (error: any) {
      console.error("Error updating password:", error.message);
      setErrorMessage("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
    reset();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  if (isVerifyingToken) {
    return (
      <AuthLayout title="Verifying Token">
        <Stack alignItems="center" spacing={3}>
          <CircularProgress />
          <Typography>Verifying token, please wait...</Typography>
        </Stack>
      </AuthLayout>
    );
  }

  return (
   <>
      {!tokenValid ?
      <AuthLayout title="Invalid Token">
      <Stack alignItems="center" spacing={3}>
        <Alert severity="error">Invalid or expired token. Please request a new reset link.</Alert>
        <Button variant="contained" color="primary" onClick={() => router.push("/forget-password")}>
          Send Reset Link
        </Button>
      </Stack>
    </AuthLayout>
      :
      <AuthLayout title="Update Password">
        <Stack spacing={3} alignItems="center">
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", maxWidth: 400 }}>
            <Stack spacing={2}>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
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

              <TextField
                label="Confirm New Password"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
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

              <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : "Update Password"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </AuthLayout>}
   </>
  );
};

export default UpdatePassword;

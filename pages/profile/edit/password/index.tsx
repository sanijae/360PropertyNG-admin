import React, { useEffect } from "react";
import { Button, TextField, Stack, Alert, CircularProgress, Typography, InputAdornment, IconButton } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "lib/store";
import { fetchAdminProfile, updatePassword } from "lib/features/admins/adminsSlices";
import AuthLayout from "components/AuthLayout";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/router";
import { resetSuccess } from "lib/features/contacts/contactSlice";

interface IFormInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AdminUpdatePassword: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentAdmin, loading, error, success } = useSelector((state: RootState) => state.admins);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<IFormInputs>();
  const newPassword = watch("newPassword");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const router = useRouter()

  useEffect(()=>{
    dispatch(fetchAdminProfile())
    dispatch(resetSuccess())
  },[dispatch])

  useEffect(()=>{
    window.document.title = "360PropertyNG - Update password"
  },[])

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setIsError(true);
      return;
    }
    dispatch(
        updatePassword({
          id: currentAdmin?._id,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
      )
      .unwrap()
      .then(()=>router.push('/profile'))
      .catch((error)=> <Alert>{error.message}</Alert>)
    reset();
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <AuthLayout title="Update Password">
        <Stack spacing={3} alignItems="center">

        {isError && <Alert severity="error">Password do not match</Alert>}
        {/* {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Password updated successfully!</Alert>} */}

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", maxWidth: 400 }}>
            <Stack spacing={2}>
            <TextField
                label="Current Password"
                type={showPassword ? "text" : "password"}
                {...register("currentPassword", { required: "Current password is required" })}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message}
                InputProps={{
                  endAdornment:(
                    <InputAdornment position="end">
                      <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    </InputAdornment>
                  )
                }}
            />

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
                  endAdornment:(
                    <InputAdornment position="end">
                      <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    </InputAdornment>
                  )
                }}
            />

            <TextField
                label="Confirm New Password"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", { required: "Please confirm your password" })}
                error={!!errors.confirmPassword}
                helperText={
                errors.confirmPassword?.message || 
                (watch("confirmPassword") && newPassword !== watch("confirmPassword") ? 
                    "Passwords do not match" : "")
                }
                InputProps={{
                  endAdornment:(
                    <InputAdornment position="end">
                      <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    </InputAdornment>
                  )
                }}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
            >
                {loading ? <CircularProgress size={24} /> : "Update Password"}
            </Button>
            </Stack>
        </form>
        </Stack>
    </AuthLayout>
  );
};

export default AdminUpdatePassword;

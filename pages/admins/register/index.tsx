import React, { useState, MouseEvent, useEffect } from "react";
import {
  Button,
  TextField,
  Stack,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import AuthLayout from "components/AuthLayout";
import { registerAdmin } from "lib/features/admins/adminsSlices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "lib/store";
import { resetError, resetSuccess } from "lib/features/contacts/contactSlice";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const AdminRegister: React.FC = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { error, loading, success } = useSelector((state: RootState) => state.admins);

  useEffect(() =>{
    dispatch(resetError())
    dispatch(resetSuccess())
  },[dispatch,resetError,resetSuccess])
  
  useEffect(()=>{
    window.document.title = "360PropertyNG - Register admin"
  },[])

  const {register,handleSubmit,formState: { errors },control} = useForm<RegisterFormInputs>({
    resolver: yupResolver(registerSchema),
  });

  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      await dispatch(registerAdmin(data));
      router.push("/admins");
    } catch (err) {
      console.error("Error registering admin:", err);
    }
  };

  const togglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  const preventDefault = (event: MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  return (
    <AuthLayout title="Admin Register">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          {/* {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Registration successful!</Alert>} */}

          <TextField
            label="Name"
            variant="standard"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Email"
            variant="standard"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="standard"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    onMouseDown={preventDefault}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            variant="standard"
            fullWidth
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword?.message ||
              (password !== confirmPassword && "Passwords do not match")
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    onMouseDown={preventDefault}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default AdminRegister;

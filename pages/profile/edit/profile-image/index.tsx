import React, { useEffect, useState } from "react";
import { Button, Stack, Typography, Avatar, Alert, CircularProgress } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "lib/store";
import { fetchAdminProfile, updateProfileImage } from "lib/features/admins/adminsSlices";
import AuthLayout from "components/AuthLayout";
import { useRouter } from "next/router";
import { resetSuccess } from "lib/features/contacts/contactSlice";

interface IFormInputs {
  profileImage: FileList;
}

const AdminUpdateImage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentAdmin, loading, error, success } = useSelector(
    (state: RootState) => state.admins
  );
  
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { register, handleSubmit, watch, reset } = useForm<IFormInputs>();

  const imageFile = watch("profileImage");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      fileReader.readAsDataURL(imageFile[0]);
    }
  }, [imageFile]);

  useEffect(() => {
    dispatch(fetchAdminProfile());
    dispatch(resetSuccess())
  }, [dispatch]);

  useEffect(()=>{
    window.document.title = "360PropertyNG - Update profile image"
  },[])

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append("file", data.profileImage[0]);

    dispatch(updateProfileImage({ id: currentAdmin?._id, formData }))
    .unwrap()
      .then(()=>router.push('/profile'))
      .catch((error)=> <Alert>{error.message}</Alert>)
    reset(); 
  };

  return (
    <AuthLayout title="Update Profile Image">
      <Stack spacing={3} alignItems="center">
        {/* {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Profile image updated successfully!</Alert>} */}

        {loading ? (
          <CircularProgress />
        ) : (
          <Avatar
            src={previewImage || currentAdmin?.imageUrl}
            sx={{ width: 150, height: 150 }}
          />
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="file"
            accept="image/*"
            {...register("profileImage")}
            required
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Update Image"}
          </Button>
        </form>
      </Stack>
    </AuthLayout>
  );
};

export default AdminUpdateImage;

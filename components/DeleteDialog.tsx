import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AppDispatch, RootState } from 'lib/store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAdmin, fetchAdmin, fetchAdmins } from 'lib/features/admins/adminsSlices';
import { Alert } from '@mui/material';

export default function DeleteDialog({id, handleClose, open}:{id: any, handleClose: any,open: any}) {
    const dispatch : AppDispatch = useDispatch()
    const {admin, success, error} = useSelector((state: RootState)=> state.admins)

    React.useEffect(()=>{
        dispatch(fetchAdmin(id))
    },[dispatch, id])

    const handleDelete = () =>{
        dispatch(deleteAdmin(id))
        .unwrap()
        .then(()=>{
            dispatch(fetchAdmins())
            handleClose()
        })
        .catch((err) => <Alert>{err.message}</Alert>);
    }

    return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Admin deleting - {admin?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this admin? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="success">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

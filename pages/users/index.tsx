import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Alert, Avatar, Button, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, IconButton, Typography } from '@mui/material';
import { PageContainer } from 'components';
import { useDispatch, UseDispatch, useSelector } from 'react-redux';
import { deleteUser, fetchUsers } from 'lib/features/users/userSlices';
import { AppDispatch, RootState } from 'lib/store';
import Image from 'next/image';
import { Delete } from '@mui/icons-material';


interface Column {
  id: 'profile' | 'name' | 'email' | "action";
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'profile', label: 'Profile', minWidth: 100},
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 100, align:"right"},
  { id: 'action', label: 'Action', minWidth: 100, align:"right"},
];



export default function Users() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch: AppDispatch = useDispatch()
  const {users, loading, error} = useSelector((state:RootState)=>state.users)
  const [filterUsers, setUsers] = React.useState<any[]>([])
  const [userId, setUserId] = React.useState<any>(null);
  const [openDialog, setOpenDialog] = React.useState(false);



  React.useEffect(() =>{
      dispatch(fetchUsers())
      window.document.title = "360PropertyNG - User"
  },[dispatch])
  
  React.useEffect(() =>{
    const fUsers = users.filter((user) => user.isVerified === false )
    setUsers(fUsers)
  },[users])
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = (user: any) => {
    setUserId(user)
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = (id: any) =>{
    dispatch(deleteUser(id))
    .unwrap()
    .then(()=>{
      setOpenDialog(false);
      dispatch(fetchUsers());
    })
    .catch((err) => <Alert>{err.message}</Alert>);
  }

  return (
    <PageContainer title=' All Users'>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filterUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user,i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                    <TableCell>
                      {user.imageUrl ? <Image width={40} height={40} src={user.imageUrl} alt='Profile' style={{borderRadius:'50%', objectFit:"cover"}} />
                      : <Avatar/>}
                    </TableCell>
                    <TableCell>
                      {user.name}
                    </TableCell>
                    <TableCell sx={{minWidth: 170, textAlign: 'right',}}>
                      {user.email}
                    </TableCell>
                    <TableCell sx={{minWidth: 170, textAlign: 'right',}}>
                        <IconButton aria-label="delete" size="small" onClick={()=>handleClickOpen(user)}>
                          <Delete fontSize="inherit" />
                        </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filterUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete User - {userId?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="success">Cancel</Button>
          <Button onClick={()=>handleDelete(userId?._id)} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}

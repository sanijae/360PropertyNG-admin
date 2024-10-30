import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { PageContainer } from 'components';
import {AppDispatch, RootState} from '../../lib/store'
import {fetchAdmins} from '../../lib/features/admins/adminsSlices'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, IconButton } from '@mui/material';
import { adminImageURL } from 'utils/api';
import { Delete, Edit } from '@mui/icons-material';
import DeleteDialog from 'components/DeleteDialog';

interface Column {
  id: 'imageUrl' | 'name' | 'email' | 'createdAt' | 'action';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'imageUrl', label: 'Avatar', minWidth: 60 },
  { id: 'name', label: 'name', minWidth: 100 },
  {
    id: 'email',
    label: 'email',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'createdAt',
    label: 'Date Joined',
    minWidth: 100,
    align: 'right',
  },
  { id: 'action', label: 'Action', minWidth: 80, align: 'right' },
];

export default function Admins() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch: AppDispatch = useDispatch()
  const {admins}  = useSelector((state: RootState)=>state.admins)
  const [open, setOpen] = React.useState(false);
  const [adminId, setAdminId] = React.useState('');


  React.useEffect(() => {
    dispatch(fetchAdmins())
    window.document.title = "360PropertyNG - Admins"
  },[dispatch])
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = (id: any) => {
    setAdminId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <PageContainer title='All Admins' buttonText='New Admin' navigate={'/admins/register'}>
      <TableContainer sx={{background:'inherit', maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column,i) => (
                <TableCell
                  key={i}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {admins
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((admin,i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={admin.id}>
                     <TableCell key={i}>
                        {admin.imageUrl ? <Avatar alt={admin.name} src={`${adminImageURL}/${admin._id}/${admin.imageUrl}`} /> : <Avatar/>}
                      </TableCell>
                      <TableCell key={i} >
                        {admin.name}
                      </TableCell>
                      <TableCell key={i} align={'right'}>
                        {admin.email}
                      </TableCell>
                      <TableCell key={i} align="right">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell key={i} align="right">
                        <IconButton aria-label="delete" size="small" onClick={()=>handleClickOpen(admin._id)}>
                          <Delete fontSize="inherit" />
                        </IconButton>
                        {/* <IconButton aria-label="edit" size="small">
                          <Edit fontSize="inherit" />
                        </IconButton> */}
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
        count={admins.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <DeleteDialog id={adminId} handleClose={handleClose} open={open} />
    </PageContainer>
  );
}

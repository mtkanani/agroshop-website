import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel, Tooltip, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import LockResetIcon from '@mui/icons-material/LockReset';
import { fetchUsers, fetchUserDetail, updateUserDetail, deleteUserById, clearAdminStatus, suspendUserThunk, resetUserPasswordThunk } from '../features/adminSlice';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.user);
  const {
    users, usersLoading, usersError, userDetail, userDetailLoading, userDetailError, userUpdateSuccess, userUpdateError, userDeleteSuccess, userDeleteError,
    userSuspendSuccess, userSuspendError, userSuspendLoading, userResetSuccess, userResetError, userResetLoading
  } = useSelector(state => state.admin);
  const [open, setOpen] = React.useState(false);
  const [editUser, setEditUser] = React.useState({ name: '', email: '', isAdmin: false });
  const [resetDialog, setResetDialog] = React.useState(false);
  const [resetUserId, setResetUserId] = React.useState(null);
  const [resetPassword, setResetPassword] = React.useState('');

  React.useEffect(() => {
    if (userInfo?.isAdmin && userInfo.token) {
      dispatch(fetchUsers(userInfo.token));
    }
  }, [dispatch, userInfo, userUpdateSuccess, userDeleteSuccess, userSuspendSuccess, userResetSuccess]);

  const handleEdit = (id) => {
    dispatch(fetchUserDetail({ id, token: userInfo.token }));
    setOpen(true);
  };

  React.useEffect(() => {
    if (userDetail) {
      setEditUser({ name: userDetail.name, email: userDetail.email, isAdmin: userDetail.isAdmin });
    }
  }, [userDetail]);

  const handleUpdate = () => {
    dispatch(updateUserDetail({ id: userDetail._id, user: editUser, token: userInfo.token }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) {
      dispatch(deleteUserById({ id, token: userInfo.token }));
    }
  };

  const handleSuspend = (id) => {
    dispatch(suspendUserThunk({ id, token: userInfo.token }));
  };

  const handleResetPassword = (id) => {
    setResetUserId(id);
    setResetPassword('');
    setResetDialog(true);
  };

  const handleResetSubmit = () => {
    dispatch(resetUserPasswordThunk({ id: resetUserId, password: resetPassword, token: userInfo.token }));
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(clearAdminStatus());
  };

  const handleResetDialogClose = () => {
    setResetDialog(false);
    dispatch(clearAdminStatus());
  };

  if (!userInfo?.isAdmin) return <Typography>Access denied. Admins only.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Manage Users</Typography>
      {usersLoading ? <CircularProgress sx={{ my: 4 }} /> : usersError ? <Alert severity="error">{usersError}</Alert> : (
        <List>
          {users.map(user => (
            <ListItem key={user._id} divider
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <Tooltip title={user.isSuspended ? 'Unsuspend' : 'Suspend'}>
                    <span>
                      <IconButton onClick={() => handleSuspend(user._id)} disabled={userSuspendLoading} color={user.isSuspended ? 'success' : 'warning'}>
                        <BlockIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Reset Password">
                    <span>
                      <IconButton onClick={() => handleResetPassword(user._id)} disabled={userResetLoading} color="primary">
                        <LockResetIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <IconButton onClick={() => handleEdit(user._id)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(user._id)} color="error"><DeleteIcon /></IconButton>
                </Stack>
              }
            >
              <ListItemText
                primary={user.name + (user.isAdmin ? ' (Admin)' : '') + (user.isSuspended ? ' [Suspended]' : '')}
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {userDetailLoading ? <CircularProgress /> : userDetailError ? <Alert severity="error">{userDetailError}</Alert> : (
            <>
              <TextField
                label="Name"
                value={editUser.name}
                onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                fullWidth sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                value={editUser.email}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                fullWidth sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={<Checkbox checked={editUser.isAdmin} onChange={e => setEditUser({ ...editUser, isAdmin: e.target.checked })} />}
                label="Admin"
              />
              {userUpdateError && <Alert severity="error">{userUpdateError}</Alert>}
              {userUpdateSuccess && <Alert severity="success">User updated!</Alert>}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" disabled={userDetailLoading}>Update</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={resetDialog} onClose={handleResetDialogClose}>
        <DialogTitle>Reset User Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            value={resetPassword}
            onChange={e => setResetPassword(e.target.value)}
            fullWidth sx={{ mb: 2 }}
          />
          {userResetError && <Alert severity="error">{userResetError}</Alert>}
          {userResetSuccess && <Alert severity="success">Password reset!</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetDialogClose}>Cancel</Button>
          <Button onClick={handleResetSubmit} variant="contained" disabled={userResetLoading || !resetPassword}>Reset</Button>
        </DialogActions>
      </Dialog>
      {userSuspendError && <Alert severity="error" sx={{ mt: 2 }}>{userSuspendError}</Alert>}
      {userSuspendSuccess && <Alert severity="success" sx={{ mt: 2 }}>User suspension status changed!</Alert>}
      {userDeleteError && <Alert severity="error" sx={{ mt: 2 }}>{userDeleteError}</Alert>}
      {userDeleteSuccess && <Alert severity="success" sx={{ mt: 2 }}>User deleted!</Alert>}
    </Box>
  );
} 
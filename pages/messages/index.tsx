'use client'
import { useEffect } from "react";
import { useRouter } from "next/router";
import { 
  Stack, List, ListItem, ListItemText, CircularProgress, 
  Box, Alert, IconButton, Container, Typography, Divider 
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { PageContainer } from "components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "lib/store";
import { fetchContacts } from "lib/features/contacts/contactSlice";

export default function Messages() {
  const { loading, error, contacts } = useSelector((state: RootState) => state.contacts);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchContacts());
    window.document.title = "360PropertyNG - Messages"
  }, [dispatch]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <PageContainer title="Contact Messages" buttonText="Send message" navigate={'/messages/new-message'}>
      <Container>
        <Stack spacing={2} sx={{ p: 3 }}>
          <List>
            {contacts.map((msg) => (
              <Box key={msg._id} sx={{ margin: "20px auto" }}>
                <ListItem
                  onClick={() => router.push(`/messages/${msg._id}`)}
                  disableGutters
                  sx={{
                    borderRadius: "8px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    mb: 2,
                    padding:"1rem 2rem",
                    backgroundColor: "inherit",
                    "&:hover": { cursor: "pointer" }
                  }}
                  secondaryAction={
                    <IconButton aria-label="comment">
                      <CommentIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        variant="h6"
                        sx={{ fontWeight: "bold", margin: "10px auto" }}
                      >
                        {msg.subject}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body1"
                          sx={{ color: "text.primary", display: "inline" }}
                        >
                          From: {msg.name} &nbsp; - &nbsp;
                        </Typography>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        </Stack>
      </Container>
    </PageContainer>
  );
}

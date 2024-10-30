import { Box, Container, Stack, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack spacing={3} width="100%" sx={{ textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold">
            {title}
          </Typography>
          {children}
        </Stack>
      </Box>
    </Container>
  );
};

export default AuthLayout;

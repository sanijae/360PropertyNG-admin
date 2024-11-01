import React from "react";
import { Typography, Stack, Button, Box } from "@mui/material";
import { useRouter } from "next/router";

interface IProps {
  children: React.ReactNode;
  title: string;
  buttonText?: string;
  navigate?: any;
}

function PageContainer({ children, title, buttonText, navigate }: IProps) {
  const router = useRouter()
  const handleClick = () => {
    router.push(navigate)
  }
  return (
    <Stack sx={{ px: { sm: "1.5rem" }, py: "1.75rem" }} spacing="1.25rem">
      <Stack
        sx={{
          px: { xs: "1.125rem", sm: 0 },
          justifyContent: "space-between",
          alignItems: "center",
        }}
        direction="row"
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            fontSize: "1.5625rem",
            color: "textPrimary.main",
          }}
        >
          {title}
        </Typography>

        {buttonText && (
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              py: "0.75rem",
              px: "1.25rem",
              borderRadius: "0.625rem",
              fontSize: "0.875rem",
              fontWeight: "600",
            }}
            onClick={handleClick}
          >
            {buttonText}
          </Button>
        )}
      </Stack>

      <Box>{children}</Box>
    </Stack>
  );
}

export default PageContainer;

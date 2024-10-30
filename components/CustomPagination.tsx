import { Pagination, PaginationItem, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Paginations = ({
  currentPage,
  totalPages,
  totalProperties,
  propertiesPerPage = 8,
}: {
  currentPage: number;
  totalPages: number;
  totalProperties: number;
  propertiesPerPage?: number;
}) => {
  const router = useRouter();
  const { pathname, query } = router;

  const [page, setPage] = useState(currentPage);

  const startIndex = (page - 1) * propertiesPerPage + 1;
  const endIndex = Math.min(page * propertiesPerPage, totalProperties);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePageChange = (event: React.ChangeEvent<any>, value: number) => {
    setPage(value);
    router.push(`${pathname}?page=${value}`, undefined, { shallow: true });
  };

  return (
    <Stack
      justifyContent="right"
      direction={{ xs: "column", sm: "row" }}
      alignItems="center"
      spacing="1rem"
    >
      {/* <Typography variant="body1">
        Showing {startIndex} to {endIndex} of {totalProperties} Properties
      </Typography> */}

      <Stack
        sx={{
          ".MuiPaginationItem-text": {
            color: "textSecondary.main",
          },
          ".Mui-selected": {
            color: "#FCFCFC",
          },
          backgroundColor: "cardBg",
          py: "0.325rem",
          px: "0.5rem",
          borderRadius: "0.375rem",
        }}
      >
        <Pagination
          color="primary"
          shape="rounded"
          size="medium"
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          style={{
            margin: "40px auto",
            width: "100%",
            display: "flex",
            justifyContent: "right",
          }}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              style={{
                borderRadius: "10px",
                fontWeight: "bold",
                margin: "10px",
              }}
              component={Link}
              href={`${pathname}?page=${item.page}`}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};

export default Paginations;

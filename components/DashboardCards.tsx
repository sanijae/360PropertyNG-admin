import { useState, useEffect } from "react";
import { Stack, Typography, Box, CircularProgress } from "@mui/material";
import api from "utils/api";
// import { dashboardCards as cards } from "utils/data";


interface Agent {
  id: string;
  _id: string;
  name: string;
  email: string;
  address: string;
  imageUrl: string;
  title: string;
  phone: number;
  isVerified: boolean;
}
interface ICardProps {
  title: string;
  color: string;
  value: number;
  progress: number;
}
export const dashboardCards = [
  {
    title: "Properties for Sale",
    value: 684,
    color: "#475BE8",
    progress: 77,
  },
  {
    title: "Properties for Rent",
    value: 546,
    color: "#FD8539",
    progress: 61,
  },
  {
    title: "Total Customer",
    value: 5632,
    color: "#2ED480",
    progress: 82,
  },
  {
    title: "Total City",
    value: 90,
    color: "#FE6D8E",
    progress: 58,
  },
];

function DashboardCards() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [allData, setAllData] = useState({
    cities: [],
    rent: [],
    sell: [],
    users: [],
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, sellRes, rentRes, usersRes] = await Promise.all([
          api.get("/property/cities"),
          api.get("/property/category/Sell"),
          api.get("/property/category/Rent"),
          api.get("/user/"),
        ]);
        setAllData({
          cities: citiesRes.data.cities,
          sell: sellRes.data.result,
          rent: rentRes.data.result,
          users: usersRes.data.result,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const verifiedAgents = allData.users.filter((user:Agent) => user.isVerified);
    setAgents(verifiedAgents);
  }, [allData.users]);
  
  
  const cards = [
    {
      title: "Properties for Sale",
      value: allData?.sell.length !== 0 ? allData?.sell.length : 344,
      color: "#475BE8",
      progress: 77,
    },
    {
      title: "Properties for Rent",
      value: allData?.rent.length !== 0 ? allData?.rent.length : 2122,
      color: "#FD8539",
      progress: 61,
    },
    {
      title: "Total Agents",
      value: agents.length !== 0 ? agents.length : 33222,
      color: "#2ED480",
      progress: 82,
    },
    {
      title: "Total City",
      value: allData?.cities.length !== 0 ? allData?.cities.length : 3233,
      color: "#FE6D8E",
      progress: 58,
    },
  ];
  
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        xl: "repeat(4, 1fr)",
      }}
      gap={2}
      rowGap="1.5625rem"
      columnGap="0.9375rem"
      sx={{
        px: { xs: "1.125rem", sm: "0" },
      }}
    >
      {cards.map((card, index) => (
        <Card key={`dashboard-card-${index}`} {...card} />
      ))}
    </Box>
  );
}

function Card({ title, color, value, progress }: ICardProps) {
  const [progressVal, setProgressVal] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgressVal((prevVal) => {
        if (prevVal >= progress) {
          clearInterval(timer);
          return progress;
        } else {
          return prevVal + 5;
        }
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Stack
      sx={{
        backgroundColor: "cardBg",
        borderRadius: "1rem",
        px: "1.375rem",
        py: "1.125rem",
        flex: 1,
      }}
      direction="row"
      alignItems="center"
      spacing="0.625rem"
      gridColumn="span 1"
    >
      <Stack flex={1}>
        <Typography variant="body2" marginBottom="0.375rem">
          {title}
        </Typography>

        <Typography
          component="span"
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem !important",
            color: "textPrimary",
          }}
        >
          {value}
        </Typography>
      </Stack>

      <Box sx={{ color }}>
        <Box sx={{ position: "relative" }}>
          <CircularProgress
            variant="determinate"
            value={progressVal}
            color="inherit"
            thickness={10}
            size={60}
            sx={{
              position: "relative",
              zIndex: 7,
            }}
          />
          <CircularProgress
            variant="determinate"
            value={100}
            // @ts-ignore
            color="altPrimary"
            thickness={10}
            size={60}
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 5,
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
}

export default DashboardCards;

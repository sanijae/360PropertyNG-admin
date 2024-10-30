import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { imageURL } from "utils/api";
import Paginations from "./CustomPagination";
import Link from "next/link";

interface Photo {
  picture: string;
}
interface Post {
_id: string;
name: string;
desc: string;
type: string;
category: string;
city?: string;
state?: string;
address?: string;
price: number;
minPrice?: string;
maxPrice?: string;
duration?: string;
negotiable?: string;
availability?: string;
photos: Photo[];
shops?: number;
beds?: number;
rooms?: number;
toilets?: number;
bathrooms?: number;
safety?: string[];
amenities?: object[];
features?: object[];
hostedBy: HostedBy;
createdAt: string;
}
function PropertyList({posts, currentPage, totalPages}:{posts: any, currentPage: number, totalPages: number}) {
  const theme = useTheme();
  const  pricesConverter = new Intl.NumberFormat('ng-NG')
  

  return (
    <Stack>
      <Grid container spacing="1.5rem">
        {posts?.map((property: Post, index: number) => (
          // @ts-ignore
          <Grid key={`property-${index}`} item xs={12} md={6} xxl={4}>
            <Link href={`/property/${property._id}`} passHref style={{textDecoration:'none'}}>
              <Stack
                sx={{
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  gap: "0.625rem",
                  flexDirection: {
                    xs: "row",
                    md: "column",
                    xl: "row",
                  },
                  cursor: "pointer",
                  ":hover": { boxShadow: 3 },
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "40%",
                      sm: "50%",
                      md: "100%",
                      xl: "200px",
                    },
                    minWidth: "180px",
                    flexGrow: {
                      xs: 1,
                      sm: 0,
                    },
                  }}
                >
                  <img
                    src={`${imageURL}/${property._id}/${property.photos[0]?.picture}`}
                    alt={property.name}
                    width={300}
                    height={200}
                    style={{
                      borderRadius: "0.625rem",
                      width:'100%',
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Stack
                  spacing="0.75rem"
                  flex="1"
                  justifyContent="space-between"
                  sx={{
                    minWidth: "180px",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "light" ? "#DADEFA" : "#111315",
                      borderRadius: "0.25rem",
                      px: "0.5rem",
                      py: "0.25rem",
                      width: "fit-content",
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.75rem !important",
                        color: "primary.main",
                        fontWeight: 600,
                      }}
                    >
                      &#8358;{pricesConverter.format(property.price)}
                    </Typography>
                  </Box>

                  <Stack spacing="0.375rem">
                    <Typography
                      variant="body1"
                      sx={{ fontSize: { sm: "1rem" },  fontWeight: "600" }}
                    >
                      {property.name}
                    </Typography>
                    <Typography variant="body2">{property.category}</Typography>
                    <Typography variant="body2">{property.address}</Typography>
                  </Stack>

                  <Stack direction="row" spacing="1.5rem">
                    <Stack
                      direction="row"
                      spacing="0.25rem"
                      color="textSecondary.main"
                    >
                      <BedOutlinedIcon
                        sx={{ width: "1.125rem", height: "1.125rem" }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.75rem !important",
                          fontWeight: "400 !important",
                        }}
                      >
                        {property.beds} bedrooms
                        {/* {Math.floor(Math.random() * 3) + 3} Beds */}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing="0.25rem"
                      color="textSecondary.main"
                    >
                      <ZoomOutMapIcon
                        sx={{
                          width: "1.125rem",
                          height: "1.125rem",
                          transform: "rotate(45deg)",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.75rem !important",
                          fontWeight: "400 !important",
                        }}
                      >
                        26M
                        {/* {Math.floor(Math.random() * 10) + 20}M */}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Paginations
        currentPage={currentPage}
        totalPages={totalPages}
        propertiesPerPage={10} 
        totalProperties={posts?.length} 
      />
    </Stack>
  );
}

export default PropertyList;

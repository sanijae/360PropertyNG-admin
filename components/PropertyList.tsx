import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { imageURL } from "utils/api";
import Paginations from "./CustomPagination";
import Link from "next/link";
import { BathroomOutlined, FolderCopyOutlined, RoomServiceOutlined, Shop2Outlined, SquareFootOutlined } from "@mui/icons-material";


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
minPrice?: number;
maxPrice?: number;
duration?: string;
negotiable?: string;
availability?: string;
photos: string;
shops?: number;
offices?: number;
beds?: number;
rooms?: number;
sizes?: number;
toilets?: number;
bathrooms?: number;
safety?: string[];
amenities?: object[];
features?: object[];
// hostedBy: HostedBy;
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
                    src={property.photos[0]}
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
                  {property.price &&
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "0.75rem !important",
                      color: "orange",
                      fontWeight: 600,
                    }}
                  >
                    &#8358;{pricesConverter.format(property.price)}
                  </Typography>
                  }
                    {property.minPrice &&
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.75rem !important",
                        color: "orange",
                        fontWeight: 600,
                        marginLeft:'10px',
                      }}
                    >
                      Min: &#8358;{pricesConverter.format(property.minPrice)}
                    </Typography>
                    }
                    {property.maxPrice &&
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.75rem !important",
                        color: "orange",
                        fontWeight: 600,
                        marginLeft:'10px',
                      }}
                    >
                      Max: &#8358;{pricesConverter.format(property.maxPrice)}
                    </Typography>
                    }
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
                      width={"100%"}
                      justifyContent={'space-between'}
                    >
                      {property.beds &&
                      <Typography
                        sx={{
                          fontSize: "0.75rem !important",
                          fontWeight: "400 !important",
                          display:'inline-flex',
                          alignItems:'center'
                        }}
                      >
                        <BedOutlinedIcon
                          sx={{ width: "1.125rem", height: "1.125rem", color:'orange', marginRight:'2px' }}
                        />
                        {property.beds} bedrooms
                      </Typography>}
                      {property.rooms &&
                      <Typography
                        sx={{
                          fontSize: "0.75rem !important",
                          fontWeight: "400 !important",
                          display:'inline-flex',
                          alignItems:'center'
                        }}
                      >
                        <RoomServiceOutlined
                          sx={{ width: "1.125rem", height: "1.125rem", color:'orange', marginRight:'2px' }}
                        />
                        {property.rooms} rooms
                      </Typography>}
                      {property.toilets &&
                      <Typography
                        sx={{
                          fontSize: "0.75rem !important",
                          fontWeight: "400 !important",
                          display:'inline-flex',
                          alignItems:'center'
                        }}
                      >
                        <BathroomOutlined
                          sx={{ width: "1.125rem", height: "1.125rem", color:'orange', marginRight:'2px' }}
                        />
                        {property.toilets} toilets
                      </Typography>}
                      {property.sizes &&
                      <Typography
                        sx={{
                          fontSize: "0.75rem !important",
                          fontWeight: "400 !important",
                          display:'inline-flex',
                          alignItems:'center'
                        }}
                      >
                        <SquareFootOutlined
                          sx={{ width: "1.125rem", height: "1.125rem", color:'orange', marginRight:'2px' }}
                        />
                        {property.sizes} SQM
                      </Typography>}
                      {property.shops &&
                      <Typography
                        sx={{
                          fontSize: "0.75rem !important",
                          fontWeight: "400 !important",
                          display:'inline-flex',
                          alignItems:'center'
                        }}
                      >
                        <Shop2Outlined
                          sx={{ width: "1.125rem", height: "1.125rem", color:'orange', marginRight:'2px' }}
                        />
                        {property.shops} shops
                      </Typography>}
                      {property.offices &&
                      <Typography
                        sx={{
                          fontSize: "0.75rem !important",
                          fontWeight: "400 !important",
                          display:'inline-flex',
                          alignItems:'center'
                        }}
                      >
                        <FolderCopyOutlined
                          sx={{ width: "1.125rem", height: "1.125rem", color:'orange', marginRight:'2px' }}
                        />
                        {property.offices} offices
                      </Typography>}
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

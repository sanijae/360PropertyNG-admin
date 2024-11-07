import { useEffect, useState } from "react";
import {
  Stack,
  FormControl,
  Select,
  MenuItem,
  SvgIcon,
  InputBase,
  Grid,
  Button,
  Alert,
  TextField,
  Typography,
  SvgIconProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { SelectChangeEvent } from "@mui/material/Select";
import api from "utils/api";
import { AppDispatch, RootState } from "lib/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, filterPosts } from "lib/features/properties/propertiesSlices";
import { useRouter } from "next/router";

function PropertyListFilter() {
  const [formState, setFormState] = useState({
    name: "",
    category: "",
    city: "",
    type: "",
  });
  const [allData, setAllData] = useState({
    cities: [],
    types: [],
    categories: [],
  });
  const [error, setError] = useState<string | null>(null);
  
  const dispatch: AppDispatch = useDispatch();
  const {posts} = useSelector((state: RootState)=>state.properties)
  const router = useRouter();
  const { query } = router;
  const page = parseInt(query.page as string || "1", 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, typesRes, categoriesRes] = await Promise.all([
          api.get("/property/cities"),
          api.get("/property/types"),
          api.get("/property/categories"),
        ]);
        setAllData({
          cities: citiesRes.data.cities,
          types: typesRes.data.types,
          categories: categoriesRes.data.categories,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load filter options.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const query = { ...formState };
      await dispatch(filterPosts({ query, page }))
        .unwrap()
        .then(() => {
          setFormState({
            name: "",
            category: "",
            city: "",
            type: "",
          });
        });
  
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  const selectSx = {
    backgroundColor: "secondary.main",
    borderRadius: "0.5rem",
    "&:hover": {
      backgroundColor: "altPrimary.main",
    },
    "& .MuiSelect-icon": {
      color: "textSecondary.main",
    },
  };

  return (
    <form onSubmit={handleSearch}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8} md={4}>
          <TextField
            placeholder="Enter a title"
            name="name"
            value={formState.name}
            onChange={handleChange}
            fullWidth
            sx={{
              "& .MuiInputBase-input": {
                borderRadius: "0.5rem",
                padding: "0.625rem",
                paddingLeft: "2.25rem",
                backgroundColor: "secondary.main",
              }
            }}
          />
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <FormControl size="small" fullWidth>
            <Select
              name="category"
              value={formState.category}
              onChange={handleChange}
              displayEmpty
              IconComponent={ExpandMoreRoundedIcon}
              sx={selectSx}
            >
              <MenuItem value="">
                <em>Any Category</em>
              </MenuItem>
              {allData.categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <FormControl size="small" fullWidth>
            <Select
              name="type"
              value={formState.type}
              onChange={handleChange}
              displayEmpty
              IconComponent={ExpandMoreRoundedIcon}
              sx={selectSx}
            >
              <MenuItem value="">
                <em>Any Type</em>
              </MenuItem>
              {allData.types.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <FormControl size="small" fullWidth>
            <Select
              name="city"
              value={formState.city}
              onChange={handleChange}
              displayEmpty
              IconComponent={ExpandMoreRoundedIcon}
              sx={selectSx}
            >
              <MenuItem value="">
                <em>Any City</em>
              </MenuItem>
              {allData.cities.map((city, index) => (
                <MenuItem key={index} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Button type="submit" variant="contained" fullWidth>
            Filter
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Stack sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Stack>
      )}
    </form>
  );
}

function SearchSvg(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg viewBox="0 0 16 16">
        <path
          d="M12.803 13.8637C13.0959 14.1566 13.5708 14.1566 13.8637 13.8637C14.1566 13.5708 14.1566 13.0959 13.8637 12.803L12.803 13.8637ZM11.25 7C11.25 9.34721 9.34721 11.25 7 11.25V12.75C10.1756 12.75 12.75 10.1756 12.75 7H11.25ZM7 11.25C4.65279 11.25 2.75 9.34721 2.75 7H1.25C1.25 10.1756 3.82436 12.75 7 12.75V11.25ZM2.75 7C2.75 4.65279 4.65279 2.75 7 2.75V1.25C3.82436 1.25 1.25 3.82436 1.25 7H2.75ZM7 2.75C9.34721 2.75 11.25 4.65279 11.25 7H12.75C12.75 3.82436 10.1756 1.25 7 1.25V2.75ZM13.8637 12.803L11.0719 10.0113L10.0113 11.0719L12.803 13.8637L13.8637 12.803Z"
          fill="#808191"
        />
      </svg>
    </SvgIcon>
  );
}

export default PropertyListFilter;

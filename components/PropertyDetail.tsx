import { Avatar, 
  Box, 
  Button, 
  Chip, 
  Grid, 
  Stack, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert
 } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick"; 
import api, { agentImageURL, imageURL } from "utils/api";
import { ArrowRight, ArrowLeft } from "@mui/icons-material";
import { deletePost } from "lib/features/properties/propertiesSlices";
import { AppDispatch, RootState } from "lib/store";
import { useDispatch, useSelector } from "react-redux";

interface HostedBy{
    name: string;
    email:string;
    phone: number;
    imageUrl?: null;
}
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
    hostedBy: HostedBy[];
    createdAt: string;
  }
const PropertyDetail = () => {
  const router = useRouter();
  const { id } = router.query; 
  const sliderRef = useRef<any | null>(null);
  const [indexs,setIndexs] = useState(0)
  const [agent, setAgent] = useState<any>(null)
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch : AppDispatch = useDispatch()
  const  pricesConverter = new Intl.NumberFormat('ng-NG')

  const [post, setPost] = useState<Post | any | null>(null);

  useEffect(() => {
    const fetchPost = async() => {
        await api.get(`/Property/post/${id}`)
            .then((res) => res.data)
            .then((data) => {
                setPost(data.result)
            })
            .catch((err) => console.error("Error fetching property:", err));
            }
    fetchPost()
  }, [id]);

  useEffect(() =>{
    setAgent(post?.hostedBy)
  },[post])

  useEffect(()=>{
    window.document.title = `360PropertyNG - ${post?.name}`
  },[post])

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleDelete = () =>{
    dispatch(deletePost(post?._id))
    .unwrap()
    .then(()=>{
      setOpenDialog(false);
      router.push('/property');
    })
    .catch((err) => <Alert>{err.message}</Alert>);
}
  

  if (!post) return <Typography>Loading property details...</Typography>;

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange:(current: React.SetStateAction<number>,newPage: any)=>setIndexs(current),
    afterChange:(i: React.SetStateAction<number>)=>setIndexs(i),
  };

  return (
    <Stack spacing={4} sx={{ padding: "2rem 10px" }}>
      {/* Image Slider */}
      <Box sx={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
        <Button sx={{margin:"10px auto"}} variant="contained" onClick={()=>router.back()} >Back</Button>
        <Box style={{ width: '100%' }}>
          <Slider {...settings} ref={sliderRef}>
            {post?.photos?.map((photo: any, index: any) => (
              <img
                key={index}
                src={`${imageURL}/${id}/${photo.picture}`}
                alt={`Property image ${index + 1}`}
                width={1000}
                height={500}
                style={{ borderRadius: "8px", objectFit: "cover" }}
              />
            ))}
          </Slider>
        </Box>
        {/* Navigation Arrows */}
        <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem" }}>
          <Typography component={'span'}  onClick={() => sliderRef.current?.slickPrev()} 
          sx={{display:'flex', alignItems:'center', fontSize:'2em', color: "#fff", cursor: "pointer" }}>
          <ArrowLeft /> Previous
          </Typography>
          <Typography component={'span'} onClick={() => sliderRef.current?.slickNext()} 
          sx={{display:'flex', alignItems:'center', fontSize:'2em', color: "#fff", cursor: "pointer" }}>
            Next
          <ArrowRight /> 
          </Typography>
        </Box>
      </Box>
      <hr/>
      {/* Property Details */}
      <Box sx={{padding:'2rem'}}>
        <Typography variant="h4" fontWeight="bold">
          {post?.name}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          {post?.category} - {post?.type}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          <strong>Posted on:</strong> {new Date(post?.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {post?.city}, {post?.state}
        </Typography>
        <Typography variant="body1" mt={2}>
          {post?.desc}
        </Typography>
      </Box>
      <hr/>
      {/* Pricing and Availability */}
      <Box sx={{padding:'2rem'}}>
        <Typography variant="h5" fontWeight="bold">
          Price: &#8358;{pricesConverter.format( post?.price)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Negotiable: {post?.negotiable || "No"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Availability: {post?.availability || "Not specified"}
        </Typography>
      </Box>

      <hr/>
      {/* Property content */}
      <Grid container spacing={2} sx={{padding:'2rem'}}>
        {post?.beds && (
          <Grid item xs={6}>
            <Typography>Bedrooms: {post?.beds}</Typography>
          </Grid>
        )}
        {post?.bathrooms && (
          <Grid item xs={6}>
            <Typography>Bathrooms: {post?.bathrooms}</Typography>
          </Grid>
        )}
        {post?.toilets && (
          <Grid item xs={6}>
            <Typography>Toilets: {post?.toilets}</Typography>
          </Grid>
        )}
        {post?.rooms && (
          <Grid item xs={6}>
            <Typography>Rooms: {post?.rooms}</Typography>
          </Grid>
        )}
        {post?.shops && (
          <Grid item xs={6}>
            <Typography>Shops: {post?.shops}</Typography>
          </Grid>
        )}
      </Grid>

      <hr/>
      {/* Propety Features */}
      <Box sx={{padding:'2rem'}}>
        {post?.features && (
          <Box mt={2}>
            <Typography variant="h6" fontWeight="bold">
              Features
            </Typography>
            <Stack direction="row" mt={2} spacing={1} flexWrap="wrap">
              {post?.features.map((amenity: any, index: any) => (
                <Chip key={index} label={amenity} />
              ))}
            </Stack>
          </Box>
        )}
        {post?.amenities && (
          <Box mt={2}>
            <Typography variant="h6" fontWeight="bold">
              Amenities
            </Typography>
            <Stack direction="row" mt={2} spacing={1} flexWrap="wrap">
              {post?.amenities.map((amenity: any, index: any) => (
                <Chip key={index} label={amenity} />
              ))}
            </Stack>
          </Box>
        )}
        {post?.safety && (
          <Box mt={2}>
            <Typography variant="h6" fontWeight="bold">
            Safety
            </Typography>
            <Stack direction="row" mt={2} spacing={1} flexWrap="wrap">
              {post?.safety.map((amenity: any, index: any) => (
                <Chip key={index} label={amenity} />
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      <hr/>
      {/* Hosted By */}
      <Box sx={{ padding: '1rem' }}>
        <Typography variant="h2" paddingBottom={'0'} padding='1em' color="textSecondary">
          Agent Information
        </Typography>
        <Box
          padding="3em"
          paddingTop={'10px'}
          display="flex"
          alignItems="center"
        >
          <Box
            sx={{
              borderRadius: '8px',
              overflow: 'hidden',
              width: '100px', 
              height: '100px', 
              marginRight: '1.5rem',
            }}
          >
            {agent?.imageUrl.trim() !== "" ? (
              <img
                src={`${agentImageURL}/${agent?._id}/${agent?.imageUrl}`}
                width={100}
                height={200}
                alt="avat"
                style={{ objectFit: 'cover', height: '100%' }}
                />
            ) : (
              <Avatar alt='done' sx={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            )}
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              <strong>Hosted by:</strong> {agent?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Title:</strong> {agent?.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Email:</strong> {agent?.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Contact:</strong> {agent?.phone}
            </Typography>
          </Box>
        </Box>
      </Box>
      <hr/>
      <Box sx={{padding:'10px', margin:"20px auto"}}>
        <Button variant="contained" fullWidth color="error" onClick={() => setOpenDialog(true)} >Delete this post</Button>
      </Box>
       <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Property - {post?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this property? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="success">Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default PropertyDetail;

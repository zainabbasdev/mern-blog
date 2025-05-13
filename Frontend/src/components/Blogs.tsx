import {
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";

import BlogCard from "./BlogCard";
import useGetBlogs from "../hooks/useGetBlogs";

interface BlogsProps {
  endpoint: string;
}

const Blogs: React.FC<BlogsProps> = ({ endpoint }) => {
  const { isLoading, error, data: blogs } = useGetBlogs(endpoint);
  //  console.log(blogs);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CssBaseline />
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Typography variant="h6" color="error">
            Could not fetch data
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <CssBaseline />
      <Container>
        <Grid container spacing={3} padding={3}>
          {blogs?.map(blog => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <BlogCard blog={blog} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Blogs;

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  CssBaseline,
  Grid,
  Rating,
  Typography,
  IconButton,
  Popper,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

import useGetBlog from "../hooks/useGetBlog";
import { useStore } from "../hooks/useStore";
import Ratings from "./Ratings";
import Comment from "./Comment";
import useDeleteBlog from "../hooks/useDeleteBlog";
import { toast } from "react-toastify";

type RouteParams = {
  [key: string]: string | undefined;
};

const BlogPage = () => {
  const { id } = useParams<RouteParams>();
  const { token, userId, setBlog } = useStore();
  const navigate = useNavigate();

  const { isLoading, error, data: blog, refetch } = useGetBlog(id as string);
  const deleteEndpoint = `/blogs/${blog?._id}`;
  const mutation = useDeleteBlog(deleteEndpoint);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | (EventTarget & Element)>(
    null
  );

  const idd = anchorEl ? "simple-popper" : undefined;

  const handleOpenRatingDialog = () => {
    setOpen(true);
  };

  const handleCloseRatingDialog = () => {
    setOpen(false);
  };

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

  if (error || !id || !blog) {
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
            {error ? "Could not fetch data" : "Blog not found"}
          </Typography>
        </Box>
      </>
    );
  }

  const handleEdit = () => {
    setBlog(blog);
    const path = `/blogs/${id}/edit`;
    navigate(path);
  };

  const tryDelete = (event: React.MouseEvent) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      await mutation.mutateAsync();
      toast.success("Blog Deletion Successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      navigate("/");
    } catch (error) {
      toast.error("Error: Blog could not be deleted", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <CssBaseline />
      <Box padding={3} position="relative">
        <Card>
          <CardContent>
            <Typography variant="h3" align="center" marginY={5}>
              {blog.title}
            </Typography>
            {token && userId === blog.author.toString() && (
              <Box position="absolute" right={30} top={30}>
                <IconButton onClick={handleEdit}>
                  <Edit />
                </IconButton>
                <IconButton onClick={tryDelete}>
                  <Delete />
                </IconButton>
                <Popper id={idd} open={Boolean(anchorEl)} anchorEl={anchorEl}>
                  <Paper>
                    <Box p={2}>
                      <Typography>
                        Are you sure you want to delete this blog?
                      </Typography>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={handleDelete} color="secondary">
                        Delete
                      </Button>
                    </Box>
                  </Paper>
                </Popper>
              </Box>
            )}
            <Grid container justifyContent="space-between" spacing={2}>
              <Grid item>
                <Typography variant="subtitle1" color="text.secondary">
                  {`By ${blog.author.username}`}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  {`Published on ${new Date(
                    blog.createdAt
                  ).toLocaleDateString()}`}
                </Typography>

                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={1}
                  marginTop={1}
                  alignItems="center"
                >
                  <Typography variant="h6">Categories:</Typography>
                  {blog.categories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item>
                <Box
                  component="fieldset"
                  m={0}
                  p={0}
                  borderColor="transparent"
                  display="flex"
                  flexDirection="row"
                  gap={1}
                >
                  <Rating
                    name="read-only"
                    value={blog.averageRating}
                    precision={0.1}
                    readOnly
                  />
                  <Typography variant="subtitle1" color="text.secondary">
                    ({blog.ratings.length})
                  </Typography>
                </Box>
                <Box m={0} p={1}>
                  {token && (
                    <Button
                      variant="outlined"
                      onClick={handleOpenRatingDialog}
                      disabled={
                        blog.ratings.find(rating => rating.userId === userId)
                          ? true
                          : false
                      }
                    >
                      {blog.ratings.find(
                        rating => rating.userId.toString() === userId
                      )
                        ? "Already rated"
                        : "Rate blog"}
                    </Button>
                  )}
                  <Ratings
                    open={open}
                    handleClose={handleCloseRatingDialog}
                    endpoint={`/blogs/${blog._id}/rate`}
                    refetch={refetch}
                  />
                </Box>

                <Box display="flex" flexWrap="wrap" gap={1} marginTop={1}>
                  {blog.keywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={`#${keyword}`}
                      variant="filled"
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
            <hr />
            <Typography variant="h6" color="text.secondary">
              {blog.content}
            </Typography>
            <hr />
            <Typography variant="h6">Comments</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {blog.comments.length} comments
            </Typography>
            <Box>
              {token && (
                <Comment
                  endpoint={`/blogs/${blog._id}/comment`}
                  refetch={refetch}
                />
              )}
              {blog.comments.map((comment, index) => (
                <Card key={index} style={{ margin: "10px 0" }} elevation={3}>
                  <CardContent>
                    <Typography variant="h6">
                      {comment.userId.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {comment.comment}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default BlogPage;

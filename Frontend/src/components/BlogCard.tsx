import React from "react";
import { CssBaseline, Paper, Rating, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

import { Blog } from "../types";

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <Paper elevation={5} className="paper">
      <CssBaseline />
      {/* <img src={blog.image} alt="" className="img" /> */}
      <Box
        sx={{
          padding: 1,
        }}
      >
        <Typography variant="h4" component="h4" align="center">
          <Link
            to={`/blogs/${blog._id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            "{blog.title}"
          </Link>
        </Typography>
        <hr />
        <Typography variant="h6" component="h6">
          By {blog.author.username}
        </Typography>
        <Box
          component="fieldset"
          m={0}
          p={0}
          py={1}
          borderColor="transparent"
          display="flex"
          flexDirection="row"
          alignContent="center"
          gap={1}
        >
          <Rating
            size="small"
            defaultValue={blog.averageRating}
            precision={0.1}
            readOnly
          />
          <Typography variant="subtitle2" color="text.secondary">
            ({blog.ratings.length})
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default BlogCard;

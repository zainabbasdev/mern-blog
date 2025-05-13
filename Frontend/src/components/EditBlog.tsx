import React, { useState } from "react";
import { Box, TextField, Button, CssBaseline, Typography } from "@mui/material";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Blog } from "../types";
import { useStore } from "../hooks/useStore";
import useEditBlog from "../hooks/useEditBlog";

interface EditBlogProps {
  blog: Blog | null;
}

const EditBlog: React.FC<EditBlogProps> = ({ blog }) => {
  const navigate = useNavigate();
  const { token, setBlog } = useStore();

  const [title, setTitle] = useState(blog?.title);
  const [categories, setCategories] = useState(blog?.categories.join(","));
  const [keywords, setKeywords] = useState(blog?.keywords.join(","));
  const [content, setContent] = useState(blog?.content);

  const endpoint = `/blogs/${blog?._id}`;
  const mutation = useEditBlog(endpoint);

  const checkData = async (data: FieldValues) => {
    try {
      const modifiedData = {
        ...data,
        categories: data.categories
          .split(",")
          .map((item: string) => item.trim()),
        keywords: data.keywords.split(",").map((item: string) => item.trim()),
      };
      await mutation.mutateAsync(modifiedData);

      toast.success("Blog Edited Successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      toast.error("Error: Blog could not be edited", {
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

    setBlog(null);
    navigate("/");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await checkData({
      title,
      categories,
      keywords,
      content,
    });
  };

  if (!blog) {
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
            Blog not found
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <CssBaseline />
      <Box
        component="form"
        p={3}
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: {
            xs: "90%", // 90% on mobile devices
            sm: "80%", // 80% on tablets
            md: "60%", // 60% on desktops
          },
        }}
        mx="auto"
        alignItems="center"
      >
        <TextField
          variant="outlined"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <TextField
          variant="outlined"
          fullWidth
          id="categories"
          label="Categories"
          name="categories"
          value={categories}
          onChange={e => setCategories(e.target.value)}
          helperText="Enter categories, separated by commas"
        />

        <TextField
          variant="outlined"
          fullWidth
          id="keywords"
          label="Keywords"
          name="keywords"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          helperText="Enter keywords, separated by commas"
        />
        <TextField
          variant="outlined"
          required
          fullWidth
          multiline
          rows={4}
          id="content"
          label="Content"
          name="content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={token ? false : true}
        >
          Edit Blog
        </Button>
      </Box>
    </>
  );
};

export default EditBlog;

//   const navigate = useNavigate();
//   const { token } = useStore();

//   const [title, setTitle] = useState("");
//   const [categories, setCategories] = useState("");
//   const [keywords, setKeywords] = useState("");
//   const [content, setContent] = useState("");

//   const mutation = useCreateBlog();

//   const checkData = async (data: FieldValues) => {
//     try {
//       await mutation.mutateAsync(data);

//       toast.success("Blog Creation Successful", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//       });

//       navigate("/");
//     } catch (error) {
//       toast.error("Error: Please try again", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//       });
//     }
//   };
//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     await checkData({
//       title,
//       categories,
//       keywords,
//       content,
//     });
//     setTitle("");
//     setCategories("");
//     setKeywords("");
//     setContent("");
//   };

//   return (
//     <>
//       <CssBaseline />
//       <Box
//         component="form"
//         p={3}
//         onSubmit={handleSubmit}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "1rem",
//           width: {
//             xs: "90%", // 90% on mobile devices
//             sm: "80%", // 80% on tablets
//             md: "60%", // 60% on desktops
//           },
//         }}
//         mx="auto"
//         alignItems="center"
//       >
//         <TextField
//           variant="outlined"
//           required
//           fullWidth
//           id="title"
//           label="Title"
//           name="title"
//           value={title}
//           onChange={e => setTitle(e.target.value)}
//         />
//         <TextField
//           variant="outlined"
//           fullWidth
//           id="categories"
//           label="Categories"
//           name="categories"
//           value={categories}
//           onChange={e => setCategories(e.target.value)}
//           helperText="Enter categories, separated by commas"
//         />

//         <TextField
//           variant="outlined"
//           fullWidth
//           id="keywords"
//           label="Keywords"
//           name="keywords"
//           value={keywords}
//           onChange={e => setKeywords(e.target.value)}
//           helperText="Enter keywords, separated by commas"
//         />
//         <TextField
//           variant="outlined"
//           required
//           fullWidth
//           multiline
//           rows={4}
//           id="content"
//           label="Content"
//           name="content"
//           value={content}
//           onChange={e => setContent(e.target.value)}
//         />
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           disabled={token ? false : true}
//         >
//           Create Blog
//         </Button>
//       </Box>
//     </>
//   );
// };

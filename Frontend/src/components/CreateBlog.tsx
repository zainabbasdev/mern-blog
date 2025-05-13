import { Box, TextField, Button, CssBaseline } from "@mui/material";
import { useState } from "react";
import { useStore } from "../hooks/useStore";
import useCreateBlog from "../hooks/useCreateBlog";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { token } = useStore();

  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState("");
  const [keywords, setKeywords] = useState("");
  const [content, setContent] = useState("");

  const mutation = useCreateBlog();

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

      toast.success("Blog Creation Successful", {
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
      toast.error("Error: Please try again", {
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
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await checkData({
      title,
      categories,
      keywords,
      content,
    });
    setTitle("");
    setCategories("");
    setKeywords("");
    setContent("");
  };

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
          Create Blog
        </Button>
      </Box>
    </>
  );
};

export default CreateBlog;

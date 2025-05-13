import React, { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Blog } from "../types";
import useComment from "../hooks/useComment";
import { toast } from "react-toastify";

interface CommentProps {
  endpoint: string;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Blog, Error>>;
}
const Comment: React.FC<CommentProps> = ({ refetch, endpoint }) => {
  const [comment, setComment] = useState("");

  const mutation = useComment(endpoint);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await mutation.mutateAsync(comment);
      toast.success("Ratings Added", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setComment("");
      refetch();
    } catch {
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

  return (
    <form onSubmit={handleSubmit}>
      <Card style={{ margin: "10px 0" }} elevation={3}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            You
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Box flexGrow={11}>
              <TextField
                variant="outlined"
                margin="none"
                required
                fullWidth
                id="comment"
                label="Comment"
                name="comment"
                autoComplete="comment"
                autoFocus
                value={comment}
                onChange={handleChange}
              />
            </Box>
            <Box flexGrow={1}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ minHeight: "56px" }} // Adjust this value as needed
                disabled={mutation.isPending || comment === ""}
              >
                <ArrowForwardIosIcon />
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};

export default Comment;

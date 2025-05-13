import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

import useRatings from "../hooks/useRatings";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Blog } from "../types";

interface RatingsProps {
  open: boolean;
  handleClose: () => void;
  endpoint: string;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Blog, Error>>;
}

const Ratings: React.FC<RatingsProps> = ({
  open,
  handleClose,
  endpoint,
  refetch,
}) => {
  const [rating, setRating] = useState(0);

  const mutation = useRatings(endpoint);

  const handleRatingChange = async (rating: number) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await mutation.mutateAsync(rating);

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

  const handleRating = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number | null
  ) => {
    event.preventDefault();
    if (newValue) setRating(newValue);
  };

  const handleSubmit = () => {
    handleRatingChange(rating);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Rate this blog</DialogTitle>
      <DialogContent>
        <Rating
          name="blog-rating"
          value={rating}
          precision={1}
          onChange={handleRating}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Ratings;

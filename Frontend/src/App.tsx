import { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Blogs from "./components/Blogs";
import { useStore } from "./hooks/useStore";
import BlogPage from "./components/BlogPage";
import CreateBlog from "./components/CreateBlog";
import EditBlog from "./components/EditBlog";
import Navbar from "./components/Navbar";

function App() {
  const setToken = useStore(state => state.setToken);
  const setUserId = useStore(state => state.setUserId);
  const { token, blog } = useStore();

  const NavbarWrapper = () => {
    return (
      <div>
        <Navbar />
        <Outlet />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <NavbarWrapper />,
      children: [
        {
          path: "/",
          element: token ? <Navigate to="/feed" /> : <Navigate to="/blogs" />,
        },
        {
          path: "/feed",
          element: <Blogs endpoint="users/:id/feed" />,
          // children: [],
        },
        {
          path: "/blogs",
          element: <Blogs endpoint="blogs/" />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "blogs/:id",
          element: <BlogPage />,
        },
        {
          path: "blogs/new",
          element: <CreateBlog />,
        },
        {
          path: "blogs/:id/edit",
          element: <EditBlog blog={blog} />,
        },
      ],
    },
  ]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    if (token) {
      setToken(token);
    }
    if (userId) {
      setUserId(userId);
    }
  }, []);

  return (
    <>
      <RouterProvider
        router={router}
        // fallbackElement={<LandingPage />}
      />
    </>
  );
}

export default App;

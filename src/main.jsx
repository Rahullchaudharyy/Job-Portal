import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home.jsx";
import Profile from "./Components/Profile.jsx";
import { Provider } from "react-redux";
import store from "./utils/store";
import Auth from './Components/Auth.jsx'
import Jobs from "./Components/Jobs.jsx";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/main",
    element: <App />,
  },
  {
     path:'/jobs/:id',
     element:<Jobs/>
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={Router}>
      <App />
    </RouterProvider>
  </Provider>
);

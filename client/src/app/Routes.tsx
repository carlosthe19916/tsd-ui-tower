import { createBrowserRouter } from "react-router-dom";

export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    lazy: async () => {
      const { default: Component } = await import("@app/App");
      return { Component };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } =
            await import("@app/pages/pull-request-list");
          return { Component };
        },
      },
    ],
  },
]);

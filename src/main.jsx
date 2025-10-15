import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={"loading"}>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              className: "",
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 4000,
                theme: {
                  primary: "green",
                  secondary: "black",
                },
              },
            }}
          />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </ErrorBoundary>
);

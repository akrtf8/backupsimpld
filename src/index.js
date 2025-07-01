// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; 
import store from "./reducers/store";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./contexts/user-context";
import ErrorBoundary from "./utils/errorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          {" "}
          {/* Wrap with Provider */}
          <UserProvider>
            <App />
          </UserProvider>
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  </ErrorBoundary>
);

reportWebVitals();

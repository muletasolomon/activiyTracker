import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ProgressSpinner } from "primereact/progressspinner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import { TaskActivityReport } from "./components/report/TaskActivityReport";
import { TaskList } from "./components/task/TaskList";
import "./index.css";

import store, { persistor } from "./store/store";
import Auth from "./components/Auth";
import { CostCodeReport } from "./components/report/CostCodeReport";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<ProgressSpinner />} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth/>}/>
            <Route path="/Home" element={<App />} />
            <Route
              path="Home/activityReport/:modelId"
              element={<TaskActivityReport />}
            />
            <Route
              path="Home/costCodeReport/"
              element={<CostCodeReport />}
            />
            <Route path="taskList/:modelId" element={<TaskList />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

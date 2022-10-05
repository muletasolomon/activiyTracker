import React from "react";
// import ReactDOM from "react-dom/client";
import ReactDOM from 'react-dom';

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
import { CostBudgetReport } from "./components/report/summaryReport/CostBudgetReport";
import { CostSummaryReport } from "./components/report/summaryReport/CostSummaryReport";
import { EarnedValueReport } from "./components/report/summaryReport/EarnedValueReport";
import { PerformanceSummaryReport } from "./components/report/summaryReport/PerformanceSummaryReport";

ReactDOM.render(
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
            path="Home/costBudgetReport/"
            element={<CostBudgetReport  
              title={"Budget Report"}
            searchFilter = {{}} />}
          />
          <Route
            path="Home/costSummaryReport/"
            element={<CostSummaryReport  
              title={"Cost Summary Report"}
                costCodes = {{}} />}
          />
          <Route
            path="Home/EarnedValue/"
            element={<EarnedValueReport  
              title={"Earned Value Report"}
              costCodes = {{}} />}
          />
          <Route
            path="Home/performanceSummary/"
            element={<PerformanceSummaryReport  
              title={"Performance Summary Report"}
               costCodes = {{}} />}
          />
          <Route path="taskList/:modelId" element={<TaskList />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
</React.StrictMode>,
 document.getElementById('root')
)

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <PersistGate loading={<ProgressSpinner />} persistor={persistor}>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Auth/>}/>
//             <Route path="/Home" element={<App />} />
//             <Route
//               path="Home/activityReport/:modelId"
//               element={<TaskActivityReport />}
//             />
//             <Route
//               path="Home/costCodeReport/"
//               element={<CostCodeReport />}
//             />
//             <Route path="taskList/:modelId" element={<TaskList />} />
//           </Routes>
//         </BrowserRouter>
//       </PersistGate>
//     </Provider>
//   </React.StrictMode>
// );

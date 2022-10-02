import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MaterialCostView } from "./activityCostView/MaterialCostView";
import { Chart } from "primereact/chart";
import { useAppSelector } from "../../store/store";
import { Button } from "primereact/button";
import { EquipmentCostView } from "./activityCostView/EquipmentCostView";
import { BudgetReport } from "../task/activity/budget/BudgetReport";
import { TaskActivityModel } from "../../model/TaskActivityModel";
import { SubContractView } from "./activityCostView/SubContractView";
import { LaborCostView } from "./activityCostView/LaborCostView";
import { CostBudgetReport } from "./summaryReport/CostBudgetReport";
import { CostSummaryReport } from "./summaryReport/CostSummaryReport";
import { EarnedValueReport } from "./summaryReport/EarnedValueReport";
import { PerformanceSummaryReport } from "./summaryReport/PerformanceSummaryReport";

export const CostCodeReport = () => {
  const params = useParams();

  const [title, setTitle] = useState("");
  const [queryParams, setQueryParams] = useSearchParams();

  const [taskChartData, setTaskChartData] = useState({});

  const [isParent, setIsParent] = useState(false);

  const [selectedTask, setSelectedTask] = useState<TaskActivityModel>();

  const [equipmentCostTotal, setequipmentCostTotal] = useState<number>(0);
  const [materialCostTotal, setmaterialCostTotal] = useState<number>(0);
  const [laborCostTotal, setlabortCostTotal] = useState<number>(0);
  const [subContractTotal, setSubContractTotal] = useState<number>(0);

  const [materialCost,setMaterialCost] = useState();
  const [equpimentCost,setEqupimentCost] = useState();
  const [laborCosts,setLaborCosts] = useState();
  const [subContractCosts,setSubContractCosts] = useState();
  const taskActivities: TaskActivityModel[] = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );

  const [lightOptions] = useState({
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
  });

  const workList = () =>{
    console.log("ty");
    
    return fetch("http://196.189.53.130:20998/testApi/rest/subactivities/getSubActivityDetail?subActivityId="+params.modelId,{
        
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        mode: 'cors'
      }).then((response) => {
        return response.json();                
    }).then(data => {
        console.log(data);
        var material = 0;
        setmaterialCostTotal(data.totalMaterialCost);
        setlabortCostTotal(data.totalLaborCostPerDay);
        setequipmentCostTotal(data.totalEquipmentCostPerDay);
        setSubContractTotal(data.subContractCost);
        console.log(materialCostTotal)
        //setMaterialCost(material)
        setMaterialCost(data.materialCosts);
        setEqupimentCost(data.equipmentCosts);
        setLaborCosts(data.laborCosts);
        setSubContractCosts(data.subContractCosts);
        setSelectedTask(true)
    }).catch(error => {
        console.log(error);
    });
   // const data = await res.json();
    //console.log(data);
}

  useEffect(() => {
    setTitle(queryParams.get("name") || "");
  }, [queryParams]);

  
    
  console.log(taskChartData)

  return (
    <>
      <div className="w-screen w-screen">
        <div className="m-4 p-4">
          <p className="text-2xl text-800 font-bold my-4">Report For {title}</p>
          {/* <Divider /> */}
          <div className="grid">
            <div className="col-7">
              <Divider />
              <CostBudgetReport
                title={"Budget Report"}
                costCode = {materialCost}
              />
              <Divider />
              <CostSummaryReport
                title={"Cost Summary Report"}
                costCode = {materialCost}
              />
              <Divider />
              <EarnedValueReport
                 title={"Earned Value Report"}
                 costCode = {materialCost}
              />

              <PerformanceSummaryReport
               title={"Performance Summary Report"}
               costCode = {materialCost}
              />
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
};

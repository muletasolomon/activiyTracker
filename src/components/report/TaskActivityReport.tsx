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

export const TaskActivityReport = () => {
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
        // setSelectedTask(true)
    }).catch(error => {
        console.log(error);
    });
   // const data = await res.json();
    //console.log(data);
}

  useEffect(() => {
    setTitle(queryParams.get("name") || "");
  }, [queryParams]);

  useEffect(() => {
    workList();
    const selectedTask = taskActivities.find(
      (task) => task.modelId == +params.modelId
    );

    setSelectedTask(selectedTask);

    const isParentTask = selectedTask ? !selectedTask.isActivity : false;
    setIsParent(selectedTask ? !selectedTask.isActivity : false);

   

    setequipmentCostTotal(equipmentCostTotal ? equipmentCostTotal : 0);
    setmaterialCostTotal(materialCostTotal ? materialCostTotal : 0);
    setlabortCostTotal(laborCostTotal ? laborCostTotal : 0);
    setSubContractTotal(subContractTotal ? subContractTotal : 0);

    setTaskChartData({
      labels: ["Equipment Cost", "Material Cost", "Labor Cost","Sub-Contract Cost"],
      datasets: [
        {
          data: [equipmentCostTotal, materialCostTotal, laborCostTotal,subContractTotal],
          backgroundColor: ["#AF4384", "#36A2EB", "#FFCE56","#EFEFEF"],
          hoverBackgroundColor: ["#AF4384", "#36A2EB", "#FFCE56","E6E6E6"],
        },
      ],
    });
  }, [taskActivities]);
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
              <MaterialCostView
                isMaterial={true}
                title={"Material Cost Breakdown"}
                modalTitle={"Add Material Cost"}
                modelId={params.modelId}
                material = {materialCost}
                materialTotal = {materialCostTotal}
              />
              <Divider />
              <EquipmentCostView
                modelId={params.modelId}
                cost={equipmentCostTotal}
                equipmentCost = {equpimentCost}
              />
              <Divider />
              <LaborCostView
                isMaterial={false}
                title={"Labor Cost Breakdown"}
                modalTitle={"Add Labor Cost"}
                modelId={params.modelId}
                material = {laborCosts}
                total = {laborCostTotal}
              />

              <SubContractView
                modelId={params.modelId}
                cost={subContractTotal}
                subContaract = {subContractCosts}
              />
            </div>

            <div className="col-5 flex flex-column align-items-center justify-content-center">
              {taskChartData && (
                <>
                  <Chart
                    type="doughnut"
                    data={taskChartData}
                    options={lightOptions}
                    className="align-self-center "
                    style={{ width: "40%" }}
                  />

                  {selectedTask && (
                    <BudgetReport
                      modelId={params.modelId}
                      isParent={!selectedTask.isActivity}
                      LaborCost={laborCostTotal}
                      equipmentCost={equipmentCostTotal}
                      materialCost={materialCostTotal}
                      subContract={subContractTotal}
                    />
                  )}

                  <Button
                    icon="pi pi-print"
                    label="Export Task Report"
                    className="p-button-outlined p-button-secondary mt-8"
                    onClick={() => window.print()}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

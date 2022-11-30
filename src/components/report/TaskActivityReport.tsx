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
import {FormControl, Grid, TextField} from "@mui/material";
import {DefaultBtn} from "../form/DefaultBtn";
import { AddExcutedTask } from "../task/AddExcutedTask";

export const TaskActivityReport = () => {
  const params = useParams();
  console.log('params', params)
  const [title, setTitle] = useState("");
  const [queryParams, setQueryParams] = useSearchParams();
  const [projectBudjet,setProjectBudjet] = useState();
    const [excutedCost,setExcutedCost] = useState();

  const [taskChartData, setTaskChartData] = useState({});

  const [isParent, setIsParent] = useState(false);

  const [selectedTask, setSelectedTask] = useState<TaskActivityModel>();
  const [selectReport, setSelectReport] = useState(false);

  const [equipmentCostTotal, setequipmentCostTotal] = useState<number>(0);
  const [materialCostTotal, setmaterialCostTotal] = useState<number>(0);
  const [laborCostTotal, setlabortCostTotal] = useState<number>(0);
  const [subContractTotal, setSubContractTotal] = useState<number>(0);

  const [totalExcuted, setTotalExcuted] = useState<number>(0);

  const [materialCost,setMaterialCost] = useState();
  const [equpimentCost,setEqupimentCost] = useState();
  const [laborCosts,setLaborCosts] = useState();
  const [subContractCosts,setSubContractCosts] = useState();
  const taskActivities: TaskActivityModel[] = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );
  const [addExcuted, setAddExcuted] = useState(false);
  const [taskParentNode, setTaskParentNode] = useState(0);
  const [keys, setKeys] = useState([]);

  const toggleModalExcuted = () => {
    setAddExcuted(!addExcuted);
    workList()
  };


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
    console.log("ty" + searchForm.startDate+" "+searchForm.endDate);
    const request = {
      id:params.modelId,
      startDate:startDate+"T07:02:57.856Z",
      endDate:endDate+"T07:02:57.856Z"
    }
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
      setTotalExcuted(data.executeQuantity);
        setProjectBudjet(data.subActivity.projectBudjet)
      console.log(materialCostTotal)
        //setMaterialCost(material)
        setMaterialCost(data.materialCosts);
        setEqupimentCost(data.equipmentCosts);
        setLaborCosts(data.laborCosts);
        setSubContractCosts(data.subContractCosts);
        setExcutedCost(data.executeQuantity)
      setTaskChartData({
        labels: ["Equipment Cost", "Material Cost", "Labor Cost","Sub-Contract Cost"],
        datasets: [
          {
            data: [data.totalEquipmentCostPerDay, data.totalMaterialCost, data.totalLaborCostPerDay,data.subContractCost],
            backgroundColor: ["#AF4384", "#36A2EB", "#FFCE56","#EFEFEF"],
            hoverBackgroundColor: ["#AF4384", "#36A2EB", "#FFCE56","E6E6E6"],
          },
        ],
      });

        setSelectReport(true);
    }).catch(error => {
        console.log(error);
    });
   // const data = await res.json();
    //console.log(data);
}
  const workListSearch = () =>{
    console.log("ty" + searchForm.startDate+" "+searchForm.endDate);
    const request = {
      id:params.modelId,
      date:searchForm.endDate+"T07:02:57.856Z",
    }
    return fetch("http://196.189.53.130:20998/testApi/rest/subactivities/getSubActivityDetailByDate",{

      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body:JSON.stringify(request)
    }).then((response) => {
      return response.json();
    }).then(data => {
      console.log(data);
      var material = 0;
      setmaterialCostTotal(data.totalMaterialCost);
      setlabortCostTotal(data.totalLaborCostPerDay);
      setequipmentCostTotal(data.totalEquipmentCostPerDay);
      setSubContractTotal(data.subContractCost);
      setTotalExcuted(data.executeQuantity);
        setProjectBudjet(data.subActivity.projectBudjet)

        console.log(materialCostTotal)
      //setMaterialCost(material)
      setMaterialCost(data.materialCosts);
      setEqupimentCost(data.equipmentCosts);
      setLaborCosts(data.laborCosts);
        setExcutedCost(data.executeQuantity)
        setSubContractCosts(data.subContractCosts);
      setTaskChartData({
        labels: ["Equipment Cost", "Material Cost", "Labor Cost","Sub-Contract Cost"],
        datasets: [
          {
            data: [data.totalEquipmentCostPerDay, data.totalMaterialCost, data.totalLaborCostPerDay,data.subContractCost],
            backgroundColor: ["#AF4384", "#36A2EB", "#FFCE56","#EFEFEF"],
            hoverBackgroundColor: ["#AF4384", "#36A2EB", "#FFCE56","E6E6E6"],
          },
        ],
      });
      // setSelectedTask(true);

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
    const selectedTask = taskActivities.find(
      (task) => task.modelId == +params.modelId
    );
    console.log("anteneh"+selectedTask)

    setSelectedTask(selectedTask);

    const isParentTask = selectedTask ? !selectedTask.isActivity : false;
    setIsParent(selectedTask ? !selectedTask.isActivity : false);

   

    setequipmentCostTotal(equipmentCostTotal ? equipmentCostTotal : 0);
    setmaterialCostTotal(materialCostTotal ? materialCostTotal : 0);
    setlabortCostTotal(laborCostTotal ? laborCostTotal : 0);
    setSubContractTotal(subContractTotal ? subContractTotal : 0);
    workList();

    // setTaskChartData({
    //   labels: ["Equipment Cost", "Material Cost", "Labor Cost","Sub-Contract Cost"],
    //   datasets: [
    //     {
    //       data: [equipmentCostTotal, materialCostTotal, laborCostTotal,subContractTotal],
    //       backgroundColor: ["#AF4384", "#36A2EB", "#FFCE56","#EFEFEF"],
    //       hoverBackgroundColor: ["#AF4384", "#36A2EB", "#FFCE56","E6E6E6"],
    //     },
    //   ],
    // });
  }, [taskActivities]);
  console.log(taskChartData)
  const [searchForm, setForm] = React.useState({
    searchParameter: "",
    driverStatus: 0,
    startDate: "",
    endDate: ""
  });
  const { startDate, endDate } = searchForm;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...searchForm, [name]: value });
  };
    console.log("+++++++++++++++++++"+JSON.stringify(queryParams));


    return (
    <>
      <div className="w-screen w-screen">
        <div className="m-4 p-4">

          <p className="text-2xl text-800 font-bold my-4">Report For {title}</p>
            <p className="text-2xl text-500  my-4">total budget {projectBudjet}</p>
            <p className="text-2xl text-500  my-4">Excuted Quantity {excutedCost}</p>

            {/* <Divider /> */}
          <div className="flex fl justify-content">

          <Grid item xs="auto" className="form-control-aligment">
            <FormControl>
              <TextField
                  id="date"
                  label="End Date"
                  type="date"
                  value={endDate}
                  name="endDate"
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
              />
            </FormControl>
          </Grid>
            <DefaultBtn name={"Filter"} callBack={workListSearch} style={"form-control-aligment"} />


        </div>
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

                  {selectReport && (
                    <BudgetReport
                      modelId={params.modelId}
                      isParent={true}
                      LaborCost={laborCostTotal}
                      equipmentCost={equipmentCostTotal}
                      materialCost={materialCostTotal}
                      subContract={subContractTotal}
                      totalExcuted={totalExcuted}
                    />
                  )}

                  <Button
                    icon= "pi pi-chart-pie"
                    label="Executed Quntity"
                    className="p-button-outlined p-button-secondary mt-8"
                    onClick={toggleModalExcuted}
                  />
                  <Button
                    icon="pi pi-print"
                    label="Export Task Report"
                    className="p-button-outlined p-button-secondary mt-8"
                    onClick={() => window.print()}
                  />
                </>
              )}
              {addExcuted && (
            <AddExcutedTask
              onHide={toggleModalExcuted}
              visible={addExcuted}
              isActivity={true}
              activityId={taskParentNode}
              taskParentId={params.modelId}
              keys={keys}
            />
          )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

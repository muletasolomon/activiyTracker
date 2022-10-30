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
import { FormInput } from "../form/FormInput";
import { DefaultBtn } from "../form/DefaultBtn";
import {
  TextField,
  Grid,
  FormControl
} from "@mui/material"; 

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
  const [costCode, setCostCode] = useState();
  const [searchKey, setSearchKey] = useState();
  const [ keyFilter,setKeyFilter] = useState({});
  const [show,isShow] = useState(false);
  const [searchForm, setForm] = React.useState({
    searchParameter: "",
    driverStatus: 0,
    startDate: "",
    endDate: "",
    start: null,
    end: null,
  });
  const { startDate, endDate } = searchForm;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...searchForm, [name]: value });
    console.log(searchForm);
  };


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
    
    return fetch("http://172.16.0.56:8080/testApi/rest/subactivities/getSubActivityDetail?subActivityId="+params.modelId,{
        
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

  
    
  console.log(taskChartData)

  const addMaterialCostCallBack = () => {
    console.log(searchKey+" "+costCode+" "+searchForm.startDate+" "+searchForm.endDate)
    setKeyFilter({searchKey:searchKey,costCode:costCode,startDate:startDate,endDate:endDate})
    if(!show){
     isShow(true)
    }else{
      isShow(false)
      addMaterialCostCallBack();
    }
  }

  return (
    <>
      <div className="w-screen w-screen">
        <div className="m-4 p-4">
        <div className="flex fl justify-content">
          <FormInput
            defaultValue={""}
            labelName={"Search"}
            onUpdate={(val) => setSearchKey(val)}
          />
          <FormInput
            defaultValue={""}
            labelName={"Cost code"}
            onUpdate={(val) => setCostCode(val)}
          />

          <Grid item xs="auto" className="form-control-aligment">
            <FormControl>
              <TextField
                id="date"
                label="Start Date"
                type="date"
                value={startDate}
                name="startDate"
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>
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


        </div>
        <DefaultBtn name={"Filter"} callBack={addMaterialCostCallBack} style={"form-control-aligment"} />

          <p className="text-2xl text-800 font-bold my-4">Report For {title}</p>
          {/* <Divider /> */}
          <div className="grid">
          {(show &&(<div className="col-7">
              
              <Divider />
              <CostBudgetReport
                title={"Budget Report"}
                searchFilter = {keyFilter}
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
            </div>))}
            

            
          </div>
        </div>
      </div>
    </>
  );
};

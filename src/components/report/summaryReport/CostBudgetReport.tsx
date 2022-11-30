import { FormControl, Grid, TextField } from "@mui/material";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { LaborCost, MaterialCost } from "../../../model/TaskActivityModel";
import {
  removeLaborCost,
  removeMaterialCost,
} from "../../../store/features/taskActivitySlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { DefaultBtn } from "../../form/DefaultBtn";
import { FormInput } from "../../form/FormInput";
import { AddMaterialCost } from "../../task/activity/AddMaterialCost";
import {FormDropDown} from "../../FormDropDown";
import {useLocation} from "react-router-dom";
import { useFetchProjectList } from "../../../api/ApiClient";

export const CostBudgetReport = ({
  title,
  searchFilter
}) => {
  const [modalToggle, setModalToggle] = useState(false);


  const [bugetReport, setBugetReport] = useState();
  const [searchKey, setSearchKey] = useState();
  const [ keyFilter,setKeyFilter] = useState({});
  const [costCode, setCostCode] = useState();
  const [projectId, setProjectId] = useState<number>();
  const [show,isShow] = useState(false);
  const { projects } = useFetchProjectList();
  const toast = useRef();

  const dispatch = useAppDispatch();

  const taskActivities = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );
    const location = useLocation();

  const [isParent, setIsParent] = useState(false);
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


  useEffect(() => {
    let materialList: MaterialCost[] = [];
    let laborCostList: LaborCost[] = [];
    workList();
  }, [taskActivities]); 

  const addCostBudgetReport = () => {
    console.log(searchKey+" "+costCode+" "+searchForm.startDate+" "+searchForm.endDate)
    setKeyFilter({searchKey:searchKey,costCode:costCode,startDate:startDate,endDate:endDate})
    isShow(true);
    workList();
  }

  console.log('projects', projects)

  const workList = () =>{
    console.log("+++++++++++"+JSON.stringify(searchFilter));
    let dataSample = []
    const request = {
      costCode:costCode,
      startDate:startDate+"T07:02:57.856Z",
      endDate:endDate+"T07:02:57.856Z",
      searchParam:searchKey,
      projectId: projectId
    }
    let data = async()=>await fetch("http://196.189.53.130:20998/testApi/rest/Report/budgetReport",{
        
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        mode: 'cors',
        body:JSON.stringify(request)
      }).then((response) => {
        return response.json();                
    }).then(pro => {
        console.log(pro);
        //setProjectsActivity(data);
        setBugetReport(pro )
        console.log(bugetReport)

        //console.log(dataList)
        //setTree(data)
        return data
    
    }).catch(error => {
        console.log(error);
    });
    data();

   // const data = await res.json();
    //console.log(data);
}

  const toggleModal = () => {
    setModalToggle(!modalToggle);
  };

  const AddMaterialCostOnClick = () => {
    toggleModal();
  };

  const removeAction = (data) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-outlined p-button-sm p-button-danger"
        onClick={() => {
         
        }}
      />
    );
  };

  return (
    <div className="w-screen w-screen">
        <div className="m-4 p-4">
        <div className="flex fl justify-content">
            <FormInput
              defaultValue={""}
              labelName={"Search"}
              onUpdate={(val) => setSearchKey(val)}
            />
            {/*<FormInput*/}
              {/*defaultValue={""}*/}
              {/*labelName={"Cost code"}*/}
              {/*onUpdate={(val) => setCostCode(val)}*/}
            {/*/>*/}

            <FormDropDown
                defaultValue={""}
                onUpdate={(val)=>setCostCode(val.id)}
                label={"Cost Code"}
                options={location.state.codes}
                customClass={"my-2"}
            />

          <div className="ml-4 mr-10 flex w-64">
            <select value={projectId} onChange={(e)=>setProjectId(parseInt(e.target.value,10))} defaultValue={projectId} name={'projectId'}  className="w-full text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none ml-4 focus:border-primary mr-7 w-full" id="project">
              <option value={''}>Select project</option>
               {projects.map(project=> <option value={project.id}>{project.name}</option>)}
            </select>
            </div>

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
          <DefaultBtn name={"Filter"} callBack={addCostBudgetReport} style={"form-control-aligment"} />

        </div>
        <div className="flex flex-column justify-content-center">
          {(show &&(<div className="col m-4">
                <p className="font-bold text-lg">{title}</p>
            <Toast ref={toast} />

            <DataTable value={bugetReport}>
              <Column header="Budgeted Quatity ToDateBQ" field="budgetedQuatityToDateBQ" />
              <Column header="Executed AmountAQ" field="executedAmountAQ" />
              <Column header="Labor CostLC" field="laborCostLC" />
              <Column header="Material CostMC" field="materialCostMC" />
              <Column header="Equipment CostEC" field="equipmentCostEC" />
              <Column header="Subcontract CostSC" field="subcontractCostSC" />
              <Column header="Total Direct CostDC" field="totalDirectCostDC" />
              <Column header="Total Cost To DateTC" field="totalCostToDateTC" />
              <Column header="Actual Unit CostAUC" field="actualUnitCostAUC" />

              <Column header="Action" body={removeAction} />
            </DataTable>
        </div>))}
        </div>
      
     
    </div>
  );
};

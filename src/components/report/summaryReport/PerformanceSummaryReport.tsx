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

export const PerformanceSummaryReport = ({
  title,
  costCodes
}) => {
  const [modalToggle, setModalToggle] = useState(false);


  const [bugetReport, setBugetReport] = useState();
  const [laborCostTotal, setLaborCostTotal] = useState<number>(0);

  const toast = useRef();

  const dispatch = useAppDispatch();

  const taskActivities = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );

  const [searchKey, setSearchKey] = useState();
  const [ keyFilter,setKeyFilter] = useState({});
  const [costCode, setCostCode] = useState();
  const [show,isShow] = useState(false);
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

  const workList = () =>{
    console.log("ty");
    let dataSample = []
    const request = {
      costCode:costCode,
      startDate:startDate+"T07:02:57.856Z",
      endDate:endDate+"T07:02:57.856Z",
      searchParam:searchKey
    }
    let data = async()=>await fetch("http://196.189.53.130:20998/testApi/rest/Report/performanceSummaryReportOut",{
        
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

  const addCostBudgetReport = () => {
    console.log(searchKey+" "+costCode+" "+searchForm.startDate+" "+searchForm.endDate)
    setKeyFilter({searchKey:searchKey,costCode:costCode,startDate:startDate,endDate:endDate})
    isShow(true);
    workList();
  }

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
          <DefaultBtn name={"Filter"} callBack={addCostBudgetReport} style={"form-control-aligment"} />

        </div>
        <div className="flex flex-column justify-content-center">
          {(show &&(<div className="col m-4">
                <p className="font-bold text-lg">{title}</p>
            <Toast ref={toast} />

            <DataTable value={bugetReport}>
              <Column header="Budgeted Quatity ToDateBQ" field="budgetedQuatityToDateBQ" />
              <Column header="Executed AmountAQ" field="executedAmountAQ" />
              <Column header="Quantity To CompleteQC" field="quantityToCompleteQC" />
              <Column header="Budgeted Cost ToDateBC" field="budgetedCostToDateBC" />
              <Column header="Actual CostAC" field="actualCostAC" />
              <Column header="Percent Complete To Date InCostACBQ" field="percentCompleteToDateInCostACBQ" />
              <Column header="Percent Complete At Completion ToDateACBC" field="percentCompleteAtCompletionToDateACBC" />
              <Column header="ForeCast CostAtGoodFC" field="foreCastCostAtGoodFC" />
              <Column header="Variance InCost" field="varianceInCost" />
              <Column header="Action" body={removeAction} />
            </DataTable>
        </div>))}
        </div>
      
     
    </div>


    
  );
};

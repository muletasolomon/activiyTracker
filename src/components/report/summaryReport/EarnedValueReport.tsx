import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { LaborCost, MaterialCost } from "../../../model/TaskActivityModel";
import {
  removeLaborCost,
  removeMaterialCost,
} from "../../../store/features/taskActivitySlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { AddMaterialCost } from "../../task/activity/AddMaterialCost";

export const EarnedValueReport = ({
  title,
  costCode
}) => {
  const [modalToggle, setModalToggle] = useState(false);


  const [bugetReport, setBugetReport] = useState();
  const [laborCostTotal, setLaborCostTotal] = useState<number>(0);

  const toast = useRef();

  const dispatch = useAppDispatch();

  const taskActivities = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );

  const [isParent, setIsParent] = useState(false);

  useEffect(() => {
    let materialList: MaterialCost[] = [];
    let laborCostList: LaborCost[] = [];
    workList();
  }, [taskActivities]);

  const workList = () =>{
    console.log("ty");
    let dataSample = []
    const request = {
      costCode:"",
      startDate:"",
      endDate:"",
      searchParam:""
    }
    let data = async()=>await fetch("http://196.189.53.130:20998/testApi/rest/Report/earnedValueReport",{
        
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
    <div>
      <p className="font-bold text-lg">{title}</p>

      <Toast ref={toast} />

      <DataTable value={bugetReport}>
        <Column header="Direct Cost TodateDC" field="directCostTodateDC" />
        <Column header="Total Cost ToDateTC" field="totalCostToDateTC" />
        <Column header="Budgeted Quatity ToDateBQ" field="budgetedQuatityToDateBQ" />
        <Column header="Executed AmountAQ" field="executedAmountAQ" />
        <Column header="Unit Price InBOQ" field="unitPriceInBOQ" />
        <Column header="Actual Unit CostAUC" field="actualUnitCostAUC" />
        <Column header="Planned ValuePV" field="plannedValuePV" />
        <Column header="Earne ValueEV" field="earneValueEV" />
        <Column header="Actual CostAC" field="actualCostAC" />
        <Column header="Costn VarianceCV" field="costnVarianceCV" />
        <Column header="Action" body={removeAction} />
      </DataTable>
    </div>
  );
};

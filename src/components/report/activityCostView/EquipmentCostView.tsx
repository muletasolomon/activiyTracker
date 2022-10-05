import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { EquipmentCost } from "../../../model/TaskActivityModel";
import { removeEquipmentCost } from "../../../store/features/taskActivitySlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { DefaultBtn } from "../../form/DefaultBtn";
import { AddEquipmentCostDialog } from "./AddEquipmentCost";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method

export const EquipmentCostView = ({ modelId, cost,equipmentCost }) => {
  const [modalToggle, setModalToggle] = useState(false);

  const [isParent, setIsParent] = useState(false);

  const dispatch = useAppDispatch();

  const taskActivities = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );
  const [equipmentCosts, setEquipmentCosts] = useState<EquipmentCost[]>([]);

  const toggleModal = () => {
    setModalToggle(!modalToggle);
  };
  const removeActivity = (data) => {
    console.log(`remove rowData ${data.id}`);
    const url = "http://196.189.53.130:20998/testApi/rest/registrationResource/deleteEquipmentCost?equipmentCostId="+data.id;
    console.log(url)
    let works = async()=>await fetch(url,{
        
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        mode: 'cors'
      }).then((response) => {
        return response.json();                
    }).then(pro => {
        
        return pro
    
    }).catch(error => {
        console.log(error);
    });
    works();
    
  };
  const confirmTaskRemoval = (data) => {
    confirmDialog({
      message: `Are you sure you want to Remove ?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {removeActivity(data)},
      reject: () => {},
    });
  };

  const removeAction = (data) => {

    return (
      <Button
        icon="pi pi-trash"
        className="p-button-outlined p-button-sm p-button-danger"
        onClick={() => confirmTaskRemoval(data)}
      />
    );
  };

  useEffect(() => {
    const selectedTask = taskActivities.find(
      (task) => task.modelId == +modelId
    );

    setIsParent(selectedTask ? !selectedTask.isActivity : false);
    const isParentTask = selectedTask ? !selectedTask.isActivity : false;
    const equipments = taskActivities
      .filter(
        (taskActivity) =>
          taskActivity.modelId == modelId ||
          (isParentTask ? taskActivity.parentId == +modelId : false)
      )
      .flatMap((taskActivity) => taskActivity.equipmentCosts);

    setEquipmentCosts(equipments);
  }, [taskActivities]);

  return (
    <div>
      <p className="font-bold text-lg">Equipment Cost</p>
      {!isParent && (
        <DefaultBtn
          callBack={toggleModal}
          name={"Add Equipment Cost"}
          style={""}
        />
      )}

      {modalToggle && (
        <AddEquipmentCostDialog
          onHide={toggleModal}
          visible={modalToggle}
          title={""}
          modelId={modelId}
          isMaterial={false}
        />
      )}

      <DataTable value={equipmentCost}>
        <Column field="typeOfEquipment" header="Type Of Equipment" />
        <Column field="quantity" header="Quantity" />
        <Column field="hourlyRate" header="Hourly Rate" />
        <Column field="operationHour" header="Operation Hour" />
        <Column field="utilityFactor" header="Utility Factor" />
        <Column header="Action" body={removeAction} />
      </DataTable>
      <p className="mt-4 font-semibold text-base">Total Amount : {cost}</p>
    </div>
  );
};

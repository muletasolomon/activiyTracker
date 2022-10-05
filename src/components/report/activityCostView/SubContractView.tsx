import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import {
  SubContract,
  TaskActivityModel,
} from "../../../model/TaskActivityModel";
import { removeSubContract } from "../../../store/features/taskActivitySlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { DefaultBtn } from "../../form/DefaultBtn";
import { AddSubContractDialog } from "./AddSubContract";

export const SubContractView = ({ modelId, cost,subContaract }) => {
  const [modalToggle, setModalToggle] = useState(false);

  const [isParent, setIsParent] = useState(false);

  const dispatch = useAppDispatch();

  const taskActivities: TaskActivityModel[] = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );
  const [subContracts, setSubContracts] = useState<SubContract[]>([]);

  const toggleModal = () => {
    setModalToggle(!modalToggle);
  };

  const removeActivity = (data) => {
    console.log(`remove rowData ${data.id}`);
    const url = "http://196.189.53.130:20998/testApi/rest/registrationResource/deleteSubcontractCost?subcontractCostId="+data.id;
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


  const removeAction = (data) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-outlined p-button-sm p-button-danger"
        onClick={() => removeActivity(data)}
      />
    );
  };

  useEffect(() => {
    const selectedTask = taskActivities.find(
      (task) => task.modelId == +modelId
    );

    setIsParent(selectedTask ? !selectedTask.isActivity : false);
    const isParentTask = selectedTask ? !selectedTask.isActivity : false;
    const subContracts = taskActivities
      .filter(
        (taskActivity) =>
          taskActivity.modelId == modelId ||
          (isParentTask ? taskActivity.parentId == +modelId : false)
      )
      .flatMap((taskActivity) => taskActivity.subContracts)
      .filter(SubContract=>SubContract.price);

    setSubContracts(subContracts);
  }, [taskActivities]);

  return (
    <div>
      <p className="font-bold text-lg my-4">Sub-Contract Cost</p>
      {!isParent && (
        <DefaultBtn
          callBack={toggleModal}
          name={"Add Sub-Contract Cost"}
          style={""}
        />
      )}

      {modalToggle && (
        <AddSubContractDialog
          onHide={toggleModal}
          visible={modalToggle}
          modelId={modelId}
        />
      )}

      <DataTable value={subContaract}>
        <Column field="name" header="Name" />
        <Column field="price" header="Price" />
        <Column field="subContractHour" header="SubContract Hour" />

        <Column body={removeAction} header="Action" />
      </DataTable>
      <p className="mt-4 font-semibold text-base">Total Amount : {cost}</p>
    </div>
  );
};

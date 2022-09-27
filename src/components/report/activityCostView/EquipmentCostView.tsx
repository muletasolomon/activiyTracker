import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { EquipmentCost } from "../../../model/TaskActivityModel";
import { removeEquipmentCost } from "../../../store/features/taskActivitySlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { DefaultBtn } from "../../form/DefaultBtn";
import { AddEquipmentCostDialog } from "./AddEquipmentCost";

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

  const removeAction = (data) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-outlined p-button-sm p-button-danger"
        onClick={() => {
          dispatch(removeEquipmentCost({ equipmentCost: data, modelId }));
        }}
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

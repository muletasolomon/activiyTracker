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
import { AddLabourCost } from "../../task/activity/AddLabourCost";
import { AddMaterialCost } from "../../task/activity/AddMaterialCost";

export const LaborCostView = ({
  isMaterial,
  title,
  modalTitle,
  modelId,
  material,
  total,
}) => {
  const [modalToggle, setModalToggle] = useState(false);

  const [materialCosts, setMaterialCosts] = useState<MaterialCost[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  const [laborCosts, setLaborCosts] = useState<LaborCost[]>([]);
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

    const selectedTask = taskActivities.find(
      (task) => task.modelId == +modelId
    );

    setIsParent(selectedTask ? !selectedTask.isActivity : false);
    const isParentTask = selectedTask ? !selectedTask.isActivity : false;
    if (isMaterial) {
      materialList = taskActivities
        .filter(
          (task) =>
            task.modelId == modelId ||
            (isParentTask ? task.parentId == +modelId : false)
        )
        .flatMap((taskActivity) => taskActivity.materialCosts)
        .filter((materialCost) => {
          return Number.isFinite(+materialCost.price);
        });
        materialList = materialList;
        console.log(materialList)
    } else {
      laborCostList = taskActivities
        .filter(
          (task) =>
            task.modelId == modelId ||
            (isParentTask ? task.parentId == +modelId : false)
        )
        .flatMap((taskActivity) => taskActivity.laborCosts)
        .filter((materialCost) => {
          return Number.isFinite(+materialCost.price);
        });
    }

    const total = (isMaterial ? materialList : laborCostList)
      .map((costModel) => +costModel.price * +costModel.qty)
      .reduce((m1, m2) => m1 + m2, 0);

    console.log(total);
    if (total > 0 && toast && toast.current) {
      toast.current.show({ severity: "success", summary: "success" });
    }

    if (isMaterial) {
      setMaterialCosts(materialList);
      setTotalCost(total);
    } else {
      setLaborCostTotal(total);
      setLaborCosts(laborCostList);
    }
  }, [taskActivities]);

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
          if (isMaterial) {
            dispatch(removeMaterialCost({materialCost:data,modelId}));
          } else {
            dispatch(removeLaborCost({laborCost:data,modelId}));
          }
        }}
      />
    );
  };

  return (
    <div>
      <p className="font-bold text-lg">{title}</p>

      <Toast ref={toast} />

      {modalToggle && (
        <AddLabourCost
          title={modalTitle}
          isMaterial={isMaterial}
          onHide={toggleModal}
          visible={modalToggle}
          modelId={modelId}
        />
      )}

      {!isParent && (
        <Button
          label={modalTitle}
          className="p-button-success my-2"
          onClick={() => AddMaterialCostOnClick()}
          aria-controls="popup_menu"
          aria-haspopup
        />
      )}

      <DataTable value={material}>
        <Column header="Name" field="crewName" />
        <Column header="Total Hour" field="totalHour" />
        <Column header="Cost per Hour" field="dailyCostPerHour" />
        <Column header="Qty" field="quantityOfmanPower" />
        <Column header="UF" field="utilityFactor" />
        <Column header="MH" field="morningHour" />
        <Column header="OT" field="overTime" />
        
        <Column header="Action" body={removeAction} />
      </DataTable>

      {(isMaterial ? total : total) > 0 && (
        <p className="mt-4 font-bold text-base">
          Total Amount : {isMaterial ? total : total} Birr
        </p>
      )}
    </div>
  );
};

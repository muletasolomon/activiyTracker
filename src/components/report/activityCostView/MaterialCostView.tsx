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

export const MaterialCostView = ({
  isMaterial,
  title,
  modalTitle,
  modelId,
  material,
  materialTotal,
}) => {
  console.log(materialTotal)
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
  const removeActivity = (data) => {
    console.log(`remove rowData ${data.id}`);
    const url = "http://172.16.0.56:8080/testApi/rest/registrationResource/deleteMaterialCost?materialCostId="+data.id;
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
      window.location.reload();
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

  return (
    <div>
      <p className="font-bold text-lg">{title}</p>

      <Toast ref={toast} />

      {modalToggle && (
        <AddMaterialCost
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

      <DataTable value={isMaterial ? material : laborCosts}>
        <Column header="Name" field="name" />
        <Column header="Price" field="price" />
        <Column header="Unit" field="unit" />
        <Column header="Qty" field="quantity" />
        <Column header="Date" field="updatedOn" />
        {/*<Column header="Executed Quantity" field="executedQuantity" />*/}
        <Column header="Action" body={removeAction} />
      </DataTable>

      {(isMaterial ? materialTotal : laborCostTotal) > 0 && (
        <p className="mt-4 font-bold text-base">
          Total Amount : {materialTotal} Birr
        </p>
      )}
    </div>
  );
};

import axios from "axios";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { addLaborCost, addMaterialCost } from "../../../store/features/taskActivitySlice";
import { useAppDispatch } from "../../../store/store";
import { DefaultBtn } from "../../form/DefaultBtn";
import { FormInput } from "../../form/FormInput";

export const AddEquipmentCostDialog = ({
  onHide,
  visible,
  modelId,
  title,
  isMaterial,
}) => {
  const [typeOfEquipment, setTypeOfEquipment] = useState();
  const [quatity, setQuatity] = useState();
  const [hourlyRate, setHourlyRate] = useState();
  const [utitlyFactor, setUtitlyFactor] = useState();
  const [operationHour, setOperationHour] = useState();
  const [date, setDate] = useState("");

  const appDispatch = useAppDispatch();

  const addMaterialCostCallBack = () => {
    
    let formData = {"subActivity":modelId
    ,"typeOfEquipment":typeOfEquipment
    ,"quatity":quatity
    ,"hourlyRate":hourlyRate
    ,"utitlyFactor":utitlyFactor
    ,"operationHour":operationHour 
    ,"date":date+"T01:36:08.775Z"};
    const url = "http://172.16.0.56:8080/testApi/rest/registrationResource/registerEquipmentCost"; 
    axios.post(url,formData,{
      headers:{"Content-Type" : "application/json"}})
    .then(res => {
        console.log(res.data)
      window.location.reload();
      onHide()    })
    .catch(err => console.log(err));

  };

  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: "70vw" }}
      onHide={() => onHide()}
    >
      <div className="formgroup">
        <FormInput
          defaultValue={""}
          labelName={"Type Of Equipment"}
          onUpdate={(val) => setTypeOfEquipment(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Quatity"}
          onUpdate={(val) => setQuatity(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Hourly Rate"}
          onUpdate={(val) => setHourlyRate(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Utitly Factor"}
          onUpdate={(val) => setUtitlyFactor(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Operation Hour"}
          onUpdate={(val) => setOperationHour(val)}
        />
        
        <div className="flex flex-column">
          <label className="py-2 text-base font-bold">Date</label>

          <input type="date" name="open"  onChange={e=>setDate(e.target.value)}
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none ml-4 focus:border-primary"
                />
        </div>
        <DefaultBtn name={"Add Cost"} callBack={addMaterialCostCallBack} style={""} />
      </div>
    </Dialog>
  );
};

import axios from "axios";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { addLaborCost, addMaterialCost } from "../../../store/features/taskActivitySlice";
import { useAppDispatch } from "../../../store/store";
import { DefaultBtn } from "../../form/DefaultBtn";
import { FormInput } from "../../form/FormInput";

export const AddLabourCost = ({
  onHide,
  visible,
  modelId,
  title,
  isMaterial,
}) => {
  const [crewName, setCrewName] = useState();
  const [dailyCostPerHour, setdailyCostPerHour] = useState();
  const [quantityOfmanPower, setquantityOfmanPower] = useState();
  const [morningHour, setmorningHour] = useState();
  const [afterNoonHour, setAfterNoonHour] = useState();
  const [overTime, setoverTime] = useState();
  const [utilityFactor, setUtilityFactor] = useState();
  const [totalHour, setTotalHour] = useState();
  const [date, setDate] = useState("");

  const appDispatch = useAppDispatch();

  const addMaterialCostCallBack = () => {
    
    let formData = {"subActivity":modelId
    ,"crewName":crewName
    ,"dailyCostPerHour":dailyCostPerHour
    ,"quantityOfmanPower":quantityOfmanPower
    ,"morningHour":morningHour
    ,"afterNoonHour":afterNoonHour 
    ,"overTime":overTime
    ,"utilityFactor":utilityFactor 
    ,"totalHour":totalHour
    ,"date":date+"T01:36:08.775Z"}
    const url = "http://196.189.53.130:20998/testApi/rest/registrationResource/registerLaborCost"; 
    axios.post(url,formData,{
      headers:{"Content-Type" : "application/json"}})
    .then(res => {
        console.log(res.data)
        onHide();
    })
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
          labelName={"Crew Name"}
          onUpdate={(val) => setCrewName(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"dailyCostPerHour"}
          onUpdate={(val) => setdailyCostPerHour(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Quantity Of man Power"}
          onUpdate={(val) => setquantityOfmanPower(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Morning Hour"}
          onUpdate={(val) => setmorningHour(val)}
        />
<FormInput
          defaultValue={""}
          labelName={"AfterNoon Hour"}
          onUpdate={(val) => setAfterNoonHour(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"overTime"}
          onUpdate={(val) => setoverTime(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Utility Factor"}
          onUpdate={(val) => setUtilityFactor(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"total Hour"}
          onUpdate={(val) => setTotalHour(val)}
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

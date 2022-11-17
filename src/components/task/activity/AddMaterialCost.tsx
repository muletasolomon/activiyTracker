import axios from "axios";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { addLaborCost, addMaterialCost } from "../../../store/features/taskActivitySlice";
import { useAppDispatch } from "../../../store/store";
import { DefaultBtn } from "../../form/DefaultBtn";
import { FormInput } from "../../form/FormInput";

export const AddMaterialCost = ({
  onHide,
  visible,
  modelId,
  title,
  isMaterial,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [unit, setUnit] = useState("");
  const [qty, setQty] = useState(0);
  const [excqty, setExcQty] = useState(0);
  const [date, setDate] = useState("");

  const appDispatch = useAppDispatch();

  const addMaterialCostCallBack = () => {
    let formData = {"subActivity":modelId
    ,"name":name
    ,"price":price
    ,"unit":unit
    ,"quantity":qty
    ,"executedQuantity":excqty 
    ,"date":date+"T01:36:08.775Z"}
    const url = "http://196.189.53.130:20998/testApi/rest/registrationResource/registerMaterialCost";
    axios.post(url,formData,{
      headers:{"Content-Type" : "application/json"}})
    .then(res => {
       onHide()
    })
    .catch(err => console.log(err));
  }

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
          labelName={"Name"}
          onUpdate={(val) => setName(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Price"}
          onUpdate={(val) => setPrice(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Unit"}
          onUpdate={(val) => setUnit(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Qty"}
          onUpdate={(val) => setQty(val)}
        />
        {/*<FormInput*/}
          {/*defaultValue={""}*/}
          {/*labelName={"Executed Quantity"}*/}
          {/*onUpdate={(val) => setExcQty(val)}*/}
        {/*/>*/}
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
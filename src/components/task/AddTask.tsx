import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import { ControlledInput } from "../form/ControlledInput";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addTask } from "../../store/features/taskActivitySlice";
import { Divider } from "primereact/divider";
import axios from "axios";

export const AddTaskDialog = ({
  onHide,
  visible,
  isActivity,
  taskParentId,
}) => {
  const [projectId, setProjectId] = useState(0);
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [budget,setBudget]=useState();

  const dispatch = useAppDispatch();

  const keys = useAppSelector((state) =>
    state.taskActivity.keys.map((data) => {
      return {
        label: data.costCode.concat(" - ").concat(data.description),
        value: data.costCode,
      };
    })
  );

  const addTaskOnClick = () => {
    let formData = {
    "name":name
    ,"budget":budget 
  }
    const url = "http://196.189.53.130:20998/testApi/rest/registrationResource/registerActivity"; 
    axios.post(url,formData,{
      headers:{"Content-Type" : "application/json"}})
    .then(res => {
       onHide()
    })
    .catch(err => console.log(err));
  };

  return (
    <Dialog
      header="Add Task/Activity"
      visible={visible}
      style={{ width: "40vw" }}
      onHide={() => onHide()}
    >
      <div className="formgroup-inline flex flex-column">
        {!isActivity && (
          <>
            <div className="field ml-4">
              <label className="">Name</label>

              <ControlledInput
                onUpdate={(val) => setName(val)}
                type={"text"}
                defaultValue={""}
              />
            </div>

            <div className="field ml-4">
              <label className="">Budget</label>

              <ControlledInput
                onUpdate={(val) => setBudget(val)}
                type={"text"}
                defaultValue={""}
              />
            </div>
          </>
        )}

        {isActivity && (
          <div className="field ml-4">
            <label className="">Cost Code</label>

            <Dropdown
              value={key}
              options={keys}
              filter
              onChange={(e) => {
                console.log(e.value);
                setKey(e.value);
              }}
            />

            {/* <ControlledInput onUpdate={(val) => setKey(val)} type={"text"} defaultValue={""}/> */}
          </div>
        )}

        <Divider />

        <Button
          label={`${isActivity ? "Add Sub-Activity" : "Add Activity"}`}
          icon="pi pi-user"
          className="p-button-success p-button-outlined mb-2 ml-4"
          onClick={() => addTaskOnClick()}
          aria-controls="popup_menu"
          aria-haspopup
        />
      </div>
    </Dialog>
  );
};

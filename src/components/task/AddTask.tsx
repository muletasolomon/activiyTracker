import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { ControlledInput } from "../form/ControlledInput";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addTask } from "../../store/features/taskActivitySlice";
import { Divider } from "primereact/divider";
import axios from "axios";
import { FormInput } from "../form/FormInput";

export const AddTaskDialog = ({
  onHide,
  visible,
  isActivity,
  taskParentId,
  keys,
  activityId
}) => {
  const [projectId, setProjectId] = useState(0);
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [budget,setBudget]=useState();
  const [unitCost,setUnitCost]=useState();
  const [costCode,setCostCode]=useState();
  const [activity,setActivity]=useState();
  const [projectBudget,setProjectBudget]=useState();
  const [projectQuantity,setProjectQuantity]=useState();
  const dispatch = useAppDispatch();

  const keyx = useAppSelector((state) =>
    state.taskActivity.keys.map((data) => {
      return {
        label: data.costCode.concat(" - ").concat(data.description),
        value: data.costCode,
      };
    })
  );
  const codeList = () =>{
   
     fetch("http://196.189.53.130:20998/testApi/rest/subactivities/getCostCodeList",{
        
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        mode: 'cors',
      }).then((response) => {
        return response.json();                
    }).then(pro => {
        let res = [];
        pro.map(element =>{
          res.push({costCode:element.code,label:element.code.concat(" - ").concat(element.descirption)})
        })
        console.log(res);
        
        return pro;
    
    }).catch(error => {
        console.log(error);
    });
  
   // const data = await res.json();
    //console.log(data);
  }

  useEffect(() => {
    //codeList()
  }, [keys]);

  const addTaskOnClick = () => {

    console.log("activity")

    if(!isActivity){
      let request = {
        "name":name
        ,"budget":budget 
      }
      
      let data = async()=>await fetch("http://196.189.53.130:20998/testApi/rest/registrationResource/registerActivity",{
          
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
        window.location.reload();
           onHide()
          return pro
      
      }).catch(error => {
          console.log(error);
      });
      data();
    }
    
  };

  const addSubTaskOnClick= () => {

    if(isActivity){
      console.log("use")

      let request = {
        "name":name,
        "costCode":costCode,
         "unitCost":unitCost,
        "activity":activityId,
        "projectBudget":projectBudget,
          "budgetedQuantity":projectQuantity
      }
      
      let data = async()=>await fetch("http://196.189.53.130:20998/testApi/rest/registrationResource/registerSubActivity",{
          
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
        window.location.reload();
           onHide()
          return pro
      
      }).catch(error => {
          console.log(error);
      });
      data();
    }
    
  };

  return (
    <Dialog
      header = {`${isActivity ? "Add Task/Sub-Activity" : "Add Task/Activity"}`}
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
                console.log(e.value.label);
                setKey(e.value)
                setCostCode(e.value.id);
              }}
            />
           <FormInput
              defaultValue={""}
              labelName={"Name"}
              onUpdate={(val) => setName(val)}
            />
            <FormInput
              defaultValue={""}
              labelName={"Unit cost"}
              onUpdate={(val) => setUnitCost(val)}
            />
            <FormInput
              defaultValue={""}
              labelName={"Project Budget"}
              onUpdate={(val) => setProjectBudget(val)}
            />
              <FormInput
                  defaultValue={""}
                  labelName={"Budgeted Quantity"}
                  onUpdate={(val) => setProjectQuantity(val)}
              />
            {/* <ControlledInput onUpdate={(val) => setKey(val)} type={"text"} defaultValue={""}/> */}
          </div>
        )}

        <Divider />

        <Button
          label={`${isActivity ? "Add Sub-Activity" : "Add Activity"}`}
          icon="pi pi-user"
          className="p-button-success p-button-outlined mb-2 ml-4"
          onClick={() => !isActivity ?addTaskOnClick():addSubTaskOnClick()}
          aria-controls="popup_menu"
          aria-haspopup
        />
      </div>
    </Dialog>
  );
};

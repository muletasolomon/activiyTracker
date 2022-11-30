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
import { useFetchProjectList } from "../../api/ApiClient";

export const AddTaskDialog = ({
  data = null,
  onHide,
  visible,
  isActivity,
  taskParentId,
  keys,
  activityId
}) => {
  console.log('AddTaskDialog', data)
  const taskId = data.key ?? 0
  const [projectId, setProjectId] = useState(data?.data?.projectId ?? 0);
  const [key, setKey] = useState("");
  const [name, setName] = useState(data?.data?.name?? "");
  const [budget,setBudget]=useState(data?.data?.budget);
  const [unitCost,setUnitCost]=useState(0);
  const [costCode,setCostCode]=useState();
  const [projectBudget,setProjectBudget]=useState(0);
  const [projectQuantity,setProjectQuantity]=useState<number>();
  const dispatch = useAppDispatch();
  const { projects } = useFetchProjectList();

  const keyx = useAppSelector((state) =>
    state.taskActivity.keys.map((data) => {
      return {
        label: data.costCode.concat(" - ").concat(data.description),
        value: data.costCode,
      };
    })
  );

  console.log(projectQuantity)
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

  const addTaskOnClick = (e) => {
    e.preventDefault()
    if(!isActivity){
      let request = {
        "id": taskId>0? taskId : undefined,
        "name":name
        ,"budget":budget,
        "projectId": projectId
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
           onHide()
          return pro
      
      }).catch(error => {
          console.log(error);
      });
      data();
    }
    
  };

  const addSubTaskOnClick= (e) => {
    e.preventDefault()
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
           onHide()
          return pro
      
      }).catch(error => {
          console.log(error);
      });
      data();
    }
    
  };
  console.log(projects)

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
              <label className="mr-3">Name</label>

              <ControlledInput
                onUpdate={(val) => setName(val)}
                placeholder={''}
                type={"text"}
                defaultValue={name}
              />
            </div>

            <div className="field ml-4">
              <label className="">Budget</label>
              <ControlledInput
                placeholder={''}
                onUpdate={(val) => setBudget(val)}
                type={"text"}
                defaultValue={budget}
              />
            </div>
            <div className="ml-4 mr-10 flex w-full">
            <label className="mr-2">Project</label>
            <select value={projectId} onChange={(e)=>setProjectId(parseInt(e.target.value,10))} defaultValue={projectId} name={'projectId'}  className="w-full text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none ml-4 focus:border-primary mr-7 w-full" id="project">
              <option value={''}>Select project</option>
               {projects.map(project=> <option value={project.id}>{project.name}</option>)}
            </select>
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
              type={'number'}
              onUpdate={(val) => {
                setUnitCost(val)
                const valPQ = parseInt(val,10) * projectBudget
                setProjectQuantity(valPQ)
              }}
            />
            <FormInput
              defaultValue={""}
              type={'number'}
              labelName={"Project Budget"}
              onUpdate={(val) =>{ 
                setProjectBudget(val)
                const valPQ = parseInt(val,10) * unitCost
                setProjectQuantity(valPQ)
              }}
            />
              <FormInput
                  defaultValue={projectQuantity}
                  type={'number'}
                  disable={true}
                  labelName={"Budgeted Quantity"}
                  onUpdate={(val) => console.log('')}
              />
            {/* <ControlledInput onUpdate={(val) => setKey(val)} type={"text"} defaultValue={""}/> */}
          </div>
        )}

        <Divider />

        <Button
          label={`${isActivity ? "Add Sub-Activity" : "Add Activity"}`}
          icon="pi pi-user"
          className="p-button-success p-button-outlined mb-2 ml-4"
          onClick={(e) => !isActivity ?addTaskOnClick(e):addSubTaskOnClick(e)}
          aria-controls="popup_menu"
          aria-haspopup
        />
      </div>
    </Dialog>
  );
};

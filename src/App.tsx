import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { TreeTable } from "primereact/treetable";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { AddTaskDialog } from "./components/task/AddTask";
import { KeyDialog } from "./components/task/KeyDialog";
import { mapTaskActivityToTree } from "./model/model-tree";
import { TaskActivityModel } from "./model/TaskActivityModel";
import { removeTask, updateTask } from "./store/features/taskActivitySlice";
import { useAppDispatch, useAppSelector } from "./store/store";
import { ConfirmDialog } from "primereact/confirmdialog"; // To use <ConfirmDialog> tag
import { confirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method

function App() {
  const taskActivities: TaskActivityModel[] = useAppSelector(
    (s) => s.taskActivity.taskActivities
  );

  const [nodes, setNodes] = useState({ root: [] });

  const [parentTasks, setParentTasks] = useState([]);
  const [codes, setCodes] = useState([]);
  const [tree,setTree] = useState([])
  const menu = useRef(null);
  const subTaskMenu = useRef(null);

  const [addTaskToggle, setAddTaskToggle] = useState(false);
  const [taskParentNode, setTaskParentNode] = useState(0);
  const [isActivity, setIsActivity] = useState(false);
  const [activityId, setactivityId] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [toggleKeyDialog, setToggleKeyDialog] = useState(false);
  const [keys,setKeys] = useState([]);
  
  const appDispatch = useAppDispatch();
  const navigate = useNavigate();

  const [projectsActivity,setProjectsActivity] = useState([]);

  const toggleModal = () => {
    setAddTaskToggle(!addTaskToggle);
  };

  const addTaskOnClick = () => {
    setIsActivity(false);
    setTaskParentNode(0);
    toggleModal();
  };

  const addCostBudgetReport = () => {
    navigate(`costBudgetReport/`)
  };

  const addCostSummaryReport = () => {
    navigate(`costSummaryReport/`)
  };

  const addEarnedValue = () => {
    navigate(`EarnedValue/`)
  };

  const addPerformanceSummary = () => {
    navigate(`performanceSummary/`)
  };

  useEffect(() => {
    console.log("works")
    workList();
    console.log(projectsActivity)
    const treeData = mapTaskActivityToTree(taskActivities);
    const parents = taskActivities.filter(
      (activity) => activity.parentId === 0
    );

    setParentTasks(parents);
    setNodes({ root: treeData });
  }, [taskActivities]);

  const addSubActivity = () => {
    console.log("subactivity")
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
          res.push({id:element.id,costCode:element.code,label:element.code.concat(" - ").concat(element.descirption)})
        })
        console.log(res);
        setKeys(res)
        setIsActivity(true);
        toggleModal();
        return pro;
    
    }).catch(error => {
        console.log(error);
    });
    
  };

  const removeActivity = () => {
    console.log(`remove rowData ${taskParentNode}`);
    
  };

  const confirmTaskRemoval = () => {
    confirmDialog({
      message: `Are you sure you want to Remove ?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => removeActivity(),
      reject: () => {},
    });
  };

  const userActionItems = [
    {
      label: "Add Sub Activity",
      icon: "pi pi-pencil",
      command: () => addSubActivity(),
    },
    {
      label: "Remove Activity",
      icon: "pi pi-trash",
      command: () => {
        confirmTaskRemoval();
      },
    },
    {
      label: "View Report",
      icon: "pi pi-chart-pie",
      command: () =>
        navigate(`activityReport/${taskParentNode}?name=${taskTitle}`),
    },
  ];

  const subTaskUserActionItems = [
    {
      label: "View Report",
      icon: "pi pi-chart-pie",
      command: () =>
        navigate(`activityReport/${taskParentNode}?name=${taskTitle}`),
    },
    {
      label: "Remove Sub Activity",
      icon: "pi pi-trash",
      command: () => {
        confirmTaskRemoval();
      },
    },
  ];

  const workList = () =>{
    console.log("ty");
    let dataSample = []
    let data = async()=>await fetch("http://196.189.53.130:20998/testApi/rest/subactivities/getActivityList?projectId=1",{
        
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        mode: 'cors'
      }).then((response) => {
        return response.json();                
    }).then(pro => {
        console.log(pro);
        let data = [];
        pro.map(element=>{
          console.log(element)
          data.push({key:element.project.id, data: {name:element.name,budget:element.project.projectBudget,isActivity:true}, children: [...element.subActivityList.map(subactiv=>{
            console.log('subactiv', subactiv)
            return({
              key: subactiv.id,  data: {name:subactiv.name, budget: "",isActivity:false}
            })
          })]})
          
        })
        //setProjectsActivity(data);
        setProjectsActivity(data )
        console.log(projectsActivity)

        //console.log(dataList)
        //setTree(data)
        return data
    
    }).catch(error => {
        console.log(error);
    });
    data();
    console.log(projectsActivity)

   // const data = await res.json();
    //console.log(data);
}

const codeList = (toggleKeyDialog) =>{
   
  let data = async()=>await fetch("http://196.189.53.130:20998/testApi/rest/subactivities/getCostCodeList",{
      
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
        res.push({costCode:element.code,description:element.descirption})
      })
      setToggleKeyDialog(toggleKeyDialog)
      console.log(res);
      setCodes(res)
      return pro;
  
  }).catch(error => {
      console.log(error);
  });
  data();

 // const data = await res.json();
  //console.log(data);
}



  const taskNameView = (taskRowData: TaskActivityModel) => {
    return (
      <span className={`${taskRowData.isActivity ? "text-pink-600" : ""}`}>
        {taskRowData.name}
      </span>
    );
  };

  const userAction = (taskActivityRowData) => {
    return (
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-outlined text-500 border-0"
        onClick={(event) => {
          const { data } = taskActivityRowData;
          console.log(taskActivityRowData);
          setTaskParentNode(taskActivityRowData.key);
          setactivityId(taskActivityRowData.key)
          setTaskTitle(taskActivityRowData.name);
          if (taskActivityRowData.data.isActivity) {
            menu.current.toggle(event);
          } else {
            subTaskMenu.current.toggle(event);
          }
        }}
        aria-controls="popup_menu"
        aria-haspopup
      />
    );
  };

  const inputTextEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.rowData[options.field]}
        onChange={(e) => {
          appDispatch(
            updateTask({
              ...options.rowData,
              name: e.target.value,
            })
          );
        }}
      />
    );
  };

  const typeEditor = (options) => {
    return inputTextEditor(options);
  };

  const onShow = (rowData) => {
    console.log(rowData);
  };

  const actionTemplate = (node, column) => {
    return (
      <div className="px-4">
        <Button
          type="button"
          icon="pi pi-plus"
          className="p-button-outlined p-button-secondary mx-4 px-2"
        >
          <span className="px-2">Task</span>
        </Button>

        <Button
          type="button"
          icon="pi pi-plus"
          className="p-button-outlined p-button-secondary"
        >
          <span className="px-2">Activity</span>
        </Button>
      </div>
    );
  };
  return (
    <>
      <ConfirmDialog />
    
      <div className="bg-gray-100 h-screen w-screen">
        <div className="bg-white mt-4 mx-6 px-8">
          {addTaskToggle && (
            <AddTaskDialog
              onHide={toggleModal}
              visible={addTaskToggle}
              isActivity={isActivity}
              activityId = {activityId}
              taskParentId={taskParentNode}
              keys = {keys}
            />
          )}
          <Menu
            model={userActionItems}
            popup
            ref={menu}
            id="popup_menu"
            onShow={onShow}
          />

          <Menu
            model={subTaskUserActionItems}
            popup
            ref={subTaskMenu}
            id="popup_menu"
            onShow={onShow}
          />

          {toggleKeyDialog && (
            <KeyDialog
              visible={toggleKeyDialog}
              keys = {codes}
              onHide={() => setToggleKeyDialog(!toggleKeyDialog)}
            />
          )}

          <div className="flex flex-column justify-content-center">
            <div className="col">
              {/* <p className="text-xl text-800 font-bold my-4">Project Name</p> */}
            </div>
            <div className="col">
              <div className="my-4 flex flex-row justify-content-evenly">
                <Button
                  label="Add Activity"
                  icon="pi pi-user"
                  className="p-button-outlined p-button-success p-button-sm"
                  onClick={() => addTaskOnClick()}
                  aria-controls="popup_menu"
                  aria-haspopup
                />
                <Button
                  label="Cost Budget Report"
                  icon="pi pi-user"
                  className="p-button-outlined p-button-success p-button-sm"
                  onClick={() => addCostBudgetReport()}
                  aria-controls="popup_menu"
                  aria-haspopup
                />
                <Button
                  label="Cost Sumary Report"
                  icon="pi pi-user"
                  className="p-button-outlined p-button-success p-button-sm"
                  onClick={() => addCostSummaryReport()}
                  aria-controls="popup_menu"
                  aria-haspopup
                />
                <Button
                  label="Earned Value Report"
                  icon="pi pi-user"
                  className="p-button-outlined p-button-success p-button-sm"
                  onClick={() => addEarnedValue()}
                  aria-controls="popup_menu"
                  aria-haspopup
                />
                <Button
                  label="Performance Summary"
                  icon="pi pi-user"
                  className="p-button-outlined p-button-success p-button-sm"
                  onClick={() => addPerformanceSummary()}
                  aria-controls="popup_menu"
                  aria-haspopup
                />
                <Button
                  type="button"
                  icon="pi pi-key"
                  className="p-button-outlined p-button-sm p-button-secondary"
                  label="Cost Code"
                  onClick={() => codeList(!toggleKeyDialog)}
                />
              </div>
              <div>
                <div className="card mx-8">
                  <p className="text-xl">Activities</p>
                  
                  <TreeTable value={projectsActivity}>
                    <Column
                      field="name"
                      header="Name"
                      expander
                      editor={typeEditor}
                    ></Column>
                    <Column header="Budget" field="budget"/>
                    <Column header="Action" body={userAction}></Column>
                     
                    
                  </TreeTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

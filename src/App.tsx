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
import { confirmDialog } from "primereact/confirmdialog";
import { AddExcutedTask } from "./components/task/AddExcutedTask";
import { ProjectList } from "./components/project/ProjectList"; // To use confirmDialog method

function App() {
  const taskActivities: TaskActivityModel[] = useAppSelector(
    (s) => s.taskActivity.taskActivities
  );

  const selectedProjectId = useAppSelector(
    (s) => s.taskActivity.selectedProjectId
  );

  const [nodes, setNodes] = useState({ root: [] });

  const [parentTasks, setParentTasks] = useState([]);
  const [codes, setCodes] = useState([]);
  const [tree, setTree] = useState([]);
  const menu = useRef(null);
  const subTaskMenu = useRef(null);

  const [addTaskToggle, setAddTaskToggle] = useState(false);
  const [taskParentNode, setTaskParentNode] = useState(0);
  const [isActivity, setIsActivity] = useState(false);
  const [activityId, setactivityId] = useState();
  const [taskTitle, setTaskTitle] = useState("");
  const [types, setType] = useState("");
  const typesRef = useRef(types);
  const [toggleKeyDialog, setToggleKeyDialog] = useState(false);
  const [keys, setKeys] = useState([]);

  const appDispatch = useAppDispatch();
  const navigate = useNavigate();

  const [projectsActivity, setProjectsActivity] = useState([]);
  const [selectedData, setSelectedData] = useState()

  useEffect(() => {
    workList();
  }, [selectedProjectId]);

  const toggleModal = () => {
    setAddTaskToggle(!addTaskToggle);
    workList()
  };

  const addTaskOnClick = () => {
    setIsActivity(false);
    setTaskParentNode(0);
    toggleModal();
  };

  const addCostBudgetReport = () => {
    setType("costBudgetReport");
    typesRef.current = "costBudgetReport";
    addSubActivity();
  };

  const addCostSummaryReport = () => {
    setType("costSummaryReport");
    typesRef.current = "costSummaryReport";
    addSubActivity();
  };

  const addEarnedValue = () => {
    setType("EarnedValue");
    typesRef.current = "EarnedValue";
    addSubActivity();
  };

  const addPerformanceSummary = () => {
    setType("performanceSummary");
    typesRef.current = "performanceSummary";
    addSubActivity();
  };

  useEffect(() => {
    workList();
    const treeData = mapTaskActivityToTree(taskActivities);
    const parents = taskActivities.filter(
      (activity) => activity.parentId === 0
    );

    setParentTasks(parents);
    setNodes({ root: treeData });
  }, [taskActivities]);

  const addSubActivity = () => {
    fetch(
      "http://196.189.53.130:20998/testApi/rest/subactivities/getCostCodeList",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((pro) => {
        let res = [];
        pro.map((element) => {
          res.push({
            id: element.id,
            costCode: element.code,
            label: element.code.concat(" - ").concat(element.descirption),
          });
        });
        setKeys(res);
        if (typesRef.current === "") {
          setIsActivity(true);
          toggleModal();
        } else if (typesRef.current === "performanceSummary") {
          navigate(`performanceSummary/`, { state: { codes: res } });
        } else if (typesRef.current === "EarnedValue") {
          navigate(`EarnedValue/`, { state: { codes: res } });
        } else if (typesRef.current === "costSummaryReport") {
          navigate(`costSummaryReport/`, { state: { codes: res } });
        } else if (typesRef.current === "costBudgetReport") {
          navigate(`costBudgetReport/`, { state: { codes: res } });
        }
        return pro;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeActivity = () => {
    let data = async () =>
      await fetch(
        "http://196.189.53.130:20998/testApi/rest/registrationResource/deleteActivity?activityId=" +
          taskParentNode,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((pro) => {
          window.location.reload();
          return pro;
        })
        .catch((error) => {
          console.log(error);
        });
    data();
  };

  const removeSubActivity = () => {
    let data = async () =>
      await fetch(
        "http://196.189.53.130:20998/testApi/rest/registrationResource/deleteSubActivity?activityId=" +
          taskParentNode,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((pro) => {
          window.location.reload();
          return pro;
        })
        .catch((error) => {
          console.log(error);
        });
    data();
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

  const confirmTaskRemovalSub = () => {
    confirmDialog({
      message: `Are you sure you want to Remove ?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => removeSubActivity(),
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
      label: "Edit",
      icon: "pi pi-file-edit",
      command: () => {

        setIsActivity(false)
        toggleModal();
      },
    },
    {
      label: "Remove Activity",
      icon: "pi pi-trash",
      command: () => {
        confirmTaskRemoval();
      },
    },
    // {
    //   label: "View Report",
    //   icon: "pi pi-chart-pie",
    //   command: () =>
    //     navigate(`activityReport/${taskParentNode}?name=${taskTitle}`),
    // },
  ];

  const subTaskUserActionItems = [
    {
      label: "View Report",
      icon: "pi pi-chart-pie",
      command: () =>
        navigate(`activityReport/${taskParentNode}?name=${taskTitle}`),
    },
    {
      label: "Edit",
      icon: "pi pi-file-edit",
      command: () => {
        setIsActivity(true);
        console.log("++++++++++++++++"+taskParentNode)
        toggleModal();
      },
    },
    {
      label: "Remove Sub Activity",
      icon: "pi pi-trash",
      command: () => {
        confirmTaskRemovalSub();
      },
    },
  ];

  const workList = () => {
    if (selectedProjectId) {
      let dataSample = [];
      let data = async () =>
        await fetch(
          `http://196.189.53.130:20998/testApi/rest/subactivities/getActivityList?projectId=${selectedProjectId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            mode: "cors",
          }
        )
          .then((response) => {
            return response.json();
          })
          .then((pro) => {
            let data = [];
            pro.map((element) => {
              data.push({
                key: element.id,
                data: {
                  name: element.name,
                  budget: element.description,
                  projectId: element?.project?.id,
                  isActivity: true,
                },
                children: [
                  ...element.subActivityList.map((subactiv) => {
                    return {
                      key: subactiv.id,
                      data: {
                        name: subactiv.name,
                        budget: subactiv.projectBudjet,
                        projectId: subactiv.activity?.project?.id,
                        isActivity: false,
                      },
                    };
                  }),
                ],
              });
            });
            setProjectsActivity(data);

            return data;
          })
          .catch((error) => {
            console.log(error);
          });
      data();

    }
  };

  const codeList = (toggleKeyDialog) => {
    let data = async () =>
      await fetch(
        "http://196.189.53.130:20998/testApi/rest/subactivities/getCostCodeList",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((pro) => {
          let res = [];
          pro.map((element) => {
            res.push({
              costCode: element.code,
              description: element.descirption,
            });
          });
          setToggleKeyDialog(toggleKeyDialog);
          console.log(res);
          setCodes(res);
          return pro;
        })
        .catch((error) => {
          console.log(error);
        });
    data();

  };

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
          console.log('taskActivityRowData', taskActivityRowData, menu, subTaskMenu)
          setTaskParentNode(taskActivityRowData.key);
          setactivityId(taskActivityRowData.key);
          setTaskTitle(taskActivityRowData.data.name);
          setSelectedData(taskActivityRowData)
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
    console.log('rowData', rowData);
  };


  return (
    <>
      <ConfirmDialog />

      <div className="bg-gray-100 h-screen w-screen">
        <div className="bg-white mt-4 mx-6 px-8">
          {addTaskToggle && (
            <AddTaskDialog
              data={selectedData}
              onHide={toggleModal}
              visible={addTaskToggle}
              isActivity={isActivity}
              activityId={activityId}
              taskParentId={taskParentNode}
              keys={keys}
            />
          )}
          <Menu
            model={localStorage.getItem('authorities') ==='ENGINEER' ? undefined : userActionItems}
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
              keys={codes}
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
                  disabled={localStorage.getItem('authorities') ==='ENGINEER'}
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
                  <div className="flex flex-row">
                    <div className="">
                      <ProjectList />
                    </div>

                    <div className="ml-6 mr-2 mt-6">
                      <p className="text-xl">Activities</p>

                      <TreeTable value={projectsActivity}>
                        <Column
                          field="name"
                          header="Name"
                          expander
                          editor={typeEditor}
                        ></Column>
                        <Column header="Budget" field="budget" />
                        <Column header="Action" body={userAction}></Column>
                      </TreeTable>
                    </div>
                  </div>
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

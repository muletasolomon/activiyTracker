import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useAddProject, useFetchProjectList } from "../../api/ApiClient";
import { DefaultBtn } from "../form/DefaultBtn";
import { useAppDispatch } from "../../store/store";
import { selectTask } from "../../store/features/taskActivitySlice";
import { useEffect, useState } from "react";
import { TemplateDialog } from "../TemplateDialog";
import { ControlledInput } from "../form/ControlledInput";

export const ProjectList = ({}) => {
  const dispatch = useAppDispatch();

  const { projects, refetchData, setRefetchData } = useFetchProjectList();

  const {setBudget,setDescription,setProjectName,setSubmit}=useAddProject();

  const [showAddProject, setShowAddProject] = useState(false);

  const onProjectSelect = (project) => {
    console.log(project);
    dispatch(selectTask(project.id));
  };

  const toggleAddProject = () => {
    setShowAddProject(!showAddProject);
  };

  const addProject = () => {
    toggleAddProject();
    setSubmit(true);
    setTimeout(() => {
        setRefetchData(!refetchData);
    }, 600);
  };

  const projectAction = (projectRowData) => {
    return (
      <Button
        icon="pi pi-angle-double-right"
        iconPos="right"
        onClick={() => onProjectSelect(projectRowData)}
      />
    );
  };
  return (
    <>
      <h2>Projects</h2>
      <Divider />
      <DefaultBtn name={"Add Project"} callBack={toggleAddProject} />
      {showAddProject && (
        <TemplateDialog
          isVisible={showAddProject}
          onHide={toggleAddProject}
          title={"Add Project"}
          render={(dialog) => (
            <>
              <div className="my-2">
                <ControlledInput
                  onUpdate={(val) => setProjectName(val)}
                  type={"text"}
                  placeholder={"Project Name"}
                />
              </div>

              <div className="my-2">
                <ControlledInput
                  onUpdate={(val) => setDescription(val)}
                  type={"text"}
                  placeholder={"Description"}
                />
              </div>
              <div className="my-2">
                <ControlledInput
                  onUpdate={(val) => setBudget(val)}
                  type={"text"}
                  placeholder={"Budget"}
                />
              </div>

              <Button
                icon="pi pi-plus"
                iconPos="right"
                label="Add Project"
                className="my-2 ml-4 p-button-outlined p-button-sm"
                onClick={() => addProject()}
              />
            </>
          )}
        ></TemplateDialog>
      )}
      <Divider />
      <div className="card">
        <DataTable value={projects} responsiveLayout="scroll">
          <Column field="name" header="Project"></Column>
          <Column header="Action" body={projectAction} />
        </DataTable>
      </div>
    </>
  );
};

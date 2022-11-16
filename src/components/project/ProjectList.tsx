import {DataTable} from "primereact/datatable";
import {Divider} from "primereact/divider";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {useFetchProjectList} from "../../api/ApiClient";
import {DefaultBtn} from "../form/DefaultBtn";
import {useAppDispatch} from "../../store/store";
import {selectTask} from "../../store/features/taskActivitySlice";

export const ProjectList = ({}) => {
    const dispatch=useAppDispatch();
    const {projects}=useFetchProjectList();


    const onProjectSelect=(project)=>{
        console.log(project);
        dispatch(selectTask(project.id));
    }

    const projectAction=(projectRowData)=>{
        return <Button icon="pi pi-angle-double-right" iconPos="right" onClick={()=>onProjectSelect(projectRowData)} />
    }
    return (
        <>
            <h2>Projects</h2>
            <Divider/>
            <div className="card">
                <DataTable value={projects} responsiveLayout="scroll">
                    <Column field="name" header="Project"></Column>
                    <Column header='Action' body={projectAction}/>
                </DataTable>
            </div>

        </>
    )
}
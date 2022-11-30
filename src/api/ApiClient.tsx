import {useEffect, useState} from "react";

export function useFetchProjectList() {
    const [projects,setProjects]=useState([]);
    const [refetchData,setRefetchData]=useState([]);

    useEffect(()=>{
        const fetchTaskList=async ()=>{
            fetch('http://196.189.53.130:20998/testApi/rest/subactivities/getProjectList?start=0&end=1000')
                .then(resp=>resp.json())
                .then(data=>setProjects(data));
        };

        fetchTaskList();

    },[refetchData]);

    return {projects,refetchData,setRefetchData};
}


export function useAddProject() {
    const [projectName,setProjectName]=useState();
    const [budget,setBudget]=useState();
    const [description,setDescription]=useState();
    const [submit,setSubmit]=useState(false);

    const data={
        name:projectName,
        description:description,
        projectBudget:budget
    };


    useEffect(()=>{
        const submitAddProject=async ()=>{
            fetch('http://196.189.53.130:20998/testApi/rest/subactivities/addProject', {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                mode: "cors",
                body:JSON.stringify(data)
              })
                .then(resp=>resp.json());
        };

        if(submit){
            submitAddProject();
        }

        setSubmit(false);

    },[submit]);

    return {setProjectName,setBudget,setDescription,setSubmit};
}




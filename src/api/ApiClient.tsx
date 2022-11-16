import {useEffect, useState} from "react";

export function useFetchProjectList() {
    const [projects,setProjects]=useState([]);

    useEffect(()=>{
        const fetchTaskList=async ()=>{
            fetch('http://196.189.53.130:20998/testApi/rest/subactivities/getProjectList?start=0&end=1000')
                .then(resp=>resp.json())
                .then(data=>setProjects(data));
        };

        fetchTaskList();

    },[]);

    return {projects};
}
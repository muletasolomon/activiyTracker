
import axios from "axios";
import { Button, Password } from "primereact";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { ControlledInput } from "./form/ControlledInput";
import { FormInput } from "../components/form/FormInput";

export default function() {
  const [name,setName]= useState()
  const [password,setPassord] = useState();
  const navigate = useNavigate();
  const addMaterialCostCallBack = () => {
    
    const url = "http://196.189.53.130:20998/testApi/rest/auth";
    let formData = {
      "username":name
    ,"password":password}
    axios.post(url,formData,{
      headers:{"Content-Type" : "application/json"}})
    .then(res => {
      console.log(res)
       if(res.data.authorities === "ADMIN")
       navigate(`Home`)

    })
    .catch(err => console.log(err));
  }
  return (
    <div className="Auth-form-container">
      <div className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            
            <FormInput
            defaultValue={""}
            labelName={"Enter Username"}
            onUpdate={(val) => setName(val)}
          />
          </div>
          <div className="form-group mt-3">
          <div className="flex flex-column">
            <label className="py-2 text-base font-bold">{"Enter password"}</label>

            <ControlledInput onUpdate={(val) => setPassord(val)} defaultValue={""} type={"password"}/>
          </div>
           
          </div>
          <div className="d-grid gap-2 mt-3 login-button-holder">
            <button  type="button" className="btn btn-primary login100-form-btn" onClick={() => addMaterialCostCallBack()}>
              Login
            </button>
          </div>
        
        </div>
      </div>
    </div>
  )
}
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addKey, removeKey } from "../../store/features/taskActivitySlice";
import { FormInput } from "../form/FormInput";
import { useNavigate } from "react-router-dom";

export const AddKeyDialog = ({ onHide, visible }) => {
  const dispatch = useAppDispatch();

  const [key, setKey] = useState();
  const [description, setDiscription] = useState();

  const uploadToServer = ()=>{
    let request = {
      "id":0,
      "code":key,
      "descirption":description,
      "updatedOn":"2022-10-06T06:01:21.260Z"
    }
    let data = async()=>await fetch("http://196.189.53.130:20998/testApi/rest/registrationResource/registerCostCode",{
          
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
        onHide();
        window.location.reload();
          return pro
      
      }).catch(error => {
          console.log(error);
      });
      data();
  }

  return (
    <Dialog
      header="Add Key"
      visible={visible}
      onHide={onHide}
      style={{ width: "40vw" }}
    >
      <FormInput
        defaultValue={key}
        onUpdate={(data) => setKey(data)}
        labelName="CostCode"
      />

      <FormInput
        defaultValue={description}
        onUpdate={(data) => setDiscription(data)}
        labelName="Activity"
      />

      <Button
        type="button"
        icon="pi pi-key"
        label="Add Cost Code"
        className="p-button-success p-button-outlined my-2 p-button-sm"
        onClick={(event) => {
          uploadToServer();
        }}
        aria-controls="popup_menu"
        aria-haspopup
      />
    </Dialog>
  );
};

export const KeyDialog = ({ onHide, visible,keys }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [toggleAddKey, setToggleAddKey] = useState(false);

  
  useEffect(() => {
  }, [keys]);

  const removeKeyAction = (keyModel) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-outlined border-0"
        onClick={(event) => {
          dispatch(removeKey(keyModel));
        }}
        aria-controls="popup_menu"
        aria-haspopup
      />
    );
  };
  const reportAction = (keyModel) => {
    return (
      <Button
      icon="pi-angle-double-right"
        className="p-button-outlined text-500 border-0"
        onClick={(event) => {
          navigate(`costCodeReport/`)
        }}
        aria-controls="popup_menu"
        aria-haspopup
      />
    );
  };

  return (
    <Dialog
      header="Manage Cost Codes"
      visible={visible}
      onHide={onHide}
      style={{ width: "60vw" }}
    >
      {toggleAddKey && (
        <AddKeyDialog
          visible={toggleAddKey}
          onHide={() => setToggleAddKey(!toggleAddKey)}
        />
      )}
      <Button
        type="button"
        icon="pi pi-key"
        label="Add Cost Code"
        className="p-button-success p-button-outlined my-2 p-button-sm"
        onClick={(event) => {
          setToggleAddKey(!toggleAddKey);
        }}
        aria-controls="popup_menu"
        aria-haspopup
      />
      {console.log(keys)}
      <DataTable value={keys} stripedRows size="small">
        <Column header="Cost Code" field="costCode" />
        <Column header="Activity" field="description" />
        <Column header="Action" body={removeKeyAction} />
      </DataTable>
    </Dialog>
  );
};

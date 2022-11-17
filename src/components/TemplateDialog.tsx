import { Dialog } from "primereact/dialog";
import React from "react";

export class TemplateDialog extends React.Component {


    render(){
        return (
            <Dialog
              header={this.props.title}
              visible={this.props.isVisible}
              style={{ width: "30vw" }}
              onHide={() => this.props.onHide()}
            >
                {this.props.render(this.props.dialog)}
            </Dialog>
          );
    }
}

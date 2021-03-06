import React from 'react';
import ReactDOM from 'react-dom';
import FormBuilder from '../FormBuilder.jsx';
import {FormControl} from 'react-bootstrap';
import api from '../../../services/api';
import {ToastContainer, ToastMessage} from 'react-toastr';
import {Redirect} from "react-router-dom";

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

/**
 * Handle finding schema building
 */
class Build extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            schemaName: '',
        };

        this.saveSchema = this.saveSchema.bind(this);
        this.onSchemaNameChange = this.onSchemaNameChange.bind(this);
        this.showToastSuccess = this.showToastSuccess.bind(this);
    }

    /**
     * Send a new finding schema to api
     * @async
     * @param schemaObj - Schema object retrieved from plugin
     * @returns {Promise.<void>}
     */
    async saveSchema(schemaObj) {
        let schema = {
            name: this.state.schemaName,
            definition: schemaObj
        };

        if (this.state.schemaName) {
            await api.createFindingSchema(schema);
            this.showToastSuccess();
        } else {
            this.showToastError();
        }
    }

    /**
     * Handle schema name change
     * @param e
     */
    onSchemaNameChange(e) {
        this.setState({
            schemaName: e.target.value
        });
    }

    /**
     * Show success toast and clear form
     */
    showToastSuccess() {
        this.refs.container.success('Schema was created', 'Success', {
            closeButton: true,
        });

        fb.actions.clearFields();
        ReactDOM.findDOMNode(this.refs.schemaName).value = '';
        this.setState({
            schemaName: '',
        })
    }

    /**
     * Show error toast
     */
    showToastError() {
        this.refs.container.error('Schema name is missing!', 'Error', {
            closeButton: true,
        });
    }

    render() {
        return (
            <div style={{margin: '20px 20%'}}>
                <ToastContainer
                    toastMessageFactory={ToastMessageFactory}
                    ref="container"
                    className="toast-top-right"
                />

                <FormControl
                    type="text"
                    value={this.state.schemaName}
                    ref="schemaName"
                    placeholder="Enter name"
                    onChange={this.onSchemaNameChange}
                    style={{marginBottom: '15px', border: '3px dashed #ccc'}}
                />
                <FormBuilder sendSchema={this.saveSchema} />
            </div>
        )
    }
}

export default Build;
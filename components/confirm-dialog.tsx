import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import {Component} from "react";

export default class ConfirmDialog extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.handleConfirm = this.handleConfirm.bind(this)
    }

    handleConfirm() {
        this.props.handleClose()
        this.props.handleConfirm()
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {this.props.title}
                    </DialogTitle>
                    {this.props.description && (
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {this.props.description}
                            </DialogContentText>
                        </DialogContent>
                    )}
                    <DialogActions>
                        <Button onClick={this.props.handleClose}>Cancel</Button>
                        <Button onClick={this.handleConfirm} autoFocus>Delete</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
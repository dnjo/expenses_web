import React, {Component} from "react";
import {apiPost, apiPut} from "../common";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";

export default class ExpenseStatusForm extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { expense: '' }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (!this.props.editExpenseObject || this.props.editExpenseObject === prevProps.editExpenseObject) {
            return
        }
        this.setState({
            expense: this.props.editExpenseObject.expense.id,
            amount: this.props.editExpenseObject.amount / 100
        })
    }

    handleSubmit() {
        const data = {
            expense_id: this.state.expense,
            amount: parseInt(this.state.amount) * 100
        }
        if (this.props.editExpenseObject) {
            apiPut(`time_periods/${this.props.id}/expense_statuses/${this.props.editExpenseObject.id}`, data)
                .then(response => response.json())
                .then((expenseStatus) => {
                    this.props.onSubmitSuccess(expenseStatus)
                    this.props.handleClose()
                })
        } else {
            apiPost(`time_periods/${this.props.id}/expense_statuses`, data)
                .then(response => response.json())
                .then((expenseStatus) => {
                    this.props.onSubmitSuccess(expenseStatus)
                    this.props.handleClose()
                })
        }
    }

    render() {
        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.handleClose}>
                    <DialogTitle>{this.props.editExpenseObject ? 'Update' : 'New'} time period expense</DialogTitle>
                    <DialogContent sx={{ width: 350 }}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Expense</InputLabel>
                            <Select
                                onChange={(e) => this.setState({ expense: e.target.value })}
                                value={this.state.expense}>
                                {this.props.expenses.map((i: any) => (
                                    <MenuItem key={i.id} value={i.id}>
                                        {i.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="expense-status-amount"
                            label="Amount"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={this.state.amount}
                            onChange={(e) => this.setState({ amount: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose}>Cancel</Button>
                        <Button onClick={this.handleSubmit}>{this.props.editExpenseObject ? 'Update' : 'Create'}</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

import {NextPage} from "next";
import React, {Component, useState} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {useRouter} from "next/router";

class FormContainer extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { expense: '', data: null }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        fetch('/expenses-api/expenses')
            .then(response => response.json())
            .then(json => this.setState({data: json}))
    }

    handleSubmit(event: any) {
        const data = {
            expense_id: this.state.expense,
            amount: parseInt(this.state.amount) * 100
        }
        fetch(`/expenses-api/time_periods/${this.props.id}/expense_statuses`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(() => this.props.onSubmitSuccess())
    }

    render() {
        if (!this.state.data) {
            return null
        }

        return (
            <>
                <Stack spacing={2}>
                    <FormControl fullWidth>
                        <InputLabel>Expense</InputLabel>
                        <Select onChange={(e) => this.setState({ expense: e.target.value })} value={this.state.expense}>
                            {this.state.data.map((i: any) => (
                                <MenuItem key={i.id} value={i.id}>
                                    {i.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField onChange={(e) => this.setState({ amount: e.target.value })} type="number" id="expense-status-amount" label="Amount" />
                </Stack>
                <Button onClick={this.handleSubmit} sx={{marginTop: 2}} variant="contained">Create</Button>
            </>
        )
    }
}

const NewExpense: NextPage = () => {
    const router = useRouter()
    const {id} = router.query

    const routeToPeriod = () => router.push(`/periods/${id}`)

    return (
        <>
            <FormContainer id={id} onSubmitSuccess={routeToPeriod} />
            <Button onClick={routeToPeriod} sx={{marginTop: 2}} variant="contained">Back</Button>
        </>
    )
}

export default NewExpense

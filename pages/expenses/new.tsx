import {NextPage} from "next";
import React, {Component} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {useRouter} from "next/router";

class FormContainer extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit() {
        const data = {
            title: this.state.title
        }
        fetch('/expenses-api/expenses', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => this.props.onSubmitSuccess())
    }

    render() {
        return (
            <>
                <Stack spacing={2}>
                    <TextField onChange={(e) => this.setState({ title: e.target.value })} id="expense-title" label="Title" />
                </Stack>
                <Button onClick={this.handleSubmit} sx={{marginTop: 2}} variant="contained">Create</Button>
            </>
        )
    }
}

const NewExpense: NextPage = () => {
    const router = useRouter()
    const routeToExpenses = () => {
        router.push('/expenses')
    }

    return (
        <>
            <FormContainer onSubmitSuccess={routeToExpenses} />
            <Button onClick={() => router.push('/expenses')} sx={{marginTop: 2}} variant="contained">Back</Button>
        </>
    )
}

export default NewExpense

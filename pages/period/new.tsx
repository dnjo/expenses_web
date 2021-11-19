import {NextPage} from "next";
import React, {Component} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {useRouter} from "next/router";

class FormContainer extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { data: null }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit() {
        const data = {
            year: parseInt(this.state.year),
            month: parseInt(this.state.month)
        }
        fetch('/expenses-api/time_periods', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((period) => this.props.onSubmitSuccess(period.id))
    }

    render() {
        return (
            <>
                <Stack spacing={2}>
                    <TextField onChange={(e) => this.setState({ year: e.target.value })} type="number" id="period-year" label="Year" />
                    <TextField onChange={(e) => this.setState({ month: e.target.value })} type="number" id="period-month" label="Month" />
                </Stack>
                <Button onClick={this.handleSubmit} sx={{marginTop: 2}} variant="contained">Create</Button>
            </>
        )
    }
}

const NewPeriod: NextPage = () => {
    const router = useRouter()
    const routeToNewPeriod = (id: any) => {
        router.push(`/period/${id}`)
    }

    return (
        <>
            <FormContainer onSubmitSuccess={routeToNewPeriod} />
            <Button onClick={() => router.push('/')} sx={{marginTop: 2}} variant="contained">Back</Button>
        </>
    )
}

export default NewPeriod

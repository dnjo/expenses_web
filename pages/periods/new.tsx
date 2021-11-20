import {NextPage} from "next";
import React, {Component} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {useRouter} from "next/router";
import {apiPost} from "../../common";

class FormContainer extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { data: null, year: new Date().getFullYear() }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit() {
        const data = {
            year: parseInt(this.state.year),
            month: parseInt(this.state.month)
        }
        apiPost('time_periods', data)
            .then(response => response.json())
            .then((period) => this.props.onSubmitSuccess(period.id))
    }

    render() {
        return (
            <>
                <Stack spacing={2}>
                    <TextField
                        onChange={(e) => this.setState({ year: e.target.value })}
                        type="number"
                        id="period-year"
                        label="Year"
                        value={this.state.year} />
                    <FormControl>
                        <InputLabel>Month</InputLabel>
                        <Select
                            value={this.state.month}
                        onChange={(e) => this.setState({ month: e.target.value })}>
                            <MenuItem value={1}>January</MenuItem>
                            <MenuItem value={2}>February</MenuItem>
                            <MenuItem value={3}>March</MenuItem>
                            <MenuItem value={4}>April</MenuItem>
                            <MenuItem value={5}>May</MenuItem>
                            <MenuItem value={6}>June</MenuItem>
                            <MenuItem value={7}>July</MenuItem>
                            <MenuItem value={8}>August</MenuItem>
                            <MenuItem value={9}>September</MenuItem>
                            <MenuItem value={10}>October</MenuItem>
                            <MenuItem value={11}>November</MenuItem>
                            <MenuItem value={12}>December</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <Button onClick={this.handleSubmit} sx={{marginTop: 2}} variant="contained">Create</Button>
            </>
        )
    }
}

const NewPeriod: NextPage = () => {
    const router = useRouter()
    const routeToNewPeriod = (id: any) => {
        router.push(`/periods/${id}`)
    }

    return (
        <>
            <FormContainer onSubmitSuccess={routeToNewPeriod} />
            <Button onClick={() => router.push('/')} sx={{marginTop: 2}} variant="contained">Back</Button>
        </>
    )
}

export default NewPeriod

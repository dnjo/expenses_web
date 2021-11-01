import type {NextPage} from 'next'
import React, {Component} from "react";
import {
    Card,
    CardContent,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useRouter} from "next/router";

class ItemContainer extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {}
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        fetch(`/expenses-api/time_periods/${this.props.id}/expense_statuses`)
            .then(response => response.json())
            .then(json => this.setState({data: json}))
    }

    render() {
        if (!this.state.data) {
            return null
        }

        return (
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Expense</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Paid</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.data.map((row: any) => (
                            <TableRow
                                key={row.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell component="th" scope="row">
                                    {row.expense.title}
                                </TableCell>
                                <TableCell align="right">{row.amount}</TableCell>
                                <TableCell align="right">{row.paid ? 'Yes' : 'No'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

const Id: NextPage = () => {
    const router = useRouter()
    const {id} = router.query

    return (
        <>
            <ItemContainer id={id}/>
        </>
    )
}

export default Id

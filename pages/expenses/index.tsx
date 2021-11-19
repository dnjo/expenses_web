import type {NextPage} from 'next'
import React, {Component} from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useRouter} from "next/router";

class ItemContainer extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {}
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    fetchExpenses() {
        fetch('/expenses-api/expenses')
            .then(response => response.json())
            .then(json => this.setState({ data: json }))
    }

    componentDidMount() {
        this.fetchExpenses()
    }

    render() {
        if (!this.state.data) {
            return null
        }

        return (
            <>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Expense</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.data.map((row: any) => (
                                <TableRow
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                    <TableCell component="th" scope="row">
                                        {row.title}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        )
    }
}

const Expenses: NextPage = () => {
    const router = useRouter()
    const {id} = router.query

    return (
        <>
            <ItemContainer id={id}/>
        </>
    )
}

export default Expenses

import type {NextPage} from 'next'
import React, {Component} from "react";
import {
    Button, IconButton,
    Paper, SpeedDial, SpeedDialIcon,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {useRouter} from "next/router";
import Link from 'next/link'
import MuiLink from '@mui/material/Link';

class ItemContainer extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {}
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    fetchStatuses() {
        fetch(`/expenses-api/time_periods/${this.props.id}/expense_statuses`)
            .then(response => response.json())
            .then(json => this.setState({ data: json }))
    }

    componentDidMount() {
        this.fetchStatuses()
    }

    deleteExpenseStatus(id: any) {
        fetch(`/expenses-api/time_periods/${this.props.id}/expense_statuses/${id}`, {
            method: 'DELETE'
        }).then(() => this.fetchStatuses())
    }

    togglePaid(id: any) {
        fetch(`/expenses-api/time_periods/${this.props.id}/expense_statuses/${id}/toggle_paid`, {
            method: 'PUT'
        }).then(() => this.fetchStatuses())
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
                                <TableCell align="right">Amount</TableCell>
                                <TableCell align="right">Paid</TableCell>
                                <TableCell align="right">Actions</TableCell>
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
                                    <TableCell align="right">{row.amount / 100}</TableCell>
                                    <TableCell align="right">
                                        <MuiLink component="button" color="inherit" onClick={() => this.togglePaid(row.id)}>
                                            {row.paid ? (<CheckBoxIcon />) : (<CheckBoxOutlineBlankIcon />)}
                                        </MuiLink>
                                    </TableCell>
                                    <TableCell align="right">
                                        <MuiLink
                                            component="button"
                                            color="inherit"
                                            onClick={() => this.deleteExpenseStatus(row.id)}>
                                            <DeleteIcon />
                                        </MuiLink>
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

const Id: NextPage = () => {
    const router = useRouter()
    const {id} = router.query

    return (
        <>
            <Link href={`/periods/${id}/new_expense`} passHref>
                <SpeedDial
                    ariaLabel="New expense dial"
                    sx={{ position: 'absolute', bottom: 50, right: 50 }}
                    icon={<SpeedDialIcon />}
                />
            </Link>
            <ItemContainer id={id} onDelete={() => router.push('/')}/>
        </>
    )
}

export default Id

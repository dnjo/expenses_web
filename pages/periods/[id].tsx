import type {NextPage} from 'next'
import React, {Component} from "react";
import {
    Paper,
    SpeedDial,
    SpeedDialIcon,
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
import MuiLink from '@mui/material/Link';
import {apiDelete, apiGet, apiPut} from "../../common";
import ConfirmDialog from "../../components/confirm-dialog";
import ExpenseStatusForm from "../../components/expense-status-form";

class ItemContainer extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { confirmDeleteOpen: false }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.openConfirmDialog = this.openConfirmDialog.bind(this)
        this.closeConfirmDialog = this.closeConfirmDialog.bind(this)
        this.addExpenseStatus = this.addExpenseStatus.bind(this)
    }

    componentDidMount() {
        apiGet('expenses')
            .then(response => response.json())
            .then(json => this.setState({ expenses: json }))
        apiGet(`time_periods/${this.props.id}/expense_statuses`)
            .then(response => response.json())
            .then(json => this.setState({ data: json }))
    }

    addExpenseStatus(expenseStatus: any) {
        const expenses = [...this.state.data, expenseStatus]
        this.setState({ data: expenses })
    }

    deleteExpenseStatus(id: any) {
        apiDelete(`time_periods/${this.props.id}/expense_statuses/${id}`)
            .then(() => {
                const expenses = this.state.data.filter((e: any) => e.id !== id)
                this.setState({ data: expenses })
            })
    }

    togglePaid(id: any) {
        apiPut(`time_periods/${this.props.id}/expense_statuses/${id}/toggle_paid`)
            .then(() => {
                const expenses = this.state.data.map((expense: any) => {
                    if (expense.id === id) {
                        expense.paid = !expense.paid
                    }
                    return expense
                })
                this.setState({ data: expenses })
            })
    }

    openConfirmDialog(object: any) {
        this.setState({ confirmDeleteObject: object })
        this.setState({ confirmDeleteOpen: true })
    }

    closeConfirmDialog() {
        this.setState({ confirmDeleteOpen: false })
    }

    render() {
        if (!this.state.data || !this.state.expenses) {
            return null
        }

        return (
            <>
                <ExpenseStatusForm
                    open={this.props.open}
                    handleClose={this.props.handleClose}
                    onSubmitSuccess={this.addExpenseStatus}
                    id={this.props.id}
                    expenses={this.state.expenses} />
                <ConfirmDialog
                    open={this.state.confirmDeleteOpen}
                    title="Delete expense"
                    description={`Do you want to delete expense ${this.state.confirmDeleteObject?.expense.title}?`}
                    handleClose={this.closeConfirmDialog}
                    handleConfirm={() => this.deleteExpenseStatus(this.state.confirmDeleteObject.id)}
                />
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
                                            onClick={() => this.openConfirmDialog(row)}>
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

const TimePeriod: NextPage = () => {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const {id} = router.query

    return (
        <>
            <SpeedDial
                onClick={() => setOpen(true)}
                ariaLabel="New expense dial"
                sx={{ position: 'fixed', bottom: 50, right: 50 }}
                icon={<SpeedDialIcon />}
            />
            <ItemContainer
                id={id}
                open={open}
                handleClose={() => setOpen(false)}/>
        </>
    )
}

export default TimePeriod

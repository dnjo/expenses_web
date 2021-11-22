import type {NextPage} from 'next'
import React, {Component} from "react";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
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
import {apiDelete, apiGet, apiPost, apiPut} from "../../common";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import ConfirmDialog from "../../components/confirm-dialog";

class NewExpenseStatusForm extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { expense: '' }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        apiGet('expenses')
            .then(response => response.json())
            .then(json => this.setState({ data: json }))
    }

    handleSubmit() {
        const data = {
            expense_id: this.state.expense,
            amount: parseInt(this.state.amount) * 100
        }
        apiPost(`time_periods/${this.props.id}/expense_statuses`, data)
            .then(response => response.json())
            .then((expenseStatus) => {
                this.props.onSubmitSuccess(expenseStatus)
                this.props.handleClose()
            })
    }

    render() {
        if (!this.state.data) {
            return null
        }

        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.handleClose}>
                    <DialogTitle>New time period expense</DialogTitle>
                    <DialogContent sx={{ width: 350 }}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Expense</InputLabel>
                            <Select onChange={(e) => this.setState({ expense: e.target.value })} value={this.state.expense}>
                                {this.state.data.map((i: any) => (
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
                            value={this.state.year}
                            onChange={(e) => this.setState({ amount: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose}>Cancel</Button>
                        <Button onClick={this.handleSubmit}>Create</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

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
        if (!this.state.data) {
            return null
        }

        return (
            <>
                <NewExpenseStatusForm
                    open={this.props.open}
                    handleClose={this.props.handleClose}
                    onSubmitSuccess={this.addExpenseStatus}
                    id={this.props.id} />
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

const Id: NextPage = () => {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const {id} = router.query

    return (
        <>
            <SpeedDial
                onClick={() => setOpen(true)}
                ariaLabel="New expense dial"
                sx={{ position: 'absolute', bottom: 50, right: 50 }}
                icon={<SpeedDialIcon />}
            />
            <ItemContainer
                id={id}
                open={open}
                handleClose={() => setOpen(false)}/>
        </>
    )
}

export default Id

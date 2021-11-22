import type {NextPage} from 'next'
import React, {Component} from "react";
import {
    Button,
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
import MuiLink from '@mui/material/Link';
import {apiDelete, apiGet, apiPost} from "../common";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import ConfirmDialog from "../components/confirm-dialog";

class NewExpenseForm extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { data: null }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit() {
        const data = {
            title: this.state.title
        }
        apiPost('expenses', data)
            .then(response => response.json())
            .then(expense => {
                this.props.onSubmitSuccess(expense)
                this.props.handleClose()
            })
    }

    render() {
        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.handleClose}>
                    <DialogTitle>New expense</DialogTitle>
                    <DialogContent sx={{ width: 350 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="expense-title"
                            label="Title"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => this.setState({ title: e.target.value })}
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
        super(props)

        this.state = { confirmDeleteOpen: false }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.openConfirmDialog = this.openConfirmDialog.bind(this)
        this.closeConfirmDialog = this.closeConfirmDialog.bind(this)
        this.addExpense = this.addExpense.bind(this)
    }

    componentDidMount() {
        apiGet('expenses')
            .then(response => response.json())
            .then(json => this.setState({ data: json }))
    }

    deleteExpense(id: any) {
        apiDelete(`expenses/${id}`)
            .then(() => {
                const expenses = this.state.data.filter((e: any) => e.id !== id)
                this.setState({ data: expenses })
            })
    }

    addExpense(expense: any) {
        const expenses = [...this.state.data, expense]
        this.setState({ data: expenses })
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
                <NewExpenseForm
                    open={this.props.open}
                    handleClose={this.props.handleClose}
                    onSubmitSuccess={this.addExpense} />
                <ConfirmDialog
                    open={this.state.confirmDeleteOpen}
                    title="Delete expense"
                    description={`Do you want to delete expense ${this.state.confirmDeleteObject?.title}?`}
                    handleClose={this.closeConfirmDialog}
                    handleConfirm={() => this.deleteExpense(this.state.confirmDeleteObject.id)}
                />
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Expense</TableCell>
                                <TableCell align="right">Actions</TableCell>
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

const Expenses: NextPage = () => {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <SpeedDial
                onClick={() => setOpen(true)}
                ariaLabel="New expense dial"
                sx={{ position: 'fixed', bottom: 50, right: 50 }}
                icon={<SpeedDialIcon />}
            />
            <ItemContainer
                open={open}
                handleClose={() => setOpen(false)} />
        </>
    )
}

export default Expenses

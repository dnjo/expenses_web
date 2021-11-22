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
import Link from 'next/link'
import DeleteIcon from "@mui/icons-material/Delete";
import MuiLink from '@mui/material/Link';
import {apiDelete, apiGet, apiPost} from "../common";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import {useRouter} from "next/router";
import ConfirmDialog from "../components/confirm-dialog";

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

class NewTimePeriodForm extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { year: new Date().getFullYear(), month: 1 }
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
            <div>
                <Dialog open={this.props.open} onClose={this.props.handleClose}>
                    <DialogTitle>New time period</DialogTitle>
                    <DialogContent sx={{ width: 350 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="year"
                            label="Year"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={this.state.year}
                            onChange={(e) => this.setState({ year: e.target.value })}
                        />
                        <FormControl variant="standard" fullWidth>
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
    }

    componentDidMount() {
        apiGet('time_periods')
            .then(response => response.json())
            .then(json => this.setState({ data: json }))
    }

    deleteTimePeriod(id: any) {
        apiDelete(`time_periods/${id}`)
            .then(() => {
                const timePeriods = this.state.data.filter((t: any) => t.id !== id)
                this.setState({ data: timePeriods })
            })
    }

    openConfirmDialog(object: any) {
        this.setState({ confirmDeleteObject: object })
        this.setState({ confirmDeleteOpen: true })
    }

    closeConfirmDialog() {
        this.setState({ confirmDeleteOpen: false })
    }

    formatTimePeriod(period: any) {
        if (!period) {
            return ''
        }
        return `${months[period.month - 1]} ${period.year}`
    }

    render() {
        if (!this.state.data) {
            return null
        }

        return (
            <>
                <ConfirmDialog
                    open={this.state.confirmDeleteOpen}
                    title="Delete time period"
                    description={`Do you want to delete time period ${this.formatTimePeriod(this.state.confirmDeleteObject)}?`}
                    handleClose={this.closeConfirmDialog}
                    handleConfirm={() => this.deleteTimePeriod(this.state.confirmDeleteObject.id)}
                />
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Time period</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.data.map((row: any) => (
                                <TableRow
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                    <TableCell component="th" scope="row">
                                        <Link key={row.id} href={`/periods/${row.id}`}>
                                            <a>{this.formatTimePeriod(row)}</a>
                                        </Link>
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

const Home: NextPage = () => {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    return (
        <>
            <NewTimePeriodForm
                open={open}
                handleClose={() => setOpen(false)}
                onSubmitSuccess={(id: any) => router.push(`/periods/${id}`)} />
            <SpeedDial
                onClick={() => setOpen(true)}
                ariaLabel="New time period dial"
                sx={{ position: 'fixed', bottom: 50, right: 50 }}
                icon={<SpeedDialIcon />}
            />
            <ItemContainer/>
        </>
    )
}

export default Home

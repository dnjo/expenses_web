import type {NextPage} from 'next'
import React, {Component} from "react";
import {
    Button,
    Card,
    CardContent, FormControl, InputLabel, MenuItem,
    Paper, Select,
    SpeedDial,
    SpeedDialIcon, Table, TableBody, TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import Link from 'next/link'
import DeleteIcon from "@mui/icons-material/Delete";
import MuiLink from '@mui/material/Link';
import {apiDelete, apiGet, apiPost} from "../common";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import {useRouter} from "next/router";
import ConfirmDialog from "../components/confirm-dialog";

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
        super(props);

        this.state = {}
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    fetchTimePeriods() {
        apiGet('time_periods')
            .then(response => response.json())
            .then(json => this.setState({ data: json }))
    }

    componentDidMount() {
        this.fetchTimePeriods()
    }

    deleteTimePeriod(id: any) {
        apiDelete(`time_periods/${id}`)
            .then(() => this.fetchTimePeriods())
    }

    render() {
        if (!this.state.data) {
            return null
        }

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

        return (
            <>
                <ConfirmDialog
                    open={this.state.confirmDeleteId}
                    title="Delete time period?"
                    handleClose={() => this.setState( { confirmDeleteId: null })}
                    handleConfirm={() => this.deleteTimePeriod(this.state.confirmDeleteId)}
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
                                            <a>
                                                {months[row.month - 1]} {row.year}
                                            </a>
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">
                                        <MuiLink
                                            component="button"
                                            color="inherit"
                                            onClick={() => this.setState({ confirmDeleteId: row.id })}>
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
                sx={{ position: 'absolute', bottom: 50, right: 50 }}
                icon={<SpeedDialIcon />}
            />
            <ItemContainer/>
        </>
    )
}

export default Home

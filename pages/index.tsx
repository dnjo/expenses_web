import type {NextPage} from 'next'
import React, {Component} from "react";
import {
    Button,
    Card,
    CardContent,
    Paper,
    SpeedDial,
    SpeedDialIcon, Table, TableBody, TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import Link from 'next/link'
import DeleteIcon from "@mui/icons-material/Delete";
import MuiLink from '@mui/material/Link';
import {apiDelete, apiGet} from "../common";

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
                                        onClick={() => this.deleteTimePeriod(row.id)}>
                                        <DeleteIcon />
                                    </MuiLink>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

const Home: NextPage = () => {
    return (
        <>
            <Link href={`/periods/new`} passHref>
                <SpeedDial
                    ariaLabel="New time period dial"
                    sx={{ position: 'absolute', bottom: 50, right: 50 }}
                    icon={<SpeedDialIcon />}
                />
            </Link>
            <ItemContainer/>
        </>
    )
}

export default Home

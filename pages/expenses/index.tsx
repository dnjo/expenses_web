import type {NextPage} from 'next'
import React, {Component} from "react";
import {
    Button,
    Paper,
    SpeedDial, SpeedDialIcon,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {useRouter} from "next/router";
import Link from "next/link";
import DeleteIcon from '@mui/icons-material/Delete';
import MuiLink from '@mui/material/Link';

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

    deleteExpense(id: any) {
        fetch(`/expenses-api/expenses/${id}`, {
            method: 'DELETE'
        }).then(() => this.fetchExpenses())
    }

    render() {
        if (!this.state.data) {
            return null
        }

        return (
            <>
                <Link href={`/expenses/new`} passHref>
                    <SpeedDial
                        ariaLabel="New expense dial"
                        sx={{ position: 'absolute', bottom: 50, right: 50 }}
                        icon={<SpeedDialIcon />}
                    />
                </Link>
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
                                            onClick={() => this.deleteExpense(row.id)}>
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
    const router = useRouter()
    const {id} = router.query

    return (
        <>
            <ItemContainer id={id}/>
        </>
    )
}

export default Expenses

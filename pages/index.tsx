import type {NextPage} from 'next'
import React, {Component} from "react";
import {Button, Card, CardContent, Typography} from "@mui/material";
import Link from 'next/link'

class ItemContainer extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {}
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        fetch('/expenses-api/time_periods')
            .then(response => response.json())
            .then(json => this.setState({data: json}))
    }

    render() {
        if (!this.state.data) {
            return null
        }

        return (this.state.data.map((i: any) => {
            return (
                <Link key={i.id} href={`/period/${i.id}`}>
                    <a>
                        <Card key={i.id} sx={{display: 'flex', minHeight: 140}}>
                            <CardContent>
                                <Typography variant="h4" color="text.secondary">
                                    {i.year}-{i.month}
                                </Typography>
                            </CardContent>
                        </Card>
                    </a>
                </Link>
            )
        }))
    }
}

const Home: NextPage = () => {
    return (
        <>
            <Link href={`/period/new`} passHref>
                <Button variant="contained">New period</Button>
            </Link>
            <ItemContainer/>
        </>
    )
}

export default Home

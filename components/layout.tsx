import {signOut, useSession} from "next-auth/react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {AccountCircle} from "@mui/icons-material";
import {Container, Drawer, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import React from "react";
import Link from 'next/link'
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function Layout({ children }: any) {
    const { status } = useSession({
        required: true
    })
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mainMenuState, setMainMenuState] = React.useState(false);

    const handleMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    if (status === 'loading') {
        return null
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon onClick={() => setMainMenuState(true)} />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link href="/"><a>Expenses</a></Link>
                        </Typography>

                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit">
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}>
                                <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>

            <Drawer
                anchor="left"
                open={mainMenuState}
                onClose={() => setMainMenuState(false)}
            >
                <Box role="presentation" sx={{ width: 250 }}>
                    <List>
                        <Link href="/" passHref>
                            <a onClick={() => setMainMenuState(false)}>
                                <ListItem>
                                    <ListItemIcon><HomeIcon /></ListItemIcon>
                                    <ListItemText>Home</ListItemText>
                                </ListItem>
                            </a>
                        </Link>
                        <Link href="/expenses" passHref>
                            <a onClick={() => setMainMenuState(false)}>
                                <ListItem>
                                    <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
                                    <ListItemText>Expenses</ListItemText>
                                </ListItem>
                            </a>
                        </Link>
                    </List>
                </Box>
            </Drawer>

            <Container sx={{ marginTop: 2 }}>
                {children}
            </Container>
        </>
    )
}
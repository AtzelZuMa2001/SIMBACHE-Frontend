import {AppBar, Box, Button, Stack, Toolbar, Typography} from "@mui/material";
import logo from "../../assets/favicon.webp";
import {AllSecurePages, type SecurePages} from "../../pages/secure/AllSecurePages.ts";
import useAuth from "../../hooks/useAuth.ts";
import {LogoutRounded} from "@mui/icons-material";

interface NavbarProps {
    activePage: SecurePages;
    onPageChange: (page: SecurePages) => void;
}

export default function Navbar({onPageChange}: NavbarProps) {
    const auth = useAuth();
    const name = auth.loginData?.firstName + ' ' + auth.loginData?.lastName;

    return (
        <AppBar component={'nav'}>
            <Toolbar>
                <Box component={'img'} src={logo} width={70} alt={'logo'} />

                <Typography
                    variant={'h5'}
                    component={'h1'}
                    fontWeight={600}
                    color={'#f1f1f1'}
                    sx={{ ml: 2, mt: 0.5 }}
                >
                    SIMBACHE
                </Typography>

                <Stack direction={'row'} spacing={2} flexGrow={1} alignItems={'center'} justifyContent={'center'}>
                    { AllSecurePages.map((item, index) => (
                        <Button
                            key={index}
                            disableRipple
                            onClick={() => onPageChange(item)}
                        >
                            <Typography variant={'body1'} color={'#f1f1f1'} sx={{ p:1 }}>{item.name}</Typography>
                        </Button>
                    ))}
                </Stack>

                <Stack direction={'row'} spacing={2} alignItems={'center'} justifyContent={'center'} >
                    <Typography variant={'body1'} color={'#f1f1f1'} sx={{ p:1 }}>{name}</Typography>
                </Stack>
                
                <Button variant={'contained'} color={'tertiary'} onClick={() => auth.logout()} sx={{ ml: 2 }}>
                    <LogoutRounded sx={{ my: 0.5 }} />
                </Button>
            </Toolbar>
        </AppBar>
    );
}
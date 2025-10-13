import {useState} from "react";
import {Box, Container, Stack, Typography} from "@mui/material";
import Navbar from "../../components/secure/Navbar.tsx";
import {AllSecurePages, type SecurePages} from "./AllSecurePages.ts";
import useAuth from "../../hooks/useAuth.ts";

export default function SecureContainer() {
    const auth = useAuth();

    const [page, setPage] = useState<SecurePages>(AllSecurePages[0]);
    const Content = page.Element;

    if (!auth.loginData) return (
        <Container maxWidth={false} disableGutters >
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100vh'} width={'100vw'}>
                <Typography variant={'h1'} color={'error'} textAlign={'center'}>Acceso no autorizado</Typography>
            </Box>
        </Container>
    );

    return (
        <Box position={'absolute'} width={'100vw'} maxWidth={'100%'} height={'100vh'} top={0} left={0}>
            <Stack direction={'column'} spacing={0} alignItems={'center'} justifyContent={'center'} >
                <Navbar
                    activePage={page}
                    onPageChange={(page: SecurePages) => setPage(page)}
                />

                <Content />
            </Stack>
        </Box>
    );
}
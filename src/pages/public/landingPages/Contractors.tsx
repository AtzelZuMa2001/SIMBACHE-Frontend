import {Box, Stack, Typography} from "@mui/material";
import {EngineeringRounded} from "@mui/icons-material";

export default function Contractors() {
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100vh'}>
            <Stack direction={'column'} spacing={6} alignItems={'center'}>
                <Typography variant={'h1'}>Página en construcción...</Typography>

                <EngineeringRounded sx={{ fontSize: 200 }} />
            </Stack>
        </Box>
    );
}
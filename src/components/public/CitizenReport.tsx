import {Dialog, Card, CardContent, CardHeader} from "@mui/material";//, Typography

interface CitizenReportProps {
    open: boolean;
    onClose: () => void;
}

export default function CitizenReport({ open, onClose }: CitizenReportProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ backdropFilter: 'blur(7px)' }}
        >
            <Card>
                <CardHeader title={'Ayúdanos reportando un bache'} />
                <CardContent>
                    // TODO
                </CardContent>
            </Card>

        </Dialog>
    );
}
import {Container} from "@mui/material";
import Navbar from "../../components/public/Navbar.tsx";
import {useState} from "react";
import {AllLandingPages, type LandingPage} from './AllLandingPages.ts'

export default function LandingPage() {
    const [page, setPage] = useState<LandingPage>(AllLandingPages[0]);
    const Content = page.Element;

    return (
        <Container maxWidth={false} disableGutters>
            <Navbar
                activePage={page}
                onPageChange={(page: LandingPage) => setPage(page)}
            />

            <Content />
        </Container>
    );
}
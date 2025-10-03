import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import HomePage from "../pages/protected/HomePage.tsx";
import LoginPage from "../pages/public/LoginPage.tsx";
import LandingPage from "../pages/public/LandingPage.tsx";
import ContactPage from "../pages/public/ContactPage.tsx";
import ContractorsPage from "../pages/public/ContractorsPage.tsx";
import CitizenReportPage from "../pages/public/CitizenReportPage.tsx";

const MainRouter = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Public routes */}
            <Route path={'/'} element={<LandingPage />} />
            <Route path={'login'} element={<LoginPage />} />
            <Route path={'contact'} element={<ContactPage />} />
            <Route path={'contractors'} element={<ContractorsPage />} />
            <Route path={'report'} element={<CitizenReportPage />} />

            {/* Protected routes */}
            <Route path={'internal'} element={<ProtectedRoute />}>
                <Route path={'home'} element={<HomePage />} />
            </Route>

            {/* Catch-all */}
            <Route path={'*'} element={<NotFoundPage />} />
        </>
    )
);

export default MainRouter;
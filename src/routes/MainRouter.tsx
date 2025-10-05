import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import HomePage from "../pages/protected/HomePage.tsx";
import LoginPage from "../pages/public/LoginPage.tsx";
import LandingPage from "../pages/public/LandingPage.tsx";
import Contact from "../pages/public/landingPages/Contact.tsx";
import Contractors from "../pages/public/landingPages/Contractors.tsx";
import CitizenReport from "../pages/public/landingPages/CitizenReport.tsx";

const MainRouter = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Public routes */}
            <Route path={'/'} element={<LandingPage />} />
            <Route path={'login'} element={<LoginPage />} />
            <Route path={'contact'} element={<Contact />} />
            <Route path={'contractors'} element={<Contractors />} />
            <Route path={'report'} element={<CitizenReport />} />

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
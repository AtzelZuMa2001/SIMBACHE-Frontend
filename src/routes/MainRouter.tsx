import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import SecureContainer from "../pages/secure/SecureContainer.tsx";
import LoginPage from "../pages/public/LoginPage.tsx";
import LandingPage from "../pages/public/LandingPage.tsx";
import Contact from "../pages/public/landingPages/Contact.tsx";
import Contractors from "../pages/public/landingPages/Contractors.tsx";

const MainRouter = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Public routes */}
            <Route path={'/'} element={<LandingPage />} />
            <Route path={'login'} element={<LoginPage />} />
            <Route path={'contact'} element={<Contact />} />
            <Route path={'contractors'} element={<Contractors />} />

            {/* Protected routes */}
            <Route path={'secure'} element={<ProtectedRoute />}>
                <Route path={'home'} element={<SecureContainer />} />
                <Route path={'potholes'} element={<SecureContainer />} />
                <Route path={'reports'} element={<SecureContainer />} />
                <Route path={'administration'} element={<SecureContainer />} />
            </Route>

            {/* Catch-all */}
            <Route path={'*'} element={<NotFoundPage />} />
        </>
    )
);

export default MainRouter;
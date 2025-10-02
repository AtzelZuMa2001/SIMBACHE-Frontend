import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";

const MainRouter = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path={'login'} element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route index element={<HomePage />} />

                <Route path={'*'} element={<NotFoundPage />} />
            </Route>
        </>
    )
);

export default MainRouter;
import { Route, Routes } from "react-router-dom";
import { MintingList } from "./views/Minting/MintingList/MintingList";
import { Project } from "./views/Projects/Project/Project";
import { ListProjects } from "./views/Projects/ListProjects/ListProjects";
import { Team } from "./views/Team/Team";
import { MutateWrapper } from "./views/Mutate/MutateWrapper";
import { MintingProvider } from "./api/minting/MintingContext";
import { StoreListing } from "./views/Store/StoreListing";
import { StoresProvider } from "./api/stores/StoresContext";

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="" element={<MintingList />} />
            <Route path="projects" element={<ListProjects />} />
            <Route path="projects/:contractAddressOrNameIdent" element={<MintingProvider><Project /></MintingProvider>} />
            <Route path="team" element={<Team />} />
            <Route
                path="labs-store"
                element={
                    <StoresProvider>
                        <StoreListing />
                    </StoresProvider>
                }
            />
            <Route path="mutate" element={<MutateWrapper />} />
            <Route path="mutatess" element={<MutateWrapper />} />
        </Routes>

    )
} 
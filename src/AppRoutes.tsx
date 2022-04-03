import { Route, Routes, Navigate } from "react-router-dom";
import { MintProjectWrapper } from "./views/Minting/MintProject/MintProjectWrapper";
import { MintingList } from "./views/Minting/MintingList/MintingList";
import { Project } from "./views/Projects/Project/Project";
import { ListProjects } from "./views/Projects/ListProjects/ListProjects";
import { Team } from "./views/Team/Team";
import { MutateWrapper } from "./views/Mutate/MutateWrapper";
import { MintingProvider } from "./api/minting/MintingContext";

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="" element={<MintingList />} />
            <Route path="minting/:contractAddress" element={<MintProjectWrapper />} />
            {/*     <Route path="minting" element={<MintingList />} /> */}
            <Route path="projects" element={<ListProjects />} />
            <Route path="projects/:contractAddress" element={<MintingProvider><Project /></MintingProvider>} />
            <Route path="team" element={<Team />} />
            <Route path="mutate" element={<MutateWrapper />} />
            <Route path="mutatess" element={<MutateWrapper />} />
        </Routes>

    )
} 
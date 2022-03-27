import { Route, Routes } from "react-router-dom";
import { MintProjectWrapper } from "./views/Minting/MintProject/MintProjectWrapper";
import { MintingList } from "./views/Minting/MintingList/MintingList";
import { Project } from "./views/Projects/Project/Project";
import { ListProjects } from "./views/Projects/ListProjects/ListProjects";
import { Team } from "./views/Team/Team";

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="" element={<div>home</div>} />
            <Route path="minting/:contractAddress" element={<MintProjectWrapper />} />
            <Route path="minting" element={<MintingList />} />
            <Route path="projects" element={<ListProjects />} />
            <Route path="projects/:contractAddress" element={<Project />} />
            <Route path="team" element={<Team />} />
        </Routes>
    )
} 
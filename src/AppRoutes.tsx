import useAccount from "./api/account/useAccount";

import { Route, Routes } from "react-router-dom";
import { MintProjectWrapper } from "./views/Minting/MintProject/MintProjectWrapper";
import { MintingList } from "./views/Minting/MintingList/MintingList";
import { Collection } from "./views/Collection/Collection";

export const AppRoutes: React.FC = () => {

    const acc = useAccount();
    if (!acc) {
        return null;
    }

    return (
        <Routes>
            <Route path="" element={<div>home</div>} />
            <Route path="minting/:contractAddress" element={<MintProjectWrapper />} />
            <Route path="minting" element={<MintingList />} />
            <Route path="collections" element={<Collection />} />
        </Routes>
    )
} 
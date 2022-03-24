import { Route, Routes } from "react-router-dom";
import { MintProjectWrapper } from "./Minting/MintProject/MintProjectWrapper";
import { MintingList } from "./Minting/MintingList/MintingList";
import useAccount from "./api/account/useAccount";

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
            <Route path="collections" element={<div>collections</div>} />
        </Routes>
    )
} 
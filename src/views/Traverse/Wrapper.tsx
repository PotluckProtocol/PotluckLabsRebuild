import { TraversingProvider } from "../../api/traversing/TraversingContext"
import { Traversing } from "./Traversing"

export const TraverseWrapper: React.FC = () => {
    return (
        <TraversingProvider>
            <Traversing />
        </TraversingProvider>
    )
}
import styled from "styled-components";
import { ProjectBaseInformation } from "../../../api/project-base-information/ProjectBaseInformation"

export type AttributionsProps = {
    attributions: Required<ProjectBaseInformation>['attributions'];
}

const Link = styled.a`
    color: #1bf2a4;
`;

export const Attributions: React.FC<AttributionsProps> = ({
    attributions
}) => {



    return (
        <ul>
            {attributions.map((attr, index) => (
                <li className="mb-2" key={index}><Link href={attr.url} target="_blank">(Link)</Link> {attr.name}</li>
            ))}
        </ul>
    )
}
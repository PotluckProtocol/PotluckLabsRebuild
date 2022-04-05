import { useContext } from "react"
import { ProjectBaseInformationContext } from "../../../api/project-base-information/ProjectBaseInformationContext"
import { ProjectItem } from "./ProjectItem";



export const ListProjects: React.FC = () => {

    const baseInformationContext = useContext(ProjectBaseInformationContext);

    const allProjects = baseInformationContext
        .getConfigs()
        .filter(baseInformation => !baseInformation.hideInProjects);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProjects.map(project => (
                <ProjectItem baseInformation={project} />
            ))}
        </div>
    )

}
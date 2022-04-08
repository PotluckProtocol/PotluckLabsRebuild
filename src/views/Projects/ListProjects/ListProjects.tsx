import { useContext, useState } from "react"
import { createSearchParams, useSearchParams } from "react-router-dom";
import Select from 'react-select';
import styled from "styled-components";
import { MintingProvider } from "../../../api/minting/MintingContext";
import { resolveNetwork } from "../../../api/network/resolveNetwork";
import { ProjectBaseInformation } from "../../../api/project-base-information/ProjectBaseInformation";
import { ProjectBaseInformationContext } from "../../../api/project-base-information/ProjectBaseInformationContext"
import { NETWORKS } from "../../../types/Networks";
import { ProjectItem } from "./ProjectItem";

type Sort = (
    'name-asc' |
    'name-desc' |
    'release-date-asc' |
    'release-date-desc'
);

type ProjectSorterFunction = (item1: ProjectBaseInformation, item2: ProjectBaseInformation) => number;

type SortMapItem = {
    label: string;
    sorter: ProjectSorterFunction
}

const SORT_MAP: { [key: string]: SortMapItem } = {
    'release-date-desc': {
        label: 'Release date (new to old)',
        sorter: (i1, i2) => {
            const d1 = new Date(i1.releaseDate);
            const d2 = new Date(i2.releaseDate);
            return d2.valueOf() - d1.valueOf();
        }
    },
    'release-date-asc': {
        label: 'Release date (old to new)',
        sorter: (i1, i2) => {
            const d1 = new Date(i1.releaseDate);
            const d2 = new Date(i2.releaseDate);
            return d1.valueOf() - d2.valueOf();
        }
    },
    'name-desc': {
        label: 'Name (A to Z)',
        sorter: (i1, i2) => {
            if (i1.name === i2.name) {
                return 0;
            } else {
                return (i1.name > i2.name) ? 1 : -1;
            }
        }
    },
    'name-asc': {
        label: 'Name (Z to A)',
        sorter: (i1, i2) => {
            if (i1.name === i2.name) {
                return 0;
            } else {
                return (i1.name < i2.name) ? 1 : -1;
            }
        }
    },
}

const CATEGORY_MAP: { [key: string]: { label: string } } = {
    '-': {
        label: 'None'
    },
    chain: {
        label: 'Chain'
    },
    'minting-status': {
        label: 'Minting Status'
    }
}

type SelectOption = {
    label: string;
    value: string;
}

const createSorterOption = (activeSortId: Sort): SelectOption => ({
    label: SORT_MAP[activeSortId].label,
    value: activeSortId
});

const createCategoryOption = (categoryId: string): SelectOption | null => {
    return !!(CATEGORY_MAP[categoryId])
        ? {
            label: CATEGORY_MAP[categoryId].label,
            value: categoryId
        }
        : null;
}

const selectorStyles = {
    option: (provided: any, state: any) => ({
        ...provided,
        color: 'black'
    })
}

const Selector = styled(Select)`
    width: max-content;
`;

const CategoryTitle = styled.h3`
    font-size: 2rem;
    font-weight: 800;
    color: #1bf2a4;
`;

export const ListProjects: React.FC = () => {
    const [stillMinting, setStillMinting] = useState<string[]>([]);
    const [queryParams, setQueryParams] = useSearchParams();
    const [activeCategoryId, setActiveCategoryId] = useState<string>(queryParams.has('cat') ? queryParams.get('cat') as string : '-');
    const [activeSortId, setActiveSortId] = useState<Sort>(queryParams.has('sort') ? queryParams.get('sort') as Sort : 'release-date-desc');
    const baseInformationContext = useContext(ProjectBaseInformationContext);

    const handleSortSelectChange = (item: any) => {
        setActiveSortId(item.value);

        const searchParams = createSearchParams(queryParams);
        searchParams.set('sort', item.value);
        setQueryParams(searchParams);
    }

    const handleCategorySelectChange = (item: any) => {
        setActiveCategoryId(item.value);

        const searchParams = createSearchParams(queryParams);
        if (item.value === '-' && searchParams.has('cat')) {
            searchParams.delete('cat');
        } else {
            searchParams.set('cat', item.value);
        }
        setQueryParams(searchParams);
    }

    const handleProjectItemMintStateResolved = (contractAddress: string, isStillMinting: boolean) => {
        if (isStillMinting) {
            setStillMinting([...stillMinting, contractAddress]);
        }
    }

    const activeSorter = SORT_MAP[activeSortId];

    const allProjects = baseInformationContext
        .getConfigs()
        .filter(baseInformation => !baseInformation.hideInProjects);

    const sortOptions = Object.keys(SORT_MAP).map(key => createSorterOption(key as Sort));
    const categoryOptions = Object.keys(CATEGORY_MAP).map(key => createCategoryOption(key)).filter(Boolean);

    const sortedProjects = [...allProjects].sort(activeSorter.sorter);

    const categorizedItems: Array<{ title: string | null, projects: ProjectBaseInformation[] }> = [];
    if (activeCategoryId === 'chain') {
        NETWORKS.forEach(network => {
            const networkProjects = sortedProjects.filter(item => resolveNetwork(item.network).networkId === network.networkId);
            if (networkProjects.length > 0) {
                categorizedItems.push({
                    title: network.name,
                    projects: networkProjects
                });
            }
        });
    } else if (activeCategoryId === 'minting-status') {
        categorizedItems.push({
            title: 'Currently minting',
            projects: sortedProjects.filter(project => stillMinting.includes(project.contractAddress))
        })
        categorizedItems.push({
            title: 'Other projects',
            projects: sortedProjects.filter(project => !stillMinting.includes(project.contractAddress))
        })
    } else {
        categorizedItems.push({
            title: null,
            projects: sortedProjects
        });
    }

    return (
        <>
            <div className="mb-8 flex">
                <div className="mr-6">
                    <label style={{ fontSize: '.8rem' }}>Sort by</label>
                    <Selector
                        value={createSorterOption(activeSortId)}
                        isSearchable={false}
                        styles={selectorStyles}
                        options={sortOptions}
                        onChange={handleSortSelectChange}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '.8rem' }}>Categorize by</label>
                    <Selector
                        value={createCategoryOption(activeCategoryId)}
                        isSearchable={false}
                        styles={selectorStyles}
                        options={categoryOptions}
                        onChange={handleCategorySelectChange}
                    />
                </div>
            </div>

            {categorizedItems.map((catItem, index) => {
                return (
                    <div key={index} className="mb-8">
                        {catItem.title && (<CategoryTitle className="mb-4">{catItem.title}</CategoryTitle>)}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {catItem.projects.map((project) => (
                                <MintingProvider key={project.contractAddress || project.name}>
                                    <ProjectItem
                                        baseInformation={project}
                                        onMintStateResolved={handleProjectItemMintStateResolved}
                                    />
                                </MintingProvider>
                            ))}
                        </div>
                    </div>
                );
            })}

        </>
    )

}
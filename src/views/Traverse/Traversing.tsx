import { useContext, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import styled from "styled-components";
import useUser from "../../api/account/useUser";
import { Traversing as TraversingItem } from "../../api/traversing/Traversing";
import { TraversingProvider } from "../../api/traversing/TraversingContext";
import { TraversingInfoContext } from "../../api/traversing/TraversingInfoContext"
import { ConnectWalletButton } from "../../components/ConnectWalletButton";
import { TraverseProject } from "./TraverseProject";


const PageHeader = styled.h1`
    font-size: 2rem;
    color: #1bf2a4;
    font-weight: 900;
`;

const TraversingInfo = styled.p`
    color: white;
`;

const selectStyles = {
    option: (provided: any, state: any) => ({
        ...provided,
        color: 'black'
    })
}

type Option = { label: string, value: string; };

const createOption = (item: TraversingItem): Option => {
    return {
        value: item.id,
        label: item.projectName
    }
}

export const Traversing: React.FC = () => {
    const user = useUser();
    const [queryParams, setQueryParams] = useSearchParams();
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const traversingInfoContext = useContext(TraversingInfoContext);
    const traversingInfos = traversingInfoContext.getTraversingInfos();
    const traverseId = queryParams.get('id');

    useEffect(() => {
        if (traverseId !== selectedOption?.value) {
            const item = traversingInfos.find(info => info.id === traverseId);
            if (item) {
                setSelectedOption(createOption(item));
            }
        }
    }, [traverseId]);

    if (!user.account) {
        return (
            <div className="mt-8">
                <div className="mb-4 text-center">Connect your wallet to traverse...</div>
                <ConnectWalletButton />
            </div>
        )
    }

    const handleProjectSelectChange: any = (option: Option) => {
        setSelectedOption({ ...option });
        setQueryParams({ id: option.value });
    }

    const options: Option[] = traversingInfos.map(createOption);
    return (
        <div className="mr-6">

            <PageHeader>Traversing</PageHeader>

            <TraversingInfo className="mb-4">
                Traversing allows moving tokens between chains using Layer0 OmniChain. Select project and start moving your pieces between chains! Unused gas fees are returned into your wallet.
            </TraversingInfo>

            <TraversingInfo className="my-4">
                <small>
                    It might take few minutes for traversed token to be visible in your target network wallet.
                </small>
            </TraversingInfo>

            <label style={{ fontSize: '.8rem' }}>Select project</label>
            <Select
                value={selectedOption}
                isMulti={false}
                isSearchable={false}
                styles={selectStyles}
                options={options}
                onChange={handleProjectSelectChange}
            />

            <div className="mt-8">
                {selectedOption && (
                    <TraversingProvider>
                        <TraverseProject id={selectedOption.value} />
                    </TraversingProvider>
                )}
            </div>


        </div>
    )


}
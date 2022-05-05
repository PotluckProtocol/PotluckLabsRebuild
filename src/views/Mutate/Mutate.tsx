
import { ReactNode, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import useUser from "../../api/account/useUser";
import { MutateContext } from "../../api/mutate/MutateContext";
import { ProjectBaseInformation } from "../../api/project-base-information/ProjectBaseInformation";
import { RoundedButton } from "../../components/RoundedButton";
import Select, { Options } from 'react-select';
import { TextFit } from "../../components/TextFit";
import { useLoadImageBackground } from "../../hooks/useLoadImageBackground";
import classNames from "classnames";

/**
 * @todo
 * X Approve step
 * X Add something to place where serum was faded out
 * - Testing
 */

export type MutateProps = {
    baseInformation: ProjectBaseInformation;
}

const Container = styled.div`
    margin: 0 auto; 
    position: relative;
    background: rgb(3,26,18);
    background: linear-gradient(0deg, rgba(3,26,18,1) 0%, rgba(12,105,71,1) 100%);
    text-align: center;
    padding: 1rem;
    border-radius: 1.5rem;
`;

type CoverImageProps = {
    faded: boolean;
}

const CoverImageWarpper = styled.div`
    position: relative;

    :before {
        content: "";
        background: url(images/PotluckLabs_Logo.png);
        background-position: center;
        background-repeat: no-repeat;
        opacity: 0.1;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute; 
    }
`;

const CoverImage = styled.img<CoverImageProps>`
    border-radius: 1rem;
    box-shadow: rgba(27, 242, 165, 0.2) 1px 1px 10px 1px;
    margin: 0 auto;
    opacity: 1;
    transition: opacity 2s ease-in-out;
    position: relative;

    ${props => props.faded && (`
        opacity: 0
    `)}
`;

const Content = styled.div`
    padding: 0 0.5rem ;
`;

const SubTitle = styled(TextFit)`
    font-weight: 900;
    font-size: 1.5rem;
    text-align: center;
    line-height: 1.5rem;
    color: #1bf2a4;
`;

const StyledRoundedButton = styled(RoundedButton)`
    font-size: 1.5rem;
`;

type SelectSerumOption = { value: string, label: string };
type SelectSerumOptions = Options<SelectSerumOption>;

const simpleTextContent = (text: string): ReactNode => {
    return (<div className="mt-3">{text}</div>);
}

export const Mutate: React.FC<MutateProps> = ({
    baseInformation
}) => {
    const user = useUser();
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [selectedSerumId, setSelectedSerumId] = useState<number | null>(null);
    const [mutateContextEnabled, setMutateContextEnabled] = useState<boolean>(false);
    const [revealedImageUrl, setRevealedImageUrl] = useState<string | null>(null);
    const mutateContext = useContext(MutateContext);
    const [loadedRevealImageError, loadedRevealImageSrc, resetLoadedReveal] = useLoadImageBackground(revealedImageUrl);

    const walletAddress = user.account?.walletAddress;
    const serumNotation = (baseInformation.mutate?.serumUnitNotation)
        ? baseInformation.mutate.serumUnitNotation
        : 'Serum';

    useEffect(() => {
        const init = async () => {
            try {
                await mutateContext.init({
                    serumContractAddress: baseInformation.contractAddress
                });
            } catch (e) {
                console.log(e);
            }
            setIsInitialized(true);
        }

        init();
    }, [baseInformation, walletAddress])

    // Fetch user approved status on this serum contract
    useEffect(() => {
        const fetchIsApproved = async () => {
            if (isInitialized) {
                // Check in view init if connected wallet is already approved
                const isApprovedAlready = await mutateContext.isApproved();
                setIsApproved(isApprovedAlready);
            }
        }

        fetchIsApproved();
    }, [isInitialized, walletAddress]);

    const handleButtonClick = async () => {

        // Button click will approve
        if (!isApproved) {
            const approved = await mutateContext.approveAll();
            setIsApproved(approved);
            return;
        }

        // If mutate button is changed to clear button
        if (mutateContextEnabled) {
            setRevealedImageUrl(null);
            resetLoadedReveal();
            setMutateContextEnabled(false);
            return;
        }

        if (typeof selectedSerumId === 'number') {
            setMutateContextEnabled(true);
            const res = await mutateContext.mutate(selectedSerumId);
            if (res.succeed && res.imageUrl) {
                setRevealedImageUrl(res.imageUrl);
            }
        }
    }

    const handleSelectChange = (option: SelectSerumOption) => {
        setSelectedSerumId(Number(option.value));
    }

    if (!baseInformation.mutate) {
        return null;
    }

    if (!isInitialized) {
        return <div>Loading</div>;
    }

    const serumOptions: SelectSerumOptions = mutateContext.serumIds.map(
        id => ({ value: id.toString(), label: `${serumNotation} #${id}` })
    );

    let buttonText: string = 'Mutate';
    if (mutateContext.isApproving) {
        buttonText = 'Approving';
    } else if (!isApproved) {
        buttonText = 'Approve';
    } else if (mutateContext.isMutating) {
        buttonText = 'Mutating...';
    } else if (mutateContextEnabled) {
        buttonText = 'Back';
    }

    let content: ReactNode;
    if (mutateContext.isMutating) {
        content = simpleTextContent('Mutating, please do not refresh your browser window.');
    } else if (mutateContextEnabled) {
        if (!loadedRevealImageError && !loadedRevealImageSrc) {
            content = simpleTextContent('Mutate done, waiting for reveal. This might take many seconds. Do not refresh your browser window.');
        } else if (loadedRevealImageError) {
            content = simpleTextContent('Could not load the reveal image. You can see your revealed image in secondary marketplace.');
        } else if (loadedRevealImageSrc) {
            content = simpleTextContent(`Look what came out from that ${serumNotation}!`);
        }
    } else {

        /** @todo Fix typings */
        const reactSelectStyles: any = {
            option: (provided: any, state: any) => ({
                ...provided,
                color: 'black'
            })
        }

        const fixedSerumNotation = (mutateContext.serumIds.length === 1) ? serumNotation : `${serumNotation}s`;

        const containerClasses = classNames({ 'invisible': !isApproved });
        content = (
            <>
                <div className="my-3">
                    You have {mutateContext.serumIds.length} {fixedSerumNotation}.
                </div>

                <div className={containerClasses}>
                    <div className="my-3">
                        Select your {serumNotation}:
                    </div>
                    <div className="flex justify-center">
                        <Select
                            isDisabled={mutateContext.serumIds.length === 0}
                            placeholder={`Select one...`}
                            options={[{ options: serumOptions }] as any}
                            onChange={handleSelectChange as any}
                            isSearchable={false}
                            styles={reactSelectStyles}
                        />
                    </div>
                </div>
            </>
        )
    }

    const buttonDisabled = (
        // Mutating is on going
        mutateContext.isMutating ||
        // Approving is on going
        mutateContext.isApproving ||
        // User is looking his/her newly revealed creature but dont have any more serums left
        (!mutateContextEnabled && mutateContext.serumIds.length === 0)
    );

    const coverImageUrl = (revealedImageUrl && loadedRevealImageSrc)
        ? loadedRevealImageSrc
        : baseInformation.coverImage;

    const coverImageFaded = (mutateContext.isMutating || (mutateContextEnabled && !loadedRevealImageSrc));

    return (
        <div>
            <SubTitle height={30} className="px-6 mt-2 mb-8">{baseInformation.name}</SubTitle>

            <Container>
                <CoverImageWarpper>
                    <CoverImage faded={coverImageFaded} src={coverImageUrl} />
                </CoverImageWarpper>
                <Content>
                    <div style={{ minHeight: 130 }}>
                        {content}
                    </div>
                    <StyledRoundedButton className="mt-6" disabled={buttonDisabled} onClick={handleButtonClick}>{buttonText}</StyledRoundedButton>
                </Content>
            </Container >
        </div >
    );
}
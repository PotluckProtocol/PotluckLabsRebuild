import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import useProjectBaseInformation from "../../api/project-base-information/useProjectBaseInformation";
import { Tab, Tabs } from "../../components/Tabs"

const Title = styled.h1`
    color: #1bf2a4;
    font-size: 3rem;
    line-height: 100%;
    margin-bottom: 2rem;
    font-weight: 900;
`;

const Paragraph = styled.p`
    color: #bdd0c9;
    margin-bottom: 1rem;
`;

export const Collection: React.FC = () => {
    const baseInformation = useProjectBaseInformation('0x72F38b2330cd187c13553dc92a0bE6334005EebA');
    const [queryParams, setQueryParams] = useSearchParams();
    const [selectedTab, setSelectedTab] = useState('roadmap');

    useEffect(() => {
        if (queryParams.has('tab')) {
            setSelectedTab(queryParams.get('tab') as string);
        }
    });

    const handleTabChange = (tabId: string) => {
        setSelectedTab(tabId);
        setQueryParams({ tab: tabId });
    }

    return (

        <div className="grid grid-cols-2 gap-12">
            <div>
                <Title>{baseInformation.name}</Title>
                <Paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae sollicitudin risus. Maecenas luctus tempor elit, vitae fringilla arcu euismod ullamcorper. Sed mauris massa, rhoncus sed ultrices sed, lacinia non sem. Pellentesque viverra turpis eu lacus dictum feugiat. Cras maximus nisi at nulla tincidunt, vitae malesuada dui posuere. Phasellus laoreet ligula at elit dictum pellentesque. Cras facilisis, metus eu volutpat sagittis, nibh enim placerat lacus, non dapibus sem velit nec mauris. Phasellus nec semper ligula. Sed et facilisis arcu. Nullam feugiat lacinia sem ut eleifend. Aliquam ultricies dolor nisl, pretium fermentum mi bibendum vel. Phasellus in libero mauris. Curabitur dictum sem a erat faucibus molestie.
                </Paragraph>
                <Paragraph>
                    Praesent sodales vehicula enim. Nulla facilisi. Vestibulum finibus erat ac risus accumsan scelerisque. Duis efficitur venenatis finibus. Proin risus metus, mattis et consectetur non, ullamcorper vel felis. Sed mi lacus, convallis sed pellentesque vitae, laoreet ut nisl. Proin euismod dolor ac nibh consectetur eleifend. Duis non justo tellus. Sed lobortis arcu ut lacus sollicitudin facilisis. Aliquam nulla leo, egestas quis tellus eget, varius pharetra odio.
                </Paragraph>
                <Paragraph>
                    Nullam et metus ac nulla efficitur laoreet non sed magna. Nam interdum lectus magna, vitae tristique mi finibus sed. Quisque volutpat felis ut velit faucibus, sit amet fermentum quam sagittis. Mauris id nisl placerat, commodo nulla at, dignissim nulla. Vivamus varius fermentum turpis, vitae lobortis massa rhoncus ac. Maecenas quis commodo orci, dapibus ornare magna. Vestibulum cursus volutpat molestie. Etiam iaculis augue nec tellus condimentum, in sodales lorem sollicitudin. Suspendisse ac facilisis sapien.
                </Paragraph>
                <Paragraph>
                    Cras tristique finibus volutpat. Suspendisse ac metus non eros porttitor congue vitae et tellus. Curabitur elementum placerat quam id eleifend. Duis vitae accumsan est. Praesent tempus ultrices finibus. Vestibulum euismod sem et ipsum fermentum eleifend. Aenean vitae tincidunt erat, at varius lectus. Vestibulum purus magna, mollis ac augue in, venenatis ullamcorper nisl. Vivamus tincidunt ligula tempor, egestas erat at, pharetra leo. Ut sollicitudin dapibus justo, id dignissim tortor blandit sit amet. Cras vitae hendrerit velit.
                </Paragraph>
            </div>
            <div>
                <Tabs activeTabId={selectedTab} onTabChange={handleTabChange}>
                    <Tab id="roadmap" header="Roadmap">Roadmap comes here</Tab>
                    <Tab id="artist" header="Artist">And artist bio here</Tab>
                    <Tab id="attributions" header="Attributions">And Attributions here</Tab>
                </Tabs>
            </div>
        </div>
    )

}
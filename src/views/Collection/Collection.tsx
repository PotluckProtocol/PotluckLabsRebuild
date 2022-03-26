import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tab } from "../../components/Tabs/Tab"
import { Tabs } from "../../components/Tabs/Tabs"

type QueryParams = {
    tab: string;
}

export const Collection: React.FC = () => {

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
        <Tabs activeTabId={selectedTab} onTabChange={handleTabChange}>
            <Tab id="roadmap" header="Roadmap">Roadmap comes here</Tab>
            <Tab id="artist" header="Artist">And artist bio here</Tab>
            <Tab id="attributions" header="Attributions">And Attributions here</Tab>
        </Tabs>
    )

}
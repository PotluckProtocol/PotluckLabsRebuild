import { useState } from "react";
import { Tab } from "../../components/Tabs/Tab"
import { Tabs } from "../../components/Tabs/Tabs"


export const Collection: React.FC = () => {

    const [selectedTab, setSelectedTab] = useState('tab1');

    const handleTabChange = (tabId: string) => {
        setSelectedTab(tabId);
    }

    return (
        <Tabs activeTabId={selectedTab} onTabChange={handleTabChange}>
            <Tab id="roadmap" header="Roadmap">Roadmap comes here</Tab>
            <Tab id="artist" header="Artist">And artist bio here</Tab>
            <Tab id="attributions" header="Attributions">And Attributions here</Tab>
        </Tabs>
    )

}
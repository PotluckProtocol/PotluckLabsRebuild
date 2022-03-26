import { useContext } from 'react';
import { AccountContext } from './api/account/AccountContext';
import { ProjectBaseInformationContext } from './api/project-base-information/ProjectBaseInformationContext';
import { MenuItem } from './components/Menu/MenuItem';
import { MenuItemList } from './components/Menu/MenuItemList';
import { NavBar } from './components/Navbar';
import { AppRoutes } from './AppRoutes';

const App = () => {

  const baseInformationContext = useContext(ProjectBaseInformationContext);
  if (!baseInformationContext.isInitialized) {
    return <div>Loading</div>;
  }

  return (
    <div className="App" style={{ maxWidth: 1300, margin: 'auto' }}>

      <NavBar />

      <div className="flex flex-row px-2">
        <div style={{ width: '230px' }} className="pt-1">
          <MenuItemList>
            <MenuItem path="/" >Home</MenuItem>
            <MenuItem path="/minting">Now minting</MenuItem>
            <MenuItem path="/collections">Collections</MenuItem>
          </MenuItemList>
        </div>
        <div style={{ width: '100%' }} className="pt-4 px-4">
          <AppRoutes />
        </div>
      </div>

    </div>


  );
}

export default App;

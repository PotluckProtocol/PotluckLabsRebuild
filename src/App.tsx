import { useContext, useState } from 'react';
import { ProjectBaseInformationContext } from './api/project-base-information/ProjectBaseInformationContext';
import { MenuItem } from './components/Menu/MenuItem';
import { MenuItemList } from './components/Menu/MenuItemList';
import { NavBar } from './components/Navbar';
import { AppRoutes } from './AppRoutes';
import { Menu } from './components/Menu/Menu';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { BiChevronsLeft } from 'react-icons/bi'

const App = () => {

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const baseInformationContext = useContext(ProjectBaseInformationContext);
  if (!baseInformationContext.isInitialized) {
    return <div>Loading</div>;
  }

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="App" style={{ maxWidth: 1300, margin: 'auto' }}>

      <NavBar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />

      <div className="flex flex-row px-2">
        <Menu open={isMenuOpen} onClose={closeMenu} >

          <div className="md:hidden mt-4 mb-6 flex justify-between items-center">
            <button onClick={closeMenu}>
              <BiChevronsLeft size={40} />
            </button>
            <ConnectWalletButton />
          </div>

          <MenuItemList>
            <MenuItem path="/" onNavigate={closeMenu}>Home</MenuItem>
            <MenuItem path="/minting" onNavigate={closeMenu}>Now minting</MenuItem>
            <MenuItem path="/collections" onNavigate={closeMenu}>Collections</MenuItem>
            <MenuItem path="/team" onNavigate={closeMenu}>Team</MenuItem>
          </MenuItemList>
        </Menu>
        <div style={{ width: '100%' }} className="pt-8 px-12">
          <AppRoutes />
        </div>
      </div >

    </div >


  );
}

export default App;

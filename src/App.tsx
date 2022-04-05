import { useContext, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ProjectBaseInformationContext } from './api/project-base-information/ProjectBaseInformationContext';
import { MenuItem } from './components/Menu/MenuItem';
import { MenuItemList } from './components/Menu/MenuItemList';
import { NavBar } from './components/Navbar';
import { AppRoutes } from './AppRoutes';
import { Menu } from './components/Menu/Menu';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { BiChevronsLeft, BiLinkExternal } from 'react-icons/bi';
import styled from 'styled-components';

const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

const StyledExternalLinkIcon = styled(BiLinkExternal)`
    display: inline-block;
    margin-left: .75rem;
`;

const App = () => {

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const baseInformationContext = useContext(ProjectBaseInformationContext);
  if (!baseInformationContext.isInitialized) {
    return <div>Loading</div>;
  }

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="App" style={{ maxWidth: 1300, margin: 'auto' }}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
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
              <MenuItem path="/projects" onNavigate={closeMenu}>Projects</MenuItem>
              {/*<MenuItem path="/minting" onNavigate={closeMenu}>Now minting</MenuItem>*/}
              <MenuItem path="/mutatess?contractAddress=0x969b2Bda44a8a6Be009Bf264fcF62e079f581b97&contractAddress=0x246CBfEfd5B70D74335F0aD25E660Ba1e2259858" onNavigate={closeMenu}>Mutate Super Serums!</MenuItem>
              <MenuItem path="/mutate?contractAddress=0x82913BB5587e42c7307cdA8bACab396c647ac20d&contractAddress=0xE0DDB7865Fc6f9ceDF95Dd9a8826c7CC965d16E3" onNavigate={closeMenu}>Mutate Serums</MenuItem>

              <MenuItem path="/team" onNavigate={closeMenu}>Team</MenuItem>
              <MenuItem path="https://claim.potluck-labs.com/" onNavigate={closeMenu}>
                <div className="flex items-center">
                  Claim $LABS <StyledExternalLinkIcon />
                </div>
              </MenuItem>
            </MenuItemList>
          </Menu>
          <div style={{ width: '100%' }} className="pt-8 px-6 md:px-12">
            <AppRoutes />
          </div>
        </div >
      </ErrorBoundary>
    </div >


  );
}

export default App;

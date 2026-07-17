import { Route, Routes } from 'react-router';
import RootPage from './pages/RootPage';
import SidebarLayout from './components/layout/SidebarLayout';
import CategoryPage from './pages/CategoryPage';
import CategoryGridPage from './pages/CategoryGridPage';
import FavoritesPage from './pages/FavoritesPage';
import ToolsPage from './pages/ToolsPage';
import SponsorsPage from './pages/SponsorsPage';


const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<RootPage />} />
        <Route
          path="/:category"
          element={
            <SidebarLayout showSponsors={false}>
              <CategoryGridPage />
            </SidebarLayout>
          }
        />
        <Route
          path="/:category/:subcategory"
          element={
            <SidebarLayout>
              <CategoryPage />
            </SidebarLayout>
          }
        />
        <Route
          path="/favorites"
          element={
            <SidebarLayout>
              <FavoritesPage />
            </SidebarLayout>
          }
        />
        <Route path="/sponsors" element={<SponsorsPage />} />
        <Route path="/tools/:toolId?" element={<ToolsPage />} />
      </Routes>
    </>
  );
};

export default App;
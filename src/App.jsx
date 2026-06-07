import { Route, Routes } from 'react-router';
import RootPage from './pages/RootPage';
import SidebarLayout from './components/layout/SidebarLayout';
import CategoryPage from './pages/CategoryPage';
import FavoritesPage from './pages/FavoritesPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<RootPage />} />
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
      </Routes>
    </>
  );
};

export default App;

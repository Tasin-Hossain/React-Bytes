import { Route, Routes } from 'react-router';
import RootPage from './pages/RootPage';
import SidebarLayout from './components/layout/SidebarLayout';
import CategoryPage from './pages/CategoryPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<RootPage />} />
        <Route
          exact
          path="/:category/:subcategory"
          element={
            <SidebarLayout>
              <CategoryPage />
            </SidebarLayout>
          }
        />
      </Routes>
    </>
  );
};

export default App;

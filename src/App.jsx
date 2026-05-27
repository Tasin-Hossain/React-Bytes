import { Route, Routes } from 'react-router';
import RootPage from './pages/RootPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<RootPage />} />
      </Routes>
    </>
  );
};

export default App;

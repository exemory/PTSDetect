import { routes } from '@/routes';
import { Routes, Route } from 'react-router-dom';
import SignIn from '@/pages/Auth/SignIn';
import SignUp from '@/pages/Auth/SignUp';

function App() {
  return (
    <Routes>
      <Route path={routes.HOME} element={<>Home</>} />
      <Route path={routes.SIGN_IN} element={<SignIn />} />
      <Route path={routes.SIGN_UP} element={<SignUp />} />
    </Routes>
  );
}

export default App;

import { routes } from '@/routes';
import { Routes, Route } from 'react-router-dom';
import { AuthRoutes, PrivateRoutes } from '@/components/Auth';
import { SignUp, SignIn, VerifyEmail, ConfirmEmail } from '@/pages/Auth';
import { Home } from '@/pages/Home';
import { GeneralTest } from '@/pages/GeneralTest';

function App() {
  return (
    <Routes>
      <Route element={<AuthRoutes />}>
        <Route path={routes.SIGN_IN} element={<SignIn />} />
        <Route path={routes.SIGN_UP} element={<SignUp />} />
        <Route path={routes.CONFIRM_EMAIL} element={<ConfirmEmail />} />
        <Route path={routes.VERIFY_EMAIL} element={<VerifyEmail />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route element={<Home />} path={routes.HOME} />
        <Route element={<GeneralTest />} path={routes.PTSD_TEST} />
      </Route>
    </Routes>
  );
}

export default App;

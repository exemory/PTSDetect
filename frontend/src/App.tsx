import { routes } from '@/routes';
import { Routes, Route } from 'react-router-dom';
import { AuthRoutes, PrivateRoutes } from '@/components/Auth';
import { SignUp, SignIn, VerifyEmail, ConfirmEmail, ForgotPassword, ResetPassword } from '@/pages/Auth';
import { Home } from '@/pages/Home';
import { GeneralTest } from '@/pages/GeneralTest';
import { GeneralTestResult } from '@/pages/GeneralTest';
import { Profile } from '@/pages/Profile/Profile';
import { Results } from '@/pages/Results';

function App() {
  return (
    <Routes>
      <Route element={<AuthRoutes />}>
        <Route path={routes.SIGN_IN} element={<SignIn />} />
        <Route path={routes.SIGN_UP} element={<SignUp />} />
        <Route path={routes.CONFIRM_EMAIL} element={<ConfirmEmail />} />
        <Route path={routes.VERIFY_EMAIL} element={<VerifyEmail />} />
        <Route path={routes.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={routes.RESET_PASSWORD} element={<ResetPassword />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route element={<Home />} path={routes.HOME} />
        <Route element={<GeneralTest />} path={routes.PTSD_TEST} />
        <Route element={<GeneralTestResult />} path={routes.PTSD_TEST_RESULT} />
        <Route element={<Results />} path={routes.RESULTS} />
        <Route element={<Profile />} path={routes.PROFILE} />
      </Route>
    </Routes>
  );
}

export default App;

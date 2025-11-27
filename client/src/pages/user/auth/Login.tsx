
import { useLocation } from 'react-router-dom';
import {CustomCenter} from '../../../components/CustomComp'
import AuthPage from '../../../components/auth/AuthPage'
type Props = {}

const Login = (props: Props) => {

  const location = useLocation();
    const pathname = location.pathname;

  const headingText= pathname.includes("interviewer") ? "Login to take the interviews of the candidate " :'Login to explore the exciting features of InterViewPlat';
  return (
    <CustomCenter>
        <AuthPage headingText={headingText} formHeadEmail={'Email'} formHeadMobile={'Mobile'} />
    </CustomCenter>
  )
}

export default Login
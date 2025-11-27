
import { useLocation } from 'react-router-dom';
import {CustomCenter} from '../../../components/CustomComp'
import AuthPage from '../../../components/auth/AuthPage'

type Props = {}

const SignUp = (props: Props) => {
  const location = useLocation();
  const pathname = location.pathname;

    const headingText= pathname.includes("interviewer") ? "Take the interviews and sare your reviews here" : 'Create Account and explore the exciting features of InterViewPlat'
  return (
    <CustomCenter>
        <AuthPage headingText={headingText} formHeadEmail={'Email'} formHeadMobile={'Mobile'} />
    </CustomCenter>
  )
}

export default SignUp

import {CustomCenter} from '../../../components/CustomComp'
import AuthPage from '../../../components/auth/AuthPage'
type Props = {}

const Login = (props: Props) => {
  return (
    <CustomCenter>
        <AuthPage headingText={'Login to explore the exciting features of InterViewPlat'} formHeadEmail={'Email'} formHeadMobile={'Mobile'} />
    </CustomCenter>
  )
}

export default Login
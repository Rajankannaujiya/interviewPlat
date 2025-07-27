
import {CustomCenter} from '../../../components/CustomComp'
import AuthPage from '../../../components/auth/AuthPage'

type Props = {}

const SignUp = (props: Props) => {
  return (
    <CustomCenter>
        <AuthPage headingText={'Create Account and explore the exciting features of InterViewPlat'} formHeadEmail={'Email'} formHeadMobile={'Mobile'} />
    </CustomCenter>
  )
}

export default SignUp
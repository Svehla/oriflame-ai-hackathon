
type VerifyUserArgs = {
  userId: string
}

type IsVerified = {
  isVerified: boolean
}
const verifyUser = async (args: VerifyUserArgs) => {
  return {
    isVerified: true
  } as IsVerified
}

export default verifyUser
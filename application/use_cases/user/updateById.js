import updateUser from '../../../src/entities/updateUser';

export default function updateById({
  id,
  email,
  accountNumber,
  identityNumber,
  userRepository
}) {
  // validate

  if (!accountNumber || !email || !identityNumber) {
    throw new Error(
      'email, accountnumber and identityNumber fields cannot be empty'
    );
  }

  const updatedUser = updateUser(email, accountNumber, identityNumber);

  return userRepository.findById(id).then((foundUser) => {
    if (!foundUser) {
      throw new Error(`No user found with id: ${id}`);
    }
    return userRepository.updateById(id, updatedUser);
  });
}

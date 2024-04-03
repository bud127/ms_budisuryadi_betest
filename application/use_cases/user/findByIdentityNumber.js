export default function findByIdentityNumber(identityNumber, userRepository) {
  return userRepository.findByIdentityNumber(identityNumber);
}

export default function findByAccountNumber(accountNumber, userRepository) {
  return userRepository.findByAccountNumber(accountNumber);
}

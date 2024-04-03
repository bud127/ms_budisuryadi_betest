export default function updateUser(email, accountNumber, identityNumber) {
  return {
    getEmail: () => email,
    getIdentityNumber: () => identityNumber,
    getAccountNumber: () => accountNumber
  };
}

export default function user(
  username,
  password,
  email,
  accountNumber,
  identityNumber,
  createdAt
) {
  return {
    getUserName: () => username,
    getPassword: () => password,
    getEmail: () => email,
    getIdentityNumber: () => identityNumber,
    getAccountNumber: () => accountNumber,
    getCreatedAt: () => createdAt
  };
}

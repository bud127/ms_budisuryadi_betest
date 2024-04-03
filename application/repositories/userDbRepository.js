export default function userRepository(repository) {
  const findByProperty = (params) => repository.findByProperty(params);
  const countAll = (params) => repository.countAll(params);
  const findById = (id) => repository.findById(id);
  const findByIdentityNumber = (identityNumber) =>
    repository.findByIdentityNumber(identityNumber);
  const findByAccountNumber = (accountNumber) =>
    repository.findByAccountNumber(accountNumber);
  const add = (user) => repository.add(user);
  const deleteById = (id) => repository.deleteById(id);
  const updateById = (id, user) => repository.updateById(id, user);

  return {
    findByProperty,
    countAll,
    findById,
    findByIdentityNumber,
    findByAccountNumber,
    updateById,
    add,
    deleteById
  };
}

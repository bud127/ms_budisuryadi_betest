import UserModel from '../models/user';

// move it to a proper place
function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
}

export default function userRepositoryMongoDB() {
  const findByProperty = (params) =>
    UserModel.find(omit(params, 'page', 'perPage'))
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const countAll = (params) =>
    UserModel.countDocuments(omit(params, 'page', 'perPage'));

  const findById = (id) => UserModel.findById(id).select('-password');
  const findByIdentityNumber = (identityNumber) =>
    UserModel.find({ identityNumber: { $eq: identityNumber } }).select(
      '-password'
    );
  const findByAccountNumber = (accountNumber) =>
    UserModel.find({ accountNumber: { $eq: accountNumber } }).select(
      '-password'
    );

  const add = (userEntity) => {
    const newUser = new UserModel({
      username: userEntity.getUserName(),
      password: userEntity.getPassword(),
      email: userEntity.getEmail(),
      identityNumber: userEntity.getIdentityNumber(),
      accountNumber: userEntity.getAccountNumber(),
      createdAt: new Date()
    });

    return newUser.save();
  };

  const deleteById = (id) => UserModel.findByIdAndRemove(id);

  const updateById = (id, updateUserEntity) => {
    const updatedUser = {
      email: updateUserEntity.getEmail(),
      accountNumber: updateUserEntity.getAccountNumber(),
      identityNumber: updateUserEntity.getIdentityNumber()
    };

    return UserModel.findOneAndUpdate(
      { _id: id },
      { $set: updatedUser },
      { new: true }
    );
  };

  return {
    findByProperty,
    countAll,
    updateById,
    findById,
    findByIdentityNumber,
    findByAccountNumber,
    deleteById,
    add
  };
}

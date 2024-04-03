import addUser from '../../application/use_cases/user/add';
import findByProperty from '../../application/use_cases/user/findByProperty';
import countAll from '../../application/use_cases/user/countAll';
import findById from '../../application/use_cases/user/findById';
import findByIdentityNumber from '../../application/use_cases/user/findByIdentityNumber';
import findByAccountNumber from '../../application/use_cases/user/findByAccountNumber';
import deleteUser from '../../application/use_cases/user/deleteΒyId';
import updateById from '../../application/use_cases/user/updateById';

export default function userController(
  userDbRepository,
  userDbRepositoryImpl,
  authServiceInterface,
  authServiceImpl,
  cachingClient,
  userCachingRepository,
  userCachingRepositoryImpl
) {
  const dbRepository = userDbRepository(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());
  const cachingRepository = userCachingRepository(
    userCachingRepositoryImpl()(cachingClient)
  );

  const fetchUsersByProperty = (req, res, next) => {
    const params = {};
    const response = {};

    // Dynamically created query params based on endpoint params
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        params[key] = req.query[key];
      }
    }
    // predefined query params (apart from dynamically) for pagination
    params.page = params.page ? parseInt(params.page, 10) : 1;
    params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;

    findByProperty(params, dbRepository)
      .then((users) => {
        response.users = users;
        const cachingOptions = {
          key: 'users_',
          expireTimeSec: 3600,
          data: JSON.stringify(users)
        };
        // cache the result to redis
        cachingRepository.setCache(cachingOptions);
        return countAll(params, dbRepository);
      })
      .then((totalItems) => {
        response.totalItems = totalItems;
        response.totalPages = Math.ceil(totalItems / params.perPage);
        response.itemsPerPage = params.perPage;
        return res.json(response);
      })
      .catch((error) => next(error));
  };

  const fetchUserById = (req, res, next) => {
    findById(req.params.id, dbRepository)
      .then((user) => res.json(user))
      .catch((error) => next(error));
  };

  const fetchUserByIdentityNumber = (req, res, next) => {
    findByIdentityNumber(req.params.identityNumber, dbRepository)
      .then((user) => res.json(user))
      .catch((error) => next(error));
  };

  const fetchUserByAccountNumber = (req, res, next) => {
    findByAccountNumber(req.params.accountNumber, dbRepository)
      .then((user) => res.json(user))
      .catch((error) => next(error));
  };

  const deleteUserById = (req, res, next) => {
    deleteUser(req.params.id, dbRepository)
      .then(() => res.json('user sucessfully deleted!'))
      .catch((error) => next(error));
  };

  const addNewUser = (req, res, next) => {
    const {
      username,
      password,
      email,
      accountNumber,
      identityNumber,
      createdAt
    } = req.body;
    addUser(
      username,
      password,
      email,
      accountNumber,
      identityNumber,
      createdAt,
      dbRepository,
      authService
    )
      .then((user) => {
        const cachingOptions = {
          key: 'user_',
          expireTimeSec: 3600,
          data: JSON.stringify(user)
        };
        // cache the result to redis
        cachingRepository.setCache(cachingOptions);
        return res.json(user);
      })
      .catch((error) => next(error));
  };

  const updateUserById = (req, res, next) => {
    const { email, accountNumber, identityNumber } = req.body;
    updateById({
      id: req.params.id,
      email,
      accountNumber,
      identityNumber,
      userRepository: dbRepository
    })
      .then((message) => res.json(message))
      .catch((error) => next(error));
  };

  return {
    fetchUsersByProperty,
    fetchUserById,
    fetchUserByIdentityNumber,
    fetchUserByAccountNumber,
    deleteUserById,
    updateUserById,
    addNewUser
  };
}

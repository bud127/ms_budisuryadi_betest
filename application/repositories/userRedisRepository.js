export default function redisUserRepository(repository) {
  const setCache = (options) => repository.setCache(options);
  return {
    setCache
  };
}

let userCache = {};

const addUserToCache = (id) => (userCache[id] = id);

const checkUserCache = (user) => user in userCache;

// NOTE: this method is used for testing only, it shouldn't be used anywhere else
const clearCache = () => {
  userCache = {};
};

export { addUserToCache, checkUserCache, userCache, clearCache };

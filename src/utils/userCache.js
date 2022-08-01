const userCache = {};

const addUserToCache = (id) => (userCache[id] = id);

const checkUserCache = (user) => user in userCache;

export { addUserToCache, checkUserCache, userCache };

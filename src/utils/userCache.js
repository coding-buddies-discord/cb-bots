const userCache = {};

const addUserToCache = (user) => {
  const id = user.id;
  if (userCache[id]) {
    return;
  }
  userCache[id] = id;
};

const checkUserCache = (user) => {
  if (userCache[user]) {
    return true;
  }
  else {
    return false;
  }
};

export { addUserToCache, checkUserCache };
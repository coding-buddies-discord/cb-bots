const userCache = new Set<string>();

export const addUserToCache = (id: string) => userCache.add(id);

export const checkUserCache = (user: string) => userCache.has(user);

/**
 * NOTE: this method is used for testing only, it shouldn't be used anywhere else
 */
export const clearCache = () => userCache.clear();


export async function populateUserCache(cache = userCache) {
	try {
		const allUsers = await collection.distinct("_id");
		allUsers.forEach((userID) => addUserToCache(userID));
		return cache;
	} catch(error) {
		console.log(error);
	}
}

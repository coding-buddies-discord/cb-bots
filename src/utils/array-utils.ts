export const randomElement = <T extends ReadonlyArray<U>, U>(array: T): U =>
	array[Math.floor(Math.random() * array.length)];

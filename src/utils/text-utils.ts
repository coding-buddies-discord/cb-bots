export const findAndReplace = (input: string, replacement: Record<string, any>, pattern = /$\{(.*?)\}/g) =>
	input.replaceAll(pattern, (match, key: string) => key in replacement ? replacement[key] : match);

interface FlagObject {
	flag: string;
	value: string;
}

export const findFlagAndValue = (str: string): FlagObject => {
	const myExp = /(--\w+\s?)(.+)*/;
	const found = str.match(myExp);
	const flag = found?.[1]?.trim();
	const value = found?.[2]?.trim();
	return { flag, value };
};

type flagObj = { flag: string; value: string };

const findFlagAndValue = (str: string): flagObj => {
  const myExp = /(--\w+\s?)(.+)*/;
  const found = str.match(myExp);
  const flag = found?.[1]?.trim();
  const value = found?.[2]?.trim();
  return { flag, value };
};

export { findFlagAndValue };

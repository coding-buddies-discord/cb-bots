const findFlagAndValue = (str) => {
  const myExp = /(--\w+\s?)(.+)*/;
  const found = str.match(myExp);
  const flag = found?.[1]?.trim();
  const value = found?.[2]?.trim();
  return { flag, value };
};

export { findFlagAndValue };

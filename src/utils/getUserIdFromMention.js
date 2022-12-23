export const getUserIdFromMention = (IDstr) => {
  const userId = IDstr.match(/(?!0)+(\d)+/g);
  const id = userId?.[0];

  if (!id) {
    const falseID = IDstr.match(/\d+/g)?.[0] || 0;
    return { isValidID: false, id: falseID };
  }

  return { id, isValidID: true };
};

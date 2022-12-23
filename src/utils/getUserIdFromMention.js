export const getUserIdFromMention = (IDstr) => {
  const userId = IDstr.match(/(?!0)+(\d)+/g);
  const id = userId?.[0];

  if (!id || id.length < 8) {
    const falseID = IDstr.match(/\d+/g)?.[0] || 0;
    return { isPossibleID: false, id: falseID };
  }

  return { id, isPossibleID: true };
};

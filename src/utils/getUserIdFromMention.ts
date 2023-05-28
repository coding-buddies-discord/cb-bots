export type userIDInfo = {
  id: string;
  isPossibleID: boolean;
};

export const getUserIdFromMention = (ID: string): userIDInfo => {
  const userId = ID.match(/(?!0)+(\d)+/g);
  const id = userId?.[0];

  if (!id || id.length < 8) {
    const falseID = ID.match(/\d+/g)?.[0] || 0;
    return { isPossibleID: false, id: falseID.toString() };
  }

  return { id, isPossibleID: true };
};

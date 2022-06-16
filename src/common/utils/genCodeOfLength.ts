export const genCodeOfLength = (length: number): string => {
  const result: string[] = [];
  const characters = '123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
};

export const maskUpi = (upi: string) => {
  if (!upi.includes('@')) return upi;
  const [name, bank] = upi.split('@');
  return `${name.substring(0, Math.min(3, name.length))}***@${bank}`;
};

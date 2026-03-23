export interface Donor {
  id: number;
  amount: number;
  username: string;
  upiId: string;
}

export const dummyDonors: Donor[] = [
  { id: 1, amount: 500, username: "John Doe", upiId: "johndoe@okaxis" },
  { id: 2, amount: 1200, username: "Sarah 99", upiId: "sarah99@okhdfcbank" },
  { id: 3, amount: 250, username: "Arjun K", upiId: "arjunk@ybl" },
  { id: 4, amount: 3000, username: "Anonymous", upiId: "mysterydonor@oksbi" },
  { id: 5, amount: 50, username: "Priya S", upiId: "priya@icici" },
  { id: 6, amount: 1500, username: "Vikram R", upiId: "vikram@okicici" },
  { id: 7, amount: 200, username: "Sneha M", upiId: "sneha@oksbi" },
  { id: 8, amount: 800, username: "Rahul G", upiId: "rahul@okaxis" },
];

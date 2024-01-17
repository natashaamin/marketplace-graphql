import bcrypt from 'bcryptjs';

export interface User {
    userId: number;
    username: string;
    password: string;
}

const dummyUsers: User[] = [
    {
        userId: 1,
        username: 'user1',
        password: bcrypt.hashSync('password1', 10)
    }
];

let users: User[] = [...dummyUsers];

export const findUserByUsername = (username: string): User | undefined => {
    return users.find(u => u.username === username);
};

export const createNewUser = (username: any, password: any) => {
    const newUser: User = {
        userId: users.length + 1, // Simple increment for userID, not suitable for production
        username: username,
        password: bcrypt.hashSync(password, 10) // Hashing the password
    };

    users.push(newUser);
    return users;
}
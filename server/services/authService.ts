import bcrypt from 'bcryptjs';

interface User {
    userId: number;
    username: string;
    password: string;
}

const dummyUsers: User[] = [
    {
        userId: 1,
        username: 'user1',
        password: bcrypt.hashSync('password1', 10)
    },
    {
        userId: 2,
        username: 'user2',
        password: bcrypt.hashSync('password2', 10)
    }
];

let users: User[] = [...dummyUsers];

export const findUserByUsername = (username: string): User | undefined => {
    return users.find(u => u.username === username);
};


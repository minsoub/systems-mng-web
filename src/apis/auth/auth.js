const users = [{ email: 'minsoub@bithumbsystems.com', password: '1234' }];

export function signIn({ email, password }) {
    const user = users.find((user) => user.email === email && user.password === password);

    if (user === undefined) throw new Error();
    return user;
}

async function signInWithPassword(
  email: string,
  password: string,
): Promise<string> {
  return fetch(
    "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=dummy",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    },
  )
    .then((response) => response.json())
    .then((data) => (data as Record<string, string>).idToken);
}

export const userToken = await signInWithPassword(
  "user@test.com",
  "user-password",
);

export const adminToken = await signInWithPassword(
  "admin@test.com",
  "admin-password",
);

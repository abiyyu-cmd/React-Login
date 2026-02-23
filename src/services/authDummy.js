export const loginDummy = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const user = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (!user) {
        reject("Email atau password salah");
        return;
      }

      resolve({
        accessToken: "dummy-access-token",
        refreshToken: "dummy-refresh-token",
        user: {
          username: user.username,
          fullname: user.fullname,
          email: user.email,
        },
      });
    }, 800);
  });
};

export const registerDummy = (form) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const exists = users.find((u) => u.email === form.email);

      if (exists) {
        reject("Email sudah terdaftar");
        return;
      }

      users.push({
        id: Date.now(),
        ...form,
      });

      localStorage.setItem("users", JSON.stringify(users));
      resolve("Register berhasil");
    }, 800);
  });
};

// 🔥 INI YANG KURANG
export const refreshTokenDummy = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("dummy-access-token-baru");
    }, 500);
  });
};

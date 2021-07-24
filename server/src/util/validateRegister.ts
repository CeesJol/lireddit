import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  console.log("options:", options);
  console.log("options.email:", options.email);
  console.log("typeof(options.email):", typeof options.email);

  console.log('!options.email.includes("@"):', !options.email.includes("@"));

  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email",
      },
    ];
  }

  console.log(1);

  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "Length must be greater than 2",
      },
    ];
  }

  console.log(2);

  console.log(
    'options.username.includes("@"):',
    options.username.includes("@")
  );

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Cannot include @",
      },
    ];
  }

  console.log(3);

  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "Length must be greater than 2",
      },
    ];
  }

  console.log(4);

  return null;
};

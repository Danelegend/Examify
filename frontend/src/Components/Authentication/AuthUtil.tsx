export const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

export const validatePasswordLength = (password: string) => {
  return password.length >= 8;
}

export const validatePasswordNumber = (password: string) => {
  return password.match(/[0-9]/);
}

export const validatePasswordLowerCaseLetter = (password: string) => {
  return password.match(/[a-z]/);
}
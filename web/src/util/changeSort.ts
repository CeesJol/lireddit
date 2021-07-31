export const changeSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
  if (event.target.value === "top") {
    window.location.href = "/top";
  } else if (event.target.value === "new") {
    window.location.href = "/";
  }
};

import router from "next/router";

export const changeSort = (
  event: React.ChangeEvent<HTMLSelectElement>,
  subredditTitle: string | undefined
) => {
  let result = "/";
  if (subredditTitle) {
    result += `r/${subredditTitle}/`;
  }
  if (event.target.value === "top") {
    result += "top/";
  }
  router.push(result);
};

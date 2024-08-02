export default function getNth(
  array: any[],
  lhs: any,
  rhs: any,
  from: "last" | "first" = "last",
  nth: number = 1,
) {
  if (from === "last") {
    let count = 1;
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i][lhs] === rhs && count === nth) {
        return array[i];
      }
      if (array[i][lhs] === rhs) count++;
    }
  } else {
    let count = 1;
    for (let i = 0; i < array.length; i++) {
      if (array[i][lhs] === rhs && count === nth) {
        return array[i];
      }
      if (array[i][lhs] === rhs) count++;
    }
  }
}

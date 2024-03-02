console.log("app.js: loaded");
export class App {
  constructor() {
    console.log("App initialized");
  }
}

// 文字列のランレングスエンコーディング
export function rle(str) {
  return groupAndCount(Array.from(str)).map(pairToString).join("");
}

// 連続する同一の要素をグループ化し、その出現数をカウントする
function groupAndCount(list) {
  return group(list).map(subList => [subList[0], subList.length]);
}

// 連続する同一の要素をグループ化する
function group(list) {
  if (list.length === 0) {
    return [];
  } else {
    let x = list[0];
    let { first: ys, second: zs } = span(y => y === x, list.slice(1));
    return [[x, ...ys], ...group(zs)];
  }
}

// プレディケートが初めてFalseを返す地点でリストを二つに分割する
function span(predicate, list) {
  if (list.length === 0) {
    return { first: [], second: [] };
  } else {
    let x = list[0];
    if (predicate(x)) {
      let { first: ys, second: zs } = span(predicate, list.slice(1));
      return { first: [x, ...ys], second: zs };
    } else {
      return { first: [], second: list };
    }
  }
}

// 文字とカウントのペアを文字列に変換する
function pairToString(pair) {
  let [c, n] = pair;
  return c + n.toString();
}
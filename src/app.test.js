describe("JavaScriptで学ぶ関数型プログラミング", () => {
  describe("1章 関数型JavaScriptへのいざない", () => {});

  describe("2章 第一級関数と作用的プロググラミング", () => {});

  describe("3章 JavaScriptにおける変数のスコープとクロージャ", () => {});

  describe("4章 高階関数", () => {});

  describe("5章 関数を組み立てる関数", () => {});

  describe("6章 再帰", () => {});

  describe("7章 純粋性、不変性、変更ポリシー", () => {});

  describe("8章 フローベースプログラミング", () => {});

  describe("9章 クラスを使わないプログラミング", () => {});
});

describe("Lodashの基本的な使い方", () => {
  const _ = require("lodash");

  describe("リスト要素の追加・取得など", () => {
    const dataList = ["A", "B", "C", "D", "E"];

    test("_.range", () => {
      expect(_.range(0, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test("_.concat (append)", () => {
      expect(_.concat(dataList, "Z")).toEqual(["A", "B", "C", "D", "E", "Z"]);
    });

    test("_.concat (prepend)", () => {
      expect(_.concat(["Z"], dataList)).toEqual(["Z", "A", "B", "C", "D", "E"]);
    });

    test("_.head (first)", () => {
      expect(_.head(dataList)).toBe("A");
    });

    test("_.last", () => {
      expect(_.last(dataList)).toBe("E");
    });

    test("_.tail (rest)", () => {
      expect(_.tail(dataList)).toEqual(["B", "C", "D", "E"]);
    });

    test("_.take", () => {
      expect(_.take(dataList, 2)).toEqual(["A", "B"]);
    });

    test("_.drop", () => {
      expect(_.drop(dataList, 2)).toEqual(["C", "D", "E"]);
    });

    test("_.takeRight (take-last)", () => {
      expect(_.takeRight(dataList, 2)).toEqual(["D", "E"]);
    });

    test("_.dropRight (drop-last)", () => {
      expect(_.dropRight(dataList, 2)).toEqual(["A", "B", "C"]);
    });

    test("_.takeWhile (take-while)", () => {
      expect(_.takeWhile(dataList, (data) => data !== "C")).toEqual(["A", "B"]);
    });

    test("_.dropWhile (drop-while)", () => {
      expect(_.dropWhile(dataList, (data) => data !== "C")).toEqual([
        "C",
        "D",
        "E",
      ]);
    });
  });

  describe("filter/map/reduce", () => {
    const dataList = ["A", "B", "C", "D", "E"];
    const f = (data) => data === "C" || data === "D";
    const mf = (data) => (data === "C" ? null : "X" + data);
    const mf2 = (data, i) => data + i;
    const mf3 = (data) => [data, data];
    const nested = [1, [[2]], [[[3]]]];
    const rf = (acc, val) => acc + val;

    test("_.find", () => {
      expect(_.find(dataList, f)).toBe("C");
    });

    test("_.some", () => {
      expect(_.some(dataList, f)).toBe(true);
    });

    test("_.filter", () => {
      expect(_.filter(dataList, f)).toEqual(["C", "D"]);
    });

    test("_.reject (filterNot/remove)", () => {
      expect(_.reject(dataList, f)).toEqual(["A", "B", "E"]);
    });

    test("_.map", () => {
      expect(_.map(dataList, mf)).toEqual(["XA", "XB", null, "XD", "XE"]);
    });

    test("_.map and _.without (mapNotNull/keep)", () => {
      expect(_(dataList).map(mf).without(null).value()).toEqual([
        "XA",
        "XB",
        "XD",
        "XE",
      ]);
    });

    test("_.map (map-indexed)", () => {
      expect(_.map(dataList, mf2)).toEqual(["A0", "B1", "C2", "D3", "E4"]);
    });

    test("_.flatMap (flatMap/mapcat)", () => {
      expect(_.flatMap(dataList, mf3)).toEqual([
        "A",
        "A",
        "B",
        "B",
        "C",
        "C",
        "D",
        "D",
        "E",
        "E",
      ]);
    });

    test("_.flatten (flatten（一段階）)", () => {
      expect(_.flatten(nested)).toEqual([1, [2], [[3]]]);
    });

    test("_.flattenDeep (flatten)", () => {
      expect(_.flattenDeep(nested)).toEqual([1, 2, 3]);
    });

    test("_.reduce (reduce（初期値なし）)", () => {
      expect(_.reduce(dataList, rf)).toBe("ABCDE");
    });

    test("_.reduce (reduce（初期値あり）)", () => {
      expect(_.reduce(dataList, rf, "X")).toBe("XABCDE");
    });

    test("_.zip (zip/interleave)", () => {
      expect(_.zip(["XX", "YY"], dataList, [99, 88])).toEqual([
        ["XX", "A", 99],
        ["YY", "B", 88],
        [undefined, "C", undefined],
        [undefined, "D", undefined],
        [undefined, "E", undefined],
      ]);
    });
  });

  describe("高度なリスト操作", () => {
    const dataList = ["A", "B", "C", "D", "E"];
    const users = [
      { user: "fred", age: 48 },
      { user: "barney", age: 36 },
      { user: "fred", age: 40 },
    ];
    const dupList = [1, 1, 2, 1];

    test("_.sortBy (sort-by)", () => {
      expect(_.sortBy(users, ["user"])).toEqual([
        { user: "barney", age: 36 },
        { user: "fred", age: 48 },
        { user: "fred", age: 40 },
      ]);
    });

    test("_.groupBy (group-by)", () => {
      expect(_.groupBy(users, (item) => Math.floor(item.age / 10))).toEqual({
        3: [{ user: "barney", age: 36 }],
        4: [
          { user: "fred", age: 48 },
          { user: "fred", age: 40 },
        ],
      });
    });

    test("_.countBy (frequencies)", () => {
      expect(_.countBy(users, (item) => Math.floor(item.age / 10))).toEqual({
        3: 1,
        4: 2,
      });
    });

    test("_.uniq (distinct)", () => {
      expect(_.uniq(dupList)).toEqual([1, 2]);
    });

    test("_.reduce and _.tail (dedupe)", () => {
      expect(
        _.reduce(
          _.tail(dupList),
          (acc, val) => (val !== _.last(acc) ? _.concat(acc, val) : acc),
          [_.head(dupList)],
        ),
      ).toEqual([1, 2, 1]);
    });

    test("_.shuffle (shuffle)", () => {
      const shuffled = _.shuffle(dataList);
      expect(shuffled).toHaveLength(dataList.length);
      expect(shuffled).toContain("A");
      expect(shuffled).toContain("B");
      expect(shuffled).toContain("C");
      expect(shuffled).toContain("D");
      expect(shuffled).toContain("E");
    });

    test("_.chunk (partitionAll)", () => {
      expect(_.chunk(dataList, 2)).toEqual([["A", "B"], ["C", "D"], ["E"]]);
    });
  });

  describe("オブジェクトに対する操作", () => {
    let dataMap = { x: "x1", y: { y1: 1, y2: 2 }, z: "Z" };

    test("_.get (get-in)", () => {
      expect(_.get(dataMap, "y.y2")).toBe(2);
    });

    test("_.set (assoc-in)", () => {
      expect(_.set({ ...dataMap }, "y.y3", 33)).toEqual({
        x: "x1",
        y: { y1: 1, y2: 2, y3: 33 },
        z: "Z",
      });
    });

    test("_.omit (dissoc-in)", () => {
      expect(_.omit({ ...dataMap }, "y.y2")).toEqual({
        x: "x1",
        y: { y1: 1, y3: 33 },
        z: "Z",
      });
    });

    test("_.update (update-in)", () => {
      expect(_.update({ ...dataMap }, "y.y2", (data) => data * data)).toEqual({
        x: "x1",
        y: { y1: 1, y2: 4, y3: 33 },
        z: "Z",
      });
    });

    test("_.pick (select-keys)", () => {
      expect(_.pick(dataMap, ["x", "z"])).toEqual({ x: "x1", z: "Z" });
    });

    test("Object.entries (entries)", () => {
      expect(Object.entries(dataMap)).toEqual([
        ["x", "x1"],
        ["y", { y1: 1, y2: 4, y3: 33 }],
        ["z", "Z"],
      ]);
    });

    test("_.mapValues (mapValues)", () => {
      expect(
        _.mapValues(dataMap, (value, key) =>
          typeof value === "string" ? `${key}#${value}` : 99,
        ),
      ).toEqual({ x: "x#x1", y: 99, z: "z#Z" });
    });

    test("_.assign (merge)", () => {
      expect(_.assign({ ...dataMap }, { y: "Y", zz: "ZZ" })).toEqual({
        x: "x1",
        y: "Y",
        z: "Z",
        zz: "ZZ",
      });
    });

    test("_.merge (mergeDeep)", () => {
      expect(_.merge({ ...dataMap }, { y: { y1: "YYY" } })).toEqual({
        x: "x1",
        y: { y1: "YYY", y2: 4, y3: 33 },
        z: "Z",
      });
    });

    test("_.mergeWith (merge-with)", () => {
      expect(
        _.mergeWith({ ...dataMap }, { x: "X" }, (v1, v2) => v1 + v2),
      ).toEqual({ x: "x1X", y: { y1: "YYY", y2: 4, y3: 33 }, z: "Z" });
    });

    test("_.zipObject (zipmap)", () => {
      expect(_.zipObject(["a", "b"], [1, 2])).toEqual({ a: 1, b: 2 });
    });
  });
});

describe("Lodash/fpの基本的な使い方", () => {
  const fp = require("lodash/fp");

  describe("リスト要素の追加・取得など", () => {
    const dataList = ["A", "B", "C", "D", "E"];

    test("fp.range", () => {
      expect(fp.range(0)(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test("fp.concat (append)", () => {
      expect(fp.concat(dataList)("Z")).toEqual(["A", "B", "C", "D", "E", "Z"]);
    });

    test("fp.concat (prepend)", () => {
      expect(fp.concat(["Z"])(dataList)).toEqual([
        "Z",
        "A",
        "B",
        "C",
        "D",
        "E",
      ]);
    });

    test("fp.head (first)", () => {
      expect(fp.head(dataList)).toBe("A");
    });

    test("fp.last", () => {
      expect(fp.last(dataList)).toBe("E");
    });

    test("fp.tail (rest)", () => {
      expect(fp.tail(dataList)).toEqual(["B", "C", "D", "E"]);
    });

    test("fp.take", () => {
      expect(fp.take(2)(dataList)).toEqual(["A", "B"]);
    });

    test("fp.drop", () => {
      expect(fp.drop(2)(dataList)).toEqual(["C", "D", "E"]);
    });

    test("fp.takeRight (take-last)", () => {
      expect(fp.takeRight(2)(dataList)).toEqual(["D", "E"]);
    });

    test("fp.dropRight (drop-last)", () => {
      expect(fp.dropRight(2)(dataList)).toEqual(["A", "B", "C"]);
    });

    test("fp.takeWhile (take-while)", () => {
      expect(fp.takeWhile((data) => data !== "C")(dataList)).toEqual([
        "A",
        "B",
      ]);
    });

    test("fp.dropWhile (drop-while)", () => {
      expect(fp.dropWhile((data) => data !== "C")(dataList)).toEqual([
        "C",
        "D",
        "E",
      ]);
    });
  });

  describe("filter/map/reduce", () => {
    const dataList = [1, 2, 3, 4, 5];

    test("fp.filter", () => {
      expect(fp.filter((data) => data % 2 === 0)(dataList)).toEqual([2, 4]);
    });

    test("fp.map", () => {
      expect(fp.map((data) => data * 2)(dataList)).toEqual([2, 4, 6, 8, 10]);
    });

    test("fp.reduce", () => {
      expect(fp.reduce((sum, data) => sum + data, 0)(dataList)).toBe(15);
    });
  });

  describe("高度なリスト操作", () => {
    const dataList = [
      { name: "Alice", age: 20 },
      { name: "Bob", age: 30 },
      { name: "Charlie", age: 40 },
    ];

    test("fp.sortBy", () => {
      expect(fp.sortBy("age")(dataList)).toEqual([
        { name: "Alice", age: 20 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 40 },
      ]);
    });

    test("fp.groupBy", () => {
      expect(fp.groupBy((data) => data.age >= 30)(dataList)).toEqual({
        true: [
          { name: "Bob", age: 30 },
          { name: "Charlie", age: 40 },
        ],
        false: [{ name: "Alice", age: 20 }],
      });
    });
  });

  describe("オブジェクトに対する操作", () => {
    const dataObject = { name: "Alice", age: 20, city: "New York" };

    test("fp.pick", () => {
      expect(fp.pick(["name", "age"])(dataObject)).toEqual({
        name: "Alice",
        age: 20,
      });
    });

    test("fp.omit", () => {
      expect(fp.omit(["city"])(dataObject)).toEqual({ name: "Alice", age: 20 });
    });

    test("fp.get", () => {
      expect(fp.get("name")(dataObject)).toBe("Alice");
    });

    test("fp.set", () => {
      expect(fp.set("age", 30)(dataObject)).toEqual({
        name: "Alice",
        age: 30,
        city: "New York",
      });
    });

    test("fp.update", () => {
      expect(
        fp.update("name", (name) => name.toUpperCase())(dataObject),
      ).toEqual({
        name: "ALICE",
        age: 20,
        city: "New York",
      });
    });

    test("fp.assign", () => {
      expect(fp.assign({ city: "Los Angeles" })(dataObject)).toEqual({
        name: "Alice",
        age: 20,
        city: "New York",
      });
    });

    test("fp.merge", () => {
      expect(
        fp.merge({ city: "Los Angeles", country: "USA" })(dataObject),
      ).toEqual({
        name: "Alice",
        age: 20,
        city: "New York",
        country: "USA",
      });
    });

    test("fp.mergeWith", () => {
      const customizer = (objValue, srcValue) => {
        return fp.isArray(objValue) ? objValue.concat(srcValue) : undefined;
      };
      const object = { a: [1], b: [2] };
      const other = { a: [3], b: [4] };
      expect(fp.mergeWith(customizer, other)(object)).toEqual({
        a: [3, 1],
        b: [4, 2],
      });
    });
  });
});

describe("Moment.jsの基本的な使い方", () => {
  const moment = require("moment/moment");
  require("moment/locale/ja");

  test("moment", () => {
    expect(moment("2020-01-01").format("YYYY/MM/DD")).toBe("2020/01/01");
  });

  test.skip("moment (with timezone)", () => {
    const m = moment("2020-01-01").utcOffset("+09:00");
    expect(m.format("YYYY/MM/DD HH:mm:ss")).toBe("2020/01/01 00:00:00");
  });

  test("moment (add/subtract)", () => {
    const m = moment("2020-01-01");
    expect(m.add(1, "days").format("YYYY/MM/DD")).toBe("2020/01/02");
    expect(m.subtract(1, "days").format("YYYY/MM/DD")).toBe("2020/01/01");
  });

  test("moment (startOf/endOf)", () => {
    const m = moment("2020-01-01");
    expect(m.startOf("month").format("YYYY/MM/DD")).toBe("2020/01/01");
    expect(m.endOf("month").format("YYYY/MM/DD")).toBe("2020/01/31");
  });

  test("moment (diff)", () => {
    const m1 = moment("2020-01-01");
    const m2 = moment("2020-01-31");
    expect(m2.diff(m1, "days")).toBe(30);
  });

  test("moment (fromNow)", () => {
    const m = moment("2020-01-01");
    expect(m.fromNow()).toBe("4年前");
  });

  test("moment (format)", () => {
    const m = moment("2020-01-01");
    expect(m.format("YYYY/MM/DD")).toBe("2020/01/01");
  });

  test("moment (parse)", () => {
    const m = moment.parseZone("2020-01-01T00:00:00+09:00");
    expect(m.format("YYYY/MM/DD HH:mm:ss")).toBe("2020/01/01 00:00:00");
  });

  test("moment (isSame/isBefore/isAfter)", () => {
    const m1 = moment("2020-01-01");
    const m2 = moment("2020-01-31");
    expect(m1.isSame(m2, "month")).toBe(true);
    expect(m1.isBefore(m2)).toBe(true);
    expect(m2.isAfter(m1)).toBe(true);
  });
});

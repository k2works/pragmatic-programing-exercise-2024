const exp = require("constants");
const { decodedTextSpanIntersectsWith } = require("typescript");

describe("JavaScriptで学ぶ関数型プログラミング", () => {
  const _ = require("lodash");

  //1章 関数型JavaScriptへのいざない

  function fail(thing) {
    throw new Error(thing);
  }

  function warn(thing) {
    console.log(["警告:", thing].join(" "));
  }

  function note(thing) {
    console.log(["情報:", thing].join(" "));
  }

  function isIndexed(data) {
    return _.isArray(data) || _.isString(data);
  }

  function nth(a, index) {
    if (!_.isNumber(index)) fail("インデックスは数値である必要があります");
    if (!isIndexed(a))
      fail("インデックス指定可能ではないデータ型はサポートされていません");
    if (index < 0 || index > a.length - 1)
      fail("指定されたインデックスは範囲外です");
    return a[index];
  }

  function second(a) {
    return nth(a, 1);
  }

  function compareLessThanOrEqual(x, y) {
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  }

  function lessOrEqual(x, y) {
    return x <= y;
  }

  function comparator(pred) {
    return function (x, y) {
      if (pred(x, y)) return -1;
      if (pred(y, x)) return 1;
      return 0;
    };
  }

  function lameCSV(str) {
    return _.reduce(
      str.split("\n"),
      (table, row) => {
        table.push(_.map(row.split(","), (c) => c.trim()));
        return table;
      },
      [],
    );
  }

  function selectNames(table) {
    return _.tail(_.map(table, _.head));
  }

  function selectAges(table) {
    return _.tail(_.map(table, second));
  }

  function selectHairColor(table) {
    return _.tail(_.map(table, (row) => nth(row, 2)));
  }

  function existy(x) {
    return x != null;
  }

  function truthy(x) {
    return x !== false && existy(x);
  }

  function doWhen(cond, action) {
    if (truthy(cond)) return action();
    else return undefined;
  }

  function executeIfHasField(target, name) {
    return doWhen(existy(target[name]), () => {
      const result = _.result(target, name);
      console.log(["結果は", result].join(" "));
      return result;
    });
  }
  // 2章 第一級関数と作用的プログラミング

  function cat(/* いくつかの拝借 */) {
    const head = _.first(arguments);
    if (existy(head)) {
      return head.concat.apply(head, _.tail(arguments));
    } else {
      return [];
    }
  }

  function construct(head, tail) {
    return cat([head], _.toArray(tail));
  }

  function mapcat(fun, coll) {
    return cat.apply(null, _.map(coll, fun));
  }

  function butLast(coll) {
    return _.toArray(coll).slice(0, -1);
  }

  function interpose(inter, coll) {
    return butLast(
      mapcat(function (e) {
        return construct(e, [inter]);
      }, coll),
    );
  }

  describe("1章 関数型JavaScriptへのいざない", () => {
    describe("抽象単位としての関数", () => {
      test("parseAge", () => {
        function parseAge(age) {
          if (!_.isString(age)) fail("引数は文字列である必要があります");
          let a;

          note("ageを数値に変換しようとしています");

          a = parseInt(age, 10);
          if (_.isNaN(a)) {
            warn(["ageを数値に変換できませんでした", age].join(" "));
            a = 0;
          }
          return a;
        }

        expect(parseAge("frob")).toBe(0);
        expect(parseAge("42.5")).toBe(42);
        expect(parseAge("x42.a")).toBe(0);
      });
    });

    describe("動作単位としての関数", () => {
      const letters = ["a", "b", "c"];

      test("naiveNth", () => {
        function naiveNth(a, index) {
          return a[index];
        }

        expect(naiveNth(letters, 1)).toBe("b");
        expect(naiveNth({}, 1)).toBe(undefined);
      });

      test("nth", () => {
        expect(nth("abc", 0)).toBe("a");
        expect(() => nth({}, 0)).toThrow(
          "インデックス指定可能ではないデータ型はサポートされていません",
        );
        expect(() => nth(letters, 4000)).toThrow(
          "指定されたインデックスは範囲外です",
        );
        expect(() => nth(letters, "aaaaa")).toThrow(
          "インデックスは数値である必要があります",
        );
      });

      test("second", () => {
        expect(second(["a", "b"])).toBe("b");
        expect(second("fogus")).toBe("o");
        expect(() => second({})).toThrow(
          "インデックス指定可能ではないデータ型はサポートされていません",
        );
      });

      test("compareLessThanOrEqual", () => {
        expect(
          [2, 3, -1, -6, 0, -108, 42, 10].sort(compareLessThanOrEqual),
        ).toEqual([-108, -6, -1, 0, 2, 3, 10, 42]);
      });

      test("lessOrEqual", () => {
        expect([2, 3, -1, -6, 0, -108, 42, 10].sort(lessOrEqual)).toEqual([
          2, 3, -1, -6, 0, -108, 42, 10,
        ]);
      });

      test("comparator", () => {
        expect(
          [2, 3, -1, -6, 0, -108, 42, 10].sort(comparator(lessOrEqual)),
        ).toEqual([-108, -6, -1, 0, 2, 3, 10, 42]);
      });
    });

    describe("抽象としてのデータ", () => {
      const peopleTable = lameCSV(
        "name,age,hair\nMerble,35,red\nBob,64,blonde",
      );

      test("lameCSV", () => {
        expect(_.tail(peopleTable).sort()).toEqual([
          ["Bob", "64", "blonde"],
          ["Merble", "35", "red"],
        ]);
      });

      test("lameCSV", () => {
        expect(lameCSV("name,age,hair\nMerble,35,red\nBob,64,blonde")).toEqual([
          ["name", "age", "hair"],
          ["Merble", "35", "red"],
          ["Bob", "64", "blonde"],
        ]);
      });

      test("selectNames", () => {
        expect(selectNames(peopleTable)).toEqual(["Merble", "Bob"]);
      });

      test("selectAges", () => {
        expect(selectAges(peopleTable)).toEqual(["35", "64"]);
      });

      test("selectHairColor", () => {
        expect(selectHairColor(peopleTable)).toEqual(["red", "blonde"]);
      });

      test("mergeReult", () => {
        expect(
          _.zip(selectNames(peopleTable), selectAges(peopleTable)),
        ).toEqual([
          ["Merble", "35"],
          ["Bob", "64"],
        ]);
      });
    });

    describe("関数型テイストのJavaScript", () => {
      test("existy", () => {
        expect(existy(null)).toBe(false);
        expect(existy(undefined)).toBe(false);
        expect(existy({})).toBe(true);
        expect(existy({}.notHere)).toBe(false);
        expect(existy((function () {})())).toBe(false);
        expect(existy(0)).toBe(true);
        expect(existy(false)).toBe(true);
        expect([null, undefined, 1, 2, false].map(existy)).toEqual([
          false,
          false,
          true,
          true,
          true,
        ]);
      });

      test("truthy", () => {
        expect(truthy(false)).toBe(false);
        expect(truthy(undefined)).toBe(false);
        expect(truthy(0)).toBe(true);
        expect(truthy("")).toBe(true);
        expect([null, undefined, 1, 2, false].map(truthy)).toEqual([
          false,
          false,
          true,
          true,
          false,
        ]);
      });

      test("executeIfHasField", () => {
        expect(executeIfHasField([1, 2, 3], "reverse")).toStrictEqual([
          3, 2, 1,
        ]);
        expect(executeIfHasField({ foo: 42 }, "foo")).toStrictEqual(42);
        expect(executeIfHasField([1, 2, 3], "notHere")).toBe(undefined);
      });
    });
  });

  describe("2章 第一級関数と作用的プロググラミング", () => {
    describe("第一級要素としての関数", () => {
      _.each(["whiskey", "tango", "foxtrot"], function (word) {
        console.log(word.charAt(0).toUpperCase() + word.substr(1));
      });

      describe("JavaScriptにおける複数のプログラミイングパラダイム", () => {});

      describe("命令型プログラミング", () => {
        /**
         * + 99から開始
         * + 現在の数をXとして、次のように歌う
         *  + X本のビールが残っている
         *  + X本のビール
         *  + ひとつ取って、隣に回せ
         *  + X-1本のビールが残っている
         * + 最後の数字(x)から1を引いた数でこれを繰り返す
         * + 1にたどり着いたら、先の歌の最後の行を次の用に歌う
         *  + もうビールは残っていない
         */

        let lyrics = [];

        for (let bottles = 99; bottles > 0; bottles--) {
          lyrics.push(bottles + "本のビールが残っている");
          lyrics.push(bottles + "本のビール");
          lyrics.push("ひとつ取って、隣に回せ");
          if (bottles > 1) {
            lyrics.push(bottles - 1 + "本のビールが残っている");
          } else {
            lyrics.push("もうビールは残っていない");
          }
        }

        function lyricSegment(n) {
          return _.chain([])
            .push(n + "本のビールが残っている")
            .push(n + "本のビール")
            .push("ひとつ取って、隣に回せ")
            .tap(function (lyrics) {
              if (n > 1) lyrics.push(n - 1 + "本のビールが残っている");
              else lyrics.push("もうビールは残っていない");
            })
            .value();
        }

        test("lyrics", () => {
          expect(lyrics).toHaveLength(396);
          expect(lyrics[0]).toBe("99本のビールが残っている");
          expect(lyrics[1]).toBe("99本のビール");
          expect(lyrics[2]).toBe("ひとつ取って、隣に回せ");
          expect(lyrics[3]).toBe("98本のビールが残っている");
          expect(lyrics[395]).toBe("もうビールは残っていない");
        });

        test("lyricSegment", () => {
          expect(lyricSegment(99)).toEqual([
            "99本のビールが残っている",
            "99本のビール",
            "ひとつ取って、隣に回せ",
            "98本のビールが残っている",
          ]);

          expect(lyricSegment(1)).toEqual([
            "1本のビールが残っている",
            "1本のビール",
            "ひとつ取って、隣に回せ",
            "もうビールは残っていない",
          ]);

          expect(lyricSegment(0)).toEqual([
            "0本のビールが残っている",
            "0本のビール",
            "ひとつ取って、隣に回せ",
            "もうビールは残っていない",
          ]);

          expect(lyricSegment(-1)).toEqual([
            "-1本のビールが残っている",
            "-1本のビール",
            "ひとつ取って、隣に回せ",
            "もうビールは残っていない",
          ]);
        });

        function song(start, end, lyricGen) {
          return _.reduce(
            _.range(start, end, -1),
            function (acc, n) {
              return acc.concat(lyricGen(n));
            },
            [],
          );
        }

        test("song", () => {
          expect(song(99, 0, lyricSegment)).toHaveLength(396);
          expect(song(99, 0, lyricSegment)[0]).toBe("99本のビールが残っている");
          expect(song(99, 0, lyricSegment)[1]).toBe("99本のビール");
          expect(song(99, 0, lyricSegment)[2]).toBe("ひとつ取って、隣に回せ");
          expect(song(99, 0, lyricSegment)[3]).toBe("98本のビールが残っている");
          expect(song(99, 0, lyricSegment)[395]).toBe(
            "もうビールは残っていない",
          );
        });
      });

      describe("プロトタイプベースのオブジェクト指向プログラミング", () => {
        const a = {
          name: "a",
          fun: function () {
            return this;
          },
        };
        const bObj = {
          name: "b",
          fun: function () {
            return this;
          },
        };
        const bFunc = bObj.fun;

        test("a.fun", () => {
          expect(a.fun()).toBe(a);
        });

        test("bObj.fun", () => {
          expect(bObj.fun()).toBe(bObj);
          expect(bFunc()).not.toBe(bObj);
        });
      });

      describe("メタプログラミング", () => {
        function Point2D(x, y) {
          this._x = x;
          this._y = y;
        }

        test("Point2D", () => {
          const p = new Point2D(0, 1);
          expect(p._x).toBe(0);
          expect(p._y).toBe(1);
        });

        function Point3D(x, y, z) {
          Point2D.call(this, x, y);
          this._z = z;
        }

        test("Point3D", () => {
          const p = new Point3D(10, -1, 100);
          expect(p._x).toBe(10);
          expect(p._y).toBe(-1);
          expect(p._z).toBe(100);
        });
      });

      describe("作用的プログラミング", () => {
        const nums = [1, 2, 3, 4, 5];

        function doubleAll(array) {
          return _.map(array, function (n) {
            return n * 2;
          });
        }

        function average(array) {
          const sum = _.reduce(array, function (a, b) {
            return a + b;
          });
          return sum / _.size(array);
        }

        function onlyEven(array) {
          return _.filter(array, function (n) {
            return n % 2 === 0;
          });
        }

        test("doubleAll", () => {
          expect(doubleAll(nums)).toEqual([2, 4, 6, 8, 10]);
        });

        test("average", () => {
          expect(average(nums)).toBe(3);
        });

        test("onlyEven", () => {
          expect(onlyEven(nums)).toEqual([2, 4]);
        });
      });

      describe("コレクション中心プログラミング", () => {
        test("_.map", () => {
          expect(_.map({ a: 1, b: 2 }, _.identity)).toEqual([1, 2]);
          expect(
            _.map({ a: 1, b: 2 }, function (v, k) {
              return [k, v];
            }),
          ).toEqual([
            ["a", 1],
            ["b", 2],
          ]);
          expect(
            _.map({ a: 1, b: 2 }, function (v, k, coll) {
              return [k, v, _.keys(coll)];
            }),
          ).toEqual([
            ["a", 1, ["a", "b"]],
            ["b", 2, ["a", "b"]],
          ]);
        });
      });

      describe("作用的プログラミングのその他の例", () => {
        describe("reduceRight", () => {
          const nums = [100, 2, 25];

          function div(x, y) {
            return x / y;
          }

          _.reduce(nums, div);

          function allOf(/* 一つ以上の関数 */) {
            return _.reduceRight(
              arguments,
              function (truth, f) {
                return truth && f();
              },
              true,
            );
          }

          function anyOf(/* 一つ以上の関数 */) {
            return _.reduceRight(
              arguments,
              function (truth, f) {
                return truth || f();
              },
              false,
            );
          }

          function T() {
            return true;
          }

          function F() {
            return false;
          }

          test("div", () => {
            expect(_.reduce(nums, div)).toBe(2);
          });

          test("allOf", () => {
            expect(allOf()).toBe(true);
            expect(allOf(T, T)).toBe(true);
            expect(allOf(T, T, T, T, F)).toBe(false);
          });

          test("anyOf", () => {
            expect(anyOf()).toBe(false);
            expect(anyOf(T, T, F)).toBe(true);
            expect(anyOf(F, F, F, F)).toBe(false);
          });
        });

        describe("find", () => {
          test("find", () => {
            expect(_.find(["a", "b", 3, "d"], _.isNumber)).toBe(3);
          });
        });

        describe("reject", () => {
          function complement(pred) {
            return function () {
              return !pred.apply(null, _.toArray(arguments));
            };
          }

          test("reject", () => {
            expect(_.reject(["a", "b", 3, "d"], _.isNumber)).toEqual([
              "a",
              "b",
              "d",
            ]);
            expect(
              _.filter(["a", "b", 3, "d"], complement(_.isNumber)),
            ).toEqual(["a", "b", "d"]);
          });
        });

        describe("all", () => {
          test("all", () => {
            expect(_.every([1, 2, 3], _.isNumber)).toBe(true);
            expect(_.every([1, 2, 3, "a"], _.isNumber)).toBe(false);
          });
        });

        describe("any", () => {
          test("any", () => {
            expect(_.some([1, 2, 3], _.isString)).toBe(false);
            expect(_.some([1, 2, 3, "a"], _.isString)).toBe(true);
          });
        });

        describe("sortBy,groupBy,countBy", () => {
          const people = [
            { name: "Rick", age: 30 },
            { name: "Jaka", age: 24 },
          ];
          const albums = [
            { title: "Sabbath Bloody Sabbath", genre: "Metal" },
            { title: "Scientist", genre: "Dub" },
            { title: "Undertow", genre: "Metal" },
          ];

          test("sortBy", () => {
            expect(
              _.sortBy(people, function (p) {
                return p.age;
              }),
            ).toEqual([
              { name: "Jaka", age: 24 },
              { name: "Rick", age: 30 },
            ]);
          });

          test("groupBy", () => {
            expect(
              _.groupBy(albums, function (a) {
                return a.genre;
              }),
            ).toEqual({
              Dub: [{ title: "Scientist", genre: "Dub" }],
              Metal: [
                { title: "Sabbath Bloody Sabbath", genre: "Metal" },
                { title: "Undertow", genre: "Metal" },
              ],
            });
          });

          test("countBy", () => {
            expect(
              _.countBy(albums, function (a) {
                return a.genre;
              }),
            ).toEqual({ Dub: 1, Metal: 2 });
          });
        });
      });

      describe("作用的な関数を定義してみる", () => {
        test("cat", () => {
          expect(cat([1, 2, 3], [4, 5], [6, 7, 8])).toEqual([
            1, 2, 3, 4, 5, 6, 7, 8,
          ]);
        });

        test("construct", () => {
          expect(construct(42, [1, 2, 3])).toEqual([42, 1, 2, 3]);
        });

        test("mapcat", () => {
          expect(
            mapcat(
              function (e) {
                return construct(e, [","]);
              },
              [1, 2, 3],
            ),
          ).toEqual([1, ",", 2, ",", 3, ","]);
        });

        test("butLast", () => {
          expect(butLast([1, 2, 3, 4])).toEqual([1, 2, 3]);
        });

        test("interpose", () => {
          expect(interpose(",", [1, 2, 3])).toEqual([1, ",", 2, ",", 3]);
        });
      });
    });

    describe("データ思考", () => {
      const zombie = { name: "Bub", film: "Day of the Dead" };
      const person = { name: "Romy", token: "j398dij", password: "tigress" };
      const library = [
        { title: "SICP", isbn: "0262010771", ed: 1 },
        { title: "SICP", isbn: "0262510871", ed: 2 },
        { title: "Joy of Clojure", isbn: "1935182641", ed: 1 },
      ];

      test("_.keys", () => {
        expect(_.keys(zombie)).toEqual(["name", "film"]);
      });

      test("_.values", () => {
        expect(_.values(zombie)).toEqual(["Bub", "Day of the Dead"]);
      });

      test("_.pluck", () => {
        expect(
          _.map(
            [
              { title: "Chthon", authoer: "Anthony" },
              { title: "Grendel", authoer: "Gardner" },
              { title: "After Dark" },
            ],
            "authoer",
          ),
        ).toEqual(["Anthony", "Gardner", undefined]);

        expect(
          _.map(
            [
              { title: "Chthon", author: "Anthony" },
              { title: "Grendel", author: "Gardner" },
              { title: "After Dark" },
            ],
            function (obj) {
              return _.defaults(obj, { author: "Unknown" }).author;
            },
          ),
        ).toEqual(["Anthony", "Gardner", "Unknown"]);
      });

      test("_.pairs", () => {
        expect(_.toPairs(zombie)).toEqual([
          ["name", "Bub"],
          ["film", "Day of the Dead"],
        ]);
      });

      test("_.object", () => {
        expect(
          _.fromPairs(
            _.map(_.toPairs(zombie), function (pair) {
              return [pair[0].toUpperCase(), pair[1]];
            }),
          ),
        ).toEqual({ FILM: "Day of the Dead", NAME: "Bub" });
      });

      test("_.invert", () => {
        expect(_.invert(zombie)).toEqual({
          Bub: "name",
          "Day of the Dead": "film",
        });
      });

      test("_.omit", () => {
        expect(_.omit(person, "token", "password")).toEqual({ name: "Romy" });
      });

      test("_.pick", () => {
        expect(_.pick(person, "token", "password")).toEqual({
          token: "j398dij",
          password: "tigress",
        });
      });

      test("_.findWhere", () => {
        expect(_.find(library, { title: "SICP", ed: 2 })).toEqual({
          title: "SICP",
          isbn: "0262510871",
          ed: 2,
        });
      });

      test("_.where", () => {
        expect(_.filter(library, { title: "SICP" })).toEqual([
          { title: "SICP", isbn: "0262010771", ed: 1 },
          { title: "SICP", isbn: "0262510871", ed: 2 },
        ]);
      });

      describe("「テーブルのような」データ", () => {
        function project(table, keys) {
          return _.map(table, function (obj) {
            return _.pick.apply(null, construct(obj, keys));
          });
        }

        function rename(obj, newNames) {
          return _.reduce(newNames, function(o, nu, old) {
            if (_.has(obj, old)) {
              o[nu] = obj[old];
              return o;    
            } 
            else 
              return 0;
            },
            _.omit.apply(null, construct(obj, _.keys(newNames))));
          }

        function as(table, newNames) {
          return _.map(table, function(obj) {
            return rename(obj, newNames);
          });
        }

        function restrict(table, pred) {
          return _.reduce(table, function(newTable, obje) {
            if (truthy(pred(obje))) return newTable;
            else return _.without(newTable, obje);
          }, table);
        }

        const editionResults = project(library, ["title", "isbn"]);
        const isbnResults = project(library, ["isbn"]);

        test("project", () => {
          expect(project(library, ["title", "isbn"])).toEqual(editionResults);
          expect(project(library, ["isbn"])).toEqual(isbnResults);
          expect(_.map(isbnResults, "isbn")).toEqual([
            "0262010771", "0262510871", "1935182641",
          ]);
          expect(project(as(library, {ed: "edition"}), ["title", "isbn"])).toEqual(editionResults);
        });

        test("rename", () => {
          expect(rename({a: 1, b: 2}, {a: "AAA"})).toEqual({AAA: 1, b: 2});
        });

        test("as", () => {
          expect(as(library, {ed: "edition"})).toEqual([
            {title: "SICP", isbn: "0262010771", edition: 1},
            {title: "SICP", isbn: "0262510871", edition: 2},
            {title: "Joy of Clojure", isbn: "1935182641", edition: 1},
          ]);
        });

        test("restrict", () => {
          expect(restrict(library, function (book) {
            return book.ed > 1;
          })).toEqual([
            {title: "SICP", isbn: "0262510871", ed: 2},
          ]);

          expect(restrict(
            project(
              as(library, {ed: "edition"}),
              ["title", "isbn", "edition"]
            ), function(book) {
              return book.edition > 1;
            }
          )
          ).toEqual([
            {title: "SICP", isbn: "0262510871", edition: 2},
          ]);
        });
      });
    });
  });

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

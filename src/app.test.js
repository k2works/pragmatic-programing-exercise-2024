const exp = require("constants");

describe("JavaScriptで学ぶ関数型プログラミング", () => {
  const _ = require("lodash");

  //1章 関数型JavaScriptへのいざない
  function splat(fun) {
    return function (array) {
      return fun.apply(null, array);
    };
  }

  function unsplat(fun) {
    return function () {
      return fun.call(null, _.toArray(arguments));
    };
  }


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

  function average(array) {
    const sum = _.reduce(array, function (a, b) {
      return a + b;
    });
    return sum / _.size(array);
  }

  function plucker(FIELD) {
    return function (obj) {
      return (obj && obj[FIELD]);
    };
  }

  function repeatedly(times, fun) {
    return _.map(_.range(times), fun);
  }

  function makeAdder(CAPTURED) {
    return function (free) {
      return free + CAPTURED;
    };
  }

  function always(VALUE) {
    return function () {
      return VALUE;
    };
  };

  function invoker(NAME, METHOD) {
    return function (target) {
      if (!existy(target)) fail("Must provide a target");

      const targetMethod = target[NAME];
      const args = _.tail(arguments);

      return doWhen((existy(targetMethod) && METHOD === targetMethod), function () {
        return targetMethod.apply(target, args);
      });
    };
  };

  function curry(fun) {
    return function (arg) {
      return fun(arg);
    };
  }

  function curry2(fun) {
    return function (secondArg) {
      return function (firstArg) {
        return fun(firstArg, secondArg);
      };
    };
  }

  function songToString(song) {
    return [song.artist, song.track].join(" - ");
  }

  function checker(/* (1つ以上の)検証関数 */) {
    const validators = _.toArray(arguments);
    return function (obj) {
      return _.reduce(validators, function (errs, check) {
        if (check(obj))
          return errs;
        else
          return _.chain(errs).push(check.message).value();
      }, []);
    };
  }

  function validator(message, fun) {
    const f = function (/* args */) {
      return fun.apply(fun, arguments);
    };
    f['message'] = message;
    return f;
  }

  function div(x, y) {
    return x / y;
  }

  function complement(pred) {
    return function () {
      return !pred.apply(null, _.toArray(arguments));
    };
  }

  function partial(fun /*, pargs */) {
    const pargs = _.tail(arguments);

    return function (/* args */) {
      const args = cat(pargs, _.toArray(arguments));
      return fun.apply(fun, args);
    };
  }

  function partial1(fun, arg1) {
    return function (/* args */) {
      const args = construct(arg1, arguments);
      return fun.apply(fun, args);
    };
  }

  function isEven(n) { return (n % 2) === 0; }
  function hasKeys() {
    const KEYS = _.toArray(arguments);

    const fun = function (obj) {
      return _.every(KEYS, function (k) {
        return _.has(obj, k);
      });
    };

    fun.message = cat(["これらのキーが存在する必要があります："], KEYS).join(' ');
    return fun;
  }

  function condition1(/* 1つ以上の検証関数 */) {
    const validators = _.toArray(arguments);

    return function (fun, arg) {
      const errors = mapcat(function (isValid) {
        return isValid(arg) ? [] : [isValid.message];
      }, validators);

      if (!_.isEmpty(errors)) throw new Error(errors.join(", "));

      return fun(arg);
    }
  }

  const greaterThan = curry2(function (lhs, rhs) { return lhs > rhs; });
  const lessThan = curry2(function (lhs, rhs) { return lhs < rhs; });
  const zero = validator("0ではいけません", function (n) { return 0 === n; });
  const number = validator("引数は数値である必要があります", _.isNumber);

  function sqr(n) {
    if (!number(n)) throw new Error(number.message);
    if (zero(n)) throw new Error(zero.message);
    return n * n;
  }

  const sqrPre = condition1(
    validator("0ではいけません", complement(zero)),
    validator("引数は数値である必要があります", _.isNumber)
  )
  function uncheckedSqr(n) { return n * n; }
  const checkedSqr = partial1(sqrPre, uncheckedSqr);

  function nexts(graph, node) {
    if (_.isEmpty(graph)) return [];
    const pair = _.head(graph);
    const from = _.head(pair);
    const to = second(pair);
    const more = _.tail(graph);

    if (_.isEqual(node, from)) return construct(to, nexts(more, node));
    else
      return nexts(more, node);
  }

  const rev = invoker('reverse', Array.prototype.reverse);

  const isOdd = complement(isEven);

  const rand = partial1(_.random, 1);

  function skipTake(n, coll) {
    const ret = [];
    const sz = _.size(coll);

    for (let index = 0; index < sz; index += n) {
      ret.push(coll[index]);
    }

    return ret;
  }

  const sqrPost = condition1(
    validator("結果は数値である必要があります", _.isNumber),
    validator("結果はゼロでない必要があります", complement(zero)),
    validator("結果は正である必要があります", greaterThan(0))
  );
  const megaCheckedSqr = _.flowRight(partial(sqrPost, _.identity), checkedSqr);

  function project(table, keys) {
    return _.map(table, function (obj) {
      return _.pick.apply(null, construct(obj, keys));
    });
  }

  function rename(obj, newNames) {
    return _.reduce(
      newNames,
      function (o, nu, old) {
        if (_.has(obj, old)) {
          o[nu] = obj[old];
          return o;
        } else return 0;
      },
      _.omit.apply(null, construct(obj, _.keys(newNames))),
    );
  }

  function as(table, newNames) {
    return _.map(table, function (obj) {
      return rename(obj, newNames);
    });
  }

  function restrict(table, pred) {
    return _.reduce(
      table,
      function (newTable, obje) {
        if (truthy(pred(obje))) return newTable;
        else return _.without(newTable, obje);
      },
      table,
    );
  }

  function actions(acts, done) {
    return function (seed) {
      const init = { values: [], state: seed };

      const intermediate = _.reduce(acts, function (stateObj, action) {
        const result = action(stateObj.state);
        const values = cat(stateObj.values, [result.answer]);
        return { values: values, state: result.state };
      }, init);

      const keep = _.filter(intermediate.values, existy);
      return done(keep, intermediate.state);
    };
  }

  function pipeline(seed /*, args */) {
    return _.reduce(
      _.tail(arguments),
      function (l, r) { return r(l); },
      seed
    );
  }

  function dispatch(/* 任意の数の関数 */) {
    const funs = _.toArray(arguments);
    const size = funs.length;

    return function (target /*, args */) {
      let ret;
      let args = _.last(arguments);

      for (let funIndex = 0; funIndex < size; funIndex++) {
        ret = funs[funIndex].apply(funs[funIndex], construct(target, args));
        if (existy(ret)) return ret;
      }

      return ret;
    };
  }

  const str = dispatch(invoker('toString', Array.prototype.toString), invoker('toString', String.prototype.toString));

  function Container(init) {
    this._value = init;
  }

  const HoleMixin = {
    setValue: function (newValue) {
      const oldVal = this._value;
      this.validate(newValue);
      this._value = newValue;
      this.notify(oldVal, newValue);
      return this._value;
    }
  };

  const Hole = function (val) {
    Container.call(this, val);
  }

  const ObserverMixin = (function () {
    let _watcher = [];
    return {
      watch: function (fun) {
        _watcher.push(fun);
        return _.size(_watcher);
      },
      notify: function (oldVal, newVal) {
        _.each(_watcher, function (watcher) {
          watcher.call(this, oldVal, newVal);
        });
        return _.size(_watcher);
      }
    }
  })();

  const ValidateMixin = {
    addValidator: function (fun) {
      this._validator = fun;
    },
    init: function (val) {
      this.validate(val);
    },
    validate: function (val) {
      if (existy(this._validator) && !this._validator(val))
        fail("不正な値を設定しようとしました：" + polyToString(val));
    }
  }

  function deepClone(obj) {
    if (!existy(obj) || !_.isObject(obj)) return obj;

    const temp = new obj.constructor();
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) temp[key] = deepClone(obj[key]);
    }

    return temp;
  }

  const SwapMinx = {
    swap: function (fun /*, args */) {
      const args = _.tail(arguments);
      const newValue = fun.apply(this, construct(this._value, args));
      return this.setValue(newValue);
    }
  };

  const SnapshotMixin = {
    snapshot: function () {
      return deepClone(this._value);
    }
  };

  function polyToString(obj) {
    if (obj instanceof String) return obj;
    else if (obj instanceof Array) return stringifyArray(obj);
    else if (obj instanceof Object) return stringifyObject(obj);
    else return String(obj);
  }

  const CAS = function (val) {
    Hole.call(this, val);
  }
  const CASMixin = {
    swap: function (oldVal, f) {
      if (this._value === oldVal) {
        this.setValue(f(this._value));
        return this._value;
      } else {
        return undefined;
      }
    }
  };


  describe("1章 関数型JavaScriptへのいざない", () => {
    describe("JavaScriptに関する事実", () => {
      function splat(fun) {
        return function (array) {
          return fun.apply(null, array);
        };
      }

      function unsplat(fun) {
        return function () {
          return fun.call(null, _.toArray(arguments));
        };
      }

      test("splat", () => {
        const addArrayElements = splat(function (x, y) {
          return x + y;
        });

        expect(addArrayElements([1, 2])).toBe(3);
      });

      test("unsplat", () => {
        const joinElements = unsplat(function (array) {
          return array.join(" ");
        });

        expect(joinElements(1, 2)).toBe("1 2");
      });
    })

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
        expect(existy((function () { })())).toBe(false);
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

      describe("JavaScriptにおける複数のプログラミイングパラダイム", () => { });

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
          return _.reduce(
            newNames,
            function (o, nu, old) {
              if (_.has(obj, old)) {
                o[nu] = obj[old];
                return o;
              } else return 0;
            },
            _.omit.apply(null, construct(obj, _.keys(newNames))),
          );
        }

        function as(table, newNames) {
          return _.map(table, function (obj) {
            return rename(obj, newNames);
          });
        }

        function restrict(table, pred) {
          return _.reduce(
            table,
            function (newTable, obje) {
              if (truthy(pred(obje))) return newTable;
              else return _.without(newTable, obje);
            },
            table,
          );
        }

        const editionResults = project(library, ["title", "isbn"]);
        const isbnResults = project(library, ["isbn"]);

        test("project", () => {
          expect(project(library, ["title", "isbn"])).toEqual(editionResults);
          expect(project(library, ["isbn"])).toEqual(isbnResults);
          expect(_.map(isbnResults, "isbn")).toEqual([
            "0262010771",
            "0262510871",
            "1935182641",
          ]);
          expect(
            project(as(library, { ed: "edition" }), ["title", "isbn"]),
          ).toEqual(editionResults);
        });

        test("rename", () => {
          expect(rename({ a: 1, b: 2 }, { a: "AAA" })).toEqual({
            AAA: 1,
            b: 2,
          });
        });

        test("as", () => {
          expect(as(library, { ed: "edition" })).toEqual([
            { title: "SICP", isbn: "0262010771", edition: 1 },
            { title: "SICP", isbn: "0262510871", edition: 2 },
            { title: "Joy of Clojure", isbn: "1935182641", edition: 1 },
          ]);
        });

        test("restrict", () => {
          expect(
            restrict(library, function (book) {
              return book.ed > 1;
            }),
          ).toEqual([{ title: "SICP", isbn: "0262510871", ed: 2 }]);

          expect(
            restrict(
              project(as(library, { ed: "edition" }), [
                "title",
                "isbn",
                "edition",
              ]),
              function (book) {
                return book.edition > 1;
              },
            ),
          ).toEqual([{ title: "SICP", isbn: "0262510871", edition: 2 }]);
        });
      });
    });
  });

  describe("3章 JavaScriptにおける変数のスコープとクロージャ", () => {
    describe("静的スコープ", () => {
      const aVariable = " 外";

      function aFun() {
        const aVariable = " 内";
        return _.map([1, 2, 3], function (e) {
          const aVariable = " 最内";
          return [aVariable, e].join(' ');
        });
      }

      test("aFun", () => {
        expect(aFun()).toEqual([" 最内 1", " 最内 2", " 最内 3"]);
      });
    });

    describe("動的スコープ", () => {
      const globals = {};

      function makeBindFun(resolver) {
        return function (k, v) {
          const stack = globals[k] || [];
          globals[k] = resolver(stack, v);
          return globals;
        };
      }

      const stackBinder = makeBindFun(function (stack, v) {
        stack.push(v);
        return stack;
      });

      const stackUnbinder = makeBindFun(function (stack) {
        stack.pop();
        return stack;
      });

      const dynamiclookup = function (k) {
        const slot = globals[k] || [];
        return _.last(slot);
      };

      function f() { return dynamiclookup('a'); };
      function g() { stackBinder('a', 'g'); return f(); };

      test("dynamiclookup", () => {
        stackBinder('a', 1);
        stackBinder('b', 100);
        expect(dynamiclookup('a')).toBe(1);
        expect(dynamiclookup('b')).toBe(100);
        expect(globals).toEqual({ a: [1], b: [100] });

        stackBinder('a', '*');
        expect(dynamiclookup('a')).toBe('*');
        expect(globals).toEqual({ a: [1, '*'], b: [100] });

        expect(f()).toBe('*');
        expect(g()).toBe('g');
        expect(globals).toEqual({ a: [1, '*', 'g'], b: [100] });
      });
    })

    describe("JavaScriptにおける動的スコープ", () => {
      function globalThis() { return this; }

      test("globalThis", () => {
        expect(globalThis.call('barnabas')).toBe('barnabas');
        expect(globalThis.apply('orsulak', [])).toBe('orsulak');
      });

      const nopeThis = _.bind(globalThis, 'nope');

      test("nopeThis", () => {
        expect(nopeThis.call('wat')).toBe('nope');
      });

      const target = {
        name: '正しい値',
        aux: function () { return this.name; },
        act: function () { return this.aux(); }
      };

      _.bindAll(target, 'aux', 'act');
      test("target", () => {
        expect(target.act()).toBe('正しい値');
      });

      describe("関数スコープ", () => {
        function strangeIdentity(n) {
          for (var i = 0; i < n; i++);
          return i
        }

        test("strangeIdentity", () => {
          expect(strangeIdentity(138)).toBe(138);
        });

        function strangerIdentity(n) {
          for (this['i'] = 0; this['i'] < n; this['i']++);
          return this['i'];
        }

        test("strangerIdentity", () => {
          expect(strangerIdentity.call({}, 10000)).toBe(10000);
        });

        function f() {
          this['a'] = 200;
          return this['a'] + this['b'];
        }

        const globals = { 'b': 2 };

        test("f", () => {
          expect(f.call(_.clone(globals))).toBe(202);
          expect(globals).toEqual({ b: 2 });
        });
      });

      describe("クロージャ", () => {
        describe("クロージャをシミュレート", () => {
          function whatWasTheLocal() {
            const CAPTURED = "あ、こんにちは。";
            return function () {
              return "ローカル変数：" + CAPTURED;
            };
          }

          test("whatWasTheLocal", () => {
            const reportLocal = whatWasTheLocal();
            expect(reportLocal()).toBe("ローカル変数：あ、こんにちは。");
          });

          function createScaleFunction(FACTOR) {
            return function (v) {
              return _.map(v, function (n) {
                return n * FACTOR;
              });
            };
          }

          test("createScaleFunction", () => {
            const scale10 = createScaleFunction(10);
            expect(scale10([1, 2, 3])).toEqual([10, 20, 30]);
          });

          function createWeirdScaleFunction(FACTOR) {
            return function (v) {
              this['FACTOR'] = FACTOR;
              const captures = this;
              return _.map(v, _.bind(function (n) {
                return (n * this['FACTOR']);
              }, captures));
            };
          }

          test("createWeirdScaleFunction", () => {
            const scale10 = createWeirdScaleFunction(10);
            expect(scale10.call({}, [5, 6, 7])).toEqual([50, 60, 70]);
          });
        });

        describe("自由変数", () => {
          function makeAdder(CAPTURED) {
            return function (free) {
              return free + CAPTURED;
            };
          }

          test("makeAdder", () => {
            const add10 = makeAdder(10);
            expect(add10(32)).toBe(42);
            const add1024 = makeAdder(1024);
            expect(add1024(10)).toBe(1034);
            expect(add10(98)).toBe(108);
          });

          function averageDamp(FUN) {
            return function (n) {
              return average([n, FUN(n)]);
            };
          }

          test("averageDamp", () => {
            const averageSq = averageDamp(function (n) { return n * n; });
            expect(averageSq(10)).toBe(55);
          });
        });

        describe("シャドウィング", () => {
          var shadowed = 0;
          function varShadow() {
            const shadowed = 4320000;
            return ["値は", shadowed].join(' ');
          }

          function argShadow(shadowed) {
            return ["値は", shadowed].join(' ');
          }

          test("varShadow", () => {
            expect(varShadow()).toBe("値は 4320000");
            expect(argShadow(4320000)).toBe("値は 4320000");
            expect(argShadow()).toBe("値は ");
          });
        });

        describe("クロージャの使用", () => {
          function complement(PRED) {
            return function () {
              return !PRED.apply(null, _.toArray(arguments));
            };
          }

          function isEven(n) { return (n % 2) === 0; }
          const isOdd = complement(isEven);
          //function isEven(n) { return false;}
          test("complement", () => {
            expect(isOdd(2)).toBe(false);
            expect(isOdd(413)).toBe(true);
          });

          function showObject(OBJ) {
            return function () {
              return OBJ;
            };
          }

          test("showObject", () => {
            const o = { a: 42 };
            const showO = showObject(o);
            expect(showO()).toStrictEqual({ a: 42 });
            o.newField = 108;
            expect(showO()).toStrictEqual({ a: 42, newField: 108 });
          });

          const pingpong = (function () {
            let PRIVATE = 0;
            return {
              inc: function (n) {
                return PRIVATE += n;
              },
              dec: function (n) {
                return PRIVATE -= n;
              }
            };
          })();

          test("pingpong", () => {
            expect(pingpong.inc(10)).toBe(10);
            expect(pingpong.dec(7)).toBe(3);

            pingpong.div = function (n) { return PRIVATE / n; }
            expect(() => pingpong.div(3)).toThrow();
          });
        });

        describe("抽象としてのクロージャ", () => {
          function plucker(FIELD) {
            return function (obj) {
              return (obj && obj[FIELD]);
            };
          }

          test("plucker", () => {
            const best = { title: "Infinite Jest", author: "DFW" };
            const getTitle = plucker('title');
            expect(getTitle(best)).toBe("Infinite Jest");

            const books = [{ title: "Chthon" }, { stars: 5 }, { title: "Botchan" }];
            const third = plucker(2);
            expect(third(books)).toStrictEqual({ title: "Botchan" });

            expect(_.filter(books, getTitle)).toStrictEqual([{ title: "Chthon" }, { title: "Botchan" }]);
          });
        });

      });
    });
  });

  describe("4章 高階関数", () => {
    describe("引数として関数を取る関数", () => {
      describe("関数を渡すことを考える : max, finder, best", () => {
        const people = [{ name: "Fred", age: 65 }, { name: "Lucy", age: 36 }];

        test("max", () => {
          expect(_.max([1, 2, 3, 4, 5])).toBe(5);
          expect(_.max([1, 2, 3, 4.75, 4.5])).toBe(4.75);
          expect(_.max(people, function (p) { return p.age; })).toStrictEqual({ name: "Fred", age: 65 });
        });

        function finder(valueFun, bestFun, coll) {
          return _.reduce(coll, function (best, current) {
            const bestValue = valueFun(best);
            const currentValue = valueFun(current);
            return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
          });
        };

        test("finder", () => {
          expect(finder(_.identity, Math.max, [1, 2, 3, 4, 5])).toBe(5);
          expect(finder(plucker('age'), Math.max, people)).toStrictEqual({ name: "Fred", age: 65 });
          expect(finder(plucker('name'), function (x, y) { return (x.charAt(0) === 'L') ? x : y; }, people)).toStrictEqual({ name: "Lucy", age: 36 });
        });

        describe("finder関数を少し引き締める", () => {
          function best(fun, coll) {
            return _.reduce(coll, function (x, y) {
              return fun(x, y) ? x : y;
            });
          }

          test("best", () => {
            expect(best(function (x, y) { return x > y; }, [1, 2, 3, 4, 5])).toBe(5);
            expect(best(function (x, y) { return x.age > y.age; }, people)).toStrictEqual({ name: "Fred", age: 65 });
          });
        });
      });

      describe("関数を渡すことをさらに考える : repeat,repeatedly,iterateUntil", () => {
        function repeat(times, VALUE) {
          return _.map(_.range(times), function () { return VALUE; });
        }

        function repeatedly(times, fun) {
          return _.map(_.range(times), fun);
        }

        function iterateUntil(fun, check, init) {
          const ret = [];
          let result = fun(init);
          while (check(result)) {
            ret.push(result);
            result = fun(result);
          }
          return ret;
        }

        test("repeat", () => {
          expect(repeat(4, "Major")).toStrictEqual(["Major", "Major", "Major", "Major"]);
        });

        describe("値ではなく、関数を使え", () => {
          test("repeatedly", () => {
            expect(repeatedly(3, function () { return Math.floor((Math.random() * 10) + 1); })).toHaveLength(3);
          });
        });

        describe("「値ではなく、関数を使え」と言いました", () => {
          test("iterateUntil", () => {
            expect(iterateUntil(function (n) { return n + n; }, function (n) { return n <= 1024; }, 1)).toStrictEqual([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);
            expect(repeatedly(10, function (exp) { return Math.pow(2, exp + 1); })).toStrictEqual([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);
          });
        });
      });
    });

    describe("他の関数を返す関数", () => {
      function always(VALUE) {
        return function () {
          return VALUE;
        };
      };

      test("always", () => {
        const f = always(function () { });
        expect(f() === f()).toBe(true);
        const g = always(function () { });
        expect(f() === g()).toBe(false);
        expect(repeatedly(3, always("Odelay"))).toStrictEqual(["Odelay", "Odelay", "Odelay"]);
      });

      function invoker(NAME, METHOD) {
        return function (target) {
          if (!existy(target)) fail("Must provide a target");

          const targetMethod = target[NAME];
          const args = _.tail(arguments);

          return doWhen((existy(targetMethod) && METHOD === targetMethod), function () {
            return targetMethod.apply(target, args);
          });
        };
      };

      test("invoker", () => {
        const rev = invoker('reverse', Array.prototype.reverse);
        expect(_.map([[1, 2, 3]], rev)).toStrictEqual([[3, 2, 1]]);
      });

      describe("引数を高階関数に確保する", () => {
        const add100 = makeAdder(100);
        test("makeAdder", () => {
          expect(add100(38)).toBe(138);
        });
      });

      describe("大義のために変数を確保する", () => {
        test("uniqueString", () => {
          function uniqueString(len) {
            return Math.random().toString(36).substr(2, len);
          }

          expect(uniqueString(10)).toHaveLength(10);
        });

        test("uniqueString", () => {
          function uniqueString(prefix) {
            return [prefix, new Date().getTime()].join('');
          }

          expect(uniqueString(10)).toHaveLength(15);
        });

        function makeUniqueStringFunction(start) {
          let COUNTER = start;

          return function (prefix) {
            return [prefix, COUNTER++].join('');
          };
        };

        test("makeUniqueStringFunction", () => {
          const uniqueString = makeUniqueStringFunction(0);
          expect(uniqueString("dari")).toBe("dari0");
          expect(uniqueString("dari")).toBe("dari1");
        });

        const generator = {
          count: 0,
          uniqueString: function (prefix) {
            return [prefix, this.count++].join('');
          }
        };

        test("generator", () => {
          expect(generator.uniqueString("bohr")).toBe("bohr0");
          expect(generator.uniqueString("bohr")).toBe("bohr1");

          generator.count = "gotcha";
          expect(generator.uniqueString("bohr")).toBe("bohrNaN");

          generator.uniqueString.call({ count: 1337 }, "bohr");
          expect(generator.uniqueString("bohr")).toBe("bohrNaN");
        });

        const omgenerator = (function (init) {
          let COUNTER = init;

          return {
            uniqueString: function (prefix) {
              return [prefix, COUNTER++].join('');
            }
          };
        })(0);

        test("omgenerator", () => {
          expect(omgenerator.uniqueString("lichking")).toBe("lichking0");
          expect(omgenerator.uniqueString("lichking")).toBe("lichking1");
        });
      });

      describe("値の変異に注意", () => {

      });

      describe("存在しない状態に対する防御のための関数", () => {
        const nums = [1, 2, 3, null, 5];

        function fnull(fun /*, defaults */) {
          const defaults = _.tail(arguments);

          return function (/* args */) {
            const args = _.map(arguments, function (e, i) {
              return existy(e) ? e : defaults[i];
            });

            return fun.apply(null, args);
          };
        }

        function defaults(df) {
          return function (o, k) {
            const val = fnull(_.identity, df[k]);
            return o && val(o[k]);
          };
        };

        test("fnull", () => {
          const safeMult = fnull(function (total, n) { return total * n; }, 1, 1);
          expect(_.reduce(nums, safeMult)).toBe(30);
        });


        test("defaults", () => {
          function doSomething(config) {
            const lookup = defaults({ critical: 108 });
            return lookup(config, 'critical');
          }

          expect(doSomething({ critical: 9 })).toBe(9);
          expect(doSomething({})).toBe(108);
        });
      });
    });

    describe("すべてを集結：オブジェクトバリデータ", () => {
      function checker(/* (1つ以上の)検証関数 */) {
        const validators = _.toArray(arguments);
        return function (obj) {
          return _.reduce(validators, function (errs, check) {
            if (check(obj))
              return errs;
            else
              return _.chain(errs).push(check.message).value();
          }, []);
        };
      }

      function validator(message, fun) {
        const f = function (/* args */) {
          return fun.apply(fun, arguments);
        };
        f['message'] = message;
        return f;
      }

      function aMap(obj) {
        return _.isObject(obj);
      }

      function hasKeys() {
        const KEYS = _.toArray(arguments);

        const fun = function (obj) {
          return _.every(KEYS, function (k) {
            return _.has(obj, k);
          });
        };

        fun.message = cat(["これらのキーが存在する必要があります："], KEYS).join(' ');
        return fun;
      }

      test("checker", () => {
        const alwaysPasses = checker(always(true), always(true));
        expect(alwaysPasses({})).toStrictEqual([]);

        const fails = always(false);
        fails.message = "人生における過ち";
        const alwaysFails = checker(fails);
        expect(alwaysFails(100)).toStrictEqual(["人生における過ち"]);
      });

      test("validator", () => {
        const gonnaFail = checker(validator("ZOMG!", always(false)));
        expect(gonnaFail(100)).toStrictEqual(["ZOMG!"]);
      });

      test("aMap", () => {
        const checkCommand = checker(validator("マップデータである必要があります", aMap));
        expect(aMap({})).toBe(true);
        expect(aMap(1)).toBe(false);
        expect(checkCommand({})).toStrictEqual([]);
        expect(checkCommand(42)).toStrictEqual(["マップデータである必要があります"]);
      });

      test("hasKeys", () => {
        const checkCommand = checker(validator("マップデータである必要があります", aMap), hasKeys('msg'));
        expect(checkCommand({ msg: "こんにちは" })).toStrictEqual([]);
        expect(checkCommand(32)).toStrictEqual(["マップデータである必要があります", "これらのキーが存在する必要があります： msg"]);
      });
    });
  });

  describe("5章 関数を組み立てる関数", () => {
    describe("関数合成の基礎", () => {
      function dispatch(/* 任意の数の関数 */) {
        const funs = _.toArray(arguments);
        const size = funs.length;

        return function (target /*, args */) {
          let ret;
          let args = _.last(arguments);

          for (let funIndex = 0; funIndex < size; funIndex++) {
            ret = funs[funIndex].apply(funs[funIndex], construct(target, args));
            if (existy(ret)) return ret;
          }

          return ret;
        };
      }

      const str = dispatch(invoker('toString', Array.prototype.toString), invoker('toString', String.prototype.toString));

      test("dispatch", () => {
        expect(str('a')).toBe('a');
        expect(str(_.range(10))).toBe('0,1,2,3,4,5,6,7,8,9');
      });

      function stringReverse(s) {
        if (!_.isString(s)) return undefined;
        return s.split('').reverse().join('');
      }

      test("stringReverse", () => {
        expect(stringReverse('abc')).toBe('cba');
        expect(stringReverse(1)).toBe(undefined);
      });

      const polyrev = dispatch(invoker('reverse', Array.prototype.reverse), stringReverse);

      test("polyrev", () => {
        expect(polyrev([1, 2, 3])).toEqual([3, 2, 1]);
        expect(polyrev('abc')).toBe('cba');
      });

      const sillyReverse = dispatch(polyrev, always(42));

      test("sillyReverse", () => {
        expect(sillyReverse([1, 2, 3])).toEqual([3, 2, 1]);
        expect(sillyReverse('abc')).toBe('cba');
        expect(sillyReverse(100000)).toBe(42);
      });

      const alert = function (message) { return "alert: " + message; };
      const notify = function (message) { return "notify: " + message; };
      const changeView = function (target) { return "changeView: " + target; };
      function performCommandHardcoded(command) {
        let result;
        switch (command.type) {
          case 'notify':
            result = notify(command.message);
            break;
          case 'join':
            result = changeView(command.target);
            break;
          default:
            return alert(command.type);
        }
        return result;
      }

      test("performCommandHardCoded", () => {
        expect(performCommandHardcoded({ type: 'notify', message: 'Hi new user' })).toBe("notify: Hi new user");
        expect(performCommandHardcoded({ type: 'join', target: 'foo' })).toBe("changeView: foo");
        expect(performCommandHardcoded({ type: 'wat' })).toBe("alert: wat");
      })

      function isa(type, action) {
        return function (obj) {
          if (type === obj.type) return action(obj);
        }
      }

      const performedCommand = dispatch(
        isa('notify', function (obj) { return notify(obj.message); }),
        isa('join', function (obj) { return changeView(obj.target); }),
        function (obj) { return alert(obj.type); }
      );

      const shutdown = function (hostname) { return "shutdown: " + hostname; };
      const performAdminCommand = dispatch(
        isa('kill', function (obj) { return shutdown(obj.hostname); }),
        performedCommand
      );

      test("performAdminCommand", () => {
        expect(performAdminCommand({ type: 'kill', hostname: 'localhost' })).toBe("shutdown: localhost");
        expect(performAdminCommand({ type: 'fail' })).toBe("alert: fail");
        expect(performAdminCommand({ type: 'join', target: 'foo' })).toBe("changeView: foo");
      });

      const performTrialUserCommand = dispatch(
        isa('join', function (obj) { return alert("許可されるまで参加できません"); }),
        performAdminCommand
      );

      test("performTrialUserCommand", () => {
        expect(performTrialUserCommand({ type: 'join' })).toBe("alert: 許可されるまで参加できません");
        expect(performTrialUserCommand({ type: 'notify', message: 'Hi new user' })).toBe("notify: Hi new user");
      });
    })

    describe("変異は低レイヤーでの操作", () => {
    })

    describe("カリー化", () => {
      function rightAwayInvoker() {
        const args = _.toArray(arguments);
        const method = args.shift();
        const target = args.shift();
        return method.apply(target, args);
      }

      test("rightAwayInvoker", () => {
        expect(rightAwayInvoker(Array.prototype.reverse, [1, 2, 3])).toEqual([3, 2, 1]);
        expect(invoker('reverse', Array.prototype.reverse)([1, 2, 3])).toEqual([3, 2, 1]);
      });

      describe("右へカリー化するか、左へカリー化するか", () => {
        function leftCurryDiv(n) {
          return function (d) {
            return n / d;
          };
        }

        function rightCurryDiv(d) {
          return function (n) {
            return n / d;
          };
        }

        test("leftCurryDiv", () => {
          expect(leftCurryDiv(10)(2)).toBe(5);
        });

        test("rightCurryDiv", () => {
          expect(rightCurryDiv(10)(2)).toBe(0.2);
        });
      });

      describe("自動的にパラメータをカリー化する", () => {
        function curry(fun) {
          return function (arg) {
            return fun(arg);
          };
        }

        test("curry", () => {
          expect(['11', '11', '11', '11'].map(curry(parseInt))).toStrictEqual([11, 11, 11, 11]);
        });

        function curry2(fun) {
          return function (secondArg) {
            return function (firstArg) {
              return fun(firstArg, secondArg);
            };
          };
        }

        test("curry2", () => {
          function div(n, d) { return n / d; }
          const div10 = curry2(div)(10);
          expect(div10(50)).toBe(5);

          const parseBinaryString = curry2(parseInt)(2);
          expect(parseBinaryString('111')).toBe(7);
          expect(parseBinaryString('10')).toBe(2);
        });
      })

      describe("カリー化を利用して新しい関数を生成する", () => {
        const plays = [{ artist: "Burial", track: "Archangel" },
        { artist: "Ben Frost", track: "Stomp" },
        { artist: "Ben Frost", track: "Stomp" },
        { artist: "Burial", track: "Archangel" },
        { artist: "Emeralds", track: "Snores" },
        { artist: "Burial", track: "Archangel" }
        ];

        _.countBy(plays, function (song) {
          return [song.artist, song.track].join(" - ");
        });

        test("_.countBy", () => {
          expect(_.countBy(plays, function (song) {
            return [song.artist, song.track].join(" - ");
          })).toStrictEqual({ "Burial - Archangel": 3, "Ben Frost - Stomp": 2, "Emeralds - Snores": 1 });
        });

        function songToString(song) {
          return [song.artist, song.track].join(" - ");
        }

        const songCount = curry2(_.countBy)(songToString);

        test("songCount", () => {
          expect(songCount(plays)).toStrictEqual({ "Burial - Archangel": 3, "Ben Frost - Stomp": 2, "Emeralds - Snores": 1 });
        });
      })

      describe("３段階のカリー化でHTMLカラーコードビルダーを実装", () => {
        function uniqSongs(first, middle, last) {
          return _.uniqWith(last, (a, b) => a.artist === b.artist && a.track === b.track);
        }

        const curry3 = (fun) => {
          return function (last) {
            return function (middle) {
              return function (first) {
                return fun(first, middle, last);
              };
            };
          };
        };

        const songsPlayed = curry3(uniqSongs);

        test("songsPlayed", () => {
          const plays = [
            { artist: "Burial", track: "Archangel" },
            { artist: "Burial", track: "Archangel" },
            { artist: "Ben Frost", track: "Stomp" },
            { artist: "Emeralds", track: "Snores" },
            { artist: "Emeralds", track: "Snores" }
          ];

          expect(songsPlayed(plays)(false)(songToString)).toStrictEqual(
            [
              { artist: "Burial", track: "Archangel" },
              { artist: "Ben Frost", track: "Stomp" },
              { artist: "Emeralds", track: "Snores" }
            ]
          );
        });

        const toHex = function (n) {
          const hex = n.toString(16);
          return (hex.length < 2) ? [0, hex].join('') : hex;
        };

        const rgbToHexString = curry3(function (r, g, b) {
          return ["#", toHex(r), toHex(g), toHex(b)].join('');
        });

        test("rgbToHexString", () => {
          expect(rgbToHexString(255)(255)(255)).toBe("#ffffff");
        });

        const blueGreenish = curry3(rgbToHexString)(255)(200);

        test("blueGreenish", () => {
          //expect(blueGreenish(0)).toBe("#00c8ff");
        });
      })

      describe("「流暢な」APIのためのカリー化", () => {
        const greaterThan = curry2(function (lhs, rhs) { return lhs > rhs; });
        const lessThan = curry2(function (lhs, rhs) { return lhs < rhs; });

        const withinRange = checker(
          validator("10より大きい必要があります", greaterThan(10)),
          validator("20より小さい必要があります", lessThan(20))
        );

        test("withinRange", () => {
          expect(withinRange(15)).toStrictEqual([]);
          expect(withinRange(1)).toStrictEqual(["10より大きい必要があります"]);
          expect(withinRange(100)).toStrictEqual(["20より小さい必要があります"]);
        });
      });

      describe("JavaScriptのおけるカリー化のデメリット", () => { })

    })

    describe("部分適用", () => {
      function divPart(n) {
        return function (d) {
          return n / d;
        };
      }

      test("divPart", () => {
        const over10Part = divPart(10);
        expect(over10Part(2)).toBe(5);
      });

      describe("１つ・２つの既知の引数を部分適用", () => {
        function partial1(fun, arg1) {
          return function (/* args */) {
            const args = construct(arg1, arguments);
            return fun.apply(fun, args);
          };
        }

        test("partial1", () => {
          const over10Part = partial1(div, 10);
          expect(over10Part(2)).toBe(5);
        });

        function partial2(fun /*, pargs */) {
          const pargs = _.tail(arguments);

          return function (/* args */) {
            const args = cat(pargs, _.toArray(arguments));
            return fun.apply(fun, args);
          };
        }

        test("partial2", () => {
          const div10By2 = partial2(div, 10, 2);
          expect(div10By2()).toBe(5);
        });
      })

      describe("任意の数の引数を部分適用", () => {
        function partial(fun /*, pargs */) {
          const pargs = _.tail(arguments);

          return function (/* args */) {
            const args = cat(pargs, _.toArray(arguments));
            return fun.apply(fun, args);
          };
        }

        test("partial", () => {
          const over10Part = partial(div, 10);
          expect(over10Part(2)).toBe(5);
          const div10By2By4By5000Partial = partial(div, 10, 2, 4, 5000);
          expect(div10By2By4By5000Partial()).toBe(5);
        });
      });

      describe("部分適用の実用例:事前条件", () => {
        const zero = validator("0ではいけません", function (n) { return 0 === n; });
        const number = validator("引数は数値である必要があります", _.isNumber);

        function sqr(n) {
          if (!number(n)) throw new Error(number.message);
          if (zero(n)) throw new Error(zero.message);
          return n * n;
        }

        test("sqr", () => {
          expect(sqr(10)).toBe(100);
          expect(() => sqr(0)).toThrow("0ではいけません");
          expect(() => sqr('')).toThrow("引数は数値である必要があります");
        });

        function condition1(/* 1つ以上の検証関数 */) {
          const validators = _.toArray(arguments);

          return function (fun, arg) {
            const errors = mapcat(function (isValid) {
              return isValid(arg) ? [] : [isValid.message];
            }, validators);

            if (!_.isEmpty(errors)) throw new Error(errors.join(", "));

            return fun(arg);
          }
        }

        const sqrPre = condition1(
          validator("0ではいけません", complement(zero)),
          validator("引数は数値である必要があります", _.isNumber)
        )

        test("sqrPre", () => {
          expect(sqrPre(sqr, 10)).toBe(100);
          expect(() => sqrPre(sqr, 0)).toThrow("0ではいけません");
          expect(() => sqrPre(sqr, '')).toThrow("引数は数値である必要があります");
          expect(sqrPre(_.identity, 10)).toBe(10);
          expect(() => sqrPre(_.identity, '')).toThrow("引数は数値である必要があります");
          expect(() => sqrPre(_.identity, 0)).toThrow("0ではいけません");
        });

        function uncheckedSqr(n) { return n * n; }

        test("uncheckedSqr", () => {
          expect(uncheckedSqr(10)).toBe(100);
          expect(uncheckedSqr('')).toBe(0);
          expect(uncheckedSqr(0)).toBe(0);
        });

        const checkedSqr = partial1(sqrPre, uncheckedSqr);

        test("checkedSqr", () => {
          expect(checkedSqr(10)).toBe(100);
          expect(() => checkedSqr('')).toThrow("引数は数値である必要があります");
          expect(() => checkedSqr(0)).toThrow("0ではいけません");
        });

        const sillySquare = partial1(
          condition1(validator("偶数を入力してください", isEven)),
          checkedSqr
        );

        test("sillySquare", () => {
          expect(sillySquare(10)).toBe(100);
          expect(() => sillySquare(11)).toThrow("偶数を入力してください");
          expect(() => sillySquare('')).toThrow("引数は数値である必要があります");
          expect(() => sillySquare(0)).toThrow("0ではいけません");
        });

        const validateCommand = condition1(
          validator("マップデータである必要があります", _.isObject),
          validator("設定オブジェクトは正しいキーを持っている必要があります", hasKeys('msg', 'type'))
        );
        const createCommand = partial(validateCommand, _.identity);

        test("createCommand", () => {
          expect(() => createCommand({})).toThrow("設定オブジェクトは正しいキーを持っている必要があります");
          expect(() => createCommand(21)).toThrow("設定オブジェクトは正しいキーを持っている必要があります");
          expect(createCommand({ msg: "", type: "" })).toStrictEqual({ msg: "", type: "" });
        });

        const createLaunchCommand = partial1(
          condition1(validator("設定オブジェクトにはcountDownプロパティが必要です", hasKeys('countDown'))),
          createCommand
        );

        test("createLaunchCommand", () => {
          expect(() => createLaunchCommand({})).toThrow("設定オブジェクトにはcountDownプロパティが必要です");
          expect(() => createLaunchCommand(21)).toThrow("設定オブジェクトにはcountDownプロパティが必要です");
          expect(createLaunchCommand({ msg: "", type: "", countDown: 10 })).toStrictEqual({ msg: "", type: "", countDown: 10 });
        });
      });
    });

    describe("並べた関数を端から端までcompose関数でつなぎ合わせる", () => {
      function isntString(str) {
        return !_.isString(str);
      }

      test("isntString", () => {
        expect(isntString(1)).toBe(true);
        expect(isntString('')).toBe(false);
      });

      const isntString1 = _.flowRight(function (x) { return !x; }, _.isString);

      test("isntStrings", () => {
        expect(isntString1(1)).toBe(true);
        expect(isntString1('')).toBe(false);
      });

      function not(x) { return !x; }

      const isntString2 = _.flowRight(not, _.isString);

      test("isntString2", () => {
        expect(isntString2(1)).toBe(true);
        expect(isntString2('')).toBe(false);
      });

      const composedMapcat = _.flowRight(splat(cat), _.map);

      test("composedMapcat", () => {
        expect(composedMapcat([[1, 2], [3, 4], [5]], _.identity)).toStrictEqual([1, 2, 3, 4, 5]);
      });

      describe("合成を使った事前条件と事後条件", () => {
        const zero = validator("0ではいけません", function (n) { return 0 === n; });
        const sqrPost = condition1(
          validator("結果は数値である必要があります", _.isNumber),
          validator("結果はゼロでない必要があります", complement(zero)),
          validator("結果は正である必要があります", greaterThan(0))
        );

        test("sqrPost", () => {
          expect(sqrPost(sqr, 10)).toBe(100);
          expect(() => sqrPost(sqr, 0)).toThrow("結果はゼロでない必要があります");
          expect(() => sqrPost(sqr, '')).toThrow("結果は数値である必要があります");
          expect(() => sqrPost(sqr, 0)).toThrow("結果はゼロでない必要があります");
        });

        const megaCheckedSqr = _.flowRight(partial(sqrPost, _.identity), checkedSqr);

        test("megaCheckedSqr", () => {
          expect(megaCheckedSqr(10)).toBe(100);
          expect(() => megaCheckedSqr(0)).toThrow("0ではいけません");
          expect(() => megaCheckedSqr('')).toThrow("引数は数値である必要があります");
          expect(() => megaCheckedSqr(NaN)).toThrow("結果は正である必要があります");
        });
      })
    });

  });

  describe("6章 再帰", () => {
    const influences = [
      ['Lisp', 'Smalltalk'],
      ['Lisp', 'Scheme'],
      ['Smalltalk', 'Self'],
      ['Scheme', 'JavaScript'],
      ['Scheme', 'Lua'],
      ['Self', 'Lua'],
      ['Self', 'JavaScript']
    ]

    describe("自身を呼ぶ関数", () => {
      function myLength(ary) {
        if (_.isEmpty(ary)) return 0;
        return 1 + myLength(_.tail(ary));
      }

      test("myLength", () => {
        expect(myLength(_.range(10))).toBe(10);
        expect(myLength([])).toBe(0);
        expect(myLength(_.range(1000))).toBe(1000);
      });

      function cycle(times, ary) {
        if (times <= 0) return [];
        return cat(ary, cycle(times - 1, ary));
      }

      test("cycle", () => {
        expect(cycle(2, [1, 2, 3])).toStrictEqual([1, 2, 3, 1, 2, 3]);
        expect(_.take(cycle(20, [1, 2, 3]), 11)).toStrictEqual([1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2]);
      });

      function constructPair(pair, rests) {
        return [construct(_.head(pair), _.head(rests)), construct(second(pair), second(rests))];
      }

      test("constructPair", () => {
        expect(constructPair(['a', 1], [[], []])).toStrictEqual([['a'], [1]]);
        expect(_.zip(['a'], [1])).toStrictEqual([['a', 1]]);
        expect(_.zip.apply(null, constructPair(['a', 1], [[], []]))).toStrictEqual([['a', 1]]);
        expect(constructPair(['a', 1],
          constructPair(['b', 2],
            constructPair(['c', 3], [[], []])))).toStrictEqual([['a', 'b', 'c'], [1, 2, 3]]);
      });

      function unzip(pairs) {
        if (_.isEmpty(pairs)) return [[], []];
        return constructPair(_.head(pairs), unzip(_.tail(pairs)));
      }

      test("unzip", () => {
        expect(unzip([['a', 1], ['b', 2], ['c', 3]])).toStrictEqual([['a', 'b', 'c'], [1, 2, 3]]);
        expect(unzip(_.zip([1, 2, 3], [4, 5, 6]))).toStrictEqual([[1, 2, 3], [4, 5, 6]]);
      });

      describe("再帰を使ったグラフ探索", () => {
        function nexts(graph, node) {
          if (_.isEmpty(graph)) return [];
          const pair = _.head(graph);
          const from = _.head(pair);
          const to = second(pair);
          const more = _.tail(graph);

          if (_.isEqual(node, from)) return construct(to, nexts(more, node));
          else
            return nexts(more, node);
        }

        test("nexts", () => {
          expect(nexts(influences, 'Lisp')).toStrictEqual(['Smalltalk', 'Scheme']);
          expect(nexts(influences, 'Scheme')).toStrictEqual(['JavaScript', 'Lua']);
        });
      })

      describe("記録つき深さ優先自己再帰探索", () => {
        function depthSearch(graph, nodes, seen) {
          if (_.isEmpty(nodes)) return rev(seen);
          const node = _.head(nodes);
          const more = _.tail(nodes);

          if (_.includes(seen, node)) return depthSearch(graph, more, seen);
          else
            return depthSearch(graph, cat(nexts(graph, node), more), construct(node, seen));
        }

        test("depthSearch", () => {
          expect(depthSearch(influences, ['Lisp'], [])).toStrictEqual(['Lisp', 'Smalltalk', 'Self', 'Lua', 'JavaScript', 'Scheme']);
          expect(depthSearch(influences, ['Smalltalk', 'Self'], [])).toStrictEqual(['Smalltalk', 'Self', 'Lua', 'JavaScript']);
          expect(depthSearch(construct(['Lua', 'Io'], influences), ['Lisp'], [])).toStrictEqual(["Lisp", "Smalltalk", "Self", "Lua", "Io", "JavaScript", "Scheme"]);
        });

        describe("末尾再帰(自己末尾再帰)", () => {
          function tcLength(ary, n) {
            const l = n ? n : 0;
            if (_.isEmpty(ary)) return l;
            else return tcLength(_.tail(ary), l + 1);
          }

          test("tcLength", () => {
            expect(tcLength(_.range(10))).toBe(10);
            expect(tcLength([])).toBe(0);
            expect(tcLength(_.range(1000))).toBe(1000);
          });
        });
      });

      describe("再帰と関数合成：論理積と論理和", () => {
        function andify(/* preds */) {
          const preds = _.toArray(arguments);

          return function (/* args */) {
            const args = _.toArray(arguments);
            const everything = function (ps, truth) {
              if (_.isEmpty(ps)) return truth;
              else
                return _.every(args, _.head(ps)) && everything(_.tail(ps), truth);
            };

            return everything(preds, true);
          };
        }

        test("andify", () => {
          const evenNums = andify(_.isNumber, isEven);
          expect(evenNums(1, 2)).toBe(false);
          expect(evenNums(2, 4)).toBe(true);
          expect(evenNums(2, 4, 6, 8)).toBe(true);
          expect(evenNums(2, 4, 6, 8, 9)).toBe(false);
        });

        function orify(/* preds */) {
          const preds = _.toArray(arguments);

          return function (/* args */) {
            const args = _.toArray(arguments);
            const something = function (ps, truth) {
              if (_.isEmpty(ps)) return truth;
              else
                return _.some(args, _.head(ps)) || something(_.tail(ps), truth);
            };

            return something(preds, false);
          };
        }

        test("orify", () => {
          const zeroOrOdd = orify(isOdd, zero);
          expect(zeroOrOdd(0, 2)).toBe(true);
          expect(zeroOrOdd(0, 3)).toBe(true);
          expect(zeroOrOdd(2, 4)).toBe(false);
        });
      })

      describe("相互再帰関数(自身を呼ぶ他の関数を呼ぶ関数", () => {
        function evenSteven(n) {
          if (n === 0) return true;
          else return oddJohn(Math.abs(n) - 1);
        }

        function oddJohn(n) {
          if (n === 0) return false;
          else
            return evenSteven(Math.abs(n) - 1);
        }

        test("evenSteven", () => {
          expect(evenSteven(0)).toBe(true);
          expect(evenSteven(1)).toBe(false);
          expect(evenSteven(2)).toBe(true);
          expect(evenSteven(3)).toBe(false);
        });

        test("oddJohn", () => {
          expect(oddJohn(0)).toBe(false);
          expect(oddJohn(1)).toBe(true);
          expect(oddJohn(2)).toBe(false);
          expect(oddJohn(3)).toBe(true);
        });

        function flat(arry) {
          if (_.isArray(arry)) return _.flatten(arry);
          else return [arry];
        }

        test("flat", () => {
          expect(flat([[1, 2], [3, 4]])).toStrictEqual([1, 2, 3, 4]);
        });
      })

      describe("再帰を使った深いコピー", () => {
        const x = [{ a: [1, 2, 3], b: 42 }, { c: { d: [] } }];
        const y = _.clone(x);

        test("_.clone", () => {
          expect(x).toStrictEqual(y);
          expect(x === y).toBe(false);
          expect(x[0] === y[0]).toBe(true);
        });

        function deepClone(obj) {
          if (!existy(obj) || !_.isObject(obj)) return obj;

          const temp = new obj.constructor();
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) temp[key] = deepClone(obj[key]);
          }

          return temp;
        }

        test("deepClone", () => {
          const x = [{ a: [1, 2, 3], b: 42 }, { c: { d: [] } }];
          const y = deepClone(x);

          expect(x).toStrictEqual(y);
          expect(x === y).toBe(false);
          expect(x[0] === y[0]).toBe(false);

          expect(_.isEqual(x, y)).toBe(true);
          y[1]['c']['d'] = 42;
          expect(_.isEqual(x, y)).toBe(false);
        });
      })

      describe("ネストされた配列を探索する", () => {
        function visit(mapFun, resultFun, array) {
          if (_.isArray(array)) return resultFun(_.map(array, mapFun));
          else return resultFun(array);
        }

        test("visit", () => {
          expect(visit(_.identity, _.isNumber, 42)).toBe(true);
          expect(visit(_.isNumber, _.identity, [1, 2, null, 3])).toStrictEqual([true, true, false, true]);
          expect(visit(function (n) { return n * 2 }, rev, _.range(10))).toStrictEqual([18, 16, 14, 12, 10, 8, 6, 4, 2, 0]);
        });

        function postDepth(fun, ary) {
          return visit(partial1(postDepth, fun), fun, ary);
        }

        test("postDepth", () => {
          expect(postDepth(_.identity, [[1, 2], 3, 4])).toStrictEqual([[1, 2], 3, 4]);
          expect(postDepth(_.identity, [[1, 2], 3, 4])).toStrictEqual([[1, 2], 3, 4]);
          expect(postDepth(_.identity, [[1, 2], 3, 4])).toStrictEqual([[1, 2], 3, 4]);
          expect(postDepth(_.identity, influences)).toStrictEqual(influences);
          expect(postDepth(function (x) {
            if (x === 'Lisp') return 'LISP';
            return x;
          }, influences)).not.toBe(influences);
        });

        function preDepth(fun, ary) {
          return fun(visit(partial1(preDepth, fun), _.identity, ary));
        }

        test("preDepth", () => {
          expect(preDepth(_.identity, [[1, 2], 3, 4])).toStrictEqual([[1, 2], 3, 4]);
          expect(preDepth(_.identity, [[1, 2], 3, 4])).toStrictEqual([[1, 2], 3, 4]);
          expect(preDepth(_.identity, [[1, 2], 3, 4])).toStrictEqual([[1, 2], 3, 4]);
        });

        function influencedWithStrategy(strategy, lang, graph) {
          const results = [];

          strategy(function (x) {
            if (_.isArray(x) && _.first(x) === lang) results.push(second(x));
            return x;
          }, graph);

          return results;
        }

        test("influencedWithStrategy", () => {
          expect(influencedWithStrategy(postDepth, 'Lisp', influences)).toStrictEqual(['Smalltalk', 'Scheme']);
          expect(influencedWithStrategy(preDepth, 'Lisp', influences)).toStrictEqual(['Smalltalk', 'Scheme']);
        });

      });
    });

    describe("再帰多すぎ！（トランポリンジェネレータ）", () => {
      function evenOline(n) {
        if (n === 0) return true;
        else return partial1(oddOline, Math.abs(n) - 1);
      }

      function oddOline(n) {
        if (n === 0) return false;
        else return partial1(evenOline, Math.abs(n) - 1);
      }

      test("evenOline", () => {
        expect(evenOline(0)).toBe(true);
        expect(evenOline(3)()()()).toBe(false);
      });

      function trampoline(fun /*, args */) {
        let result = fun.apply(fun, _.tail(arguments));

        while (_.isFunction(result)) {
          result = result();
        }

        return result;
      }

      test("trampoline", () => {
        expect(trampoline(evenOline, 100000)).toBe(true);
        expect(trampoline(oddOline, 100000)).toBe(false);
      });

      function isEvenSafe(n) {
        if (n === 0) return true;
        else return partial1(trampoline, partial1(oddOline, Math.abs(n) - 1));
      }

      function isOddSafe(n) {
        if (n === 0) return false;
        else return partial1(trampoline, partial1(evenOline, Math.abs(n) - 1));
      }

      test("isEvenSafe", () => {
        expect(isEvenSafe(20001)()).toBe(false);
        expect(isOddSafe(20001)()).toBe(true);
      });

      describe("ジェネレータ(generatore)", () => {
        function generator(seed, current, step) {
          return {
            head: current(seed),
            tail: function () {
              console.log("forced");
              return generator(step(seed), current, step);
            }
          };
        }

        function genHead(gen) { return gen.head; }
        function genTail(gen) { return gen.tail(); }

        test("generator", () => {
          const ints = generator(0, _.identity, function (n) { return n + 1; });
          expect(genHead(ints)).toBe(0);
          expect(genTail(ints).head).toBe(1);
          expect(genTail(genTail(ints)).head).toBe(2);
        })

        function genTake(n, gen) {
          const doTake = function (g, x, ret) {
            if (x === 0) return ret;
            else return partial(doTake, genTail(g), x - 1, cat(ret, genHead(g)));
          };

          return trampoline(doTake, gen, n, []);
        }

        test("genTake", () => {
          const ints = generator(0, _.identity, function (n) { return n + 1; });
          expect(genTake(10, ints)).toStrictEqual(_.range(10));
          expect(genTake(100, ints)).toStrictEqual(_.range(100));
          expect(genTake(1000, ints)).toStrictEqual(_.range(1000));
        });
      })

      describe("トランポリンの原則とコールバック", () => {
        function asyncGetAny(interval, urls, onsuccess, onfailure) {
          const n = urls.length;
          const looper = function (i) {
            setTimeout(function () {
              if (i < n) {
                onsuccess(urls[i]);
              } else {
                onfailure("all failed");
              }
            }, interval);
          };

          looper(0);
          return "go";
        }

        test("asyncGetAny", () => {
          const urls = ["http://example1.com", "http://example2.com", "http://example3.com"];
          const t = asyncGetAny(1000, urls, function (url) {
            console && console.log("success", url);
          }
            , function (msg) {
              console && console.log("failed", msg);
            });
          expect(t).toBe("go");
        });
      })
    });

    describe("再帰は低レイヤーでの操作", () => {
      const groupFrom = curry2(_.groupBy)(_.first);
      const groupTo = curry2(_.groupBy)(second);

      test("groupFrom", () => {
        expect(groupFrom(influences)).toStrictEqual({
          "Lisp": [["Lisp", "Smalltalk"], ["Lisp", "Scheme"]],
          "Smalltalk": [["Smalltalk", "Self"]],
          "Scheme": [["Scheme", "JavaScript"], ["Scheme", "Lua"]],
          "Self": [["Self", "Lua"], ["Self", "JavaScript"]]
        });
      });

      test("groupTo", () => {
        expect(groupTo(influences)).toStrictEqual({
          "Smalltalk": [["Lisp", "Smalltalk"]],
          "Scheme": [["Lisp", "Scheme"]],
          "Self": [["Smalltalk", "Self"]],
          "JavaScript": [["Scheme", "JavaScript"], ["Self", "JavaScript"]],
          "Lua": [["Scheme", "Lua"], ["Self", "Lua"]]
        });
      });

      function influenced(graph, node) {
        return _.map(groupFrom(graph)[node], second);
      }

      test("influenced", () => {
        expect(influenced(influences, "Lisp")).toStrictEqual(["Smalltalk", "Scheme"]);
        expect(influenced(influences, "Scheme")).toStrictEqual(["JavaScript", "Lua"]);
      });
    })
  });

  describe("7章 純粋性、不変性、変更ポリシー", () => {
    describe("純粋性", () => {
      const rand = partial1(_.random, 1);

      test("rand", () => {
        expect(rand(10)).toBeGreaterThanOrEqual(1);
        expect(rand(10)).toBeLessThanOrEqual(10);
      });

      function randString(len) {
        const ascii = repeatedly(len, function () {
          return rand(26);
        });

        return _.map(ascii, function (n) {
          return n.toString(36);
        }).join('');
      }

      test("randString", () => {
        expect(randString(10).length).toBe(10);
      });

      describe("純粋性とテストの関係", () => {
        describe("_.map", function () {
          test("should return an array made from...", () => {
            expect(_.map([1, 2, 3], sqr)).toStrictEqual([1, 4, 9]);
          });
        });
      })
    })

    describe("純粋と不純を分離する", () => {
      function generateRandomCharacter() {
        return _.random(26).toString(36);
      }

      function generateString(charGen, len) {
        return repeatedly(len, charGen).join('');
      }

      test("generateString", () => {
        expect(generateString(generateRandomCharacter, 10).length).toBe(10);
      });

      const composedRandomString = partial1(generateString, generateRandomCharacter);

      test("composedRandomString", () => {
        expect(composedRandomString(10).length).toBe(10);
      });

      describe("generateString", function () {
        const result = generateString(always('a'), 10);

        test("特定の長さを持った文字列を返す", () => {
          expect(typeof result).toBe('string');
          expect(result.length).toBe(10);
        });

        test("文字生成関数が返す文字に合致する", () => {
          expect(result).toBe('aaaaaaaaaa');
        });
      });

      describe("不純関数を適切にテストする", () => {
        describe("generateRandomCharacter", function () {
          const result = repeatedly(1000, generateRandomCharacter);

          test("長さ1の文字列を返す", () => {
            expect(_.every(result, _.isString)).toBe(true);
            expect(_.every(result, function (s) { return s.length === 1; })).toBe(true);
          })

          test("アルファベットの小文字が数字を返す", () => {
            expect(_.every(result, function (s) { return /[a-z0-9]/.test(s); })).toBe(true);
            expect(_.every(result, function (s) { return /[A-Z]/.test(s); })).toBe(false);
          })
        });
      });

      describe("純粋性と参照透過性との関係", () => {
        function second(a) {
          return _.head(_.tail(a));
        }

        test("second", () => {
          expect(second([1, 2, 3], 1)).toBe(2);
          expect(second(['a', 'b', 'c'], 1)).toBe('b');

          const a = ['a', 'b', 'c'];
          expect(second(a, 1)).toBe('b');
          expect(a === a).toBe(true);
          expect(nth(a, 1)).toBe('b');
          expect(_.isEqual(a, ['a', 'b', 'c'])).toBe(true);
        });
      })

      describe("純粋性と冪等性の関係", () => {
        const a = [1, [10, 20, 30], 3, 4];

        const secondTwice = _.flowRight(second, second);

        test("secondTwice", () => {
          expect(secondTwice(a)).toBe(20);
          expect(secondTwice(a)).toBe(20);
        });
      })
    })

    describe("不変性", () => {
      test("s", () => {
        const s = "Lemongrab";
        expect(s.toUpperCase()).toBe("LEMONGRAB");
      });

      test("obj", () => {
        let key = "lemongrab";
        const obj = { lemongrab: "Earl" };

        function doSomethingThatMutaesSting(s) {
          return s[0].toUpperCase() + s.substr(1);
        }
        expect(obj[key] === "Earl").toBe(true);
        key = doSomethingThatMutaesSting(key);
        expect(obj[key]).toBe(undefined);
        expect(obj["lemonjon"]).toBe(undefined);
      });

      test("obj", () => {
        const obj = { lemongrab: "Earl" };

        (function (o) {
          _.extend(o, { lemongrab: "King" });
        })(obj);

        expect(obj.lemongrab).not.toBe("Earl");
      });

      describe("誰もいない森で木が倒れたら、音がするでしょうか？", () => {
        function skipTake(n, coll) {
          const ret = [];
          const sz = _.size(coll);

          for (let index = 0; index < sz; index += n) {
            ret.push(coll[index]);
          }

          return ret;
        }

        test("skipTake", () => {
          expect(skipTake(2, [1, 2, 3, 4])).toStrictEqual([1, 3]);
          expect(skipTake(3, _.range(20))).toStrictEqual([0, 3, 6, 9, 12, 15, 18]);
        });
      });

      describe("不変性と、その再帰との関係", () => {
        function summ(array) {
          let result = 0;
          const sz = array.length;

          for (let i = 0; i < sz; i++) result += array[i];
          return result;
        }

        test("summ", () => {
          expect(summ(_.range(1, 11))).toBe(55);
        });

        function summRec(array, seed) {
          if (_.isEmpty(array)) return seed;
          else return summRec(_.tail(array), _.head(array) + seed);
        }

        test("summRec", () => {
          expect(summRec([], 0)).toBe(0);
          expect(summRec(_.range(1, 11), 0)).toBe(55);
        });
      });

      describe("防御的フリーズとクローン", () => {
        test("freeze", () => {
          const a = [1, 2, 3];
          expect(a[1]).toBe(2);
          a[1] = 42;
          expect(a[1]).toBe(42);
          Object.freeze(a);
          expect(() => a[1] = 108).toThrow();
          expect(a[1]).toBe(42);
          expect(Object.isFrozen(a)).toBe(true);

          const x = [{ a: [1, 2, 3], b: 42 }, { c: { d: [] } }];
          Object.freeze(x);
          expect(() => x[0] = "").toThrow();
          expect(() => x[1]['c']['d'] = 100000).not.toThrow();
        });

        function deepFreeze(obj) {
          if (!Object.isFrozen(obj)) {
            Object.freeze(obj);
          }

          for (let key in obj) {
            if (!obj.hasOwnProperty(key) || !_.isObject(obj[key])) continue;
            deepFreeze(obj[key]);
          }
        }

        test("deepFreeze", () => {
          const x = [{ a: [1, 2, 3], b: 42 }, { c: { d: [] } }];
          deepFreeze(x);
          expect(() => x[0] = "").toThrow();
          expect(() => x[1]['c']['d'] = 100000).toThrow();
        });
      })

      describe("関数レベルの不変性を意識する", () => {
        const freq = curry2(_.countBy)(_.identity);
        const a = repeatedly(1000, partial1(rand, 2));
        const copy = _.clone(a);

        test("freq", () => {
          expect(_.isEqual(a, copy)).toBe(true);
          freq(skipTake(2, a))
          expect(_.isEqual(a, copy)).toBe(true);
        });

        const person = { fname: "Simon" };

        test("person", () => {
          expect(_.extend(person,
            { lname: "Petrikov" }, { age: 28 }, { age: 108 })
          ).toStrictEqual(
            { age: 108, fname: "Simon", lname: "Petrikov" }
          );
          expect(person).toStrictEqual(
            { age: 108, fname: "Simon", lname: "Petrikov" }
          );
        });

        function merge(/*args*/) {
          return _.extend.apply(null, construct({}, arguments));
        }

        test("merge", () => {
          const person = { fname: "Simon" };

          expect(merge(person,
            { lname: "Petrikov" }, { age: 28 }, { age: 108 })
          ).toStrictEqual(
            { age: 108, fname: "Simon", lname: "Petrikov" }
          );
          expect(person).toStrictEqual(
            { fname: "Simon" }
          );
        });
      })

      describe("オブジェクトの不変性を観察する", () => {
        function Point(x, y) {
          this._x = x;
          this._y = y;
        }

        Point.prototype = {
          withX: function (x) {
            return new Point(x, this._y);
          },

          withY: function (y) {
            return new Point(this._x, y);
          }
        };

        test("Point", () => {
          const p = new Point(0, 1);
          expect(p.withX(1000)._x).toBe(1000);
          expect(p).toStrictEqual({ _x: 0, _y: 1 });
          expect((new Point(0, 1)).withX(100).withY(-100)).toStrictEqual({ _x: 100, _y: -100 });
        });

        function Queue(elems) {
          this._q = elems;
        }

        Queue.prototype = {
          enqueue: function (thing) {
            return new Queue(cat(this._q, [thing]));
          }
        };

        test("Queue", () => {
          const seed = [1, 2, 3];
          const q = new Queue(seed);
          expect(q).toStrictEqual({ _q: [1, 2, 3] });
          const q2 = q.enqueue(108);
          expect(q2).toStrictEqual({ _q: [1, 2, 3, 108] });
          expect(q).toStrictEqual({ _q: [1, 2, 3] });
          seed.push(10000);
          expect(q).toStrictEqual({ _q: [1, 2, 3, 10000] });
        });

        const SaferQueue = function (elems) {
          this._q = _.clone(elems);
        }

        SaferQueue.prototype = {
          enqueue: function (thing) {
            return new SaferQueue(cat(this._q, [thing]));
          }
        };

        test("SaferQueue", () => {
          const seed = [1, 2, 3];
          const q = new SaferQueue(seed);
          expect(q).toStrictEqual({ _q: [1, 2, 3] });
          const q2 = q.enqueue(108);
          expect(q2).toStrictEqual({ _q: [1, 2, 3, 108] });
          expect(q).toStrictEqual({ _q: [1, 2, 3] });
          seed.push(10000);
          expect(q).toStrictEqual({ _q: [1, 2, 3] });
          q._q.push(-1111);
          expect(q).toStrictEqual({ _q: [1, 2, 3, -1111] });
          SaferQueue.prototype.enqueue = sqr;
          expect(q.enqueue(42)).toStrictEqual(1764);
        });
      })

      describe("オブジェクト操作は往々にして低レイヤー操作", () => {
        const SaferQueue = function (elems) {
          this._q = _.clone(elems);
        }

        SaferQueue.prototype = {
          enqueue: function (thing) {
            return new SaferQueue(cat(this._q, [thing]));
          }
        };
        function queue() {
          return new SaferQueue(_.toArray(arguments));
        }

        test("queue", () => {
          const q = queue(1, 2, 3);
          const enqueue = invoker('enqueue', SaferQueue.prototype.enqueue);
          expect(enqueue(q, 42)).toStrictEqual({ _q: [1, 2, 3, 42] });
        });
      });
    });

    describe("変更コントロールのポリシー", () => {
      function Container(init) {
        this._value = init;
      }

      test("Container", () => {
        const aNumber = new Container(42);
        expect(aNumber).toEqual({ _value: 42 });
      });

      Container.prototype = {
        update: function (fn) {
          const arg = _.tail(arguments);
          const oldValue = this._value;
          this._value = fn.apply(this, construct(oldValue, arg));
          return this._value;
        }
      };

      test("Container.prototype", () => {
        const aNumber = new Container(42);
        expect(aNumber.update(function (n) { return n + 1; })).toBe(43);
        expect(aNumber).toEqual({ _value: 43 });
        expect(aNumber.update(function (n, x, y, z) { return n / x / y / z; }, 1, 2, 3)).toBe(7.166666666666667);
        expect(() => (aNumber.update(_.flowRight(megaCheckedSqr, always(0))))).toThrow("0ではいけません");
      });
    });

    describe("まとめ", () => { });
  });

  describe("8章 フローベースプログラミング", () => {
    describe("チェーン", () => {
      function createPerson() {
        let firstName = "";
        let lastName = "";
        let age = 0;

        return {
          setFirstName: function (fn) {
            firstName = fn;
            return this;
          },
          setLastName: function (ln) {
            lastName = ln;
            return this;
          },
          setAge: function (a) {
            age = a;
            return this;
          },
          toString: function () {
            return [firstName, lastName, age].join(' ');
          }
        };
      }

      test("creatPersion", () => {
        const person = createPerson();
        expect(person.setFirstName("Mike").setLastName("Fogus").setAge(108).toString()).toBe("Mike Fogus 108");
      })

      test("_.tap", () => {
        const result = _.tap([1, 2, 3], note);
        expect(result).toStrictEqual([1, 2, 3]);
      })

      test("_.chain", () => {
        _.chain([1, 2, 3, 200])
          .filter(function (num) { return num % 2 == 0; })
          .tap(note)
          .map(function (num) { return num * num; })
          .value();
      });

      describe("レイジーチェーン（遅延実行を行うチェーン）", () => {
        function LazyChain(obj) {
          this._calls = [];
          this._target = obj;
        }

        LazyChain.prototype.invoke = function (methodName, ...args) {
          this._calls.push(function (target) {
            const meth = target[methodName];
            if (typeof meth === 'function') {
              return meth.apply(target, args);
            }
          });
          return this;
        };

        test("LazyChain", () => {
          const l = new LazyChain([2, 1, 3]).invoke('sort')._calls[0]([[2, 1, 3]]);
          //expect(l).toStrictEqual([1, 2, 3]);
        });

        LazyChain.prototype.force = function () {
          return _.reduce(this._calls, function (target, thunk) {
            return thunk(target);
          }, this._target);
        }

        test("LazyChain.prototype.force", () => {
          const result = new LazyChain([2, 1, 3]).invoke('sort').force();
          expect(result).toStrictEqual([1, 2, 3]);

          const result2 = new LazyChain([2, 1, 3])
            .invoke('concat', [8, 5, 7, 6])
            .invoke('sort')
            .invoke('join', ',')
            .force();
          expect(result2).toBe("1,2,3,5,6,7,8");
        });

        LazyChain.prototype.tap = function (fun) {
          this._calls.push(function (target) {
            fun(target);
            return target;
          });
          return this;
        }

        test("LazyChain.prototype.tap", () => {
          const result = new LazyChain([2, 1, 3])
            .invoke('sort')
            .tap(note)
            .force();
          expect(result).toStrictEqual([1, 2, 3]);
        });

        function LazyChainChainChain(obj) {
          const isLC = obj instanceof LazyChain;
          this._calls = isLC ? cat(obj._calls, []) : [];
          this._target = isLC ? obj._target : obj;
        }
        LazyChainChainChain.prototype = LazyChain.prototype;

        test("LazyChainChainChain", () => {
          const result = new LazyChainChainChain(new LazyChain([1, 2, 3]))
            .invoke('toString')
            .force();
          expect(result).toStrictEqual("1,2,3");
        });
      })

      describe("Promise", () => {
      });
    });

    describe("パイプライン", () => {
      function pipeline(seed /*, args */) {
        return _.reduce(
          _.tail(arguments),
          function (l, r) { return r(l); },
          seed
        );
      }

      test("pipeline", () => {
        expect(pipeline()).toBe(undefined);
        expect(pipeline(42)).toBe(42);
        expect(pipeline(42, function (n) { return -n; })).toBe(-42);
      });

      function fifth(a) {
        return pipeline(a
          , _.tail
          , _.tail
          , _.tail
          , _.tail
          , _.head);
      }

      test("fifth", () => {
        expect(fifth([1, 2, 3, 4, 5])).toBe(5);
      });

      function negativeFifth(a) {
        return pipeline(a
          , fifth
          , function (n) { return -n; });
      }

      test("negativeFifth", () => {
        expect(negativeFifth([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(-5);
      });

      function firstEditions(table) {
        return pipeline(table
          , function (t) { return as(t, { ed: 'edition' }); }
          , function (t) { return project(t, ['title', 'edition', 'isbn']); }
          , function (t) {
            return restrict(t, function (book) {
              return book.edition === 1;
            })
          })
      }

      const RQL = {
        select: curry2(project),
        as: curry2(as),
        where: curry2(restrict)
      };

      function allFirstEditions(table) {
        return pipeline(table
          , RQL.as({ ed: 'edition' })
          , RQL.select(['ttile', 'edition', 'isbn'])
          , RQL.where(function (book) {
            return book.edition === 1;
          }));
      }
    });

    describe("データフロー対コントロールフロー（制御構造）", () => {
      describe("共通の形をみつける", () => {
        function actions(acts, done) {
          return function (seed) {
            const init = { values: [], state: seed };

            const intermediate = _.reduce(acts, function (stateObj, action) {
              const result = action(stateObj.state);
              const values = cat(stateObj.values, [result.answer]);
              return { values: values, state: result.state };
            }, init);

            const keep = _.filter(intermediate.values, existy);
            return done(keep, intermediate.state);
          };
        }

        function mSqr() {
          return function (state) {
            const ans = sqr(state);
            return { answer: ans, state: ans };
          };
        }

        test("actions", () => {
          const doubleSquare = actions(
            [mSqr(), mSqr()],
            function (values) {
              return values;
            }
          );

          expect(doubleSquare(10)).toStrictEqual([100, 10000]);
        });

        function mNote() {
          return function (state) {
            note();
            return { answer: undefined, state: state };
          }
        }

        function mNeg() {
          return function (state) {
            return { answer: -state, state: -state };
          }
        }

        test("actions", () => {
          const negativeSqrAction = actions(
            [mSqr(), mNeg(), mNote()],
            function (_, state) {
              return state;
            }
          );

          expect(negativeSqrAction(9)).toBe(-81);
        });
      })

      describe("アクションの生成をシンプルにする関数", () => {
        function lift(answerFun, stateFun) {
          return function (/* arguments */) {
            const args = _.toArray(arguments);
            return function (state) {
              const ans = answerFun.apply(null, construct(state, args));
              const s = stateFun ? stateFun(state) : ans;
              return { answer: ans, state: s };
            };
          };
        }

        test("lift", () => {
          const mSqr2 = lift(sqr);
          const mNote2 = lift(note, _.identity);
          const mNeg2 = lift(function (n) { return -n; });

          const negativeSqrAction2 = actions(
            [mSqr2(), mNeg2(), mNote2()],
            function (_, state) {
              return state;
            }
          );

          expect(negativeSqrAction2(100)).toBe(-10000);
        });

        const push = lift(function (stack, e) { return construct(e, stack); });
        const pop = lift(_.head, _.tail);

        test("push", () => {
          const stackAction = actions(
            [push(1), push(2), pop()],
            function (values, state) {
              return values;
            }
          );

          expect(stackAction([])).toStrictEqual([[1], [2, 1], 2]);
        });


        test("pipeline", () => {
          const stackAction = actions(
            [push(1), push(2), pop()],
            function (values, state) {
              return values;
            }
          );

          const result =
            pipeline(
              []
              , stackAction
              , _.chain)
          _.each(function (elem) {
            console.log(polyToString(elem));
          })

          expect(stackAction([])).toStrictEqual([[1], [2, 1], 2]);
        });
      });
    })

  });

  describe("9章 クラスを使わないプログラミング", () => {
    describe("データ指向", () => {
      function lazyChain(obj) {
        const calls = [];

        return {
          invoke: function (methodName /*, args */) {
            const args = _.tail(arguments);
            calls.push(function (target) {
              const meth = target[methodName];
              return meth.apply(target, args);
            });
            return this;
          },
          force: function () {
            return _.reduce(calls, function (ret, thunk) {
              return thunk(ret);
            }, obj);
          }
        };
      }

      test("lazyChain", () => {
        const result = lazyChain([2, 1, 3])
          .invoke('concat', [7, 7, 8, 9, 0])
          .invoke('sort')
        expect(result.force()).toStrictEqual([0, 1, 2, 3, 7, 7, 8, 9]);
      })

      describe("関数型を目指して構築", () => {
        function deferredSort(any) {
          return lazyChain(any).invoke('sort');
        }

        function force(thunk) {
          return thunk.force();
        }

        test("deferredSort", () => {
          const deferredSorts = _.map([[2, 1, 3], [7, 7, 1], [0, 9, 5]], deferredSort);
          expect(_.map(deferredSorts, force)).toStrictEqual([[1, 2, 3], [1, 7, 7], [0, 5, 9]]);
        });

        const validateTriples = validator(
          "それぞれの配列は３つの要素を持っている必要があります",
          function (arrays) {
            return _.every(arrays, function (a) {
              return a.length === 3;
            });
          });

        const validateTripleStore = partial1(
          condition1(validateTriples),
          _.identity
        );

        test("validateTripleStore", () => {
          expect(validateTripleStore([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toStrictEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
          expect(() => validateTripleStore([[1, 2, 3], [4, 5, 6], [7, 8]])).toThrow("それぞれの配列は３つの要素を持っている必要があります");
        });

        function postProcess(arrays) {
          return _.map(arrays, second);
        }

        function processTriples(data) {
          return pipeline(data
            , JSON.parse
            , validateTripleStore
            , deferredSort
            , force
            , postProcess
            , invoker('sort', Array.prototype.sort)
            , str);
        }

        test("processTriple", () => {
          const result = processTriples("[[2, 1, 3], [7, 7, 1], [0, 9, 5]]");
          expect(result).toBe("1,7,9");

          expect(() => processTriples("[[2, 1, 3], [7, 7, 1], [0, 9]]")).toThrow("それぞれの配列は３つの要素を持っている必要があります");

        })
      });
    })

    describe("Mixin", () => {
      function polyToString(obj) {
        if (obj instanceof String) return obj;
        else if (obj instanceof Array) return stringifyArray(obj);
        else if (obj instanceof Object) return stringifyObject(obj);
        else return String(obj);
      }

      function stringifyArray(ary) {
        return ["[", _.map(ary, polyToString).join(","), "]"].join('');
      }

      function stringifyObject(obj) {
        return ["{", _.map(obj, function (v, k) {
          return polyToString(k) + ":" + polyToString(v);
        }).join(","), "}"].join('');
      }

      test("stringifyArray", () => {
        expect(stringifyArray([1, 2, 3])).toBe("[1,2,3]");
        expect(stringifyArray([1, [2, 3], 4])).toBe("[1,[2,3],4]");
      });

      const polyToString2 = dispatch(
        function (s) { return _.isString(s) ? s : undefined; },
        function (s) { return _.isArray(s) ? stringifyArray(s) : undefined; },
        function (s) { return s.toString(); });

      test("polyToString2", () => {
        expect(polyToString2(42)).toBe("42");
        expect(polyToString2([1, 2, [3, 4]])).toBe("[1,2,[3,4]]");
        expect(polyToString2('a')).toBe('a');
        expect(polyToString2({ a: 1, b: 2 })).toBe("[object Object]");
      })

      const polyToString3 = dispatch(
        function (s) { return _.isString(s) ? s : undefined },
        function (s) { return _.isArray(s) ? stringifyArray(s) : undefined },
        function (s) { return _.isObject(s) ? JSON.stringify(s) : undefined },
        function (s) { return s.toString() });

      test("polyToString3", () => {
        expect(polyToString3(42)).toBe("42");
        expect(polyToString3([1, 2, [3, 4]])).toBe("[1,2,[3,4]]");
        expect(polyToString3('a')).toBe('a');
        expect(polyToString3({ a: 1, b: 2 })).toBe('{"a":1,"b":2}');
        expect(polyToString3([1, 2, { a: 42, b: [4, 5, 6] }, 77])).toBe("[1,2,{a:42,b:[4,5,6]},77]");
      })

      describe("コアプロトタイプマンジング", () => {
        Container.prototype.toString = function () {
          return ["@<", polyToString(this._value), ">"].join('');
        }

        test("Container.prototype.toString", () => {
          expect(new Container(42).toString()).toBe("@<42>");
          expect(new Container({ a: 42, b: [1, 2, 3] }).toString()).toBe('@<{a:42,b:[1,2,3]}>');
        });

        test("Array.prototype.toString", () => {
          Array.prototype.toString = function () {
            return "DON'T DO THIS";
          }

          expect([1, 2, 3].toString()).toBe("DON'T DO THIS");
        });
      })

      describe("クラス階層構造", () => {
      })

      describe("階層を変更", () => {
      })

      describe("Mixinを使って階層を平坦化", () => {
        function Container(val) {
          this._value = val;
          this.init(val);
        }

        Container.prototype.init = _.identity;

        test("Container", () => {
          expect(new Container(42)._value).toBe(42);
        });

        const HoleMixin = {
          setValue: function (newValue) {
            const oldVal = this._value;
            this.validate(newValue);
            this._value = newValue;
            this.notify(oldVal, newValue);
            return this._value;
          }
        };

        const Hole = function (val) {
          Container.call(this, val);
        }

        const ObserverMixin = (function () {
          let _watcher = [];
          return {
            watch: function (fun) {
              _watcher.push(fun);
              return _.size(_watcher);
            },
            notify: function (oldVal, newVal) {
              _.each(_watcher, function (watcher) {
                watcher.call(this, oldVal, newVal);
              });
              return _.size(_watcher);
            }
          }
        })();

        const ValidateMixin = {
          addValidator: function (fun) {
            this._validator = fun;
          },
          init: function (val) {
            this.validate(val);
          },
          validate: function (val) {
            if (existy(this._validator) && !this._validator(val))
              fail("不正な値を設定しようとしました：" + polyToString(val));
          }
        }

        _.extend(Hole.prototype, HoleMixin, ValidateMixin, ObserverMixin);

        test("Hole.prototype", () => {
          let h = new Hole(42);
          h.addValidator(always(false));
          expect(() => h.setValue(9)).toThrow("不正な値を設定しようとしました：9");

          h = new Hole(42);
          h.addValidator(isEven);
          expect(() => h.setValue(9)).toThrow("不正な値を設定しようとしました：9");
          expect(h.setValue(108)).toBe(108);

          h.watch(function (old, nu) {
            note([old, "を", nu, "に変更"].join(' '));
          });
          expect(h.setValue(42)).toBe(42);

          h.watch(function (old, nu) {
            note(["Veranderende", old, , "tot", nu].join(' '));
          });
          expect(h.setValue(36)).toBe(36);
        });

      })

      describe("mixin拡張を使用した新しい仕組み", () => {
        const SwapMinx = {
          swap: function (fun /*, args */) {
            const args = _.tail(arguments);
            const newValue = fun.apply(this, construct(this._value, args));
            return this.setValue(newValue);
          }
        };

        test("SwapMinx", () => {
          const o = { _value: 0, setValue: _.identity };
          _.extend(o, SwapMinx);
          expect(o.swap(construct, [1, 2, 3])).toStrictEqual([0, 1, 2, 3]);
        });

        const SnapshotMixin = {
          snapshot: function () {
            return deepClone(this._value);
          }
        };

        _.extend(Hole.prototype, HoleMixin, ValidateMixin, ObserverMixin, SwapMinx, SnapshotMixin);

        test("Hole.prototype", () => {
          const h = new Hole(42);
          expect(h.snapshot()).toBe(42);
          expect(h.swap(always(99))).toBe(99);
          expect(h.snapshot()).toBe(99);
        });

      })

      describe("Mixinの混ぜ込みによる新しい型", () => {
        const CAS = function (val) {
          Hole.call(this, val);
        }

        const CASMixin = {
          swap: function (oldVal, f) {
            if (this._value === oldVal) {
              this.setValue(f(this._value));
              return this._value;
            } else {
              return undefined;
            }
          }
        };

        _.extend(CAS.prototype, HoleMixin, ValidateMixin, ObserverMixin, SwapMinx, CASMixin, SnapshotMixin)

        test("CAS.prototype", () => {
          const c = new CAS(42);
          expect(c.swap(42, always(-1))).toBe(-1);
          expect(c.snapshot()).toBe(-1);
          expect(c.swap('not the value', always(1000))).toBe(undefined);
          expect(c.snapshot()).toBe(-1);
        });

      })

      describe("メソッドは低レイヤーでの操作", () => {
        function contain(value) {
          return new Container(value);
        }

        test("contain", () => {
          expect(contain(42)).toEqual({ "_value": 42 });
        });

        function hole(val /*, validator */) {
          const h = new Hole(val);
          const v = _.toArray(arguments)[1];

          if (v) h.addValidator(v);
          h.setValue(val);
          return h;
        }

        test("hole", () => {
          expect(() => (hole(42, always(false))).setValue(9)).toThrow("不正な値を設定しようとしました：42");
          const swap = invoker('swap', Hole.prototype.swap);
          const x = hole(42);
          expect(swap(x, sqr)).toBe(1764);
        });

        function cas(val /*, validator */) {
          const h = hole.apply(this, arguments);
          const c = new CAS(val);
          c._validator = h._validator;
          return c;
        }

        function snapshot(o) { return o.snapshot(); }

        function addWatcher(o, fun) { o.watch(fun); }

        test("cas", () => {
          const swap = invoker('swap', Hole.prototype.swap);
          const x = hole(42);

          addWatcher(x, note);
          expect(swap(x, sqr)).toBe(1764);

          _.extend(CAS.prototype, HoleMixin, ValidateMixin, ObserverMixin, SwapMinx, CASMixin, SnapshotMixin)
          const compareAndSwap = invoker('swap', CAS.prototype.swap);
          const y = cas(9, isOdd);

          expect(compareAndSwap(y, 9, always(1))).toBe(1);
          expect(snapshot(y)).toBe(1);
        });
      })
    });
  })
})

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

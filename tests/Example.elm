module Example exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)
import Html exposing (a)
import List exposing (reverse)
import String exposing (join)


suite : Test
suite =
    describe "文字列モジュール"
        [ describe "String.reverse"
            [ test "回文には影響を与えない" <|
                \() ->
                    let
                        palindrome =
                            "hannah"
                    in
                        Expect.equal
                            palindrome
                            (String.reverse palindrome)
            , test "既知の文字列を反転" <|
                \() ->
                    "ABCDEFG"
                        |> String.reverse
                        |> Expect.equal "GFEDCBA"
            , fuzz string "もう一度実行すると元の文字列を復元" <|
                \randomlyGeneratedString ->
                    randomlyGeneratedString
                        |> String.reverse
                        |> String.reverse
                        |> Expect.equal randomlyGeneratedString
            ]
        ]

suite2 : Test
suite2 =   
    describe "言語の基礎"
        [ describe "値"
            [ test "数値の加算" <|
                \() ->
                    Expect.equal 3 (1 + 2)
            , test "数値の減算" <|
                \() ->
                    Expect.equal 1 (2 - 1)
            , test "数値の乗算" <|
                \() ->
                    Expect.equal 6 (2 * 3)
            , test "数値の除算" <|
                \() ->
                    Expect.equal 3 (6 // 2)
            , test "数値の剰余" <|
                \() ->
                    Expect.equal 1 (modBy 2 5)
            , test "数値の比較1" <|
                \() ->
                    Expect.equal True (1 < 2)
            , test "数値の比較2" <|
                \() ->
                    Expect.equal False (1 > 2)
            , test "数値の比較3" <|
                \() ->
                    Expect.equal True (1 <= 2)
            , test "数値の比較4" <|
                \() ->
                    Expect.equal False (1 >= 2)
            , test "数値の比較5" <|
                \() ->
                    Expect.equal True (1 == 1)
            , test "数値の比較6" <|
                \() ->
                    Expect.equal False (1 /= 1)
            ]
        , describe "関数"
            (List.map
                (\testName ->
                    test ("関数の定義1 - " ++ testName) <|
                        \() ->
                            Expect.equal ("Hello " ++ testName ++ "!") (greet1 testName)
                )
                [ "Alice", "Bob", "John" ]
            )
            , test "関数の定義2" <|
                \() ->
                    Expect.equal "The ostentatious butterfly wears metallic shorts." (madlib "butterfly" "metallic")
            , test "関数の定義3" <|
                \() ->
                    let
                        add a b =
                            a + b
                    in
                        Expect.equal 3 (add 1 2)
        , describe "if式"
            [ test "if式1" <|
                \() ->
                    Expect.equal 1 (if True then 1 else 2)
            , test "if式2" <|
                \() ->
                    Expect.equal "Hey!" (greet2 "Tom")
            , test "if式3" <|
                \() ->
                    Expect.equal "Greetings Mr. President!" (greet2 "Abraham Lincoln")
            ]
        , describe "リスト"
            [ test "リストの長さ" <|
                \() ->
                    Expect.equal 3 (List.length [ 1, 2, 3 ])
            , test "リストの結合" <|
                \() ->
                    Expect.equal [ 1, 2, 3, 4, 5 ] (List.append [ 1, 2, 3 ] [ 4, 5 ])
            , test "リストの先頭要素" <|
                \() ->
                    case List.head [ 1, 2, 3 ] of
                        Just num -> Expect.equal 1 num
                        Nothing -> Expect.fail "List was empty"
            , test "リストの末尾要素" <|
                \() ->
                    case List.head (List.reverse [ 1, 2, 3 ]) of
                        Just num -> Expect.equal 3 num
                        Nothing -> Expect.fail "List was empty"
            , test "リストの先頭要素を除いたリスト" <|
                \() ->
                    case List.tail [ 1, 2, 3 ] of
                        Just nums -> Expect.equal [ 2, 3 ] nums
                        Nothing -> Expect.fail "List was empty"
            , test "リストの末尾要素を除いたリスト" <|
                \() ->
                    case allButLast [1, 2, 3] of
                        Just nums -> Expect.equal [ 1, 2 ] nums
                        Nothing -> Expect.fail "List was empty"
            , test "リストの要素の存在確認1" <|
                \() ->
                    Expect.equal True (List.member 2 [ 1, 2, 3 ])
            , test "リストの要素の存在確認2" <|
                \() ->
                    Expect.equal False (List.member 4 [ 1, 2, 3 ])
            , test "リストの要素の存在確認3" <|
                \() ->
                    Expect.equal True (List.any (\x -> x > 2) [ 1, 2, 3 ])
            , test "リストの要素の存在確認4" <|
                \() ->
                    Expect.equal False (List.any (\x -> x > 3) [ 1, 2, 3 ])
            , test "リストの要素の存在確認5" <|
                \() ->
                    Expect.equal True (List.all (\x -> x > 0) [ 1, 2, 3 ])
            , test "リストの中身1" <|
                \() ->
                    Expect.equal ["Alice", "Bob", "Chuck"] (names)
            , test "リストの中身2" <|
                \() ->
                    Expect.equal False (List.isEmpty names)
            , test "リストの中身3" <|
                \() ->
                    Expect.equal 3 (List.length names)
            , test "リストの中身4" <|
                \() ->
                    Expect.equal ["Chuck", "Bob", "Alice"] (List.reverse names)
            , test "リストの中身5" <|
                \() ->
                    Expect.equal [4,3,2,1] (numbers)
            , test "リストの中身6" <|
                \() ->
                    Expect.equal [1,2,3,4] (List.sort numbers)
            , test "リストの中身7" <|
                \() ->
                    Expect.equal [5,4,3,2] (List.map increment numbers)
            ]
        , describe "タプル"
            [ test "タプル1" <|
                \() ->
                    Expect.equal (True, "name accepted") (isGoodName "Alice")
            , test "タプル2" <|
                \() ->
                    Expect.equal (False, "name was too long: please limit it to 20 characters") (isGoodName "AliceAliceAliceAliceAlice")
            ]
        , describe "レコード"
            [ test "レコード1" <|
                \() ->
                    Expect.equal "Alice" (person.name)
            , test "レコード2" <|
                \() ->
                    Expect.equal 30 (person.age)
            , test "レコード3" <|
                \() ->
                    Expect.equal { name = "Alice", age = 30 } (person)
            , test "レコード4" <|
                \() ->
                    Expect.equal { name = "Alice", age = 31 } ({ person | age = 31 })
            , test "レコード5" <|
                \() ->
                    Expect.equal "Hobson" (john.last)
            , test "レコード6" <|
                \() ->
                    Expect.equal ["Hobson","Hobson","Hobson"] (List.map .last [john,john,john])
            , test "レコード7" <|
                \() ->
                    Expect.equal { age = 81, first = "John", last = "Adams" } {john | last="Adams"}
            , test "レコード8" <|
                \() ->
                    Expect.equal { age = 22, first = "John", last = "Hobson" } {john | age=22}
            , test "レコード9" <|
                \() ->
                    Expect.equal { age = 82, first = "John", last = "Hobson" } (celeberateBirthday john)
            ]
        ]


greet1 : String -> String
greet1 name =
    "Hello " ++ name ++ "!"

madlib : String -> String -> String
madlib animal adjective =
    "The ostentatious " ++ animal ++ " wears " ++ adjective ++ " shorts."

greet2 : String -> String
greet2 name = 
    if name == "Abraham Lincoln" then
        "Greetings Mr. President!"
    else
        "Hey!"

allButLast : List a -> Maybe (List a)
allButLast list =
    List.reverse >> List.tail >> Maybe.map List.reverse
        |> (\f -> f list)

isGoodName name = 
    if String.length name <= 20 then
        (True, "name accepted")
    else
        (False, "name was too long: please limit it to 20 characters")

increment : Int -> Int
increment n = 
    n + 1

names : List String
names = [ "Alice", "Bob", "Chuck" ]

numbers : List Int
numbers = [4,3,2,1]

person : { name : String, age : Int }
person = { name = "Alice", age = 30 }

john : { first : String, last : String, age : Int }
john = {first = "John"
            ,last = "Hobson"
            ,age = 81
            }
celeberateBirthday : {a | age : Int} -> {a | age : Int}
celeberateBirthday pserson =
    {pserson | age = pserson.age + 1}
module Example exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)


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

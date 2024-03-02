module Example exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import RLE exposing (rle)
import Test exposing (..)


tests : Test
tests =
    describe "RLE tests"
        [ test "empty string" <| \_ -> Expect.equal "" (rle "")
        , test "single character" <| \_ -> Expect.equal "A1" (rle "A")
        , test "multiple characters" <| \_ -> Expect.equal "A3B2C3A3" (rle "AAABBCCCAAA")
        ]

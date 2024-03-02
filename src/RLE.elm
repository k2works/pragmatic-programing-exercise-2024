module RLE exposing (..)


rle : String -> String
rle str =
    (fromCharAndRunLength << toCharAndRunLength) str


fromCharAndRunLength : List ( Char, Int ) -> String
fromCharAndRunLength =
    String.concat << List.map rl2str


rl2str : ( Char, Int ) -> String
rl2str ( c, n ) =
    String.fromChar c ++ String.fromInt n


toCharAndRunLength : String -> List ( Char, Int )
toCharAndRunLength =
    toPairs << toRls


toRls : String -> List ( Char, Int )
toRls =
    Debug.todo "toRls"


toPairs : List ( Char, Int ) -> List ( Char, Int )
toPairs =
    Debug.todo "toPairs"

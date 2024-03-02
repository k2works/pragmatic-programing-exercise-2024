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


cat : List String -> String
cat =
    Debug.todo "Implement me!"


toCharAndRunLength : String -> List ( Char, Int )
toCharAndRunLength =
    Debug.todo "Implement me!"

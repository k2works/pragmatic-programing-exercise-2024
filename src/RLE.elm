module RLE exposing (..)


rle : String -> String
rle str =
    (fromCharAndRunLength << toCharAndRunLength) str


fromCharAndRunLength : List ( Char, Int ) -> String
fromCharAndRunLength =
    String.concat << rls2str


rls2str : List ( Char, Int ) -> List String
rls2str =
    foreach rl2str


foreach : (a -> b) -> List a -> List b
foreach =
    Debug.todo "Implement me!"


rl2str : ( Char, Int ) -> String
rl2str ( c, n ) =
    Debug.todo "Implement me!"


cat : List String -> String
cat =
    Debug.todo "Implement me!"


toCharAndRunLength : String -> List ( Char, Int )
toCharAndRunLength =
    Debug.todo "Implement me!"

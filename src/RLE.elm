module RLE exposing (..)


rle : String -> String
rle str =
    (fromCharAndRunLength << toCharAndRunLength) str


fromCharAndRunLength : List ( Char, Int ) -> String
fromCharAndRunLength =
    Debug.todo "Implement me!"


toCharAndRunLength : String -> List ( Char, Int )
toCharAndRunLength =
    Debug.todo "Implement me!"

module RLE exposing (..)


rle : String -> String
rle str =
    (fromCharAndRunLength << toCharAndRunLength) str


fromCharAndRunLength : List ( Char, Int ) -> String
fromCharAndRunLength =
    cat << rls2str


rls2str : List ( Char, Int ) -> List String
rls2str =
    Debug.todo "Implement me!"


cat : List String -> String
cat =
    Debug.todo "Implement me!"


toCharAndRunLength : String -> List ( Char, Int )
toCharAndRunLength =
    Debug.todo "Implement me!"

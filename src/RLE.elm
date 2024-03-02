module RLE exposing (..)


rle : String -> String
rle str =
    case String.uncons str of
        Nothing ->
            ""

        Just ( h, t ) ->
            aux 1 h t h


aux : Int -> Char -> String -> Char -> String
aux runLength prevChar str currentChar =
    case String.uncons str of
        Nothing ->
            String.fromChar prevChar ++ String.fromInt runLength

        Just ( c, s ) ->
            if c == prevChar then
                aux (runLength + 1) prevChar s currentChar

            else
                String.fromChar prevChar ++ String.fromInt runLength ++ aux 1 c s c

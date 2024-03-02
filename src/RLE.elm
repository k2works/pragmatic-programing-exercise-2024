module RLE exposing (..)

-- 文字列のランレングスエンコーディング


rle : String -> String
rle str =
    str
        |> String.toList
        |> groupAndCount
        |> List.map pairToString
        |> String.concat



-- 連続する同一の要素をグループ化し、その出現数をカウントする


groupAndCount : List Char -> List ( Char, Int )
groupAndCount list =
    list
        |> group
        |> List.map (\subList -> ( List.head subList |> Maybe.withDefault ' ', List.length subList ))



-- 連続する同一の要素をグループ化する


group : List Char -> List (List Char)
group list =
    case list of
        [] ->
            []

        x :: xs ->
            let
                ( ys, zs ) =
                    span ((==) x) xs
            in
            (x :: ys) :: group zs



-- プレディケートが初めてFalseを返す地点でリストを二つに分割する


span : (a -> Bool) -> List a -> ( List a, List a )
span predicate list =
    case list of
        [] ->
            ( [], [] )

        x :: xs ->
            if predicate x then
                let
                    ( ys, zs ) =
                        span predicate xs
                in
                ( x :: ys, zs )

            else
                ( [], list )



-- 文字とカウントのペアを文字列に変換する


pairToString : ( Char, Int ) -> String
pairToString ( c, n ) =
    String.fromChar c ++ String.fromInt n

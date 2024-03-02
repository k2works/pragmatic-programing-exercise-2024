module RLE exposing (..)


group : List a -> List (List a)
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


groupAndCount : List Char -> List ( Char, Int )
groupAndCount list =
    let
        grouped =
            group list
    in
    List.map (\subList -> ( List.head subList |> Maybe.withDefault ' ', List.length subList )) grouped


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
toCharAndRunLength str =
    groupAndCount <| String.toList str


toPair : String -> ( Char, Int )
toPair str =
    let
        charList =
            String.toList str
    in
    ( List.head charList |> Maybe.withDefault ' ', String.length str )

module RLE exposing (..)


rle : String -> String
rle str =
    let
        groupAndCount list =
            let
                grouped =
                    group list
            in
            List.map (\subList -> ( List.head subList |> Maybe.withDefault ' ', List.length subList )) grouped

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
    in
    (String.concat << List.map rl2str << groupAndCount << String.toList) str


rl2str : ( Char, Int ) -> String
rl2str ( c, n ) =
    String.fromChar c ++ String.fromInt n

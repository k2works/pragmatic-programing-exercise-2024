module Main exposing (..)

import Html exposing (Html, div, text)
import Post exposing (Post, estimatedReadTime, encode, decoder)
import Json.Decode as D
import Json.Encode as E

-- メイン関数
main : Html msg
main =
    let
        -- Postのインスタンスを作成
        post = { title = "Elm Tutorial", author = "John Doe", content = "Welcome to the Elm tutorial..." }

        -- estimatedReadTime関数を使用して読了時間を推定
        readTime = Post.estimatedReadTime post

        -- encode関数を使用してPostをJSONにエンコード
        json = Post.encode post

        -- JSONを文字列に変換
        jsonString = E.encode 0 json

        -- JSON文字列をデコードしてPostに変換
        decodedPost = D.decodeString Post.decoder jsonString
    in
    div []
        [ div [] [ text ("Estimated read time: " ++ String.fromFloat readTime ++ " minutes") ]
        , div [] [ text ("Encoded JSON: " ++ jsonString) ]
        , div [] [ text ("Decoded Post: " ++ resultToString decodedPost) ]
        ]

-- Result型の値を文字列に変換する関数
resultToString : Result D.Error Post -> String
resultToString result =
    case result of
        Ok post ->
            "Title: " ++ post.title ++ ", Author: " ++ post.author ++ ", Content: " ++ post.content

        Err errorMessage ->
            "Error: " ++ D.errorToString errorMessage
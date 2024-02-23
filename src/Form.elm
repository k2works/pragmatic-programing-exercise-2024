module Form exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import Button exposing (Msg)


-- MAIN

main =
    Browser.sandbox { init = init, update = update, view = view }

-- MODEL

type alias Model =
    { name : String
    , password : String
    , passwordAgain: String
    }

init : Model
init =
    Model "" "" ""

-- UPDATE

type Msg
  = Name String
  | Password String
  | PasswordAgaing String


update : Msg -> Model -> Model
update msg model =
    case msg of
        Name name ->
            { model | name = name }

        Password password ->
            { model | password = password }

        PasswordAgaing passwordAgain ->
            { model | passwordAgain = passwordAgain }

-- VIEW

view : Model -> Html Msg
view model =
    div []
        [viewInput "text" "Name" model.name Name
         , viewInput "password" "Password" model.password Password
         , viewInput "password" "Password again" model.passwordAgain PasswordAgaing
         , viewValidation model
        ]

viewInput : String -> String -> String -> (String -> Msg) -> Html Msg
viewInput t p v toMsg =
    input [ type_ t, placeholder p, value v, onInput toMsg ] []

viewValidation : Model -> Html Msg
viewValidation model =
    let
        password = model.password
        lengthValidation = if String.length password >= 8 then "Passes length check" else "Fails length check"
        upperCaseValidation = if String.any Char.isUpper password then "Contains uppercase" else "Does not contain uppercase"
        lowerCaseValidation = if String.any Char.isLower password then "Contains lowercase" else "Does not contain lowercase"
        digitValidation = if String.any Char.isDigit password then "Contains digit" else "Does not contain digit"
        passwordMatchValidation = if model.password == model.passwordAgain then (div [ style "color" "green" ] [ text "OK" ]) else (div [ style "color" "red"] [ text "Passwords do not match!" ])
    in
    div []
        [ div [] [ text lengthValidation ]
        , div [] [ text upperCaseValidation ]
        , div [] [ text lowerCaseValidation ]
        , div [] [ text digitValidation ]
        , passwordMatchValidation
        ]
module Main where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Halogen as H
import Halogen.Aff as HA
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.VDom.Driver (runUI)

main :: Effect Unit
main = HA.runHalogenAff do
  body <- HA.awaitBody
  runUI xomponent unit body

data Action = Increment | Decrement

xomponent = H.mkComponent
              { initialState,
                render,
                eval: H.mkEval $ H.defaultEval { handleAction = f } }
  where
  initialState = const ["a"]
  render state = HH.div_ [HH.text $ show state, 
                         HH.button [ HE.onClick $ const $ Just Increment] [HH.text "+"]]
  f = case _ of
    Increment -> H.modify_ \state → state <> ["a"]
    _         -> H.modify_ identity

-- component =
--   H.mkComponent
--     { initialState
--     , render
--     , eval: H.mkEval $ H.defaultEval { handleAction = handleAction }
--     }
--   where
--   initialState _ = 0
-- 
--   render state =
--     HH.div_
--       [ HH.button [ HE.onClick \_ -> Just Decrement ] [ HH.text "-" ]
--       , HH.div_ [ HH.text $ show state ]
--       , HH.button [ HE.onClick \_ -> Just Increment ] [ HH.text "+" ]
--       , HH.ul_ [ HH.li_ [HH.text "ass" ]]
--       ]
-- 
--   handleAction = case _ of
--     Increment -> H.modify_ \state -> state + 1
--     Decrement -> H.modify_ \state -> state - 1

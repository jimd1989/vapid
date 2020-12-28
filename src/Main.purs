module Main where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect (Effect)
import Effect.Class (class MonadEffect)
import Effect.Class.Console (logShow)
import Halogen as H
import Halogen.Aff as HA
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.HTML.Events as HE
import Halogen.VDom.Driver (runUI)

main :: Effect Unit
main = HA.runHalogenAff do
  body <- HA.awaitBody
  runUI component unit body

component ∷ ∀ q i o m. H.Component HH.HTML q i o m
component =
  H.mkComponent
    { initialState,
      render,
      eval: H.mkEval $ H.defaultEval { handleAction = f }
    }
  where
  initialState ∷ ∀ i. i → { name ∷ Maybe String}
  initialState = const { name: Nothing }
  render ∷ ∀ m. { name ∷ Maybe String } → H.ComponentHTML String () m
  render {name: Nothing}  = HH.div_ [HH.p_ [HH.text "Nothing yet." ], HH.input [HE.onValueInput pure ]]
  render {name: Just ""}  = HH.div_ [HH.p_ [HH.text "Nothing yet." ], HH.input [HE.onValueInput pure ]]
  render {name: Just x }  = HH.div_ [HH.p_ [HH.text x], HH.input [HE.onValueInput pure ]]
  f ∷ ∀ o m. String → H.HalogenM { name ∷ Maybe String} String () o m Unit
  f x = H.modify_ \state → { name: Just x }

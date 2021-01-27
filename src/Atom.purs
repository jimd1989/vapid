module Atom where

import Prelude (($), show, (+))
import Data.Const (Const)
import Data.Function (const)
import Data.Unit (Unit)
import Data.Void (Void)
import Halogen as H
import Halogen.Component as HC
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Query.HalogenM as HQ

type Magnitude = Int
type MagnitudeState = { magnitude ∷ Magnitude }
data MagnitudeAction = MagnitudeModify Int

type Label = String
data Attribute = Attribute { label ∷ Label, magnitude ∷ Magnitude }

class' ∷ ∀ a b. String → HP.IProp (class ∷ String | b) a
class' α = HP.class_ $ HH.ClassName α

component' ∷ ∀ a b c d e f g h. 
  (e → b) → (b → c (HC.ComponentSlot c a g d) d) → (d → HQ.HalogenM b d a h g Unit) → H.Component c f e h g
component' α β ω = H.mkComponent { initialState, render, eval: H.mkEval H.defaultEval { handleAction = handleAction }}
  where initialState = α
        render = β
        handleAction = ω

magnitude ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Void m
magnitude = component' i r a
  where
    i = const { magnitude: 1 }
    a (MagnitudeModify n) = H.modify_ _{ magnitude = n }
    r α =
      HH.span [class' "magnitudeBox"]
       [HH.input [class' "magnitude", HP.placeholder $ show α.magnitude]]

--label ∷ ∀ w i. String → HH.HTML w i
--label α = HH.span [HP.class_ $ HH.ClassName "labelBox"] [HH.input [HP.class_ $ HH.ClassName "label"]]

--atom ∷ ∀ w i. HH.HTML w i
--atom = HH.li [HP.class_ $ HH.ClassName "atom"] [label "a"]

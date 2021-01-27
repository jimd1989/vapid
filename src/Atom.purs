module Atom where

import Prelude (($), show)
import Data.Const (Const)
import Data.Function (const)
import Data.Int (fromString)
import Data.Unit (Unit)
import Data.Void (Void)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Helpers ((◁), class', component')

type Magnitude = Int
type MagnitudeState = { magnitude ∷ Magnitude }
data MagnitudeAction = MagnitudeModify Magnitude

type Label = String
data Attribute = Attribute { label ∷ Label, magnitude ∷ Magnitude }

magnitude ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Void m
magnitude = component' i r a
  where
    i = const { magnitude: 1 }
    a (MagnitudeModify n) = H.modify_ _{ magnitude = n }
    r α =
      HH.span [class' "magnitudeBox"]
       [HH.input [class' "magnitude", HP.placeholder $ show α.magnitude, HE.onValueInput parse]]
    parse = MagnitudeModify ◁ fromString

--label ∷ ∀ w i. String → HH.HTML w i
--label α = HH.span [HP.class_ $ HH.ClassName "labelBox"] [HH.input [HP.class_ $ HH.ClassName "label"]]

--atom ∷ ∀ w i. HH.HTML w i
--atom = HH.li [HP.class_ $ HH.ClassName "atom"] [label "a"]

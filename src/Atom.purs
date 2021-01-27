module Atom where

import Prelude (($), show, (+))
import Data.Const (Const)
import Data.Function (const)
import Data.Unit (Unit)
import Data.Void (Void)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

type Magnitude = Int
type MagnitudeState = { magnitude ∷ Magnitude }
data MagnitudeAction = MagnitudeModify Int

type Label = String
data Attribute = Attribute { label ∷ Label, magnitude ∷ Magnitude }


magnitude ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Void m
magnitude = H.mkComponent { initialState, render, eval: H.mkEval H.defaultEval { handleAction = handleAction } }
  where
    initialState = const { magnitude: 1 }
    handleAction (MagnitudeModify n) = H.modify_ _{ magnitude = n }
    render α =
      HH.span [HP.class_ $ HH.ClassName "magnitudeBox"]
       [HH.input [HP.class_ $ HH.ClassName "magnitude", HP.placeholder $ show α.magnitude]]

--label ∷ ∀ w i. String → HH.HTML w i
--label α = HH.span [HP.class_ $ HH.ClassName "labelBox"] [HH.input [HP.class_ $ HH.ClassName "label"]]

--atom ∷ ∀ w i. HH.HTML w i
--atom = HH.li [HP.class_ $ HH.ClassName "atom"] [label "a"]

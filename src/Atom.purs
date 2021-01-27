module Atom where

import Prelude (($), identity, pure, show)
import Data.Const (Const)
import Data.Function (const)
import Data.Int (fromString)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Data.Unit (Unit, unit)
import Data.Void (Void, absurd)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Helpers ((∘), class', component')


type Label = String
type LabelState = { label ∷ Label }
data LabelAction = LabelModify Label

label ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Void m
label = component' i r a
  where
    i = const { label: "" }
    a (LabelModify α) = H.modify_ _{ label = α }
    r = const $ HH.input [class' "atomLabel", HE.onValueInput parse]
    parse = pure ∘ LabelModify
   
type Magnitude = Int
type MagnitudeState = { magnitude ∷ Maybe Magnitude }
data MagnitudeAction = MagnitudeModify (Maybe Magnitude)

magnitude ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Void m
magnitude = component' i r a
  where
    i = const { magnitude: Just 1 }
    a (MagnitudeModify n) = H.modify_ _{ magnitude = n }
    r { magnitude: Nothing } =  HH.input [class' "magnitudeError", HP.placeholder "integer", HE.onValueInput parse]
    r { magnitude: Just α } = HH.input [class' "magnitude", HP.placeholder $ show α, HE.onValueInput parse]
    parse = pure ∘ MagnitudeModify ∘ fromString

sym = SProxy ∷ SProxy "sym"
lSlot = HH.slot sym 0 label unit absurd
rSlot = HH.slot sym 1 magnitude unit absurd

attribute ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Void m
attribute = component' i r a
  where
    i = const { label: "" }
    a (LabelModify α) = H.modify_ _{ label = α }
    r = const $ HH.span [class' "attribute"] [lSlot, rSlot]

module Atom where

import Prelude (($), pure, show)
import Data.Const (Const)
import Data.Function (const)
import Data.Int (fromString)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Data.Unit (Unit)
import Data.Void (Void)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Helpers ((∘), class', component')

type Label = String
labelSym = SProxy ∷ SProxy "label"

label ∷ ∀ m. H.Component HH.HTML (Const Void) Label Label m
label = component' i r a
  where
    i = const ""
    a = H.raise
    r = const $ HH.input [class' "atomLabel", HE.onValueInput pure]

type Magnitude = Maybe Int
magnitudeSym = SProxy ∷ SProxy "magnitude"

magnitude ∷ ∀ m. H.Component HH.HTML (Const Void) Magnitude Magnitude m
magnitude = component' i r a
  where
    i = const $ Just 1
    a = H.raise
    r Nothing  =  HH.input [class' "magnitudeError", HP.placeholder "integer", HE.onValueInput parse]
    r (Just α) = HH.input [class' "magnitude", HP.placeholder $ show α, HE.onValueInput parse]
    parse = pure ∘ fromString

type AttributeState = { label ∷ Label, magnitude ∷ Magnitude }
data AttributeAction = Label Label | Magnitude Magnitude

attribute ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Void m
attribute = component' i r a
 where
   i = const { label: "", magnitude: Nothing }
   a (Magnitude α) = H.modify_ _{ magnitude = α }
   a (Label α)     = H.modify_ _{ label = α }
   r α = HH.li [class' "attribute"] [labelSlot α, magnitudeSlot α]
   labelSlot α     = HH.slot labelSym 0 label α.label (pure ∘ Label)
   magnitudeSlot α = HH.slot magnitudeSym 1 magnitude α.magnitude (pure ∘ Magnitude)

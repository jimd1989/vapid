module Atom where

import Prelude (($), pure, show)
import Control.Apply ((*>))
import Data.Const (Const)
import Data.Function (const)
import Data.Int (fromString)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Data.Unit (Unit, unit)
import Data.Void (Void)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Helpers ((∘), class', component')

type Label = String
labelSym = SProxy ∷ SProxy "label"

label ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Label m
label = component' i r a
  where
    i = const ""
    a = H.raise
    r = const $ HH.input [class' "atomLabel", HE.onValueInput pure]

type Magnitude = Maybe Int
magnitudeSym = SProxy ∷ SProxy "magnitude"

magnitude ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Magnitude m
magnitude = component' i r a
  where
    i = const $ Just 1
    a α = H.modify_ (const α) *> H.raise α
    r Nothing  =  HH.input [class' "magnitudeError", HP.placeholder "integer", HE.onValueInput parse]
    r (Just α) = HH.input [class' "magnitude", HP.placeholder $ show α, HE.onValueInput parse]
    parse = pure ∘ fromString

type AttributeState = { label ∷ Label, magnitude ∷ Magnitude }
data AttributeAction = Label Label | Magnitude Magnitude

attribute ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Void m
attribute = component' i r a
 where
   i = const { label: "", magnitude: Just 1}
   a (Label α)     = H.modify_ _{ label = α }
   a (Magnitude α) = H.modify_ _{ magnitude = α }
   r α = HH.li [class' "attribute"] [labelSlot, magnitudeSlot, HH.text $ show α]
   labelSlot     = HH.slot labelSym 0 label unit (pure ∘ Label)
   magnitudeSlot = HH.slot magnitudeSym 1 magnitude unit (pure ∘ Magnitude)

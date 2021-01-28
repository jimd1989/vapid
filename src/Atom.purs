module Atom where

import Prelude (($), (>>=), pure, show)
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
    a α = H.modify (const α) >>= H.raise
    r Nothing  =  HH.input [class' "magnitudeError", HP.placeholder "integer", HE.onValueInput parse]
    r (Just α) = HH.input [class' "magnitude", HP.placeholder $ show α, HE.onValueInput parse]
    parse = pure ∘ fromString

type AttributeState = { num ∷ Int, label ∷ Label, magnitude ∷ Magnitude }
data AttributeAction = Label Label | Magnitude Magnitude | KillAttribute
attributeSym = SProxy ∷ SProxy "attribute"

attribute ∷ ∀ m. H.Component HH.HTML (Const Void) Int AttributesAction m
attribute = component' i r a
 where
   i n = {num: n, label: "", magnitude: Just 1}
   a (Label α)     = H.modify _{ label = α } >>= H.raise ∘ UpdateAttributeN
   a (Magnitude α) = H.modify _{ magnitude = α } >>= H.raise ∘ UpdateAttributeN
   a KillAttribute = H.get >>= H.raise ∘ KillAttributeN
   r = const $ HH.li [class' "attribute"] [xButton, labelSlot, magnitudeSlot]
   xButton       = HH.button [class' "attributeKill", HE.onClick (pure ∘ const KillAttribute)] [HH.text "x"]
   labelSlot     = HH.slot labelSym 0 label unit (pure ∘ Label)
   magnitudeSlot = HH.slot magnitudeSym 1 magnitude unit (pure ∘ Magnitude)

type AttributesState = Array AttributeState
data AttributesAction = AddAttribute | UpdateAttributeN AttributeState | KillAttributeN AttributeState
attributesSym = SProxy ∷ SProxy "attributes"

attributes = component' i r a
  where
    i = const [{ num: 0, label: "", magnitude: Just 1 }]
    a AddAttribute         = H.modify_ $ const []
    a (UpdateAttributeN α) = H.modify_ $ const []
    a (KillAttributeN α)   = H.modify_ $ const []
    r α = HH.ul [class' "attributes"] [attributeSlot, HH.text $ show α]
    attributeSlot = HH.slot attributeSym 0 attribute 0 pure

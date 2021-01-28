module Atom where

import Prelude (($), (>>=), identity, pure, show)
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
import Helpers ((∘), (◇), (◁), addNth, class', component', deleteNth, reorder, updateNth)

type Label = String
data LabelAction = GetLabel Label | UpdateLabel Label
labelSym = SProxy ∷ SProxy "label"

label ∷ ∀ m. H.Component HH.HTML (Const Void) Label AttributeAction m
label = component' i r a e
  where
    i = const $ ""
    a (GetLabel α)    = H.modify_ $ const α
    a (UpdateLabel α) = H.raise $ Label α
    e = pure ∘ GetLabel
    r α = HH.input [class' "atomLabel", HP.value α, HE.onValueInput (pure ∘ UpdateLabel)]

type Magnitude = Maybe Int
data MagnitudeAction = GetMagnitude Magnitude | UpdateMagnitude Magnitude
magnitudeSym = SProxy ∷ SProxy "magnitude"

magnitude ∷ ∀ m. H.Component HH.HTML (Const Void) Magnitude AttributeAction m
magnitude = component' i r a e
  where
    i = const $ Just 1
    a (GetMagnitude α)    = H.modify_ $ const α
    a (UpdateMagnitude α) = H.raise $ Magnitude α
    e = pure ∘ GetMagnitude
    r Nothing  =  HH.input [class' "magnitudeError", HP.placeholder "integer", HE.onValueInput parse]
    r (Just α) = HH.input [class' "magnitude", HP.value $ show α, HE.onValueInput parse]
    parse = pure ∘ UpdateMagnitude ∘ fromString

type AttributeState = { num ∷ Int, label ∷ Label, magnitude ∷ Magnitude }
data AttributeAction = GetAttribute AttributeState | Label Label | Magnitude Magnitude | KillAttribute
attributeSym = SProxy ∷ SProxy "attribute"

attribute ∷ ∀ m. H.Component HH.HTML (Const Void) AttributeState AttributesAction m
attribute = component' i r a e
 where
   i = identity
   a (GetAttribute α) = H.modify_ $ const α
   a (Label α)        = H.modify _{ label = α } >>= H.raise ∘ UpdateAttributeN
   a (Magnitude α)    = H.modify _{ magnitude = α } >>= H.raise ∘ UpdateAttributeN
   a KillAttribute    = H.get >>= H.raise ∘ KillAttributeN
   e = pure ∘ GetAttribute
   r α = HH.li [class' "attribute"] [xButton, labelSlot α, magnitudeSlot α]
   xButton         = HH.button [class' "attributeKill", HE.onClick (pure ∘ const KillAttribute)] [HH.text "x"]
   labelSlot α     = HH.slot labelSym 0 label α.label pure
   magnitudeSlot α = HH.slot magnitudeSym 1 magnitude α.magnitude pure

type AttributesState = Array AttributeState
data AttributesAction = AddAttribute | UpdateAttributeN AttributeState | KillAttributeN AttributeState
attributesSym = SProxy ∷ SProxy "attributes"

attributes ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Void m
attributes = component' i r a e
  where
    i = const [{ num: 0, label: "", magnitude: Just 1 }]
    a AddAttribute         = H.modify_ $ addNth {num: 0, label: "", magnitude: Just 1}
    a (UpdateAttributeN α) = H.modify_ $ updateNth α
    a (KillAttributeN α)   = H.modify_ $ deleteNth α
    e = const Nothing
    r α = HH.ul [class' "attributes"] ((mkSlots α) ◇ [addButton, HH.text $ show α])
    mkSlot α = HH.slot attributeSym α.num attribute α pure
    mkSlots = mkSlot ◁ reorder
    addButton = HH.button [class' "attributeAdd", HE.onClick (pure ∘ const AddAttribute)] [HH.text "+"]

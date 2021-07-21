module Atom where

import Prelude (($), (>>=), identity, pure, show)
import Data.Const (Const)
import Data.Either (Either(..))
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
import Helpers ((∘), (◇), (◁), addNth, class', component', decode, deleteNth, reorder, updateNth)
import Components.Label (Label, LabelOutput(..), label, labelSym)
import Components.Magnitude (Magnitude, MagnitudeOutput(..), defaultMagnitude, magnitude, magnitudeSym)

type AttributeState = { num ∷ Int, label ∷ Label, magnitude ∷ Magnitude }
data AttributeAction = GetAttribute AttributeState
                     | UpdateAttributeLabel LabelOutput
                     | UpdateAttributeMagnitude MagnitudeOutput
                     | KillAttribute
attributeSym = SProxy ∷ SProxy "attribute"

attribute ∷ ∀ m. H.Component HH.HTML (Const Void) AttributeState AttributesAction m
attribute = component' i r a e
 where
   i = identity
   a (GetAttribute α)                              = H.modify_ $ const α
   a (UpdateAttributeLabel (RaiseLabel α))         = H.modify _{ label = α } >>= H.raise ∘ UpdateAttributeN
   a (UpdateAttributeMagnitude (RaiseMagnitude α)) = H.modify _{ magnitude = α } >>= H.raise ∘ UpdateAttributeN
   a KillAttribute                                 = H.get >>= H.raise ∘ KillAttributeN
   e = pure ∘ GetAttribute
   r α = HH.li [class' "attribute"] [xButton, labelSlot α, magnitudeSlot α]
   xButton         = HH.button [class' "attributeKill", HE.onClick (pure ∘ const KillAttribute)] [HH.text "x"]
   labelSlot α     = HH.slot labelSym 0 label α.label (pure ∘ UpdateAttributeLabel)
   magnitudeSlot α = HH.slot magnitudeSym 1 magnitude α.magnitude (pure ∘ UpdateAttributeMagnitude)

type AttributesState = Array AttributeState
data AttributesAction = AddAttribute | UpdateAttributeN AttributeState | KillAttributeN AttributeState
attributesSym = SProxy ∷ SProxy "attributes"

attributes ∷ ∀ m. H.Component HH.HTML (Const Void) Unit Void m
attributes = component' i r a e
  where
    i = const [{ num: 0, label: "", magnitude: defaultMagnitude }]
    a AddAttribute         = H.modify_ $ addNth {num: 0, label: "", magnitude: defaultMagnitude }
    a (UpdateAttributeN α) = H.modify_ $ updateNth α
    a (KillAttributeN α)   = H.modify_ $ deleteNth α
    e = const Nothing
    r α = HH.ul [class' "attributes"] ((mkSlots α) ◇ [addButton, HH.text $ show α])
    mkSlot α  = HH.slot attributeSym α.num attribute α pure
    mkSlots   = mkSlot ◁ reorder
    addButton = HH.button [class' "attributeAdd", HE.onClick (pure ∘ const AddAttribute)] [HH.text "+"]

type AtomState = {num ∷ Int, label ∷ Label, attributes ∷ AttributesState }
data AtomAction = GetAtom AtomState | UpdateAtomLabel LabelOutput | UpdateAttributes AttributesState | KillAtom
atomSym = SProxy ∷ SProxy "atom"

atom = component' i r a e
  where
    i = identity
    a = H.raise
    r α = HH.li [class' "atom"] []
    e = const Nothing
    labelSlot α = HH.slot atomSym 0 label α.label pure


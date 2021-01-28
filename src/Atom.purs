module Atom where

import Prelude (($), (>>=), identity, pure, show)
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
import Helpers ((∘), (◇), (◁), addNth, class', component', deleteNth, reorder, updateNth)

type Label = String
labelSym = SProxy ∷ SProxy "label"

data LabelAction = GetLabel Label | UpdateLabel Label

label ∷ ∀ m. H.Component HH.HTML (Const Void) Label AttributeAction m
label = H.mkComponent { initialState: i, render: r, eval: H.mkEval $ H.defaultEval { handleAction = a, receive = pure ∘ GetLabel } }
  where
    i = const $ ""
    a (GetLabel α)    = H.modify_ $ const α
    a (UpdateLabel α) = H.raise $ Label α
    r α = HH.input [class' "atomLabel", HP.value α, HE.onValueInput (pure ∘ UpdateLabel)]

type Magnitude = Maybe Int
magnitudeSym = SProxy ∷ SProxy "magnitude"

magnitude ∷ ∀ m. H.Component HH.HTML (Const Void) Unit AttributeAction m
magnitude = component' i r a
  where
    i = const $ Just 1
    a α = H.modify (const α) >>= H.raise ∘ Magnitude
    r Nothing  =  HH.input [class' "magnitudeError", HP.placeholder "integer", HE.onValueInput parse]
    r (Just α) = HH.input [class' "magnitude", HP.value $ show α, HE.onValueInput parse]
    parse = pure ∘ fromString

type AttributeState = { num ∷ Int, label ∷ Label, magnitude ∷ Magnitude }
data AttributeAction = Label Label | Magnitude Magnitude | KillAttribute | GetAttribute AttributeState
attributeSym = SProxy ∷ SProxy "attribute"

attribute ∷ ∀ m. H.Component HH.HTML (Const Void) AttributeState AttributesAction m
attribute = H.mkComponent { initialState: i, render: r, eval: H.mkEval $ H.defaultEval { handleAction = a, receive = pure ∘ GetAttribute } }
 where
   i = identity
   a (GetAttribute α) = H.modify_ $ const α
   a (Label α)     = H.modify _{ label = α } >>= H.raise ∘ UpdateAttributeN
   a (Magnitude α) = H.modify _{ magnitude = α } >>= H.raise ∘ UpdateAttributeN
   a KillAttribute = H.get >>= H.raise ∘ KillAttributeN
   r α = HH.li [class' "attribute"] [xButton, labelSlot α, magnitudeSlot]
   xButton       = HH.button [class' "attributeKill", HE.onClick (pure ∘ const KillAttribute)] [HH.text "x"]
   labelSlot α   = HH.slot labelSym 0 label α.label pure
   magnitudeSlot = HH.slot magnitudeSym 1 magnitude unit pure

type AttributesState = Array AttributeState
data AttributesAction = AddAttribute | UpdateAttributeN AttributeState | KillAttributeN AttributeState
attributesSym = SProxy ∷ SProxy "attributes"

attributes = component' i r a
  where
    i = const [{ num: 0, label: "", magnitude: Just 1 }]
    a AddAttribute         = H.modify_ $ addNth {num: 0, label: "", magnitude: Just 1}
    a (UpdateAttributeN α) = H.modify_ $ updateNth α
    a (KillAttributeN α)   = H.modify_ $ deleteNth α
    r α = HH.ul [class' "attributes"] ((mkSlots α) ◇ [addButton, HH.text $ show α])
    mkSlot α = HH.slot attributeSym α.num attribute α pure
    mkSlots = mkSlot ◁ reorder
    addButton = HH.button [class' "attributeAdd", HE.onClick (pure ∘ const AddAttribute)] [HH.text "+"]

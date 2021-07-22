module Components.Attribute (Attribute, AttributeOutput(..), attribute, attributeSym, defaultAttribute) where

-- A Magnitude/Label pair on an Atom

import Prelude (($), (>>=), identity, pure)
import Data.Const (Const)
import Data.Function (const)
import Data.Symbol (SProxy(..))
import Data.Void (Void)
import Halogen (Component, get, modify, modify_, raise)
import Halogen.HTML (HTML, button, li, slot, text)
import Halogen.HTML.Events (onClick)
import Components.Label (Label, LabelOutput(..), label, labelSym)
import Components.Magnitude (Magnitude, MagnitudeOutput(..), defaultMagnitude, magnitude, magnitudeSym)
import Helpers ((∘), class', component')

type Attribute = { num ∷ Int, label ∷ Label, magnitude ∷ Magnitude }

data AttributeAction = GetAttribute             Attribute
                     | UpdateAttributeLabel     LabelOutput
                     | UpdateAttributeMagnitude MagnitudeOutput
                     | KillAttribute

data AttributeOutput = AddAttribute
                     | UpdateAttributeN Attribute 
                     | KillAttributeN   Attribute

attributeSym = SProxy ∷ SProxy "attribute"

defaultAttribute = { num: 0, label: "", magnitude: defaultMagnitude } ∷ Attribute

attribute ∷ ∀ m. Component HTML (Const Void) Attribute AttributeOutput m
attribute = component' i r a e
  where
    i = identity
    a (GetAttribute                             α ) = modify_ $ const α
    a (UpdateAttributeLabel     (RaiseLabel     α)) = modify _{label = α}     >>= raise ∘ UpdateAttributeN
    a (UpdateAttributeMagnitude (RaiseMagnitude α)) = modify _{magnitude = α} >>= raise ∘ UpdateAttributeN
    a KillAttribute                                 = get                     >>= raise ∘ KillAttributeN
    e = pure ∘ GetAttribute
    r α = li [class' "attribute"] [xButton, labelSlot α, magnitudeSlot α]
    xButton         = button [class' "attributeKill", onClick (pure ∘ const KillAttribute)] [text "x"]
    labelSlot     α = slot labelSym     0 label     α.label     (pure ∘ UpdateAttributeLabel)
    magnitudeSlot α = slot magnitudeSym 1 magnitude α.magnitude (pure ∘ UpdateAttributeMagnitude)

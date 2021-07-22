module Atom where

-- The primary problem unit. Atoms are sorted into Groups according to their Attributes

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
import Components.Attribute (Attribute, AttributeOutput(..), attribute, attributeSym)
import Components.Attributes (Attributes, attributes, attributesSym)
import Components.Label (Label, LabelOutput(..), label, labelSym)
import Components.Magnitude (Magnitude, MagnitudeOutput(..), defaultMagnitude, magnitude, magnitudeSym)

type AtomState = {num ∷ Int, label ∷ Label, attributes ∷ Attributes }

data AtomAction = GetAtom AtomState
                | UpdateAtomLabel LabelOutput
                | UpdateAttributes Attributes
                | KillAtom

atomSym = SProxy ∷ SProxy "atom"

atom = component' i r a e
  where
    i = identity
    a = H.raise
    r α = HH.li [class' "atom"] []
    e = const Nothing
    labelSlot α = HH.slot atomSym 0 label α.label pure

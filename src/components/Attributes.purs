module Components.Attributes (Attributes, attributes, attributesSym, defaultAttributes) where

-- A list of all Attribute entries for an Atom

import Prelude (($), pure, show)
import Data.Const (Const)
import Data.Function (const)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Data.Unit (Unit)
import Data.Void (Void)
import Halogen (Component, get, modify_, raise)
import Halogen.HTML (HTML, button, slot, text, ul)
import Halogen.HTML.Events (onClick)
import Components.Attribute (Attribute, AttributeOutput(..), attribute, attributeSym, defaultAttribute)
import Helpers ((∘), (◁), (◇), addNth, class', component', deleteNth, reorder, updateNth)

type Attributes = Array Attribute

attributesSym = SProxy ∷ SProxy "attributes"

defaultAttributes = [defaultAttribute] ∷ Attributes

attributes ∷ ∀ m. Component HTML (Const Void) Unit Void m
attributes = component' i r a e
  where
    i = const defaultAttributes
    a AddAttribute         = modify_ $ addNth defaultAttribute
    a (UpdateAttributeN α) = modify_ $ updateNth α
    a (KillAttributeN   α) = modify_ $ deleteNth α
    e = const Nothing
    r α = ul [class' "attributes"] ((mkSlots α) ◇ [addButton, text $ show α])
    mkSlot α  = slot attributeSym α.num attribute α pure
    mkSlots   = mkSlot ◁ reorder
    addButton = button [class' "attributeAdd", onClick (pure ∘ const AddAttribute)] [text "+"]


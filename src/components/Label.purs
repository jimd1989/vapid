module Components.Label (Label, LabelOutput(..), label, labelSym) where

-- A text label on an Attribute

import Prelude (($), pure)
import Data.Const (Const)
import Data.Function (const)
import Data.Symbol (SProxy(..))
import Data.Void (Void)
import Halogen (Component, modify_, raise)
import Halogen.HTML (HTML, input)
import Halogen.HTML.Events (onValueInput)
import Halogen.HTML.Properties (value)
import Helpers ((∘), class', component')

type Label = String

data LabelAction = GetLabel Label
                 | UpdateLabel Label

data LabelOutput = RaiseLabel Label

labelSym = SProxy ∷ SProxy "label"

label ∷ ∀ m. Component HTML (Const Void) Label LabelOutput m
label = component' i r a e
  where
    i = const $ ""
    a (GetLabel α   ) = modify_ $ const α
    a (UpdateLabel α) = raise   $ RaiseLabel α
    e = pure ∘ GetLabel
    r α = input [class' "atomLabel", value α, onValueInput (pure ∘ UpdateLabel)]


module Components.Magnitude (Magnitude, MagnitudeOutput(..), defaultMagnitude, magnitude, magnitudeSym) where

-- A numerical value associated with an Attribute

import Prelude (($), pure, show)
import Data.Const (Const)
import Data.Either (Either(..))
import Data.Function (const)
import Data.Int (fromString)
import Data.Symbol (SProxy(..))
import Data.Void (Void)
import Halogen (Component, modify_, raise)
import Halogen.HTML (HTML, input)
import Halogen.HTML.Events (onValueInput)
import Halogen.HTML.Properties (value, placeholder)
import Helpers ((∘), class', component', decode)

type Magnitude = Either String Int

data MagnitudeAction = GetMagnitude Magnitude
                     | UpdateMagnitude Magnitude

data MagnitudeOutput = RaiseMagnitude Magnitude

magnitudeSym = SProxy ∷ SProxy "magnitude"

defaultMagnitude = Right 1 ∷ Magnitude

magnitude ∷ ∀ m. Component HTML (Const Void) Magnitude MagnitudeOutput m
magnitude = component' i r a e
  where
    i = const $ defaultMagnitude
    a (GetMagnitude    α) = modify_ $ const α
    a (UpdateMagnitude α) = raise   $ RaiseMagnitude α
    e = pure ∘ GetMagnitude
    r (Left  α) = input [class' "magnitudeError", value α, placeholder "integer", onValueInput parse]
    r (Right α) = input [class' "magnitude", value $ show α, onValueInput parse]
    parse = pure ∘ UpdateMagnitude ∘ decode fromString

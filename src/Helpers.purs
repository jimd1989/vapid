module Helpers where

import Prelude (($), compose)
import Control.Apply (apply)
import Control.Bind (composeKleisliFlipped)
import Data.Functor (class Functor, map, mapFlipped)
import Data.Ord (lessThanOrEq, greaterThanOrEq)
import Data.Semigroup (append)
import Data.Unit (Unit)
import Halogen as H
import Halogen.Component as HC
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Query.HalogenM as HQ

class' ∷ ∀ a b. String → HP.IProp (class ∷ String | b) a
class' α = HP.class_ $ HH.ClassName α

component' ∷ ∀ a b c d e f g h. 
  (e → b) → (b → c (HC.ComponentSlot c a g d) d) → (d → HQ.HalogenM b d a h g Unit) → H.Component c f e h g
component' α β ω = H.mkComponent { initialState, render, eval: H.mkEval H.defaultEval { handleAction = handleAction }}
  where initialState = α
        render = β
        handleAction = ω

mapCompose ∷ ∀ a b c f. Functor f ⇒ (a → b) → (c → f a) → c → f b
mapCompose f = compose (map f)

-- Digraph Dw
infixr 5 append as ◇

-- Digraph Ob
infixr 9 compose as ∘

-- Digraph Tl = ◁
infixr 9 mapCompose as ◁

-- Digraph PL = ◀
infixr 1 composeKleisliFlipped as ◀

-- Digraph 0.
infixl 4 map as ⊙

-- dig mr 8854
infixl 1 mapFlipped as ⊖

-- Digraph 0M
infixl 4 apply as ●

-- Digraph =<
infixl 4 lessThanOrEq as ≤

-- Digraph >=
infixl 4 greaterThanOrEq as ≥

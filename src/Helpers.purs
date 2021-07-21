module Helpers where

import Prelude (($), (-), add, compose, flip)
import Control.Apply (apply, lift2)
import Control.Bind (composeKleisliFlipped)
import Data.Array (drop, length, range, snoc, take, updateAtIndices, zip)
import Data.Either (Either, note)
import Data.Functor (class Functor, map, mapFlipped)
import Data.Maybe (Maybe)
import Data.Ord (lessThanOrEq, greaterThanOrEq)
import Data.Semigroup (append)
import Data.Tuple (Tuple(..), uncurry)
import Data.Unit (Unit)
import Halogen as H
import Halogen.Component as HC
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

class' ∷ ∀ a b. String → HP.IProp (class ∷ String | b) a
class' α = HP.class_ $ HH.ClassName α

component' ∷ ∀ a b c d e f g h. (f → d) → (d → e (HC.ComponentSlot e c a g) g) 
             → (g → H.HalogenM d g c b a Unit) → (f → Maybe g) → H.Component e h f b a
component' α β γ ω = H.mkComponent { initialState: α, render: β, 
                                      eval: H.mkEval H.defaultEval { handleAction = γ, receive = ω } }

fork ∷ ∀ a b c d. (a → b → c) → (d → a) → (d → b) → d → c
fork = lift2

mapCompose ∷ ∀ a b c f. Functor f ⇒ (a → b) → (c → f a) → c → f b
mapCompose f = compose (map f)

blackbird ∷ ∀ a b c d. (c → d) → (a → b → c) → a → b → d
blackbird = (∘) ∘ (∘)

decode ∷ ∀ a. (String → Maybe a) → String → Either String a
decode f = note ● f

enumerate ∷ ∀ a. Array a → Array (Tuple a Int)
enumerate = zip ● (range 0 ∘ (_ - 1) ∘ length)

withIndices ∷ ∀ a b. (a → Int → b) → Array a → Array b
withIndices f = (uncurry f) ◁ enumerate

reorder ∷ ∀ a. Array { num ∷ Int | a } → Array { num ∷ Int | a }
reorder = withIndices (_{num = _})

addNth ∷ ∀ a. { num ∷ Int | a } → Array { num ∷ Int | a } → Array { num ∷ Int | a }
addNth = reorder ... flip snoc

updateNth ∷ ∀ a. { num ∷ Int | a } → Array { num ∷ Int | a } → Array { num ∷ Int | a }
updateNth α = reorder ∘ updateAtIndices [(Tuple α.num α)]

deleteNth ∷ ∀ a. { num ∷ Int | a } → Array { num ∷ Int | a } → Array { num ∷ Int | a }
deleteNth = reorder ... fork append (take ∘ _.num) (drop ∘ add 1 ∘ _.num)

infixr 8 blackbird as ...

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

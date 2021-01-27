module Main where

import Prelude
import Atom (attribute)
import Effect (Effect)
import Halogen.Aff as HA
import Halogen.VDom.Driver (runUI)

main ∷ Effect Unit
main = HA.runHalogenAff do
  body <- HA.awaitBody
  runUI attribute unit body

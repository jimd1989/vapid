import { plus } from '../output/Mathy'
import { main } from '../output/Main'

const component = () => {
  const element = document.createElement('div');
  const a = parseInt(document.getElementById('p-a').innerHTML);
  const b = parseInt(document.getElementById('p-b').innerHTML);
  element.innerHTML = plus(a)(b);
  return element;
}

document.body.appendChild(component());
console.log(main());

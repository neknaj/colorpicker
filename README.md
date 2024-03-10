# Color Picker
A simple color picker for the web implemented in javascript

## Usage
### Init
```js
function ColorPicker(colorpicker,handleSize,margin)
```
`colorpicker`: html canvas element for color picker (HTMLCanvasElement)  
`handleSize`: Handle size (Number)  
`margin`: Margin size within the UI (Number)  
### Events
`changeColor`: when the color is changed  

## Sample Code
```html
<script src="colorpicker.js"></script>
<canvas id="colorpicker"></canvas>
<script>
    ColorPicker(document.querySelector("#colorpicker"),40,10);

    document.querySelector("#colorpicker").addEventListener("changeColor",(e)=>{
        console.log("color changed",e.detail);
    })
</script>
```
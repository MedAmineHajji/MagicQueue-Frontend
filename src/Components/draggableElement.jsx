import React from "react";
import useDragger from "../Hooks/useDragger";
import DOMPurify from 'dompurify';
import Draggable from 'react-draggable';


import './devComponentLayout.css';



function DraggableElement(elementObject){

    // useDragger(elementObject.elementObject.element_id);
    
    
    const styleString = elementObject.elementObject.element_style;
    
    // Extracting left and top values using regular expressions
    const leftMatch = styleString.match(/left:\s*(-?\d+)px;/);
    const topMatch = styleString.match(/top:\s*(-?\d+)px;/);

    // console.log(`${leftMatch} \n${topMatch}`)

    let leftValue = 0;
    let topValue = 0;
    
    if (leftMatch && leftMatch[1]) {
      leftValue = parseInt(leftMatch[1]);
    }
    
    if (topMatch && topMatch[1]) {
      topValue = parseInt(topMatch[1]);
    }

    const element_id = elementObject.elementObject.element_id;
    const element_class = elementObject.elementObject.element_class;

    

    return(
        <>
        
        {/* <div id={elementObject.elementObject.element_id} style={stylesObject} className="draggableDiv">
            <div dangerouslySetInnerHTML={{ __html: elementObject.elementObject.element_content }} />
        </div> */}

        <Draggable
            defaultPosition={{x: leftValue, y: topValue}}
            bounds="parent"
        >
            <div id={element_id} className={element_class} style={{display: "inline-block"}}>
                <div  dangerouslySetInnerHTML={{ __html: elementObject.elementObject.element_content }} />
            </div>
        </Draggable>
        
        

        </>
    )

}



export default DraggableElement;
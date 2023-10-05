
////////////////////////////////////////////////////////////////////////////////
//                      API working the DB method                             //
////////////////////////////////////////////////////////////////////////////////


import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './devComponentLayout.css'
import axios from 'axios';
import DOMPurify from 'dompurify';

const DraggableElement = React.lazy(
    () => import('./draggableElement')
);

const API_url = 'http://localhost:8000/api/';


function DevComponent(){


    
//Having an error saying that functional components can-t have string refs
//and the problem here is from the <HTMLDivElement>

    // const containerRef = useRef<HTMLDivElement>(null);
    // const boxRef = useRef<HTMLDivElement>(null);
    
    

    const buttonClicked = () => {


        arrayOfElementsData.map((elementObject) => {

            const divElement = document.getElementById(elementObject.element_id);

            if (divElement) {
                const divStyle = divElement.style.transform;
                const translateMatch = divStyle.match(/translate\((\d+)px,\s*(\d+)px\)/);
        
                let translateX = 0;
                let translateY = 0;
        
                if (translateMatch && translateMatch.length >= 3) {
                  translateX = parseInt(translateMatch[1]);
                  translateY = parseInt(translateMatch[2]);
                }
        
                console.log(`Div ID: ${elementObject.element_id}`);
                console.log(`TranslateX: ${translateX}px`);
                console.log(`TranslateY: ${translateY}px`);
              }
        })

        // const divStyle = 'text-align: center;transform: translate(499px, 93px); helloworld:23px;';
        // const translateMatch = divStyle.match(/translate\((\d+)px,\s*(\d+)px\)/);

        // let translateX = 0;
        // let translateY = 0;

        // if (translateMatch && translateMatch.length >= 3) {
        //     translateX = parseInt(translateMatch[1]);
        //     translateY = parseInt(translateMatch[2]);
        // }


        //print all the content of the box
        const containerHTML = document.getElementById("p");
        console.log(containerHTML);
    }

//getting the query param passed in the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const template_id = queryParams.get('template_id');
    // console.log(template_id);


    const [templateContent, setTemplateContent] = useState(null);
    const [arrayOfElementsData, setArrayOfElementsData] = useState(null);
    const updatedArrayOfElementsData = [];

//fetching data from API using the templateName variable
    useEffect(() => {
        const fetchTemplateDataByName = async () => {
            
            await axios.get(API_url + `templates/${template_id}`).then(
                (result) => {
                    setTemplateContent(result.data);
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            )
        };

        const fetchArrayOfElementsDataByTemplateId = async () => {
            await axios.get(API_url + `templates/${template_id}/elements/get`).then(
                (result) => {
                    setArrayOfElementsData(result.data);
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            )
        }
        
        fetchTemplateDataByName();
        fetchArrayOfElementsDataByTemplateId();
    },[])

    

    const sanitizedHTML = DOMPurify.sanitize(templateContent);

    if(!arrayOfElementsData){
        return(
            <>
            Chargement....
            </>
        )
    }
    return(
        <>
        {/* <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} /> */}
             <main>
                <div id="p" className="container">
                    {arrayOfElementsData.map((elementObjectData) => (
                        <DraggableElement 
                            key={elementObjectData.element_id}
                            elementObject={elementObjectData}
                        />
                    ))}
                </div>
                
                <button onClick={buttonClicked}>
                    click me
                </button>
            </main>
            </>
        )
};


export default DevComponent;

{/* <main>
    <div ref={ containerRef } className="container">
        <div ref={ boxRef } className='draggableDiv'>
            Drag me wherever you want
        </div>
        <div ref={ boxRef1 } className="box1">

        </div>
    </div>
    <button onClick={buttonClicked}>
        click me
    </button>
</main> */}



// ////////////////////////////////////////////////////////////////////////////////
// //                      Dev APIs of Front-side React App                      //
// ////////////////////////////////////////////////////////////////////////////////

const start = 0;
// import { useEffect, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import './devComponentLayout.css'
// import axios from 'axios';
// import DOMPurify from 'dompurify';



// const API_url = 'http://localhost:8000/api/';


// function DevComponent(){


// //Fetching the all templates Data API : getTemplates 
//     // const [templatesDataArray, setTemplatesDataArray] = useState(null);
//     // useEffect( () => {
//     //     const fetchAllTemplatesData = async () => {
//     //         await axios.get(API_url + 'getTemplates').then(
//     //             (result) => {
//     //                 setTemplatesDataArray(result.data);
//     //             }
//     //         ).catch(
//     //             (error) => {
//     //                 console.log(error);
//     //             }
//     //         )
//     //     };

//     //     fetchAllTemplatesData();
//     // }, [])

//     // if(templatesDataArray){
//     //     return(
//     //         <>
//     //         {templatesDataArray.map( (singleTemplate, indexTemplate) => (
//     //             <>
//     //                 {singleTemplate.templateName}
//     //             </>
//     //         ) )}
//     //         </>
//     //     )
//     // }else{
//     //     return(
//     //         <>
//     //         Chargement....

//     //         </>
//     //     )
//     // }



//     const containerRef = useRef(null);
//     const boxRef = useRef(null);
//     const boxRef1 = useRef(null);
// //Having an error saying that functional components can-t have string refs
// //and the problem here is from the <HTMLDivElement>

//     // const containerRef = useRef<HTMLDivElement>(null);
//     // const boxRef = useRef<HTMLDivElement>(null);
//     const isClicked = useRef(false);

//     const cords = useRef({
//         startX: 0,
//         startY: 0,
//         lastX: 0,
//         lastY: 0
//     });

//     const buttonClicked = () => {
//         const containerHTML = containerRef.current.innerHTML;

//         console.log(containerHTML);
//     }

//     useEffect(() => {
//         if(!boxRef.current || !containerRef.current ) return;

//         const box = boxRef.current;
//         const container = containerRef.current;

//         const onMouseDown = (e) => {
//             isClicked.current = true;
//             cords.current.startX = e.clientX;
//             cords.current.startY = e.clientY;
//         };
//         const onMouseUp = () => {
//             isClicked.current = false;
//             cords.current.lastX = box.offsetLeft;
//             cords.current.lastY = box.offsetTop;
//         };
//         const onMouseMove = (e) => {
//             if(!isClicked.current) return;

//             const nextX = e.clientX - cords.current.startX + cords.current.lastX;
//             const nextY = e.clientY - cords.current.startY + cords.current.lastY;

//             box.style.left = `${nextX}px`;
//             box.style.top = `${nextY}px`;
//         };

//         box.addEventListener('mousedown', onMouseDown);
//         box.addEventListener('mouseup', onMouseUp);
//         container.addEventListener('mousemove', onMouseMove);

//         const cleanUp = () => {
//             box.removeEventListener('mousedown', onMouseDown);
//             box.removeEventListener('mouseup', onMouseUp);
//             container.removeEventListener('mousemove', onMouseMove);
//         }
        
//         return cleanUp;

//     }, []);
    


// //getting the query param passed in the URL
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const templateName = queryParams.get('template');


//     const [templateContent, setTemplateContent] = useState(null);

// //fetching data from API using the templateName variable
//     useEffect(() => {
//         const fetchTemplateDataByName = async () => {
            
//             await axios.get(API_url + `templates/getByName/${templateName}`).then(
//                 (result) => {
//                     setTemplateContent(result.data.templateContent);
//                 }
//             ).catch(
//                 (error) => {
//                     console.log(error);
//                 }
//             )
//         };

//         fetchTemplateDataByName();
//     },[])


//     const sanitizedHTML = DOMPurify.sanitize(templateContent);
//     return(
//         <>
//          <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
//          <main>
//     <div ref={ containerRef } className="container">
//         <div ref={ boxRef } className='draggableDiv'>
//         <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
//         </div>
//         <div ref={ boxRef1 } className="box1">

//         </div>
//     </div>
//     <button onClick={buttonClicked}>
//         click me
//     </button>
// </main>
//         </>
//     )
// };


// export default DevComponent;

// {/* <main>
//     <div ref={ containerRef } className="container">
//         <div ref={ boxRef } className='draggableDiv'>
//             Drag me wherever you want
//         </div>
//         <div ref={ boxRef1 } className="box1">

//         </div>
//     </div>
//     <button onClick={buttonClicked}>
//         click me
//     </button>
// </main> */}
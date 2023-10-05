import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { Button, Divider, Grid, MenuItem, Modal, Select } from "@mui/material";
import { createTheme, ThemeProvider  } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { FormControl, InputLabel, Input, FormHelperText } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';

import ModalComponent from "../../Components/Modal/modalComponent";
import Draggable from "react-draggable";

const HeaderComponent = React.lazy(
    () => import('../../Components/headerComponent')
);
const FooterComponent = React.lazy(
    () => import('../../Components/footerComponent')
);
const DraggableElement = React.lazy(
    () => import('../../Components/draggableElement')
);
const ElementsGrid = React.lazy(
    () => import('../../Components/elementGrid')
);


const API_url = 'http://localhost:8000/api/';

function reloadPage() {
    window.location.reload();
}

function cmToPixels(centimeter) {
    const res = centimeter * 37.7952755906;
    return res;
}
function PixelsToCm(pixels){
    const res = pixels / 37.7952755906;
    return parseInt(res);
}

const theme = createTheme({
    palette: {
        yellow: {
            main: '#E3D026',
            light: '#E9DB5D',
            dark: '#A29415',
            contrastText: '#242105',
        },
        primary: {
            light: blue[300],
            main: blue[500],
            dark: blue[700],
            darker: blue[900],
        },
    },
  });


function EditComponent(){


    const adminConnected = true
    const {id} = useParams();

    const [templateContent, setTemplateContent] = useState(null);
    const [arrayOfElementsData, setArrayOfElementsData] = useState(null);
    // const updatedArrayOfElementsData = [];

    const [openModal, setOpenModal] = useState(false);
    const [openModalAddElement, setOpenModalAddElement] = useState(false);
    const [openModalChangeDim, setOpenModalChangeDim] = useState(false);
    const [newElementIdentifier, setNewElementIdentifier] = useState('');
    const [errorNewElementIdentifier, setErrorNewElementIdentifier] = useState('');

    const [dimensionsArray, setDimensionsArray] = useState(null);
    const [idDimension, setIdDimension] = useState();
    const [dimensionOfTemplate, setDimensionOfTemplate] = useState(null);
    const handleWidthChange = (event) => {
        setIdDimension(event.target.value)
        console.log(idDimension)
    }

    const [idLogo, setIdLogo] = useState(null);
    const [openModalUploadLogo, setOpenModalUploadLogo] = useState(false);
    const [logoIdentifier, setLogoIdentifier] = useState('');
    const [logoName, setLogoName] = useState('');
    const [logoFile, setLogoFile] = useState(null);

    const [oldIdLogo, setOldIdLogo] = useState(null);
    const [oldLogoFile, setOldLogoFile] = useState(null);


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setLogoFile(selectedFile);
        // console.log(logoFile)
    }


    const editorRef = useRef(null);

    const isIdentifierUnique = (newIdentifier) => {

        let res = true;
        arrayOfElementsData.forEach(element => {
            if(element.element_id == newIdentifier){
                res = false;
            }
        });
        return res;
    }
    const addNewElementConfirmButtonClicked = async () => {
        if (editorRef.current) {
            let contentNewEelement = editorRef.current.getContent();
            
            if(!newElementIdentifier){
                setErrorNewElementIdentifier('identifier is required');
            }else if(!isIdentifierUnique(newElementIdentifier)){
                setErrorNewElementIdentifier('identifier exists. Identifier must be unique');
            }else {
                setErrorNewElementIdentifier('');
                const newElementData = {
                    identifier: newElementIdentifier,
                    class: "auto-sized-div",
                    style: "left: 0px; top: 0px;",
                    content: contentNewEelement,
                    template_id: parseInt(id),
                    // hidden: true
                }
                await axios.post(API_url + "elements/create", newElementData).then(
                    (res) => {
                        fetchArrayOfElementsDataByTemplateId();
                        setOpenModalAddElement(false);
                        setErrorNewElementIdentifier('');
                        setNewElementIdentifier('');
                    }
                ).catch(
                    (error) => console.log(error)
                )
            }
        }
    };

    // const updatedArrayOfElementsData = () => {

    // }

    const buttonClicked = () => {

        arrayOfElementsData.map( async (elementObject) => {

            const divElement = document.getElementById(elementObject.element_id);
            
            if (divElement) {

                
                const divStyle = divElement.style.transform;
                
                const translateMatch = divStyle.match(/translate\((-?\d+)px,\s*(-?\d+)px\)/);
                const elementMatch = elementObject.element_style.match(/left:\s*(-?\d+)px;\s*top:\s*(-?\d+)px;/);

                let translateX = 0;
                let translateY = 0;

                let oldTranslateX = parseInt(elementMatch[1]);
                let oldTranslateY = parseInt(elementMatch[2]);
        
                if (translateMatch && translateMatch.length >= 3) {
                    translateX = parseInt(translateMatch[1]);
                    translateY = parseInt(translateMatch[2]);

                    if(translateX != oldTranslateX || oldTranslateY != translateY){
                        const styleObject = {
                            left: translateX,
                            top: translateY
                        }
                        await axios.put(API_url + `element/update/${elementObject.element_ID}`, styleObject).then(
                            (result) => {
                                console.log("Element updated successfully");
                                reloadPage();
                            }
                        ).catch(
                            (error) => console.log(error)
                        ); 
                    }
                    
                }
        
                // console.log(`Div ID: ${elementObject.element_id}`);
                // console.log(`TranslateX: ${translateX}px`);
                // console.log(`TranslateY: ${translateY}px`);
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
        // const containerHTML = document.getElementById("p");
        // console.log(arrayOfElementsData);
    }

    const buttonConfirmChangeDimensionClicked = async () => {

        await axios.put(API_url + `template/${id}/updateDim`, {
            "id_dimension": idDimension
        }).then(
            (res) => {
                fetchTemplateDataById();
                setOpenModalChangeDim(false);
            }
        ).catch(
            (error) => console.log(error)
        )
    }

    const buttonConfirmAddLogoClicked = async () => {

        const formData = new FormData();
        // Append your form fields to the FormData object
        formData.append('logo_name', logoName);
        formData.append('logo_id', logoIdentifier);
        formData.append('template_id', id);
        formData.append('logo', logoFile);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        await axios.post(API_url + `logo/upload`, formData, config).then(
            (res) => {
                fetchTemplateDataById();
                setOpenModalUploadLogo(false);
                setLogoFile(null);
                setLogoIdentifier('');
                setLogoName('');
            }
        ).catch(
            (error) => console.log(error)
        )
    }

    const buttonUpdateLogoClicked = async () => {

        const updateFormData = new FormData();

        updateFormData.append('logo_name', logoName);
        updateFormData.append('logo', logoFile);

        updateFormData.forEach((value, key) => {
            console.log(key, value);
          });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        await axios.put(API_url + `logo/update/${idLogo}`, updateFormData, config).then(
            (res) => {
                console.log('nrmlmnt cbn')
            }
        ).catch(
            (error) => console.log(error)
        )
        
    }


//All the fetch Data from Back End functions here
    const fetchTemplateDataById = async () => {
            
        await axios.get(API_url + `templates/${id}`).then(
            (result) => {
                setTemplateContent(result.data.content);
                setDimensionOfTemplate({
                    'dimension_name': result.data.dimension_name,
                    'dimension_width': result.data.dimension_width,
                    'dimension_height': result.data.dimension_height
                });
                setIdLogo(result.data.logo_id);
                setOldIdLogo(result.data.logo_id);
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
    };

    const fetchArrayOfElementsDataByTemplateId = async () => {
        await axios.get(API_url + `templates/${id}/elements/get`).then(
            (result) => {
                setArrayOfElementsData(result.data);
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    };

    const fetchArrayOfDimensionsData = async () => {
        await axios.get(API_url + 'dimension/getAll').then(
            (res) => setDimensionsArray(res.data)
        ).catch(
            (error) => console.log(error)
        )
    };

    


//fetching data from API using the id variable
    useEffect(() => {
        
        
        fetchTemplateDataById();
        fetchArrayOfElementsDataByTemplateId();
        fetchArrayOfDimensionsData();
        
    },[]);


    

    if(!arrayOfElementsData || !dimensionsArray){
        return(
            <>
            Chargement....
            </>
        )
    }
    
    const sanitizedHTML = DOMPurify.sanitize(templateContent);

    return(
        <>
        <HeaderComponent adminConnected={adminConnected} />

{/* Buttons on the top of the page */}
        <Grid container justifyContent="flex-end" alignItems="flex-start" spacing={2} >
    {/* Button of the Upload/Replace Logo */}
            {idLogo ? (
                <>
                <Grid item >
                    <ThemeProvider theme={ theme }>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpenModalUploadLogo(true)}
                            sx={{ bgcolor: `primary.dark` }}
                        >
                            Update Logo
                        </Button>
                    </ThemeProvider>
                </Grid>
                </>
            ):(
                <>
                <Grid item >
                    <ThemeProvider theme={ theme }>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpenModalUploadLogo(true)}
                            sx={{ bgcolor: `primary.dark` }}
                        >
                            Upload Logo
                        </Button>
                    </ThemeProvider>
                </Grid>
                </>
            )}
            
            <Grid item >
                <ThemeProvider theme={ theme }>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenModalChangeDim(true) }
                        sx={{ bgcolor: `primary.dark` }}
                    >
                        Change Ticket Dimensions
                    </Button>
                </ThemeProvider>
                
            </Grid>
            <Grid item >
                <ThemeProvider theme={ theme }>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenModalAddElement(true)}
                        sx={{ bgcolor: `primary.dark` }}
                    >
                        Add new Element
                    </Button>
                </ThemeProvider>
            </Grid>
        </Grid>

{/* Display of different Element of the current Template */}

        Logo : 
        <Grid container alignItems="center">
            <Grid item xs={3}>
                {idLogo ? (
                    <img src={`http://localhost:8000/api/logo/getFile/${idLogo}`} style={{ maxWidth: '40%', height: 'auto' }} />
                ): (
                    <>
                    No current logo, upload a file.
                    </>
                )}
                
            </Grid>
            
        </Grid>


        <Grid container spacing={2} alignItems="center">
            
            {arrayOfElementsData.map((elementObjectData) => (
                <>
                    <Grid item xs={4} >
                        <ElementsGrid elementData={elementObjectData}/>
                    </Grid>
                </>
            ))}
            
        </Grid>
        


{/* <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} /> */}
        <div id="p" 
            className="container"
            style={ {
                width: dimensionOfTemplate.dimension_width,
                height: dimensionOfTemplate.dimension_height
            }}
        >
            {arrayOfElementsData.map((elementObjectData) => (

                !elementObjectData.element_is_hidden ? (
                    <>
                        <DraggableElement 
                            key={elementObjectData.element_id}
                            elementObject={elementObjectData}
                            parentContainerWidth={dimensionOfTemplate.dimension_width}
                            parentContainerHeight={dimensionOfTemplate.dimension_height}
                        />
                    </>
                ): (
                    <>
                    </>
                )
                        
            ))}
            <Draggable
                axis="both"
                defaultPosition={{x: "50px", y: "50px"}}
            >
                {/* {idLogo ? (
                    <img src={`http://localhost:8000/api/logo/getFile/${idLogo}`} style={{ maxWidth: '30%', height: 'auto' }} />
                ): (
                    <>
                    No current logo, upload a file.
                    </>
                )} */}
                <img src={`http://localhost:8000/api/logo/getFile/${idLogo}`} style={{ maxWidth: '30%', height: 'auto' }} />
                
            </Draggable>
        </div>
                
        <Button
            variant="outlined"
            color="success"
            onClick={() => setOpenModal(true)}
        >
            Update
        </Button>

{/* this is the pop up of the confirmation of the update of template */}
        <ModalComponent
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
        >
            <Modal.Header>
                Update Template
            </Modal.Header>

            <Modal.Body>
                Are you sure to update the Template?
            </Modal.Body>

            <Modal.Footer>
                        
                <button className="btn-primary" onClick={buttonClicked}>Confirm</button>
                <Modal.DismissButton className="btn-danger">Cancel</Modal.DismissButton>

            </Modal.Footer>
                    
        </ModalComponent>
{/* Changing the Dimensions of the Template Popup */}
        <ModalComponent
            isOpen={openModalChangeDim}
            onClose={() => setOpenModalChangeDim(false)}
        >
            <Modal.Header>
                Choose Your Ticket Dimensions
            </Modal.Header>

            <Modal.Body>
                <FormControl fullWidth>
                    <InputLabel id="width">Dimension (cm)</InputLabel>
                    <Select
                        labelId="width"
                        id="width-select"
                        value={idDimension}
                        label="Dimension (cm) "
                        onChange={handleWidthChange}
                    >
                        {dimensionsArray.map( (dimension, index) => (
                            <MenuItem value={index+1}>
                                {PixelsToCm(dimension.dimension_height)} x {PixelsToCm(dimension.dimension_width)}
                            </MenuItem>
                        ))}
                        
                    </Select>
                </FormControl>
            </Modal.Body>

            <Modal.Footer>
                <button className="btn-primary" onClick={buttonConfirmChangeDimensionClicked}>Confirm</button>
                <Modal.DismissButton className="btn-danger">Cancel</Modal.DismissButton>
            </Modal.Footer>
        </ModalComponent>
{/* Need to Implement a NEW Add New Element Popup of confirmation and data control */}
        <ModalComponent>

        </ModalComponent>
{/* Upload/Update Logo popup */}
        <ModalComponent
            isOpen={openModalUploadLogo}
            onClose={() => setOpenModalUploadLogo(false)}
        >

            <Modal.Header>
                {idLogo ? (
                    <>
                    Update your logo Here
                    </>
                ):(
                    <>
                    Upload your logo Here
                    </>
                )}
            </Modal.Header>

            <Modal.Body>

                {idLogo ? (<></>):(
                    <>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="logo-identifier">Unique Identifier of the Logo</InputLabel>
                            <Input
                                id="logo-identifier"
                                type="text"
                                value={logoIdentifier}
                                onChange={(e) => setLogoIdentifier(e.target.value)}
                                required
                            />
                        </FormControl>
                    </>
                )}
                <FormControl fullWidth style={{marginTop: '10px'}}>
                    <InputLabel htmlFor="logo-name">Name of the Logo</InputLabel>
                    <Input
                        id="logo-name"
                        type="text"
                        value={logoName}
                        onChange={(e) => setLogoName(e.target.value)}
                        required
                    />
                </FormControl>
                <InputLabel htmlFor='logo-file'>Upload your File here</InputLabel>
                <FormControl>
                    <Input
                        id="logo-file"
                        type="file"
                        accept=".jpg, .jpeg, .png" // Specify the allowed file types
                        onChange={handleFileChange}
                        required
                    />
                </FormControl>


            </Modal.Body>

            <Modal.Footer>
                {idLogo ? (
                    <>
                    <button className="btn-primary" onClick={buttonUpdateLogoClicked}>Update</button>
                    </>
                ):(
                    <>
                    <button className="btn-primary" onClick={buttonConfirmAddLogoClicked}>Confirm</button>
                    </>
                )}
                <Modal.DismissButton className="btn-danger">Cancel</Modal.DismissButton>
            </Modal.Footer>

        </ModalComponent>


    

        <FooterComponent />
        </>
    )
}


export default EditComponent;
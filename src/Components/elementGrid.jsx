import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { Card, CardActionArea, CardContent, Button, CardActions, Modal } from "@mui/material";
import Typography from '@mui/material/Typography';
import ModalComponent from "./Modal/modalComponent";
import { Editor } from '@tinymce/tinymce-react';
import axios from "axios";



const API_url = 'http://localhost:8000/api/';

function reloadPage() {
    window.location.reload();
}

function ElementsGrid(props){

    // console.log(props)

    const [openModal, setOpenModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [confirmDisabled, setConfirmDisabled] = useState(true);
    
    const editorRef = useRef(null);

    const confirmEditElement = async () => {

        if (editorRef.current) {

            let contentNewEelement = editorRef.current.getContent();
            if(contentNewEelement){
                const elementEditingData = {
                    content: contentNewEelement
                };

                await axios.put(API_url + `element/updateContent/${props.elementData.element_ID}`, 
                                elementEditingData).then(
                                    (res) => reloadPage()
                                ).catch(
                                    (error) => console.log(error)
                                )
            }else{
                console.log("failed")
            }
        }
    };

    const buttonAddToTemplateClicked = async () => {

        await axios.put(API_url + `element/makeVisible/${props.elementData.element_ID}`).then(
            (res) => reloadPage()
        ).catch(
            (error) => console.log(error)
        );
    };

    const buttonDeleteFromTemplateClicked = async () => {

        await axios.put(API_url + `element/makeHidden/${props.elementData.element_ID}`).then(
            (res) => reloadPage()
        ).catch(
            (error) => console.log(error)
        );
    }

    const deleteElementConfirmButtonClicked = async () => {

        await axios.delete(API_url + `element/deleteElement/${props.elementData.element_ID}`).then(
            (res) => reloadPage()
        ).catch(
            (error) => console.log(error)
        )
    }

    const sanitizedHTML = DOMPurify.sanitize(props.elementData.element_content);
    
    return(
        <>
        <Card>
            <CardActionArea>
                <CardContent>
                    {/* <Typography gutterBottom variant="h5" component="div">
                        Lizard
                    </Typography> */}
                    <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
                </CardContent>
            </CardActionArea>

            <CardActions>
                <Button size="small" color="primary" onClick={() => setOpenModal(true)}>
                    Edit
                </Button>

                {props.elementData.element_is_hidden ? (
                    <>
                    <Button size="small" color="primary" onClick={buttonAddToTemplateClicked}>
                        Add To Template
                    </Button>
                    </>
                ): (
                    <>
                    <Button size="small" color="error" onClick={buttonDeleteFromTemplateClicked}>
                        Remove from Template
                    </Button>
                    </>
                )}
                

                <Button size="small" color="error" onClick={() => setOpenConfirmationModal(true)}>
                    delete
                </Button>
            </CardActions>
        </Card>
        
    {/* this is the popup of editing an element */}
        <ModalComponent
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
        >
            <Modal.Header>Edit Element</Modal.Header>

            <Modal.Body>
                <Card>
                    <CardActionArea>
                        <CardContent>
                            <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
                        </CardContent>
                    </CardActionArea>
                </Card>
                
                <Editor
                    apiKey='nqb1bllnspltyhyh6wv4yvpd7ghba90fw3l3ju9qltgtjjl8'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={sanitizedHTML}
                    init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
                
            </Modal.Body>

            <Modal.Footer>
                <button
                    className="btn-primary"
                    onClick={confirmEditElement}
                    // disabled={confirmDisabled}
                >Confirm</button>

                <Modal.DismissButton className="btn-danger">Cancel</Modal.DismissButton>
            </Modal.Footer>
                    
        </ModalComponent>
    
    {/* this is the popup of deleting an element */}
                    
        <ModalComponent
            isOpen={openConfirmationModal}
            onClose={() => setOpenConfirmationModal(false)}
        >
            
            <Modal.Header>
                Delete Element
            </Modal.Header>

            <Modal.Body>
                Are you sure to delete this Element from this Template?
            </Modal.Body>

            <Modal.Footer>
                <button className="btn-primary" onClick={deleteElementConfirmButtonClicked}>Confirm</button>
                <Modal.DismissButton className="btn-danger">Cancel</Modal.DismissButton>
            </Modal.Footer>

        </ModalComponent>
        </>
    )
}


export default ElementsGrid;
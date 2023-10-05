import React, { useEffect, useRef } from "react";

function useDragger(id){

    const isClicked = useRef(false);

    const cords = useRef({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    });

    

    useEffect(() => {
        
        const target = document.getElementById(id);

        if(target !=null){
            const container = target.parentElement;
            const onMouseDown = (e) => {
                isClicked.current = true;
                cords.current.startX = e.clientX;
                cords.current.startY = e.clientY;
            };
            const onMouseUp = () => {
                isClicked.current = false;
                cords.current.lastX = target.offsetLeft;
                cords.current.lastY = target.offsetTop;
            };
            const onMouseMove = (e) => {
                if(!isClicked.current) return;
    
                const nextX = e.clientX - cords.current.startX + cords.current.lastX;
                const nextY = e.clientY - cords.current.startY + cords.current.lastY;
    
                target.style.left = `${nextX}px`;
                target.style.top = `${nextY}px`;
            };
    
            target.addEventListener('mousedown', onMouseDown);
            target.addEventListener('mouseup', onMouseUp);
            container.addEventListener('mousemove', onMouseMove);
    
            const cleanUp = () => {
                target.removeEventListener('mousedown', onMouseDown);
                target.removeEventListener('mouseup', onMouseUp);
                container.removeEventListener('mousemove', onMouseMove);
            }
            return cleanUp;
        }
    },[id]);

}

export default useDragger;
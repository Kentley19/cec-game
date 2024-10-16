import React, { useState,useRef  } from "react";
import ART3RemovebgPreview1 from "./assets/img-art-3-removebg-preview-1.png";
import arrowDropDown from "./assets/img-arrow-drop-down.svg";
import calendarRemovebgPreview1 from "./assets/img-calendar-removebg-preview-1.png";
import notifRemovebgPreview1 from "./assets/img-notif-removebg-preview-1.png";
import playRemovebgPreview1 from "./assets/img-play-removebg-preview-1.png";
import "./assets/style.css";
import upload from "./assets/img-upload.svg"; 
import Recorder from './assets/recording';
import Upload from './components/RecordUploads';
export const Main = () => {

  const [filesSelected, setSelectedFiles] = useState([]);
    const editorRef = useRef(null);
    const [tab,setTab]=useState(0);
    const [opt,setOpt]=useState(0);
    const [obj,setObj]=useState(null);
    
  const [fileCurrent, setFileCurrent] = useState(null);  
  
  const [post, setPost] = useState([]);
  const [newContent, setNewContent] = useState(''); 

  const handleAddPost = () => {
    // Create a new post
    const newPost = {
      filePath: fileCurrent, // You can modify this to match your logic
      content: newContent,
    };  
    // Update the post state
    setPost([...post, newPost]);
    setNewContent(''); // Clear the input after adding
  };

    const OnclickTab=(e)=>{
        setTab(e);
    }

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        // Optional: Change border style when dragging over
        if (editorRef.current) {
            editorRef.current.style.border = "2px dashed #000";
        }
    };

    const handleDragLeave = () => {
        if (editorRef.current) {
            editorRef.current.style.border = "1px solid #ccc"; // Revert border
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const files = event.dataTransfer.files;

        // Handle only image files
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                
                img.style.maxHeight = '200px'; // Ensure the image fits within the editor
                img.style.display = 'inlineblock'; // Make images block elements
                img.onclick = () => selectElement(img);
                editorRef.current.appendChild(img); // Append the image to the contenteditable div
            };

            reader.readAsDataURL(files[0]); // Convert the image file to a data URL
        } else if (files.length > 0 && files[0].type.startsWith('video/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const video = document.createElement('video'); 
                video.src = e.target.result;
                // video.style.marginLeft='auto';
                // video.style.marginRight='auto';
                video.controls = true; // Add controls for video playback
                video.style.maxWidth = '70%'; // Ensure the video fits within the editor
                
                video.style.cursor = 'pointer';
                video.style.display = 'block'; // Make videos block elements
                video.onclick = () => selectElement(video);
                editorRef.current.appendChild(video);  
                // Append the video to the contenteditable div
            };
            reader.readAsDataURL(files[0]); // Convert the video file to a data URL
        }

        handleDragLeave(); // Reset border style after drop
    };
    const selectElement = (element) => {
        // Remove existing selection
        setObj(element);

    };

    const handleKeyDown = (event) => {
        const selectedElement = obj;
        if (event.key === 'Backspace') {
            // If the selected element is an image or video, remove it
            if (selectedElement && (selectedElement.tagName === 'IMG' || selectedElement.tagName === 'VIDEO')) {
                selectedElement.remove();
                event.preventDefault(); // Prevent the default backspace behavior
            }else{

            }
        }
    };

  return (
    <div className="frame">
      <div className="div">
        <div className="overlap-group"> 
            <div className="leftSide" >
                <div className="leftDiv">
                    <img src={ART3RemovebgPreview1} ></img>
                </div>
                
                <button onClick={(e)=>OnclickTab(0)} className={tab==0?'leftButton p2 active':"leftButton p2"}>
                    <img src={notifRemovebgPreview1} ></img>
                </button>
                <button  onClick={(e)=>OnclickTab(1)} className={tab==1?'leftButton p1 active':"leftButton p1"}>
                    <img src={playRemovebgPreview1} ></img>
                </button>
                <button onClick={(e)=>OnclickTab(2)} className={tab==2?'leftButton p1 active':"leftButton p1"}>
                    <img src={calendarRemovebgPreview1} ></img>
                </button>
            </div>
          <div className="rectangle-3" /> 
          {tab==0?<>
            <div className="text-wrapper-2 ">ClassWork</div> 
            <select onChange={(e)=>setOpt(e.target.value)} className="SelectActivity rectangle-6 " >
              <option value="Announcement">Announcement</option>
            <option value="Activity">Activity</option>
            <option value="Reminder">Reminder</option>
          </select> 
          <div 
            ref={editorRef} contentEditable="true" className="editor text-wrapper-6 textarea" 
            
            style={{  
                overflow: 'auto',
                display:'inline-block', 
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            
            onKeyDown={handleKeyDown} 
            >

          </div>
       
          <button className="text-wrapper-4 button">Cancel</button> 
          <button className="text-wrapper-5 button">Upload</button> 
          
          {opt=="Reminder"?<input type="datetime-local" className="fileSelector"></input>
          :<input type="file" className="fileSelector"></input>}
          </>:tab==1?<>
          <div className="card">
            <Recorder setFileCurrent={setFileCurrent} handleAddPost={handleAddPost}></Recorder>
          </div> 
          <div className="card2">
                <h2>Uploads:  </h2>
                <Upload fileCurrent={fileCurrent} setSelectedFiles={setSelectedFiles} filesSelected={filesSelected} post={post} handleAddPost={handleAddPost} newContent={newContent} setNewContent={setNewContent}></Upload>
            </div>
          </>:<>
          </>
          
        }
           </div>
      </div>
    </div>
  );
};
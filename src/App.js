import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Speech from 'react-speech';
import { Button, Form, Container,  Row, Col} from 'react-bootstrap';
import Index from './index.jpeg';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
function App() {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [describe, setDescribe] = useState();
  const [data, setData] = useState();
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState(...transcript );
  const microphoneRef = useRef(null);
  
  
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div>
       Your browser does not Support Speech Recognition.
      </div>
    );
  }
  const handleListing = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("Listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
   
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("Listening");
    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };
  const resetdata = () => {
   setDescribe(" ");
 
    }
    const resetMessage = () => {
      setMessage(" ");
    
       }
    const printDocument=()=>  {
      const input = document.getElementById('meetcontent');
      html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
        });
        const imgProps= pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('meetingcontent.pdf');
      });
    }
  return (
  
      <Container>
          <img src={Index} className="center" alt="meetdocs" />
          <h3 style={{textAlign:"center"}}>MeetDocs</h3>
          <p style={{textAlign:"center"}}>A meeting website that allows you to take voice notes and write text messages and convey them to others.</p>
          <Row>
            <Col>
              <h5 style={{textAlign:"center",color:"blue"}}>Add Voice Note/ Start Meeting Conversion to Text</h5>
              <Form.Control style={{marginBottom:10}} as="textarea" rows="4" name="description"  value={transcript} />
              <Button style={{marginRight:10, marginBottom:10}} variant="primary" ref={microphoneRef} onClick={handleListing}>
                Start Recognition
              </Button>
              
              {transcript && (
              <div>
                  <Button style={{marginRight:10, marginBottom:10}} variant="success" onClick={handleReset}>
                  Reset the text
                  </Button>
              </div>
              )}
              {isListening && (
                <Button style={{marginRight:10, marginBottom:10}} variant="warning" onClick={stopHandle}>
                  Stop Recognition
                </Button>
              )}
              <div>
                {isListening ? "Listening........." : "Click to start Listening"}
              
              </div>
            </Col>
            <Col >
            <h5 style={{textAlign:"center",color:"blue"}}>Voice Notes</h5>
              <div id="meetcontent"> {message} </div> 
              <Button variant="primary" onClick={printDocument}>Print Text</Button>
              <br/>
              <br/>
              <p style={{textAlign:"center"}}>Editor Box for editing content</p>
              <Form.Control style={{marginBottom:10}} as="textarea" rows="4" name='message' defaultValue={transcript} onChange={e => setMessage(e.target.value)}/>
              <Button variant="primary" onClick={resetMessage}>Clear Editor Content</Button>
      
            </Col>
            <Col>
            <h5 style={{textAlign:"center",color:"blue"}}>Chatbox for asking queries</h5>
              <Form.Control style={{marginBottom:10}} as="textarea" rows="4" name='describe' value={describe} onChange={e => setDescribe(e.target.value)}/>
                <Speech 
                textAsButton={true}    
                displayText="Convert to speech" 
                text={describe} />
        
              <Button variant="primary" onClick={resetdata}>Clear Text</Button>
      
            </Col>
          </Row>
      
        
      </Container>
  );
}
export default App;
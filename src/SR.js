import React from 'react';

class SR extends React.Component
{

    state ={
        //userData:[{picture: 'images/kitten.jpg'}, {picture: 'images/puppy.jpg'}],
        searchedValue: '',
        id: 0
      }
    
    handlePress = async () => {
        console.log("function is called");
        fetch('http://172.20.10.5:5000/testData?title_picture=' + this.state.searchedValue, {
            "method": "GET"
        })
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({userData: responseData,
                            loaded:true})
            
        }, () => {
            console.log(this.state.userData);
        })
    }
    
      handleMic = async () => {
        console.log("function 1 is called");
        var output = document.getElementById("output");
        // get action element reference
        var action = document.getElementById("action");
        var speech = true;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
        const recognition = new SpeechRecognition();
        recognition.interimResults = true;
    
        const words = document.querySelector('.words');
        let p = document.createElement("p");
        words.appendChild(p);
        recognition.onstart = function() {
            action.innerHTML = "<small>listening, please speak...</small>";
        };
        
        recognition.onspeechend = function() {
            action.innerHTML = "<small>stopped listening...</small>";
            recognition.stop();
        }
        recognition.addEventListener('result', e => {
    
        const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
       
        this.state.searchedValue = transcript.slice(0, -1);
        document.getElementById("p").innerHTML = transcript;
        console.log(transcript);
        console.log(this.state.searchedValue);
        
        this.handlePress();    
        });
    
      
    
        recognition.start();
      }

      componentDidMount(){
        //const url = "http://172.20.10.5:5000/user";
        //const response = await fetch(url);
        //const data = await response.json(); 
        //this.setState({userData: data});
        //console.log(this.state.userData);
      }

      render() {
          return (
           <div>
                <p><button onClick={() => this.handleMic()}>Microphone</button>  &nbsp; <span id="action"></span></p>
                <div id="output" class="hide"></div>
                
                <input type="text" id="p" value={this.state.searchedValue} onChange={(e)=>{this.setState({searchedValue: e.target.value})}}/>  
           

           </div>
          )
      }
}

export default SR;
import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
 apiKey: '3b9e3b3543e34d1385f40847b63e40ed'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      isLoading:true
    }
  }

  calculateFaceLocation = (data) => {
    console.log(data)
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
  return data.outputs[0].data.regions.map(face => {

      const clarifaiFace = face.region_info.bounding_box;
    
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
        
      }
      
    });
  }

  displayFaceBox = (boxes) => {
    console.log(boxes)
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
         .then(response=> this.displayFaceBox(this.calculateFaceLocation(response)))
         .catch(err => console.log(err));
         this.setState({isLoading:false})
    }

  render() {
    const { imageUrl, boxes } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        
        
           <div>
              <Logo />
            
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
            
              
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
              
            </div>
            
        
      </div>
    );
  }
}

export default App;

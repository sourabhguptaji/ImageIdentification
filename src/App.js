import * as mobilenet from '@tensorflow-models/mobilenet';
import { useState,  useEffect,useRef } from 'react';

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imageUrl,setImageUrl] = useState(null)
  const [results, setResults] = useState([])
  const imageRef = useRef()
  const textInputRef = useRef()
  
  const loadModel = async() =>{
    setIsModelLoading(true)
    try{
      const model = await mobilenet.load()
      setModel(model)
      setIsModelLoading(false)
    }
    catch(error){
      console.log(error)
      setIsModelLoading(false)

    }
  }
  const uploadImage= (e) =>{
    const {files} = e.target
    if(files.length>0){
      const url = URL.createObjectURL(files[0])
      setImageUrl(url)
    }
    else{
      setImageUrl(null)
    }
  }
  const identify= async ()=>{
    const results =await model.classify(imageRef.current)
     setResults(results)
    console.log(results)
  }
  const handleOnChange = (e) =>{
    setImageUrl(e.target.value)
    setResults([])
  }
  useEffect(()=>{
    loadModel()
  },[])
  if(isModelLoading){
    return <h2>model Loading...</h2>
  }
  return (
    <div className="App">
      <h1 className="header">Image Identifiaction</h1>
      <div>
        <input type= "file" accept= 'image/*' capture= 'camera' className='uploadInput'
        onChange={uploadImage}/>
        <span className="or">OR   </span>
        <input type="text" placeholder="Enter Image Url" ref={textInputRef} onChange={handleOnChange}/>
       <div className='mainWrapper'>
          <div className = "mainContent">
            
            <div className = "imageHolder">
             {imageUrl && <img src={imageUrl} alt="upload Preview" crossOrigin="anonymous" ref = {imageRef}/>}
            
            </div>
            {results.length > 0 && <div className='resultsHolder'>
                        {results.map((result, index) => {
                            return (
                                <div className='result' key={result.className}>
                                    <span className='name'>{result.className}</span>
                                    <span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span>
                                </div>
                            )
                        })}
            </div>}
          
          </div>
          
          {imageUrl && <button className = 'button' onClick={identify}>Identify Image</button>}
       </div>
      </div>
    </div>
  );
}

export default App;

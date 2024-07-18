// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);

    // Create a preview of the uploaded image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data.predicted_class);
    } catch (error) {
      console.error('There was an error uploading the file!', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Potato Disease Classifier</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} accept="image/*" required />
          <button type="submit">Upload and Classify</button>
        </form>
        {preview && (
          <div>
            <h2>Image Preview:</h2>
            <img src={preview} alt="Uploaded" style={{ maxWidth: '300px', marginTop: '20px' }} />
          </div>
        )}
        {prediction && <h2>Predicted Class: {prediction}</h2>}
      </header>
    </div>
  );
}

export default App;

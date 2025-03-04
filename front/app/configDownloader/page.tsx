"use client"
import React, { useState } from "react";

const ConfigDownloader = () => {
  const [tool, setTool] = useState("");
  const [hosting, setHosting] = useState("");
  const [monitoring, setMonitoring] = useState("");
  const [jarTool, setJarTool] = useState("");

  const handleDownload = async () => {
    if (!tool || !hosting || !monitoring || !jarTool) {
      alert("Please fill all fields before downloading.");
      return;
    }

    const queryParams = new URLSearchParams({
      tool,
      hosting,
      monitoring,
      jarTool,
    });

    const downloadUrl = `http://localhost:4000/get-config?${queryParams}`;

    // Trigger the download
    window.location.href = downloadUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
        <h2 className="text-xl font-bold text-center">Download Config.zip</h2>
        
        <input 
          type="text" 
          placeholder="Tool" 
          className="w-full p-2 border rounded" 
          value={tool} 
          onChange={(e) => setTool(e.target.value)} 
        />
        
        <input 
          type="text" 
          placeholder="Hosting" 
          className="w-full p-2 border rounded" 
          value={hosting} 
          onChange={(e) => setHosting(e.target.value)} 
        />
        
        <input 
          type="text" 
          placeholder="Monitoring" 
          className="w-full p-2 border rounded" 
          value={monitoring} 
          onChange={(e) => setMonitoring(e.target.value)} 
        />
        
        <input 
          type="text" 
          placeholder="Jar Tool" 
          className="w-full p-2 border rounded" 
          value={jarTool} 
          onChange={(e) => setJarTool(e.target.value)} 
        />

        <button 
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={handleDownload}
        >
          Download Config.zip
        </button>
      </div>
    </div>
  );
};

export default ConfigDownloader;


const { storage, bucket } = require('../lib/firebase');
const fs = require('fs');
const path = require('path');

async function uploadTest() {
  try {
    const filePath = path.join(__dirname, '../audio_sample.mp3');
    const destination = 'test/audio_sample.mp3';
    
    console.log('Starting upload...');
    await bucket.upload(filePath, {
      destination: destination,
      metadata: {
        contentType: 'audio/mp3'
      }
    });
    
    console.log('File uploaded successfully');
    const [url] = await bucket.file(destination).getSignedUrl({
      action: 'read',
      expires: '03-01-2025'
    });
    
    console.log('Public URL:', url);
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadTest();

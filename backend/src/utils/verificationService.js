const fs = require('fs');
const path = require('path');
let levenshtein;
try {
  levenshtein = require('fast-levenshtein');
} catch (e) {
  levenshtein = null;
}

let VisionClient;
try {
  VisionClient = require('@google-cloud/vision').ImageAnnotatorClient;
} catch (e) {
  VisionClient = null;
}

let Rekognition;
try {
  Rekognition = require('aws-sdk/clients/rekognition');
} catch (e) {
  Rekognition = null;
}

const readBuffer = (p) => fs.readFileSync(p);

const similarity = (a = '', b = '') => {
  const A = (a || '').toString().trim().toLowerCase();
  const B = (b || '').toString().trim().toLowerCase();
  if (!A && !B) return 1;
  if (!A || !B) return 0;
  if (levenshtein && levenshtein.get) {
    const dist = levenshtein.get(A, B);
    return 1 - dist / Math.max(A.length, B.length);
  }
  // fallback: simple equality/substring heuristic
  if (A === B) return 1;
  if (A.includes(B) || B.includes(A)) return 0.9;
  return 0;
};

async function runOCR(filePath) {
  if (!VisionClient) throw new Error('Google Vision client not installed');
  const client = new VisionClient();
  const [result] = await client.textDetection(filePath);
  const detections = result.textAnnotations || [];
  return detections[0]?.description || '';
}

async function runFaceCompare(selfiePath, targetPath) {
  if (!Rekognition) throw new Error('AWS Rekognition client not installed');
  const rek = new Rekognition({ region: process.env.AWS_REGION || 'us-east-1' });
  const params = {
    SourceImage: { Bytes: readBuffer(selfiePath) },
    TargetImage: { Bytes: readBuffer(targetPath) },
    SimilarityThreshold: 0
  };
  const resp = await rek.compareFaces(params).promise();
  const match = resp.FaceMatches && resp.FaceMatches[0];
  return match?.Similarity || 0;
}

async function verifyCNI({ cniRectoPath, cniVersoPath, selfiePath, form }) {
  const result = { ocrText: '', nameScore: 0, prenomScore: 0, faceScore: 0, errors: [] };
  try {
    // OCR combine recto+verso
    const texts = [];
    if (cniRectoPath) texts.push(await runOCR(cniRectoPath));
    if (cniVersoPath) texts.push(await runOCR(cniVersoPath));
    result.ocrText = texts.join('\n');

    // naive extraction: check similarity with provided form fields
    result.nameScore = similarity(form.nom || '', result.ocrText);
    result.prenomScore = similarity(form.prenom || '', result.ocrText);

    // face compare (assumes photo on recto)
    if (selfiePath && cniRectoPath) {
      result.faceScore = await runFaceCompare(selfiePath, cniRectoPath);
    }
    // detect if OCR indicates Cameroonian ID
    const textLow = (result.ocrText || '').toLowerCase();
    const camKeywords = [
      'république du cameroun', 'republique du cameroun', 'république', 'cameroun',
      'carte nationale d\'identité', 'carte nationale d\u2019identit', 'carte nationale', 'ministère'
    ];
    result.isCameroonian = camKeywords.some(k => textLow.includes(k));
    // detect a numeric ID pattern (common sequences of digits 6-14)
    const digits = (result.ocrText || '').match(/\d{6,14}/g) || [];
    result.detectedNumbers = digits;
  } catch (err) {
    result.errors.push(err.message || String(err));
  }
  return result;
}

module.exports = { verifyCNI };

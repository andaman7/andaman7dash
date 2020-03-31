const patients = require('./samples.json');

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyDgDF0g_-B8RiHVguMkpCCQVB1_5pRJOU8",
    authDomain: "andaman7-dash.firebaseapp.com",
    databaseURL: "https://andaman7-dash.firebaseio.com",
    projectId: "andaman7-dash",
    storageBucket: "andaman7-dash.appspot.com",
    messagingSenderId: "832698702010",
    appId: "1:832698702010:web:b93cf9c064e065478a8a83"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

patients.forEach(function(obj) {
    if (obj.gender == 'Male' || obj.age < 20 || obj.age > 50) {
        obj.pregnant = false;
    }
    if (obj.temp < 100.4 && !obj.cough && !obj.short_breath) {
        obj.symptom_onset = "N/A"
    }
    obj.medications = obj["medications[random(0,5)]"];
    obj.medications = obj.medications.split(', ');
    obj.conditions = obj.conditions.split(', ');
    try {
        db.collection("patients").add({
            assessment_date: obj.assessment_date,
            phone: obj.phone,
            age: obj.age,
            gender: obj.gender,
            first_name: obj.first_name,
            last_name: obj.last_name,
            residence: obj.residence,
            exposure_community: obj.exposure_community,
            exposure_individual: obj.exposure_individual,
            exposure_travel: obj.exposure_travel,
            conditions: obj.conditions,
            symptom_onset: obj.symptom_onset,
            diagnosis: obj.diagnosis,
            temp: obj.temp,
            cough: obj.cough,
            short_breath: obj.short_breath,
            medications: obj.medications,
            pregnant: obj.pregnant
        }).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
    } catch (err) {
        console.error("Error adding document: ", err);
    }
});




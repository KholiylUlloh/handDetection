import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpos from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import { drawHand } from './utils';
import './style.css'

const Root = () => {
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    const runHandpose = async()=>{
        const net = await handpos.load()
        setInterval(()=>{
            detect(net)
        }, 10)
    }

    const detect = async(net)=>{
        if(
            typeof webcamRef !== 'undefined' &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ){
            // get video properties
            const video = webcamRef.current.video
            const videoWidth = webcamRef.current.video.videoWidth
            const videoHeight = webcamRef.current.video.videoHeight

            // set video properties
            webcamRef.current.video.width = videoWidth
            webcamRef.current.video.height = videoHeight

            // set canvas width & height 
            canvasRef.current.width = videoWidth
            canvasRef.current.height = videoHeight

            // make detection
            const hand = await net.estimateHands(video)
            //draw mesh
            const ctx = canvasRef.current.getContext('2d')
            drawHand(hand, ctx)
        }
    }

    useEffect(()=>{
        runHandpose();
    }, []);
  return (
    <div className="container">
        <div className='header'>
            <Webcam ref={webcamRef} className='webcam'/>
            <canvas ref={canvasRef} className='canvas' />
        </div>
    </div>
  )
}

export default Root;
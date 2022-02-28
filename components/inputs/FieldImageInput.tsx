import React, { useState } from 'react'
import BaseInputProps from './BaseInputProps'

import fieldImage from '../../config/2022/field_image.png'

export interface FieldImageProps extends BaseInputProps {
  resolutionWidth?: number
  resolutionHeight?: number
  maxSelections?: number
  defaultValue?: {x:number,y:number}[]
}

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function clamp(input: number, min: number, max: number): number {
  return input < min ? min : input > max ? max : input;
}

function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
  const mapped: number = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}

class FieldImageInput extends React.Component {
  constructor(data: FieldImageProps){
    super(data);
    this.data = data;
    this.value = data.defaultValue || [];

    this.canvas = React.createRef();
    this.img = React.createRef();
  }
  handleClick(event) {
    //Resolution height and width
    const resWidth = this.data.resolutionWidth || 12;
    const resHeight = this.data.resolutionHeight || 6;

    const canvas = this.canvas.current;
    const canvasBounds = canvas.getBoundingClientRect();

    const {x,y} = getMousePos(event.target, event)

    if (!this.value) {
      this.value = [];
    }

    if (!this.data.maxSelections && this.value.length > this.data.maxSelections) {
      return; // can't add any more
    }

    this.value.push({
      x: Math.round(map(x,0,canvasBounds.width, 0, resWidth)),
      y: Math.round(map(y,0,canvasBounds.height, 0, resHeight))
    })

    this.data.onChange(this.value);

    const radius = 5;

    const ctx = canvas.getContext("2d")
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
  }

  componentDidMount() {
    this.drawFieldImage()
  }

  drawFieldImage() {
    const canvas = this.canvas.current;
    const ctx = canvas.getContext("2d")
    const img = this.img.current

    const canvasBounds = canvas.getBoundingClientRect();
    ctx.drawImage(img, 0, 0, canvasBounds.width, canvasBounds.height)
  }

  clear() {
    this.value = null;
    this.data.onChange(this.value);

    this.drawFieldImage();
  }

  render(){
    return (
      <div>
        <canvas ref={this.canvas} style={{width: "100%"}} onClick={this.handleClick.bind(this)}/>
        <img ref={this.img} src={fieldImage.src} className="hidden" />
        <button className="focus:shadow-outline px-2 px-1 rounded bg-gray-500 text-2xl text-white hover:bg-red-700 focus:outline-none" type="button" onClick={this.clear.bind(this)}>Clear</button>
      </div>
    )
  }
}
export default FieldImageInput;

import React, { useState } from 'react'
import BaseInputProps from './BaseInputProps'

import fieldImage from '../../config/2022/field_image.png'

export interface Point {x: number, y: number}

export interface FieldImageProps extends BaseInputProps {
  resolutionWidth?: number
  resolutionHeight?: number
  maxSelections?: number
  defaultValue?: Point[]
  onChange: any
}

function getMousePos(canvas:HTMLCanvasElement, evt: React.MouseEvent<HTMLElement>) {
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
  data: FieldImageProps;
  value: Point[] | null;
  rawPoints: Point[];
  canvas: React.RefObject<HTMLCanvasElement>;
  img: any;

  constructor(data: FieldImageProps){
    super(data);
    this.data = data;
    this.value = data.defaultValue || [];
    this.rawPoints = [];

    this.canvas = React.createRef();
    this.img = React.createRef();
  }
  handleClick(event: React.MouseEvent<HTMLElement>) {
    //Resolution height and width
    const resWidth = this.data.resolutionWidth || 12;
    const resHeight = this.data.resolutionHeight || 6;

    const canvas = this.canvas.current;
    if (!canvas) {
      console.error("canvas is null");
      return;
    }
    const canvasBounds = canvas.getBoundingClientRect();

    const {x,y} = getMousePos(event.target as HTMLCanvasElement, event)

    if (!this.value) {
      this.value = [];
    }

    if (this.data.maxSelections && this.value.length >= this.data.maxSelections) {
      return; // can't add any more, hit limit
    }

    this.value.push({
      x: Math.round(map(x, 0, canvasBounds.width, 0, resWidth)),
      y: Math.round(map(y, 0, canvasBounds.height, 0, resHeight))
    })
    this.rawPoints.push({x,y})

    this.data.onChange(this.value);

    this.drawPoint({x,y})
  }

  drawPoint(pt: Point) {
    const radius = 5;
    const canvas = this.canvas.current;
    if (!canvas) {
      console.error("canvas is null");
      return;
    }
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("getContext(2d) is null");
      return;
    }
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
  }

  componentDidMount() {
    this.drawFieldImage()
  }

  drawFieldImage() {
    const canvas = this.canvas.current;
    if (!canvas) {
      console.error("canvas is null");
      return;
    }
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("getContext(2d) is null");
      return;
    }
    const img = this.img.current

    const canvasBounds = canvas.getBoundingClientRect();
    ctx.drawImage(img, 0, 0, canvasBounds.width, canvasBounds.height)

    for (let pt of this.rawPoints) {
      this.drawPoint(pt)
    }
  }

  clear() {
    this.value = null;
    this.rawPoints = [];
    this.data.onChange(this.value);

    this.drawFieldImage();
  }

  undo() {
    //remove last point
    if (this.value) {
      this.value.pop()
    }
    this.rawPoints.pop()
    this.data.onChange(this.value);

    this.drawFieldImage();
  }

  render(){
    return (
      <div>
        <canvas ref={this.canvas} style={{width: "100%"}} onClick={this.handleClick.bind(this)}/>
        <img ref={this.img} src={fieldImage.src} className="hidden" />
        <button className="focus:shadow-outline px-2 mx-1 py-1 rounded bg-gray-500 text-2xl text-white hover:bg-red-700 focus:outline-none" type="button" onClick={this.clear.bind(this)}>Clear</button>
        <button className="focus:shadow-outline px-2 mx-1 py-1 rounded bg-gray-500 text-2xl text-white hover:bg-red-700 focus:outline-none" type="button" onClick={this.undo.bind(this)}>Undo</button>
      </div>
    )
  }
}
export default FieldImageInput;

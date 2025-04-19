"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Point {
  x: number;
  y: number;
}

interface ImageSelectorProps {
  imageUrl: string;
  onSelectionComplete: (points: Point[]) => void;
  projectId: string;
}

const ImageSelector = ({ imageUrl, onSelectionComplete, projectId }: ImageSelectorProps) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image on canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Draw current selection
    if (points.length > 0) {
      ctx.strokeStyle = '#0000FF'; // Blue color
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
        for (let i = 0; i < points.length; i++) {
            ctx.fillStyle = '#0000FF'; // Blue color
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI); // Circle with radius 3
            ctx.fill();
        }
    }
  }, [points]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (points.length >= 4) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add a margin of error (adjust as needed)
    const margin = 5;
    if (x >= -margin && x <= canvas.width + margin && y >= -margin && y <= canvas.height + margin) {
      setPoints([...points, { x, y }]);

    }
  };
  const handleSelectionComplete = () => {
    onSelectionComplete(points);
    setPoints([]);
  };
  return (
    <div className="relative">
    <canvas 
    ref={canvasRef}
    onClick={handleCanvasClick}
    className="border border-gray-400 cursor-crosshair"
    />
    {points.length >= 3 && (
      <div className="absolute bottom-4 right-4">
      <Button onClick={handleSelectionComplete}>
          Complete Selection
      </Button>
      </div>
      )}
    <img 
      ref={imageRef}
      src={imageUrl}
      alt="Satellite View"
      style={{ display: 'none' }}
      onLoad={() => {
          const canvas = canvasRef.current;
          const image = imageRef.current;
          if (!canvas || !image) return;

          canvas.width = image.width;
          canvas.height = image.height;
      }}
      />
      </div>
  );
};

export default ImageSelector;

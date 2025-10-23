import { useEffect, useRef, useState } from 'react';

type GameObject = {
  id: string;
  name: string;
  type: 'cube' | 'sphere' | 'light' | 'camera';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
};

type Scene3DProps = {
  objects: GameObject[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

const Scene3D = ({ objects, selectedId, onSelect }: Scene3DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = '#0f0f0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const gridSize = 40;
      const gridCount = 20;

      ctx.strokeStyle = '#303030';
      ctx.lineWidth = 1;
      for (let i = -gridCount; i <= gridCount; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX + i * gridSize, 0);
        ctx.lineTo(centerX + i * gridSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, centerY + i * gridSize);
        ctx.lineTo(canvas.width, centerY + i * gridSize);
        ctx.stroke();
      }

      ctx.strokeStyle = '#007ACC';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height);
      ctx.stroke();

      ctx.strokeStyle = '#4EC9B0';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();

      objects.forEach(obj => {
        if (obj.type === 'light' || obj.type === 'camera') return;

        const scale = 60;
        const x = centerX + obj.position.x * scale;
        const y = centerY - obj.position.y * scale - obj.position.z * scale * 0.5;
        const size = Math.max(30, obj.scale.x * 60);
        
        const isSelected = obj.id === selectedId;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((obj.rotation.y + rotation) * Math.PI / 180);

        ctx.shadowBlur = isSelected ? 20 : 10;
        ctx.shadowColor = isSelected ? '#007ACC' : '#000000';
        ctx.shadowOffsetY = 5;

        if (obj.type === 'sphere') {
          const gradient = ctx.createRadialGradient(
            -size * 0.2, -size * 0.2, 0,
            0, 0, size / 2
          );
          gradient.addColorStop(0, '#4EC9B0');
          gradient.addColorStop(1, '#2A8070');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();

          if (isSelected) {
            ctx.strokeStyle = '#007ACC';
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        } else {
          const gradient = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2);
          gradient.addColorStop(0, '#007ACC');
          gradient.addColorStop(1, '#005A9E');
          ctx.fillStyle = gradient;
          
          ctx.fillRect(-size/2, -size/2, size, size);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(-size/2, -size/2, size/4, size);

          if (isSelected) {
            ctx.strokeStyle = '#4EC9B0';
            ctx.lineWidth = 3;
            ctx.strokeRect(-size/2, -size/2, size, size);
          }
        }

        ctx.restore();

        ctx.fillStyle = '#ffffff';
        ctx.font = '11px -apple-system, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(obj.name, x, y + size/2 + 15);
      });

      setRotation(r => (r + 0.3) % 360);
      requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [objects, selectedId, rotation]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 60;

    for (const obj of objects) {
      if (obj.type === 'light' || obj.type === 'camera') continue;

      const objX = centerX + obj.position.x * scale;
      const objY = centerY - obj.position.y * scale - obj.position.z * scale * 0.5;
      const size = Math.max(30, obj.scale.x * 60);

      if (obj.type === 'sphere') {
        const dist = Math.sqrt((x - objX) ** 2 + (y - objY) ** 2);
        if (dist < size / 2) {
          onSelect(obj.id);
          return;
        }
      } else {
        if (x > objX - size/2 && x < objX + size/2 && 
            y > objY - size/2 && y < objY + size/2) {
          onSelect(obj.id);
          return;
        }
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full h-full cursor-pointer"
      style={{ background: 'radial-gradient(circle at 50% 50%, hsl(0 0% 15%) 0%, hsl(0 0% 9.4%) 100%)' }}
    />
  );
};

export default Scene3D;

// Waveform.tsx
import { useEffect, useRef } from "react";

interface WaveformProps {
  stream: MediaStream | null;
}

const Waveform: React.FC<WaveformProps> = ({ stream }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationId = useRef<number | null>(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    const draw = () => {
      animationId.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4A90E2";
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
      audioContext.close();
    };
  }, [stream]);

  return <canvas ref={canvasRef} className="w-full h-[30px] block" />;
};

export default Waveform;

'use client';

/**
 * Advanced Client-Side Caricature Illustration Engine
 * Converts photo portraits into authentic hand-drawn caricatures matching Image 2:
 * 1. Big Head / Face Enlargement Warp (تضخيم الوجه والرأس)
 * 2. Background Removal & Whitening (تبييض الخلفية لتبدو كرسم على ورق)
 * 3. Bold Ink Lines & Outline Art (خطوط حبر سوداء ناصعة للملامح)
 * 4. High-Contrast Cartoon Toon Shading (تلوين الكوميك والتظليل التعبيري)
 */
export function transformToCaricatureCanvas(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const size = 600;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        canvas.width = size;
        canvas.height = size;

        // Step 1: Fill clean white background like a caricature paper sketch
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);

        // Step 2: Draw cropped image centered into temporary canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tempCtx = tempCanvas.getContext('2d')!;

        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        tempCtx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        const srcData = tempCtx.getImageData(0, 0, size, size);
        const srcPixels = srcData.data;

        // Step 3: Big-Head Caricature Distortion (Radial Magnification around head region)
        const warpedCanvas = document.createElement('canvas');
        warpedCanvas.width = size;
        warpedCanvas.height = size;
        const warpedCtx = warpedCanvas.getContext('2d')!;
        const warpedData = warpedCtx.createImageData(size, size);
        const dstPixels = warpedData.data;

        // Head center: Upper center of image (x: 50%, y: 38%)
        const headX = size / 2;
        const headY = size * 0.38;
        const radius = size * 0.42;
        const magnification = 0.35; // Enlarges head area for caricature proportions

        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const dstIdx = (y * size + x) * 4;

            // Distance from head center
            const dx = x - headX;
            const dy = y - headY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let srcX = x;
            let srcY = y;

            if (dist < radius) {
              // Apply quadratic pinch/magnification warp
              const normDist = dist / radius;
              const factor = 1 - magnification * Math.pow(1 - normDist, 2);
              srcX = headX + dx * factor;
              srcY = headY + dy * factor;
            }

            // Bilinear interpolation
            const ix = Math.max(0, Math.min(size - 1, Math.floor(srcX)));
            const iy = Math.max(0, Math.min(size - 1, Math.floor(srcY)));
            const srcIdx = (iy * size + ix) * 4;

            dstPixels[dstIdx] = srcPixels[srcIdx];
            dstPixels[dstIdx + 1] = srcPixels[srcIdx + 1];
            dstPixels[dstIdx + 2] = srcPixels[srcIdx + 2];
            dstPixels[dstIdx + 3] = srcPixels[srcIdx + 3];
          }
        }

        // Step 4: Caricature Ink Lines & Cartoon Shading
        const gray = new Float32Array(size * size);
        for (let i = 0; i < dstPixels.length; i += 4) {
          const r = dstPixels[i];
          const g = dstPixels[i + 1];
          const b = dstPixels[i + 2];
          gray[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b;
        }

        const finalData = ctx.createImageData(size, size);
        const finalPixels = finalData.data;
        const width = size;
        const height = size;

        // Posterization levels (quantization for clean toon illustration look)
        const levels = 5;
        const step = 255 / (levels - 1);

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x;
            const pIdx = idx * 4;

            const r = dstPixels[pIdx];
            const g = dstPixels[pIdx + 1];
            const b = dstPixels[pIdx + 2];

            // Detect background pixels (corners or dark background) and whiten them
            const isCorner = (x < width * 0.15 || x > width * 0.85) && (y < height * 0.15 || y > height * 0.85);
            const isBackground = isCorner || (r < 40 && g < 40 && b < 40);

            if (isBackground) {
              // Clean White Background (like paper in caricature drawing)
              finalPixels[pIdx] = 255;
              finalPixels[pIdx + 1] = 255;
              finalPixels[pIdx + 2] = 255;
              finalPixels[pIdx + 3] = 255;
              continue;
            }

            // Sobel Edge Detection for Strong Black Ink Outlines
            const gx = 
              -1 * gray[(y - 1) * width + (x - 1)] + 1 * gray[(y - 1) * width + (x + 1)] +
              -2 * gray[y * width + (x - 1)]     + 2 * gray[y * width + (x + 1)] +
              -1 * gray[(y + 1) * width + (x - 1)] + 1 * gray[(y + 1) * width + (x + 1)];

            const gy = 
              -1 * gray[(y - 1) * width + (x - 1)] - 2 * gray[(y - 1) * width + x] - 1 * gray[(y - 1) * width + (x + 1)] +
              1 * gray[(y + 1) * width + (x - 1)]  + 2 * gray[(y + 1) * width + x] + 1 * gray[(y + 1) * width + (x + 1)];

            const edgeMag = Math.sqrt(gx * gx + gy * gy);
            const isInkLine = edgeMag > 65; // Ink line threshold

            if (isInkLine) {
              // Deep Black Ink Line Contour (Line Art)
              finalPixels[pIdx] = 15;
              finalPixels[pIdx + 1] = 10;
              finalPixels[pIdx + 2] = 20;
              finalPixels[pIdx + 3] = 255;
            } else {
              // Toon Shading & Vibrant Color Quantization
              let pr = Math.round(r / step) * step;
              let pg = Math.round(g / step) * step;
              let pb = Math.round(b / step) * step;

              // Boost warm skin & vibrant suit colors
              pr = Math.min(255, pr * 1.15);
              pg = Math.min(255, pg * 1.08);

              finalPixels[pIdx] = pr;
              finalPixels[pIdx + 1] = pg;
              finalPixels[pIdx + 2] = pb;
              finalPixels[pIdx + 3] = 255;
            }
          }
        }

        ctx.putImageData(finalData, 0, 0);

        const caricatureResultUrl = canvas.toDataURL('image/png');
        resolve(caricatureResultUrl);
      } catch (err) {
        console.warn('Caricature canvas transformation warning:', err);
        resolve(imageSrc);
      }
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

import { RiMergeCellsHorizontal, RiFileCodeLine, RiImageLine } from 'react-icons/ri';
import { useState, useCallback } from 'react';
import { TbFileTypeSvg } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import PreviewSlider from '../../../components/shared/preview/PreviewSlider';
import PreviewSelect from '../../../components/shared/preview/PreviewSelect';
import PreviewSwitch from '../../../components/shared/preview/PreviewSwitch';
import { ExportButton } from './ControlsShared';
import {
  generateCSSClipPath,
  generateMergedClipPathSVG,
  generateMergedSVG,
  generateReactComponent
} from '../Svgrenderers';

export default function ExportPanel({
  shapes,
  bridges,
  cornerRadii,
  style,
  globalRadius,
  smoothing = 0.6,
  disabled = false
}) {
  const [copyStatus, setCopyStatus] = useState(null);
  const [pngScale, setPngScale] = useState('2');
  const [exportPad, setExportPad] = useState(16);
  const [includeBg, setIncludeBg] = useState(false);

  const exportOpts = { padding: exportPad, forceBackground: includeBg };

  const flash = key => {
    setCopyStatus(key);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleCopySVG = useCallback(() => {
    navigator.clipboard.writeText(
      generateMergedSVG(shapes, bridges, cornerRadii || {}, style, globalRadius, smoothing, exportOpts)
    );
    flash('svg');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes, bridges, cornerRadii, globalRadius, style, smoothing, exportPad, includeBg]);

  const handleCopyReact = useCallback(() => {
    navigator.clipboard.writeText(
      generateReactComponent(shapes, bridges, cornerRadii || {}, style, globalRadius, smoothing)
    );
    flash('react');
  }, [shapes, bridges, cornerRadii, globalRadius, style, smoothing]);

  const handleCopyMerged = useCallback(() => {
    navigator.clipboard.writeText(
      generateMergedClipPathSVG(shapes, bridges, cornerRadii || {}, style, globalRadius, smoothing)
    );
    flash('merged');
  }, [shapes, bridges, cornerRadii, globalRadius, style, smoothing]);

  const handleCopyCSS = useCallback(() => {
    navigator.clipboard.writeText(generateCSSClipPath(shapes, bridges, cornerRadii || {}, globalRadius, smoothing));
    flash('css');
  }, [shapes, bridges, cornerRadii, globalRadius, smoothing]);

  const handleDownloadSVG = useCallback(() => {
    const svg = generateMergedSVG(shapes, bridges, cornerRadii || {}, style, globalRadius, smoothing, exportOpts);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'merged-shape.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes, bridges, cornerRadii, globalRadius, style, smoothing, exportPad, includeBg]);

  const downloadRaster = useCallback(
    format => {
      const isJpg = format === 'jpg';
      const opts = { padding: exportPad, forceBackground: includeBg || isJpg };
      const svg = generateMergedSVG(shapes, bridges, cornerRadii || {}, style, globalRadius, smoothing, opts);
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const img = new window.Image();
      img.onload = () => {
        const scale = parseInt(pngScale, 10) || 2;
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (isJpg) {
          ctx.fillStyle = style.backgroundColor || '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob(
          outBlob => {
            const outUrl = URL.createObjectURL(outBlob);
            const link = document.createElement('a');
            link.download = `merged-shape.${format}`;
            link.href = outUrl;
            link.click();
            URL.revokeObjectURL(outUrl);
          },
          isJpg ? 'image/jpeg' : 'image/png',
          isJpg ? 0.92 : undefined
        );
      };
      img.src = url;
    },
    [shapes, bridges, cornerRadii, globalRadius, style, smoothing, pngScale, exportPad, includeBg]
  );

  return (
    <div
      className={`flex flex-col h-full overflow-hidden transition-opacity duration-200 ${
        disabled ? 'opacity-50 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.5px] mb-3 shrink-0 text-(--brand)">
        Export
      </p>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none [-webkit-overflow-scrolling:touch]">
        <div className="flex flex-col gap-2 mb-3">
          <PreviewSwitch label="Bake background" value={includeBg} onChange={setIncludeBg} />
          <PreviewSlider
            label="Padding"
            min={0}
            max={120}
            step={2}
            value={exportPad}
            valueUnit="px"
            onChange={setExportPad}
          />
          <PreviewSelect
            label="Raster scale"
            value={pngScale}
            options={[
              { value: '1', label: '1x' },
              { value: '2', label: '2x' },
              { value: '3', label: '3x' },
              { value: '4', label: '4x' }
            ]}
            onChange={setPngScale}
          />
        </div>

        <div className="flex flex-col gap-2">
          <ExportButton
            icon={RiMergeCellsHorizontal}
            label={copyStatus === 'merged' ? 'Copied!' : 'Merge & Copy (Mask-Ready)'}
            active={copyStatus === 'merged'}
            onClick={handleCopyMerged}
          />
          <div className="flex gap-2">
            <ExportButton
              icon={TbFileTypeSvg}
              label={copyStatus === 'svg' ? 'Copied!' : 'Copy SVG'}
              active={copyStatus === 'svg'}
              onClick={handleCopySVG}
              flex={1}
            />
            <ExportButton
              icon={FaReact }
              label={copyStatus === 'react' ? 'Copied!' : 'Copy React'}
              active={copyStatus === 'react'}
              onClick={handleCopyReact}
              flex={1}
            />
          </div>
          <ExportButton
            icon={RiFileCodeLine}
            label={copyStatus === 'css' ? 'Copied!' : 'Copy CSS clip-path'}
            active={copyStatus === 'css'}
            onClick={handleCopyCSS}
          />
          <div className="flex gap-2">
            <ExportButton icon={TbFileTypeSvg} label="SVG" onClick={handleDownloadSVG} flex={1} primary />
            <ExportButton icon={RiImageLine} label="PNG" onClick={() => downloadRaster('png')} flex={1} primary />
            <ExportButton icon={RiImageLine} label="JPG" onClick={() => downloadRaster('jpg')} flex={1} primary />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { RiEyeLine, RiEyeOffLine, RiFullscreenLine } from 'react-icons/ri';
import { getBridgePathAt, getRoundedRectPath, getFillSpec, getFxSpec, computeShapesBBox } from './Svgrenderers';

const Canvas = forwardRef(
  (
    {
      shapes,
      bridges,
      cornerRadii,
      globalRadius,
      smoothing = 0.6,
      style,
      selectedIds,
      onShapeUpdate,
      onSelectionChange,
      onDragEnd,
      onAltDragDuplicate,
      snapToGrid,
      gridSize,
      showGrid = true,
      showBridgeDebug = false,
      onShowBridgeDebugChange
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const hasCenteredRef = useRef(false);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [spaceHeld, setSpaceHeld] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [draggedShape, setDraggedShape] = useState(null);
    const [resizeHandle, setResizeHandle] = useState(null);
    const [initialShapeStates, setInitialShapeStates] = useState(null);
    const [isAltDragging, setIsAltDragging] = useState(false);
    const altDragDuplicatedRef = useRef(false);

    const [marquee, setMarquee] = useState(null);
    const [marqueeStart, setMarqueeStart] = useState(null);

    // Pinch-to-zoom state (two-finger touch)
    const pinchStateRef = useRef(null); // { startDist, startZoom, startPan, startMid }

    const fitToView = useCallback(() => {
      if (shapes.length === 0) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const minX = Math.min(...shapes.map(s => s.x));
      const minY = Math.min(...shapes.map(s => s.y));
      const maxX = Math.max(...shapes.map(s => s.x + s.w));
      const maxY = Math.max(...shapes.map(s => s.y + s.h));

      const shapesWidth = maxX - minX;
      const shapesHeight = maxY - minY;
      const shapesCenterX = minX + shapesWidth / 2;
      const shapesCenterY = minY + shapesHeight / 2;

      const padding = 60;
      const scaleX = (rect.width - padding * 2) / shapesWidth;
      const scaleY = (rect.height - padding * 2) / shapesHeight;
      const newZoom = Math.min(scaleX, scaleY, 2);

      setZoom(newZoom);
      setPan({
        x: rect.width / 2 - shapesCenterX * newZoom,
        y: rect.height / 2 - shapesCenterY * newZoom
      });
    }, [shapes]);

    useImperativeHandle(ref, () => ({ fitToView }), [fitToView]);

    useEffect(() => {
      if (hasCenteredRef.current || shapes.length === 0) return;
      const container = containerRef.current;
      if (!container) return;

      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const minX = Math.min(...shapes.map(s => s.x));
        const minY = Math.min(...shapes.map(s => s.y));
        const maxX = Math.max(...shapes.map(s => s.x + s.w));
        const maxY = Math.max(...shapes.map(s => s.y + s.h));

        const shapesCenterX = minX + (maxX - minX) / 2;
        const shapesCenterY = minY + (maxY - minY) / 2;

        setPan({ x: rect.width / 2 - shapesCenterX, y: rect.height / 2 - shapesCenterY });
        hasCenteredRef.current = true;
      });
    }, [shapes]);

    const screenToCanvas = useCallback(
      (screenX, screenY) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        return { x: (screenX - rect.left - pan.x) / zoom, y: (screenY - rect.top - pan.y) / zoom };
      },
      [pan, zoom]
    );

    const snapValue = useCallback(
      value => (!snapToGrid ? value : Math.round(value / gridSize) * gridSize),
      [snapToGrid, gridSize]
    );

    useEffect(() => {
      const handleKeyDown = e => {
        if (e.code === 'Space' && !e.repeat && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          setSpaceHeld(true);
        }
      };
      const handleKeyUp = e => {
        if (e.code === 'Space') {
          setSpaceHeld(false);
          setIsPanning(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

    const handleWheel = useCallback(
      e => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.min(Math.max(zoom * delta, 0.25), 4);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          setPan({ x: mouseX - (mouseX - pan.x) * (newZoom / zoom), y: mouseY - (mouseY - pan.y) * (newZoom / zoom) });
        }
        setZoom(newZoom);
      },
      [zoom, pan]
    );

    // ---- Core pointer logic, shared between mouse and single-touch handlers ----

    const pointerDown = useCallback(
      (
        clientX,
        clientY,
        { altKey = false, shiftKey = false, isMiddleButton = false, targetHandle, targetShapeId } = {}
      ) => {
        const canvasPos = screenToCanvas(clientX, clientY);

        if (spaceHeld) {
          setIsPanning(true);
          setDragStart({ x: clientX, y: clientY });
          return;
        }

        if (targetHandle) {
          const shape = shapes.find(s => s.id === targetShapeId);
          if (shape) {
            const states = {};
            const selected = selectedIds.includes(targetShapeId) ? selectedIds : [targetShapeId];
            selected.forEach(id => {
              const s = shapes.find(sh => sh.id === id);
              if (s) states[id] = { ...s };
            });
            setResizeHandle(targetHandle);
            setDraggedShape(shape);
            setDragStart({ x: clientX, y: clientY });
            setInitialShapeStates(states);
            setIsDragging(true);
            return;
          }
        }

        const clickedShape = [...shapes]
          .reverse()
          .find(
            shape =>
              canvasPos.x >= shape.x &&
              canvasPos.x <= shape.x + shape.w &&
              canvasPos.y >= shape.y &&
              canvasPos.y <= shape.y + shape.h
          );

        if (clickedShape) {
          if (altKey && onAltDragDuplicate) {
            const shapesToDuplicate = selectedIds.includes(clickedShape.id) ? selectedIds : [clickedShape.id];
            altDragDuplicatedRef.current = false;
            setIsAltDragging(true);
            const states = {};
            shapesToDuplicate.forEach(id => {
              const s = shapes.find(sh => sh.id === id);
              if (s) states[id] = { ...s };
            });
            setDraggedShape(clickedShape);
            setDragStart({ x: clientX, y: clientY });
            setInitialShapeStates(states);
            setIsDragging(true);
            return;
          }

          if (shiftKey) {
            if (selectedIds.includes(clickedShape.id)) {
              onSelectionChange(selectedIds.filter(id => id !== clickedShape.id));
            } else {
              onSelectionChange([...selectedIds, clickedShape.id]);
            }
          } else if (!selectedIds.includes(clickedShape.id)) {
            onSelectionChange([clickedShape.id]);
          }

          const shapesToMove = selectedIds.includes(clickedShape.id) ? selectedIds : [clickedShape.id];
          const states = {};
          shapesToMove.forEach(id => {
            const s = shapes.find(sh => sh.id === id);
            if (s) states[id] = { ...s };
          });

          setDraggedShape(clickedShape);
          setDragStart({ x: clientX, y: clientY });
          setInitialShapeStates(states);
          setIsDragging(true);
        } else {
          if (isMiddleButton) {
            setIsPanning(true);
            setDragStart({ x: clientX, y: clientY });
          } else {
            if (!shiftKey) onSelectionChange([]);
            setMarqueeStart(canvasPos);
            setMarquee({ x: canvasPos.x, y: canvasPos.y, w: 0, h: 0 });
          }
        }
      },
      [shapes, selectedIds, screenToCanvas, onSelectionChange, spaceHeld, onAltDragDuplicate]
    );

    const pointerMove = useCallback(
      (clientX, clientY) => {
        if (isPanning && dragStart) {
          const dx = clientX - dragStart.x;
          const dy = clientY - dragStart.y;
          setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
          setDragStart({ x: clientX, y: clientY });
          return;
        }

        if (marqueeStart && marquee) {
          const canvasPos = screenToCanvas(clientX, clientY);
          setMarquee({
            x: Math.min(marqueeStart.x, canvasPos.x),
            y: Math.min(marqueeStart.y, canvasPos.y),
            w: Math.abs(canvasPos.x - marqueeStart.x),
            h: Math.abs(canvasPos.y - marqueeStart.y)
          });
          return;
        }

        if (isDragging && draggedShape && dragStart && initialShapeStates) {
          const dx = (clientX - dragStart.x) / zoom;
          const dy = (clientY - dragStart.y) / zoom;

          if (isAltDragging && !altDragDuplicatedRef.current && onAltDragDuplicate) {
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
              const originalIds = Object.keys(initialShapeStates);
              const duplicates = onAltDragDuplicate(originalIds);
              if (duplicates && duplicates.length > 0) {
                const newStates = {};
                duplicates.forEach(dup => {
                  newStates[dup.id] = { ...dup };
                });
                setInitialShapeStates(newStates);
                setDraggedShape(duplicates[0]);
                altDragDuplicatedRef.current = true;
                duplicates.forEach(dup => {
                  onShapeUpdate(dup.id, { x: snapValue(dup.x + dx), y: snapValue(dup.y + dy) });
                });
              }
            }
            return;
          }

          if (resizeHandle) {
            const ids = Object.keys(initialShapeStates);
            if (ids.length === 1) {
              const id = ids[0];
              const initial = initialShapeStates[id];
              let newX = initial.x,
                newY = initial.y,
                newW = initial.w,
                newH = initial.h;
              if (resizeHandle.includes('w')) {
                newX = snapValue(initial.x + dx);
                newW = initial.w - (newX - initial.x);
              }
              if (resizeHandle.includes('e')) {
                newW = snapValue(initial.w + dx);
              }
              if (resizeHandle.includes('n')) {
                newY = snapValue(initial.y + dy);
                newH = initial.h - (newY - initial.y);
              }
              if (resizeHandle.includes('s')) {
                newH = snapValue(initial.h + dy);
              }
              onShapeUpdate(id, {
                x: snapValue(newX),
                y: snapValue(newY),
                w: snapValue(Math.max(20, newW)),
                h: snapValue(Math.max(20, newH))
              });
            } else {
              const minX = Math.min(...ids.map(id => initialShapeStates[id].x));
              const minY = Math.min(...ids.map(id => initialShapeStates[id].y));
              const maxX = Math.max(...ids.map(id => initialShapeStates[id].x + initialShapeStates[id].w));
              const maxY = Math.max(...ids.map(id => initialShapeStates[id].y + initialShapeStates[id].h));
              const boxW = maxX - minX,
                boxH = maxY - minY;
              let newMinX = minX,
                newMinY = minY,
                newMaxX = maxX,
                newMaxY = maxY;
              if (resizeHandle.includes('w')) newMinX = snapValue(minX + dx);
              if (resizeHandle.includes('e')) newMaxX = snapValue(maxX + dx);
              if (resizeHandle.includes('n')) newMinY = snapValue(minY + dy);
              if (resizeHandle.includes('s')) newMaxY = snapValue(maxY + dy);
              const newBoxW = Math.max(gridSize * 2, newMaxX - newMinX);
              const newBoxH = Math.max(gridSize * 2, newMaxY - newMinY);
              ids.forEach(id => {
                const initial = initialShapeStates[id];
                const relX = (initial.x - minX) / (boxW || 1);
                const relY = (initial.y - minY) / (boxH || 1);
                const relW = initial.w / (boxW || 1);
                const relH = initial.h / (boxH || 1);
                onShapeUpdate(id, {
                  x: snapValue(newMinX + relX * newBoxW),
                  y: snapValue(newMinY + relY * newBoxH),
                  w: snapValue(Math.max(gridSize * 2, relW * newBoxW)),
                  h: snapValue(Math.max(gridSize * 2, relH * newBoxH))
                });
              });
            }
          } else {
            Object.keys(initialShapeStates).forEach(id => {
              const initial = initialShapeStates[id];
              onShapeUpdate(id, { x: snapValue(initial.x + dx), y: snapValue(initial.y + dy) });
            });
          }
        }
      },
      [
        isPanning,
        isDragging,
        dragStart,
        draggedShape,
        initialShapeStates,
        zoom,
        resizeHandle,
        snapValue,
        onShapeUpdate,
        marqueeStart,
        marquee,
        screenToCanvas,
        gridSize,
        isAltDragging,
        onAltDragDuplicate
      ]
    );

    const pointerUp = useCallback(() => {
      if (marquee && marqueeStart) {
        const selected = shapes.filter(shape => {
          const shapeRight = shape.x + shape.w;
          const shapeBottom = shape.y + shape.h;
          const marqueeRight = marquee.x + marquee.w;
          const marqueeBottom = marquee.y + marquee.h;
          return !(
            shape.x > marqueeRight ||
            shapeRight < marquee.x ||
            shape.y > marqueeBottom ||
            shapeBottom < marquee.y
          );
        });
        if (selected.length > 0) onSelectionChange(selected.map(s => s.id));
      }
      if (isDragging && onDragEnd) onDragEnd();
      setIsDragging(false);
      setIsPanning(false);
      setDragStart(null);
      setDraggedShape(null);
      setResizeHandle(null);
      setInitialShapeStates(null);
      setMarquee(null);
      setMarqueeStart(null);
      setIsAltDragging(false);
      altDragDuplicatedRef.current = false;
    }, [marquee, marqueeStart, shapes, onSelectionChange, isDragging, onDragEnd]);

    // ---- Mouse handlers ----

    const handleMouseDown = useCallback(
      e => {
        pointerDown(e.clientX, e.clientY, {
          altKey: e.altKey,
          shiftKey: e.shiftKey,
          isMiddleButton: e.button === 1,
          targetHandle: e.target.dataset.handle,
          targetShapeId: e.target.dataset.shapeId
        });
      },
      [pointerDown]
    );

    const handleMouseMove = useCallback(
      e => {
        pointerMove(e.clientX, e.clientY);
      },
      [pointerMove]
    );

    const handleMouseUp = useCallback(() => {
      pointerUp();
    }, [pointerUp]);

    // ---- Touch handlers (single-finger drag/select/resize, two-finger pinch-zoom+pan) ----

    const touchDist = (t1, t2) => Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    const touchMid = (t1, t2) => ({ x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 });

    const handleTouchStart = useCallback(
      e => {
        if (e.touches.length === 2) {
          // Entering pinch mode: cancel any single-touch drag/marquee in progress
          setIsDragging(false);
          setIsPanning(false);
          setDragStart(null);
          setDraggedShape(null);
          setResizeHandle(null);
          setInitialShapeStates(null);
          setMarquee(null);
          setMarqueeStart(null);
          setIsAltDragging(false);
          altDragDuplicatedRef.current = false;

          const [t1, t2] = [e.touches[0], e.touches[1]];
          pinchStateRef.current = {
            startDist: touchDist(t1, t2),
            startZoom: zoom,
            startPan: { ...pan },
            startMid: touchMid(t1, t2)
          };
          return;
        }

        if (e.touches.length === 1) {
          const t = e.touches[0];
          pointerDown(t.clientX, t.clientY, {
            targetHandle: t.target?.dataset?.handle,
            targetShapeId: t.target?.dataset?.shapeId
          });
        }
      },
      [pointerDown, zoom, pan]
    );

    const handleTouchMove = useCallback(
      e => {
        if (e.touches.length === 2 && pinchStateRef.current) {
          e.preventDefault();
          const [t1, t2] = [e.touches[0], e.touches[1]];
          const { startDist, startZoom, startPan, startMid } = pinchStateRef.current;
          const newDist = touchDist(t1, t2);
          const scaleFactor = newDist / (startDist || 1);
          const newZoom = Math.min(Math.max(startZoom * scaleFactor, 0.25), 4);

          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            const anchorX = startMid.x - rect.left;
            const anchorY = startMid.y - rect.top;
            const curMid = touchMid(t1, t2);
            const panDx = curMid.x - startMid.x;
            const panDy = curMid.y - startMid.y;
            setPan({
              x: anchorX - (anchorX - startPan.x) * (newZoom / startZoom) + panDx,
              y: anchorY - (anchorY - startPan.y) * (newZoom / startZoom) + panDy
            });
          }
          setZoom(newZoom);
          return;
        }

        if (e.touches.length === 1) {
          if (isDragging || isPanning || marqueeStart) e.preventDefault();
          const t = e.touches[0];
          pointerMove(t.clientX, t.clientY);
        }
      },
      [pointerMove, isDragging, isPanning, marqueeStart]
    );

    const handleTouchEnd = useCallback(
      e => {
        if (e.touches.length < 2) {
          pinchStateRef.current = null;
        }
        if (e.touches.length === 0) {
          pointerUp();
        }
      },
      [pointerUp]
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    const shapesBBox = useMemo(() => computeShapesBBox(shapes), [shapes]);
    const fillSpec = useMemo(() => getFillSpec(style, shapesBBox, 'canvas'), [style, shapesBBox]);
    const fxSpec = useMemo(() => getFxSpec(style, 'canvas'), [style]);

    const renderResizeHandles = shape => {
      if (!selectedIds.includes(shape.id)) return null;
      // Touch targets are larger than the visible handle so fingers can grab them accurately
      const handleSize = 8 / zoom;
      const touchPadding = 14 / zoom;
      const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

      return handles.map(handle => {
        const half = handleSize / 2;
        let x, y;
        switch (handle) {
          case 'nw':
            x = shape.x - half;
            y = shape.y - half;
            break;
          case 'n':
            x = shape.x + shape.w / 2 - half;
            y = shape.y - half;
            break;
          case 'ne':
            x = shape.x + shape.w - half;
            y = shape.y - half;
            break;
          case 'e':
            x = shape.x + shape.w - half;
            y = shape.y + shape.h / 2 - half;
            break;
          case 'se':
            x = shape.x + shape.w - half;
            y = shape.y + shape.h - half;
            break;
          case 's':
            x = shape.x + shape.w / 2 - half;
            y = shape.y + shape.h - half;
            break;
          case 'sw':
            x = shape.x - half;
            y = shape.y + shape.h - half;
            break;
          case 'w':
            x = shape.x - half;
            y = shape.y + shape.h / 2 - half;
            break;
          default:
            x = 0;
            y = 0;
        }
        return (
          <g key={`${shape.id}-${handle}`}>
            {/* Invisible larger touch target so fingers can grab the handle accurately */}
            <rect
              data-handle={handle}
              data-shape-id={shape.id}
              x={x - touchPadding}
              y={y - touchPadding}
              width={handleSize + touchPadding * 2}
              height={handleSize + touchPadding * 2}
              fill="transparent"
              style={{ cursor: `${handle}-resize` }}
            />
            <rect
              data-handle={handle}
              data-shape-id={shape.id}
              x={x}
              y={y}
              width={handleSize}
              height={handleSize}
              fill="#A855F7"
              stroke="#fff"
              strokeWidth={1 / zoom}
              style={{ cursor: `${handle}-resize`, pointerEvents: 'none' }}
            />
          </g>
        );
      });
    };

    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden select-none touch-none bg-(--bg) ${
          isPanning || spaceHeld ? 'cursor-grab' : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Grid - backgroundSize/Position are computed from live pan/zoom state, must stay inline */}
        <div
          className={`absolute inset-0 transition-opacity duration-150 ${showGrid ? 'opacity-50' : 'opacity-0'}`}
          style={{
            backgroundImage: `linear-gradient(var(--canvas-primary) 1px, transparent 1px), linear-gradient(90deg, var(--canvas-primary) 1px, transparent 1px)`,
            backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`
          }}
        />

        {/* Background fill - dynamic user-chosen color, must stay inline */}
        {style.backgroundEnabled && <div className="absolute inset-0" style={{ background: style.backgroundColor }} />}

        {/* Main SVG */}
        <svg width="100%" height="100%" className="absolute left-0 top-0">
          <defs>
            {fillSpec.type === 'linear' && (
              <linearGradient
                id={fillSpec.id}
                gradientUnits="userSpaceOnUse"
                x1={fillSpec.x1}
                y1={fillSpec.y1}
                x2={fillSpec.x2}
                y2={fillSpec.y2}
              >
                {fillSpec.stops.map((s, i) => (
                  <stop key={i} offset={s.offset} stopColor={s.color} />
                ))}
              </linearGradient>
            )}
            {fillSpec.type === 'radial' && (
              <radialGradient
                id={fillSpec.id}
                gradientUnits="userSpaceOnUse"
                cx={fillSpec.cx}
                cy={fillSpec.cy}
                r={fillSpec.r}
              >
                {fillSpec.stops.map((s, i) => (
                  <stop key={i} offset={s.offset} stopColor={s.color} />
                ))}
              </radialGradient>
            )}
            {fxSpec && (
              <filter id={fxSpec.id} x="-50%" y="-50%" width="200%" height="200%">
                {fxSpec.hasShadow && (
                  <>
                    <feGaussianBlur in="SourceAlpha" stdDeviation={fxSpec.shadowBlur} result="smBlur" />
                    <feOffset in="smBlur" dx={fxSpec.shadowOffsetX} dy={fxSpec.shadowOffsetY} result="smOff" />
                    <feFlood
                      floodColor={fxSpec.shadowColor}
                      floodOpacity={fxSpec.shadowOpacity}
                      result="smShadowColor"
                    />
                    <feComposite in="smShadowColor" in2="smOff" operator="in" result="smShadow" />
                  </>
                )}
                {fxSpec.hasStroke && (
                  <>
                    <feMorphology in="SourceAlpha" operator="dilate" radius={fxSpec.strokeWidth} result="smDilated" />
                    <feFlood floodColor={fxSpec.strokeColor} result="smStrokeColor" />
                    <feComposite in="smStrokeColor" in2="smDilated" operator="in" result="smOutline" />
                  </>
                )}
                <feMerge>
                  {fxSpec.hasShadow && <feMergeNode in="smShadow" />}
                  {fxSpec.hasStroke && <feMergeNode in="smOutline" />}
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            <g
              fill={fillSpec.paint}
              fillOpacity={style.opacity ?? 1}
              filter={fxSpec ? `url(#${fxSpec.id})` : undefined}
            >
              {shapes.map(shape => {
                const corners = cornerRadii[shape.id] || {
                  tl: globalRadius,
                  tr: globalRadius,
                  br: globalRadius,
                  bl: globalRadius
                };
                return <path key={shape.id} d={getRoundedRectPath(shape.x, shape.y, shape.w, shape.h, corners)} />;
              })}
              {bridges.map(bridge => (
                <path key={bridge.id} d={getBridgePathAt(bridge.x, bridge.y, bridge.r, bridge.rotation, smoothing)} />
              ))}
            </g>

            {shapes.map(shape => {
              const isSelected = selectedIds.includes(shape.id);
              if (!isSelected) return null;
              return (
                <rect
                  key={`sel-${shape.id}`}
                  x={shape.x - 2 / zoom}
                  y={shape.y - 2 / zoom}
                  width={shape.w + 4 / zoom}
                  height={shape.h + 4 / zoom}
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth={2 / zoom}
                  strokeDasharray={`${4 / zoom} ${2 / zoom}`}
                />
              );
            })}

            {showBridgeDebug &&
              bridges.map(bridge => (
                <circle key={`dbg-${bridge.id}`} cx={bridge.x} cy={bridge.y} r={3 / zoom} fill="#ff0" />
              ))}

            {shapes.map(shape => renderResizeHandles(shape))}

            {marquee && marquee.w > 0 && marquee.h > 0 && (
              <rect
                x={marquee.x}
                y={marquee.y}
                width={marquee.w}
                height={marquee.h}
                fill="rgba(168, 85, 247, 0.1)"
                stroke="#A855F7"
                strokeWidth={1 / zoom}
                strokeDasharray={`${4 / zoom} ${2 / zoom}`}
              />
            )}
          </g>
        </svg>

        {/* Bottom-left toolbar */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all duration-150 hover:border-(--brand)/40 cursor-pointer ${
              showBridgeDebug
                ? 'bg-(--brand) text-white border-(--border-button)'
                : 'bg-(--bg-button) text-(--text-primary) border-(--border-button)'
            }`}
            onClick={() => onShowBridgeDebugChange?.(!showBridgeDebug)}
          >
            {showBridgeDebug ? <RiEyeLine size={14} /> : <RiEyeOffLine size={14} />}
            Bridges
          </button>
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-(--brand) cursor-pointer text-xs font-medium transition-all duration-150 hover:border-(--brand)/40 bg-(--brand) text-white"
            onClick={fitToView}
          >
            <RiFullscreenLine color='#ffffff' size={14} />
            Fit
          </button>
        </div>

        {/* Zoom indicator */}
        <div className="absolute bottom-4 right-4 rounded-md border px-2.5 py-1.5 text-xs font-medium bg-(--brand) border-(--brand) text-white ">
          {Math.round(zoom * 100)}%
        </div>
      </div>
    );
  }
);

export default Canvas;

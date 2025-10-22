import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDashboardStore } from "../../../store/appStore";
import { biIcons, goIcons, mdIcons } from "../../../global/icons";
import { useCreateZones } from "../../../services/camera/camera.hooks";
import { connectStreamSocket } from "../../../sockets/connectStreamSocket";

const MAX_POINTS = 7;
const MIN_POINTS = 4;

const CameraStream = () => {
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [displayedFrame, setDisplayedFrame] = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [polygons, setPolygons] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(null);
  const cameraDetails = useDashboardStore((state) => state.cameraDetails);
  const { mutateAsync: createZone } = useCreateZones();
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();
  const wsRef = useRef(null);
  const cleanupRef = useRef(null);

  // WebSocket stream setup
  useEffect(() => {
    if (!cameraDetails?.id) return;

    const { ws, cleanup } = connectStreamSocket(cameraDetails, (f, dets) => {
      frameRef.current = f;
      if (dets) setDetections(dets);
      setLoading(false);
    });

    wsRef.current = ws;
    cleanupRef.current = cleanup;

    const interval = setInterval(() => {
      if (frameRef.current) {
        setDisplayedFrame(frameRef.current);
      }
    }, 100);

    return () => {
      if (interval) clearInterval(interval);
      if (cleanupRef.current) cleanupRef.current();
      if (wsRef.current) {
        if (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        ) {
          wsRef.current.close();
        }
      }
    };
  }, [cameraDetails?.id]);

  useEffect(() => {
    const syncCanvasSize = () => {
      if (!imageRef.current || !canvasRef.current) return;

      const img = imageRef.current;
      const canvas = canvasRef.current;

      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;

      // Force re-render by resetting state (this will trigger the polygon drawing effect)
      setPolygons((prev) => [...prev]);
    };

    syncCanvasSize();
    window.addEventListener("resize", syncCanvasSize);
    return () => window.removeEventListener("resize", syncCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all completed polygons
    polygons.forEach((polygon, idx) => {
      ctx.beginPath();
      const abs = (pt) => ({
        x: pt.x * canvas.width,
        y: pt.y * canvas.height,
      });
      ctx.moveTo(abs(polygon[0]).x, abs(polygon[0]).y);
      polygon.forEach((pt) => {
        const { x, y } = abs(pt);
        ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.strokeStyle = idx === selectedPolygonIndex ? "lime" : "red";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw current polygon
    if (currentPolygon.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentPolygon[0].x, currentPolygon[0].y);
      currentPolygon.slice(1).forEach((pt) => ctx.lineTo(pt.x, pt.y));
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();

      currentPolygon.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
      });
    }
  }, [polygons, currentPolygon, selectedPolygonIndex]);

  const handleClick = (e) => {
    if (e.button !== 0) return;

    if (polygons.length >= 1) return alert("Only one polygon is allowed.");

    const canvas = canvasRef.current;
    const img = imageRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const newPolygon = [...currentPolygon, { x, y }];

    // Auto-close if close to start and enough points
    if (newPolygon.length >= MIN_POINTS) {
      const firstPoint = newPolygon[0];
      const dist = Math.hypot(x - firstPoint.x, y - firstPoint.y);
      if (dist < 10) {
        const normalizedPolygon = newPolygon.slice(0, -1).map((pt) => ({
          x: pt.x / canvas.width,
          y: pt.y / canvas.height,
        }));
        setPolygons([normalizedPolygon]); // ← force replace
        setCurrentPolygon([]);
        return;
      }
    }

    // Auto-complete if max points reached
    if (newPolygon.length >= MAX_POINTS) {
      const normalizedPolygon = newPolygon.map((pt) => ({
        x: pt.x / canvas.width,
        y: pt.y / canvas.height,
      }));
      setPolygons([normalizedPolygon]); // ← force replace
      setCurrentPolygon([]);
      return;
    }

    setCurrentPolygon(newPolygon);
  };

  const handleRightClick = (e) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clickedIndex = polygons.findIndex((polygon) => {
      const path = new Path2D();
      const abs = (pt) => ({
        x: pt.x * canvas.width,
        y: pt.y * canvas.height,
      });

      const start = abs(polygon[0]);
      path.moveTo(start.x, start.y);

      polygon.forEach((pt) => {
        const { x, y } = abs(pt);
        path.lineTo(x, y);
      });
      path.closePath();

      return canvas.getContext("2d").isPointInPath(path, x, y);
    });

    if (clickedIndex !== -1) {
      setSelectedPolygonIndex(clickedIndex);
    } else {
      setSelectedPolygonIndex(null);
    }
  };

  // const handleDeleteSelected = () => {
  //   if (selectedPolygonIndex === null) return;
  //   const updated = [...polygons];
  //   updated.splice(selectedPolygonIndex, 1);
  //   setPolygons(updated);
  //   setSelectedPolygonIndex(null);
  // };
  const handleDeleteSelected = () => {
    if (selectedPolygonIndex === null) return;
    setPolygons([]);
    setSelectedPolygonIndex(null);
  };

  const handleSend = async () => {
    if (polygons.length === 0) return alert("Draw at least one polygon");

    const payload = {
      camera_id: cameraDetails.id,
      polygon_points: polygons.flatMap((polygon) =>
        polygon.map((pt) => ({ x: pt.x, y: pt.y }))
      ),
    };

    try {
      const response = await createZone(payload);
      if (response) {
        setShowAlert("Coordinates sent successfully!");

        // Auto dismiss after 3 seconds
        setTimeout(() => {
          setShowAlert(false);
          if (cleanupRef.current) cleanupRef.current();
          if (
            wsRef.current?.readyState === WebSocket.OPEN ||
            wsRef.current?.readyState === WebSocket.CONNECTING
          ) {
            wsRef.current.close();
          }
          navigate("/camera");
        }, 3000);
      }
    } catch (err) {
      setShowAlert("Something went wrong", err);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const handleCancelCurrentPolygon = () => {
    setCurrentPolygon([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-xl shadow-sm">
      {/* Stream Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">
          Live Stream:{" "}
          <span className="text-blue-600">{cameraDetails.name}</span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
      </div>

      {showAlert && (
        <div className="bg-green-100 text-green-800 absolute top-44 right-0 z-30 p-2 rounded mb-2">
          {showAlert}
        </div>
      )}
      {/* Video Stream Container */}
      <div className="relative bg-black rounded-xl overflow-hidden shadow-lg mb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-300 text-lg">Loading stream...</p>
          </div>
        ) : displayedFrame ? (
          <>
            <img
              ref={imageRef}
              className="w-[1280px] h-[720px] object-contain mx-auto"
              src={`data:image/jpeg;base64,${displayedFrame}`}
              alt="Live Frame"
            />
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              onClick={handleClick}
              onContextMenu={handleRightClick}
              className="absolute top-0 left-0 w-full h-full cursor-crosshair"
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-900">
            <span className="text-5xl mb-4 text-gray-500">
              {biIcons.BiErrorAlt}
            </span>
            <p className="text-xl text-gray-400">No stream available</p>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Polygon Controls
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2
          ${
            polygons.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          }`}
            onClick={handleSend}
            disabled={polygons.length === 0}
          >
            <span>{biIcons.BiSend}</span>
            Send Coordinates
          </button>
          <button
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2
          ${
            selectedPolygonIndex === null
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
          }`}
            onClick={handleDeleteSelected}
            disabled={selectedPolygonIndex === null}
          >
            <span>{mdIcons.MdDeleteOutline}</span>
            Delete Selected
          </button>
          <button
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2
          ${
            currentPolygon.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
          }`}
            onClick={handleCancelCurrentPolygon}
            disabled={currentPolygon.length === 0}
          >
            <span>{biIcons.BiXCircle}</span>
            Cancel Drawing
          </button>
        </div>
      </div>

      {/* Detections Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>{biIcons.BiRadar}</span>
          Detections
        </h3>
        {detections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {detections.map((det, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500"
              >
                <p className="font-medium text-gray-800">{det.label}</p>
                {/* <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2.5 rounded-full"
                    style={{ width: `${det.confidence * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.round(det.confidence * 100)}% confidence
                </p> */}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500 italic">
              No detections found in current frame
            </p>
          </div>
        )}
      </div>

      {/* Instructions Panel */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm border border-blue-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>{biIcons.BiBookAlt}</span>
          How to Draw Polygons
        </h1>
        <div className="space-y-3">
          {[
            "Click on the stream to start placing points. You can add up to 7 points.",
            "To complete a polygon, either click near the first point (to auto-close it), or place the 7th point.",
            "To select an existing polygon, right-click anywhere inside it.",
            "Once selected, click the 'Delete Selected Polygon' button to remove it.",
            "If you want to cancel the polygon you're currently drawing, press 'Cancel Drawing'.",
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">{goIcons.GoDotFill}</span>
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CameraStream;

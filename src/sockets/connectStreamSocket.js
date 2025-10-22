// export const connectStreamSocket = (camera, onFrame) => {
//   if (!camera?.id) {
//     console.error('No camera ID provided');
//     return null;
//   }

//   const ws = new WebSocket(`wss://ppbnmtxzxafku2-8000.proxy.runpod.net/ws/stream/${camera.id}`);

//   const handleOpen = () => {
//     console.log('WebSocket connected');
//     ws.send(JSON.stringify({
//       action: "start_stream",
//       camera: { ...camera },
//     }));
//   };

//   const handleMessage = (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       if (data.frame) {
//         onFrame(data.frame, data.detections);
//       }
//     } catch (e) {
//       console.warn("WebSocket message error:", e);
//     }
//   };

//   const handleError = (e) => {
//     console.error("Stream WebSocket error:", e);
//   };

//   const handleClose = () => {
//     console.log("WebSocket closed");
//   };

//   // Attach event listeners
//   ws.addEventListener('open', handleOpen);
//   ws.addEventListener('message', handleMessage);
//   ws.addEventListener('error', handleError);
//   ws.addEventListener('close', handleClose);

//   return {
//     ws,
//     cleanup: () => {
//       ws.removeEventListener('open', handleOpen);
//       ws.removeEventListener('message', handleMessage);
//       ws.removeEventListener('error', handleError);
//       ws.removeEventListener('close', handleClose);
//     }
//   };
// };


export const connectStreamSocket = (camera, onFrame) => {
  if (!camera?.id) {
    console.error('No camera ID provided');
    return null;
  }

  let ws;
  let shouldReconnect = true;
  let reconnectInterval = 3000; // 3 seconds before trying to reconnect

  const connect = () => {
    ws = new WebSocket(`wss://ppbnmtxzxafku2-8000.proxy.runpod.net/ws/stream/${camera.id}`);

    ws.addEventListener('open', handleOpen);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('error', handleError);
    ws.addEventListener('close', handleClose);
  };

  const handleOpen = () => {
    console.log('✅ WebSocket connected');
    ws.send(
      JSON.stringify({
        action: "start_stream",
        camera: { ...camera },
      })
    );
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.frame) {
        onFrame(data.frame, data.detections);
      }
    } catch (e) {
      console.warn("⚠️ WebSocket message parse error:", e);
    }
  };

  const handleError = (e) => {
    console.error("❌ WebSocket error:", e);
  };

  const handleClose = () => {
    console.log("⚠️ WebSocket closed");
    if (shouldReconnect) {
      console.log(`🔄 Reconnecting in ${reconnectInterval / 1000}s...`);
      setTimeout(connect, reconnectInterval);
    }
  };

  // Initial connection
  connect();

  // Manual cleanup function
  const cleanup = () => {
    console.log("🛑 Closing WebSocket manually...");
    shouldReconnect = false;
    if (ws) {
      ws.close();
      ws.removeEventListener('open', handleOpen);
      ws.removeEventListener('message', handleMessage);
      ws.removeEventListener('error', handleError);
      ws.removeEventListener('close', handleClose);
    }
  };

  return {
    getSocket: () => ws,
    cleanup,
  };
};


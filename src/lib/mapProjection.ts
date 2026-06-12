let projectionOverlay: google.maps.OverlayView | null = null;
let attachedMap: google.maps.Map | null = null;
const pendingCallbacks = new Set<(projection: google.maps.MapCanvasProjection) => void>();

function flushProjectionReady(projection: google.maps.MapCanvasProjection) {
  if (pendingCallbacks.size === 0) return;

  const batch = Array.from(pendingCallbacks);
  pendingCallbacks.clear();

  // Defer so overlay draw callbacks cannot synchronously re-enter projection work.
  queueMicrotask(() => {
    batch.forEach((callback) => callback(projection));
  });
}

function ensureProjectionOverlay(map: google.maps.Map) {
  if (attachedMap !== map || !projectionOverlay?.getMap()) {
    attachedMap = map;

    if (!projectionOverlay) {
      projectionOverlay = new google.maps.OverlayView();
      projectionOverlay.onAdd = () => {};
      projectionOverlay.draw = function draw() {
        const projection = this.getProjection();
        if (projection) flushProjectionReady(projection);
      };
    }

    projectionOverlay.setMap(map);
    return;
  }
}

export function whenMapProjectionReady(
  map: google.maps.Map,
  callback: (projection: google.maps.MapCanvasProjection) => void,
): () => void {
  ensureProjectionOverlay(map);

  const projection = projectionOverlay?.getProjection();
  if (projection) {
    callback(projection);
    return () => {};
  }

  pendingCallbacks.add(callback);
  return () => pendingCallbacks.delete(callback);
}

export function projectLatLngToContainer(
  map: google.maps.Map,
  lat: number,
  lng: number,
): google.maps.Point | null {
  ensureProjectionOverlay(map);
  const projection = projectionOverlay?.getProjection();
  if (!projection) return null;

  return projection.fromLatLngToContainerPixel(new google.maps.LatLng(lat, lng));
}

export function projectLatLngToMapDiv(
  map: google.maps.Map,
  lat: number,
  lng: number,
): google.maps.Point | null {
  ensureProjectionOverlay(map);
  const projection = projectionOverlay?.getProjection();
  if (!projection) return null;

  return projection.fromLatLngToDivPixel(new google.maps.LatLng(lat, lng));
}

export function projectLatLngToElement(
  map: google.maps.Map,
  lat: number,
  lng: number,
  element: HTMLElement,
): { x: number; y: number } | null {
  ensureProjectionOverlay(map);
  const projection = projectionOverlay?.getProjection();
  if (!projection) return null;

  const pixel = projection.fromLatLngToContainerPixel(new google.maps.LatLng(lat, lng));
  if (!pixel) return null;

  const mapDiv = map.getDiv();
  const mapRect = mapDiv.getBoundingClientRect();
  const layerRect = element.getBoundingClientRect();

  // Container pixels are relative to the map div; shift only when the target
  // layer is not coincident with the map div (e.g. instruments on stage).
  return {
    x: pixel.x + mapRect.left - layerRect.left,
    y: pixel.y + mapRect.top - layerRect.top,
  };
}

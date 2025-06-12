function addRoomImage(src) {
  const canvas = document.getElementById("floor-canvas");
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "50px";
  wrapper.style.top = "50px";
  wrapper.style.width = "100px";
  wrapper.style.height = "100px";
  wrapper.style.userSelect = "none";
  wrapper.style.display = "inline-block";
  const img = document.createElement("img");
  img.src = src;
  img.className = "room-image";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.transform = "rotate(0deg)";
  img.setAttribute("data-angle", "0");
  const rotateButton = document.createElement("div");
  rotateButton.innerHTML = "⟳";
  rotateButton.style.position = "absolute";
  rotateButton.style.top = "-10px";
  rotateButton.style.right = "-10px";
  rotateButton.style.width = "24px";
  rotateButton.style.height = "24px";
  rotateButton.style.background = "white";
  rotateButton.style.border = "1px solid #ccc";
  rotateButton.style.borderRadius = "50%";
  rotateButton.style.cursor = "pointer";
  rotateButton.style.display = "none";
  rotateButton.style.alignItems = "center";
  rotateButton.style.justifyContent = "center";
  rotateButton.style.fontSize = "16px";
  rotateButton.style.textAlign = "center";
  rotateButton.style.zIndex = "10";
  const resizeHandle = document.createElement("div");
  resizeHandle.style.position = "absolute";
  resizeHandle.style.right = "0";
  resizeHandle.style.bottom = "0";
  resizeHandle.style.width = "12px";
  resizeHandle.style.height = "12px";
  resizeHandle.style.background = "#000";
  resizeHandle.style.cursor = "nwse-resize";
  resizeHandle.style.display = "none";
  resizeHandle.style.zIndex = "10";
  wrapper.addEventListener("mouseenter", () => {
    rotateButton.style.display = "flex";
    resizeHandle.style.display = "block";
  });
  wrapper.addEventListener("mouseleave", () => {
    rotateButton.style.display = "none";
    resizeHandle.style.display = "none";
  });
  rotateButton.addEventListener("click", () => {
    let angle = parseInt(img.getAttribute("data-angle") || "0");
    angle = (angle + 15) % 360;
    img.style.transform = `rotate(${angle}deg)`;
    img.setAttribute("data-angle", angle);
  });
  resizeHandle.addEventListener("mousedown", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = wrapper.offsetWidth;
    const startHeight = wrapper.offsetHeight;
    function resizeMove(e) {
      wrapper.style.width = startWidth + (e.clientX - startX) + "px";
      wrapper.style.height = startHeight + (e.clientY - startY) + "px";
    }
    function stopResize() {
      document.removeEventListener("mousemove", resizeMove);
      document.removeEventListener("mouseup", stopResize);
    }
    document.addEventListener("mousemove", resizeMove);
    document.addEventListener("mouseup", stopResize);
  });
  wrapper.addEventListener("mousedown", function (e) {
    if (e.target === resizeHandle || e.target === rotateButton) return;
    e.preventDefault();
    const shiftX = e.clientX - wrapper.getBoundingClientRect().left;
    const shiftY = e.clientY - wrapper.getBoundingClientRect().top;

    function moveAt(e) {
      wrapper.style.left = e.pageX - shiftX + "px";
      wrapper.style.top = e.pageY - shiftY + "px";
    }
    function stopDrag() {
      document.removeEventListener("mousemove", moveAt);
      document.removeEventListener("mouseup", stopDrag);
    }
    document.addEventListener("mousemove", moveAt);
    document.addEventListener("mouseup", stopDrag);
  });
  wrapper.appendChild(img);
  wrapper.appendChild(rotateButton);
  wrapper.appendChild(resizeHandle);
  canvas.appendChild(wrapper);
}

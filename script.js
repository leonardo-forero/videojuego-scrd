body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: linear-gradient(to top, #ffcc00, #ffffff);
  font-family: sans-serif;
}

canvas {
  display: block;
  background: url('bogota_fondo.jpg') no-repeat center center fixed;
  background-size: cover;
}

/* Logo centrado y grande */
.logo {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: auto;
  z-index: 20;
}

#scoreDisplay {
  position: absolute;
  top: 20px;
  left: 120px;
  color: red;
  font-weight: bold;
  font-size: 24px;
  z-index: 5;
}

#heartsDisplay {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 5;
}

.heart {
  width: 24px;
  height: 24px;
  background: url('corazon.png') no-repeat center center;
  background-size: contain;
}

.heart.lost {
  filter: grayscale(100%);
}

#messageBox {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  color: black;
  border: 4px solid red;
  padding: 20px;
  text-align: center;
  z-index: 10;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  border-radius: 10px;
}

#messageBox.hidden {
  display: none;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background: #ffcc00;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

button:hover {
  background: #e6b800;
}
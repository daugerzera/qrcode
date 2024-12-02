"use client";

import React, { useState, useRef } from "react";
import QRCodeGenerator from "qrcode-generator";

const QRCodePage: React.FC = () => {
  const [url, setUrl] = useState<string>(""); // URL inserida pelo usuário
  const [qrCodeSvg, setQrCodeSvg] = useState<string>(""); // SVG do QR Code
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Referência ao canvas para exportação

  // Função para gerar o QR Code
  const generateQRCode = (value: string) => {
    if (!value) {
      setQrCodeSvg("");
      return;
    }

    // Gera o QR Code
    const qr = QRCodeGenerator(0, "L");
    qr.addData(value);
    qr.make();

    // Gera o SVG para exibição e download
    setQrCodeSvg(qr.createSvgTag(8));

    // Renderiza no canvas para formatos PNG e JPEG
    const size = qr.getModuleCount() * 10; // Ajusta o tamanho com base nos módulos
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fff"; // Fundo branco
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      qr.renderTo2dContext(ctx, 10); // Renderiza no canvas
    }
    canvasRef.current = canvas;
  };

  // Manipula alterações no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setUrl(value);
    generateQRCode(value);
  };

  // Função para fazer o download
  const downloadQRCode = (format: "png" | "jpeg" | "svg") => {
    if (!canvasRef.current && format !== "svg") return;

    if (format === "svg") {
      // Converte o SVG em um Blob e faz o download
      const svgElement = document.createElement("div");
      svgElement.innerHTML = qrCodeSvg; // Reutiliza o SVG gerado no estado
      const svg = svgElement.querySelector("svg")!;
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.svg";
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Para PNG e JPEG
      const canvas = canvasRef.current!;
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const link = document.createElement("a");

      // Adiciona uma margem ao canvas
      const paddedCanvas = document.createElement("canvas");
      const padding = 20; // Margem ao redor do QR Code
      paddedCanvas.width = canvas.width + padding * 2;
      paddedCanvas.height = canvas.height + padding * 2;

      const paddedCtx = paddedCanvas.getContext("2d");
      if (paddedCtx) {
        paddedCtx.fillStyle = "#fff"; // Fundo branco
        paddedCtx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
        paddedCtx.drawImage(canvas, padding, padding); // Desenha o QR Code com margem
      }

      link.href = paddedCanvas.toDataURL(mimeType);
      link.download = `qrcode.${format}`;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1>Gerador de QR Code</h1>
      <p className="pb-4">Insira uma URL abaixo para gerar um QR Code:</p>
      <input
        className="p-2 w-[20rem] sm:w-[30rem] max-w-[500px] mb-5 border border-gray-300 rounded"
        type="text"
        placeholder="Digite uma URL"
        value={url}
        onChange={handleInputChange}
      />
      <div className="mt-2 sm:mt-8">
        {qrCodeSvg && (
          <div className="flex flex-col items-center">
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
            />
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => downloadQRCode("png")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Baixar como PNG
              </button>
              <button
                onClick={() => downloadQRCode("jpeg")}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Baixar como JPEG
              </button>
              <button
                onClick={() => downloadQRCode("svg")}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Baixar como SVG
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodePage;

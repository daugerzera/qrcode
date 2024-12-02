"use client";

import React, { useState } from "react";
import QRCodeGenerator from "qrcode-generator";

const QRCodePage: React.FC = () => {
  const [url, setUrl] = useState<string>(""); // URL inserida pelo usuário
  const [qrCodeHtml, setQrCodeHtml] = useState<string>(""); // QR Code em HTML

  const generateQRCode = (value: string) => {
    if (!value) {
      setQrCodeHtml("");
      return;
    }


    const qr = QRCodeGenerator(0, "L");
    qr.addData(value);
    qr.make();
    setQrCodeHtml(qr.createImgTag(8));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setUrl(value);
    generateQRCode(value);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1>Gerador de QR Code</h1>
      <p className="pb-4">
        Insira uma URL abaixo para gerar um QR Code:
      </p>
      <input
      className="p-2 w-[20rem] sm:w-[30rem] max-w-[500px] mb-5 border border-gray-300 rounded"
        type="text"
        placeholder="Digite uma URL"
        value={url}
        onChange={handleInputChange}
      />
      <div
        dangerouslySetInnerHTML={{ __html: qrCodeHtml }}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default QRCodePage;

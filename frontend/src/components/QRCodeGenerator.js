import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = ({ value }) => {
  return (
    <div>
      <QRCodeCanvas value={value} size={256} />
    </div>
  );
};

export default QRCodeGenerator;

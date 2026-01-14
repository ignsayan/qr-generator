import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Download, Image as ImageIcon } from "lucide-react";

export default function App() {

    const [text, setText] = useState("");
    const [qrValue, setQrValue] = useState("");

    const generateQR = () => {
        if (text.trim()) setQrValue(text);
    };

    const downloadPNG = async () => {
        const tempDiv = document.createElement("div");

        const root = createRoot(tempDiv);
        root.render(
            <QRCodeSVG value={qrValue} size={600} marginSize={1} />
        );

        await new Promise((r) => setTimeout(r, 0));

        const svg = tempDiv.querySelector("svg");
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);

        root.unmount();

        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;

        const ctx = canvas.getContext("2d");
        const img = new Image();

        const blob = new Blob([svgStr], {
            type: "image/svg+xml;charset=utf-8",
        });

        const url = URL.createObjectURL(blob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0, 600, 600);
            URL.revokeObjectURL(url);

            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            const microtime = Math.floor(Date.now() * 1000) + Math.floor(Math.random() * 1000);
            link.download = `${microtime}.png`;
            link.click();
        };

        img.src = url;
    };

    return (
        <div className="app">
            <div className="card">
                <h1 className="title">QR Code Generator</h1>
                <small className="card-footer">
                    d e v e l o p e d &nbsp; b y <strong> S A Y A N</strong>
                </small>
                <input
                    type="text"
                    className="input"
                    placeholder="Enter text or URL"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <button className="btn primary" onClick={generateQR}>
                    <ImageIcon className="btn-icon" />
                    Generate Image
                </button>

                {qrValue && (
                    <div className="qr-section">
                        <button className="btn secondary" onClick={downloadPNG}>
                            <Download className="btn-icon" />
                            Download PNG
                        </button>

                        <div className="qr-preview">
                            <QRCodeSVG value={qrValue} size={200} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

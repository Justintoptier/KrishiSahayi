import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaTimes, FaSpinner } from "react-icons/fa";
import QRCode from "qrcode";

const UPIPaymentmodal = ({
  isOpen, onClose, onSuccess,
  amount, farmerName, farmerUpiId, cartItems = [],
}) => {
  const canvasRef           = useRef(null);
  const [step, setStep]     = useState("qr");
  const [copied, setCopied] = useState(false);

  const upiId  = farmerUpiId;
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(farmerName)}&am=${amount}&cu=INR&tn=KrishiSahayi Order`;

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    setStep("qr");
    QRCode.toCanvas(canvasRef.current, upiUrl, {
      width: 200, margin: 2,
      color: { dark: "#1a1a1a", light: "#ffffff" },
    });
  }, [isOpen, upiUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setStep("confirming");
    setTimeout(() => {
      setStep("done");
      setTimeout(() => { onSuccess?.(); setStep("qr"); onClose(); }, 1800);
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-5 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <FaTimes />
          </button>
          <p className="text-green-100 text-xs font-semibold uppercase tracking-widest mb-1">UPI Payment</p>
          <h2 className="text-2xl font-bold">Pay ₹{amount?.toLocaleString("en-IN")}</h2>
          <p className="text-green-100 text-sm mt-1">to {farmerName}</p>
        </div>

        <div className="px-6 py-5">
          {step === "qr" && (
            <>
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Summary</p>
                <div className="space-y-2">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} × {item.quantity}</span>
                      <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-green-600">₹{amount?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center mb-5">
                <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100">
                  <canvas ref={canvasRef} className="rounded-lg" />
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Scan with GPay, PhonePe, Paytm, or any UPI app
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">or pay using UPI ID</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* UPI ID */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5">
                <span className="flex-1 text-sm font-mono text-gray-700 truncate">{upiId}</span>
                <button
                  onClick={handleCopy}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    copied ? "bg-green-100 text-green-700" : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl transition-all text-sm shadow-md"
              >
                I've Completed the Payment ✓
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Click only after your UPI app shows "Payment Successful"
              </p>
            </>
          )}

          {step === "confirming" && (
            <div className="flex flex-col items-center py-12 gap-4">
              <FaSpinner className="text-green-500 text-4xl animate-spin" />
              <p className="text-gray-700 font-semibold text-lg">Confirming payment…</p>
              <p className="text-gray-400 text-sm text-center">Please wait while we record your order</p>
            </div>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              <p className="text-gray-800 font-bold text-xl">Payment Confirmed!</p>
              <p className="text-gray-500 text-sm text-center">Your order is being placed. The farmer will be notified.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentmodal;
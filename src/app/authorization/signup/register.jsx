"use client";
import { useState, useRef } from "react";
import { register } from "@/app/service/AuthService";
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    username: "",
    display_name: "",
    created_at: "2025-07-16T06:56:54.883Z",
    role_id: "",
    img_url: "",
    flagDelete: 1, // set active (demo)
  });

  const fakeData = ({
    username: "jineman",
    password: "12345678",
    email: "jinemn@example.com",
    phone: "0909000678",
    img_url: "",
    display_name: "ayme",
    created_at: "2025-07-16T04:23:31.229Z",
    role_id: "",
    flagDelete: 1
  })

  const [imgPreview, setImgPreview] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgZoom, setImgZoom] = useState(1);
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef();
  const imgContainerRef = useRef();
  const [errors, setErrors] = useState({});

  // Step navigation
  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      // Email
      if (!formData.email) {
        newErrors.email = "Email không được để trống.";
      } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ.";
      }
      // Phone
      if (!formData.phone) {
        newErrors.phone = "Số điện thoại không được để trống.";
      } else if (!/^0\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = "Số điện thoại không hợp lệ.";
      }

      // Password
      if (!formData.password) {
        newErrors.password = "Mật khẩu không được để trống.";
      } else if (formData.password.length < 8) {
        newErrors.password = "Mật khẩu phải từ 8 ký tự trở lên.";
      }
    }
    if (step === 2) {
      if (!formData.username) {
        newErrors.username = "Username không được để trống.";
      } else if (formData.username.length < 6) {
        newErrors.username = "username không được nhỏ hơn 6 ký tự.";
      }

      if (!formData.display_name) {
        newErrors.display_name = "display name không được để trống."
      } else if (formData.display_name.length < 4) {
        {
          newErrors.username = "display name không được nhỏ hơn 4 ký tự.";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setErrors({});
      setStep(step + 1);
    }
  };
  const handleBack = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  // Input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img_url" && files && files[0]) {
      const file = files[0];
      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
      setFormData({ ...formData, img_url: file });
      setImgZoom(1);
      setImgOffset({ x: 0, y: 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Drag & drop for image
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
      setFormData({ ...formData, img_url: file });
      setImgZoom(1);
      setImgOffset({ x: 0, y: 0 });
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setImgZoom((z) => Math.max(1, Math.min(3, z - e.deltaY * 0.001)));
  };
  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - imgOffset.x, y: e.clientY - imgOffset.y });
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setImgOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => {
    setDragging(false);
  };

  const fetchingCreateNewUser = async (dataUser) => {
    try {
      const response = await register(dataUser);
      console.log("data register: ", response);
      if (response.status === 201) {
        toast.success("create Success");
        setStep(4);

      } else {
        toast.error(response.data?.detail?.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("error call api register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-2">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="bg-white p-7 rounded-xl shadow w-full max-w-md border border-blue-100">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-700">Đăng ký tài khoản</h2>
        <div className="flex items-center justify-center mb-6">
          <div className="flex w-2/3">
            <div className={`flex-1 h-2 rounded-l-xl ${step === 1 ? "bg-blue-600" : "bg-blue-200"}`}></div>
            <div className={`flex-1 h-2 ${step === 2 ? "bg-blue-600" : "bg-blue-200"}`}></div>
            <div className={`flex-1 h-2 rounded-r-xl ${step === 3 ? "bg-blue-600" : "bg-blue-200"}`}></div>
          </div>
        </div>
        <form className="space-y-5">
          {step === 1 && (
            <>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                required
              />
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              <input
                name="phone"
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                required
              />
              {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                required
              />
              {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Next
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                required
              />
              {errors.username && <div className="text-red-500 text-xs mt-1">{errors.username}</div>}
              <input
                name="display_name"
                type="text"
                placeholder="Display Name (optional)"
                value={formData.display_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="flex flex-col items-center gap-3">
                <label className="w-full text-left text-gray-500 text-sm mb-1">Avatar (optional)</label>
                <div
                  ref={imgContainerRef}
                  className="relative w-40 h-40 rounded-full border-2 border-blue-200 bg-blue-50 flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onWheel={imgPreview ? handleWheel : undefined}
                  onMouseDown={imgPreview ? handleMouseDown : undefined}
                  onMouseMove={imgPreview ? handleMouseMove : undefined}
                  onMouseUp={imgPreview ? handleMouseUp : undefined}
                  onMouseLeave={imgPreview ? handleMouseUp : undefined}
                  title="Kéo thả hoặc click để chọn/căn chỉnh ảnh"
                  style={{ userSelect: 'none' }}
                >
                  {imgPreview ? (
                    <img
                      src={imgPreview}
                      alt="Preview"
                      style={{
                        width: `${imgZoom * 100}%`,
                        height: `${imgZoom * 100}%`,
                        objectFit: 'cover',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) scale(${imgZoom}) translate(${imgOffset.x}px, ${imgOffset.y}px)`
                      }}
                      draggable={false}
                    />
                  ) : (
                    <span className="text-blue-300 text-sm">Kéo thả hoặc click để chọn ảnh</span>
                  )}
                  <input
                    ref={fileInputRef}
                    name="img_url"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
                <div className="flex gap-2 mt-2 w-full">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => fetchingCreateNewUser(formData)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                  >
                    Confirm
                  </button>
                </div>
                <div className="w-full text-xs text-gray-400 text-center mt-2">Bạn có thể kéo để di chuyển ảnh, cuộn để zoom.</div>
              </div>
            </>
          )}
          {step === 4 && (
            <div className="text-center text-blue-600 font-semibold py-10">Đăng ký thành công!</div>
          )}
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/authorization/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

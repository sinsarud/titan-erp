import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import Swal from 'sweetalert2';

// 👑 Component โลโก้มงกุฎทอง (Premium Gold Crown SVG) 
const CrownLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gold-grad" x1="0" y1="100" x2="100" y2="0">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="20%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="80%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#FFFBEB" />
      </linearGradient>
      <linearGradient id="gold-base" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="50%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#D97706" floodOpacity="0.3" />
      </filter>
    </defs>
    <g filter="url(#glow-gold)">
      <path d="M 15 80 Q 50 85 85 80 L 80 65 Q 50 70 20 65 Z" fill="url(#gold-base)" />
      <path d="M 20 65 L 10 30 L 30 45 L 50 15 L 70 45 L 90 30 L 80 65 Q 50 70 20 65 Z" fill="url(#gold-grad)" stroke="#FEF08A" strokeWidth="1" />
      <circle cx="10" cy="30" r="4" fill="#FFFBEB" />
      <circle cx="30" cy="45" r="3" fill="#FFFBEB" />
      <circle cx="50" cy="15" r="5" fill="#FFFBEB" />
      <circle cx="70" cy="45" r="3" fill="#FFFBEB" />
      <circle cx="90" cy="30" r="4" fill="#FFFBEB" />
      <ellipse cx="50" cy="74" rx="4" ry="2" fill="#FFFBEB" />
      <ellipse cx="30" cy="72" rx="3" ry="1.5" fill="#FFFBEB" />
      <ellipse cx="70" cy="72" rx="3" ry="1.5" fill="#FFFBEB" />
    </g>
  </svg>
);

const translations = {
  TH: {
    menuDash: "🏠 กลับหน้าหลัก", menuCheck: "⏰ ลงเวลาเข้า-ออก", menuLogout: "ออกจากระบบ",
    appName: "Pancake Lovely Enrichment HR", title: "บันทึกเวลาทำงาน", subtitle: "กรุณาถ่ายภาพเซลฟี่เพื่อยืนยันตัวตนในพื้นที่",
    statusScanning: "กำลังสแกนพื้นที่...", errNoMap: "⚠️ ยังไม่ได้ตั้งค่าแผนที่สาขา", errGpsWeak: "⚠️ สัญญาณ GPS อ่อน",
    errGpsMove: "ม. กรุณาขยับหาสัญญาณ", successLocation: "✅ คุณอยู่ในพื้นที่:", errOutZone: "❌ คุณอยู่นอกเขตพื้นที่ทำงาน",
    errNoGps: "❌ ไม่สามารถเข้าถึง GPS ได้", distLabel: "ระยะห่างจากจุดศูนย์กลาง:", unitMeter: "เมตร",
    btnClockIn: "🌞 ลงเวลา เข้างาน", btnClockOut: "🌙 ลงเวลา ออกงาน", btnSnap: "📸 ถ่ายภาพยืนยัน",
    btnSaving: "⏳ กำลังบันทึกข้อมูล...", btnConfirmIn: "🚀 ยืนยัน ลงเวลาเข้างาน", btnConfirmOut: "🚀 ยืนยัน ลงเวลาออกงาน",
    btnRetake: "🔄 ถ่ายใหม่อีกครั้ง", btnCancel: "❌ ยกเลิก", alertCheckedIn: "⚠️ ตอนนี้คุณอยู่ในสถานะเข้างานแล้ว",
    alertCheckedOut: "⚠️ ตอนนี้คุณอยู่ในสถานะออกงานแล้ว", alertSuccess: "🎉 บันทึกเวลาสำเร็จ!", roleAdmin: "ผู้ดูแลระบบ",
    roleStaff: "พนักงาน", statusIn: "เข้างานล่าสุด:", statusOut: "ออกงานล่าสุด:", errorPrefix: "เกิดข้อผิดพลาด: "
  },
  EN: {
    menuDash: "🏠 Back to Dashboard", menuCheck: "⏰ Timestamp", menuLogout: "Logout",
    appName: "Pancake Lovely Enrichment HR", title: "Attendance Recording", subtitle: "Please take a selfie to verify your location.",
    statusScanning: "Scanning...", errNoMap: "⚠️ No map setup.", errGpsWeak: "⚠️ Weak GPS",
    errGpsMove: "m. Please move.", successLocation: "✅ Work Zone:", errOutZone: "❌ Out of Zone",
    errNoGps: "❌ GPS Access Denied", distLabel: "Distance:", unitMeter: "m.",
    btnClockIn: "🌞 Clock In", btnClockOut: "🌙 Clock Out", btnSnap: "📸 Capture",
    btnSaving: "⏳ Saving...", btnConfirmIn: "🚀 Confirm In", btnConfirmOut: "🚀 Confirm Out",
    btnRetake: "🔄 Retake", btnCancel: "❌ Cancel", alertCheckedIn: "⚠️ Already clocked in.",
    alertCheckedOut: "⚠️ Already clocked out.", alertSuccess: "🎉 Recorded!", roleAdmin: "Admin",
    roleStaff: "Staff", statusIn: "Last In:", statusOut: "Last Out:", errorPrefix: "Error: "
  }
};

// ✨ เพิ่มโหมด TikTok เข้าไปในตัวเลือก
const cameraFilters = {
  none: { name: "🟢 สด (Original)", css: "none" },
  tiktok: { name: "🎵 ติ๊กต๊อก (Magic)", css: "brightness(1.1) saturate(1.2) contrast(1.05)" },
  beauty: { name: "✨ ผ่องใส (Beauty)", css: "brightness(1.15) contrast(1.05) saturate(1.2)" },
  warm: { name: "☀️ อบอุ่น (Warm)", css: "sepia(0.3) saturate(1.4) brightness(1.1) hue-rotate(-10deg)" },
  vintage: { name: "🎞️ วินเทจ (Vintage)", css: "sepia(0.6) contrast(1.2) brightness(0.9) saturate(1.1)" },
  bw: { name: "🖤 ขาวดำ (B&W)", css: "grayscale(100%) contrast(1.2) brightness(1.1)" }
};

export default function CheckIn() {
  const [user] = useState(JSON.parse(localStorage.getItem("titan_user")));
  const navigate = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem("titan_lang") || "TH");
  const t = translations[lang];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [statusMsg, setStatusMsg] = useState(t.statusScanning);
  const [isInside, setIsInside] = useState(false);
  const [distance, setDistance] = useState(null);
  const [nearestBranch, setNearestBranch] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [timestampType, setTimestampType] = useState(null); 
  const [imageSrc, setImageSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recentLogs, setRecentLogs] = useState([]);
  
  const [activeFilter, setActiveFilter] = useState('none');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const addNotificationToBell = (title, message) => {
    const savedNotifs = localStorage.getItem("titan_notifications");
    const currentNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
    const newNotif = { id: Date.now(), title, message, isRead: false, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.' };
    localStorage.setItem("titan_notifications", JSON.stringify([newNotif, ...currentNotifs]));
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180; const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180; const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return Math.round(R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
  };

const fetchBranches = async () => {
    const { data } = await supabase.from("branches").select("*");
    if (!data || data.length === 0) return setStatusMsg(t.errNoMap);

    let attempts = 0;
    const maxAttempts = 3; // กำหนดให้พยายามค้นหาสัญญาณสูงสุด 3 รอบ

    const tryGetLocation = () => {
      attempts++;
      if (attempts > 1) {
        setStatusMsg(`กำลังปรับจูนสัญญาณ GPS... (ครั้งที่ ${attempts}/3)`);
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;

          // 🛠️ ถ้าระยะคลาดเคลื่อนเกิน 800m และยังลองไม่ครบ 3 ครั้ง ให้รอ 2 วินาทีแล้วดึงใหม่
          // (ให้เวลามือถือสลับไปจับสัญญาณ Wi-Fi ในตึกเพื่อให้แม่นยำขึ้น)
          if (accuracy > 800 && attempts < maxAttempts) {
            setTimeout(tryGetLocation, 2000);
            return;
          }

          // ถ้าพยายามครบ 3 ครั้งแล้วสัญญาณยังเกิน 800m อยู่ ค่อยแจ้ง Error (รักษามาตรฐานความปลอดภัยไว้)
          if (accuracy > 800) {
            setStatusMsg(`${t.errGpsWeak} (${Math.round(accuracy)} ${t.errGpsMove})`);
            return;
          }

          setLocation({ lat: latitude, lng: longitude });
          let closest = null; let minDistance = Infinity;

          data.forEach((b) => {
            const d = calculateDistance(latitude, longitude, b.lat, b.lng);
            if (d < minDistance) { minDistance = d; closest = b; }
          });

          if (closest && minDistance <= closest.radius_m) {
            setNearestBranch(closest); setDistance(minDistance); setIsInside(true);
            setStatusMsg(`${t.successLocation} ${closest.name}`);
          } else {
            setIsInside(false); setStatusMsg(t.errOutZone);
          }
        },
        (err) => {
          // ถ้าดึงสัญญาณไม่สำเร็จ (เช่น Timeout) ให้ลองใหม่จนกว่าจะครบโควต้า
          if ((err.code === err.TIMEOUT || err.code === err.POSITION_UNAVAILABLE) && attempts < maxAttempts) {
            setTimeout(tryGetLocation, 2000);
          } else {
            setStatusMsg(t.errNoGps);
          }
        },
        { 
          enableHighAccuracy: true, 
          maximumAge: 0, // 🔒 บังคับดึงพิกัดสดใหม่ ห้ามใช้พิกัดเก่าที่ค้างในแคชของเครื่อง
          timeout: 7000  // ⏳ ให้เวลามือถือคำนวณพิกัดนานขึ้น (7 วินาทีต่อรอบ)
        }
      );
    };

    tryGetLocation();
  };

  const fetchTodayLog = async () => {
    const now = new Date();
    // ✅ ดึงข้อมูลย้อนหลัง 24 ชั่วโมง เพื่อให้รองรับคนเข้ากะข้ามวัน
    const past24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const startFetch = past24Hours.toISOString(); 

    try {
      const { data, error } = await supabase
        .from("attendance_logs")
        .select("*")
        .eq("employee_id", user.id)
        .gte("created_at", startFetch)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setRecentLogs(data || []);

      if (data && data.length > 0) {
        const latestLog = data[data.length - 1];
        setHasCheckedIn(latestLog.log_type === 'check_in');
        setHasCheckedOut(false);

        const lastIn = [...data].reverse().find(l => l.log_type === 'check_in');
        const lastOut = [...data].reverse().find(l => l.log_type === 'check_out');
        
        if (lastIn) setCheckInTime(new Date(lastIn.timestamp || lastIn.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }));
        if (lastOut) setCheckOutTime(new Date(lastOut.timestamp || lastOut.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }));
      } else {
        setHasCheckedIn(false); setHasCheckedOut(false);
        setCheckInTime(null); setCheckOutTime(null);
      }
    } catch (err) { console.error("fetchTodayLog Error:", err); }
  };

  useEffect(() => {
    if (!user) return navigate("/login");
    fetchBranches(); fetchTodayLog();
    return () => stopCamera();
  }, [user, navigate, stopCamera]);

  const openCameraFor = async (type) => {
    // โค้ดเดิมกลับมาแล้ว เงื่อนไขการห้ามกดออกถ้ายังไม่เข้าอยู่ครบ
    if (type === 'IN' && hasCheckedIn) return alert(t.alertCheckedIn);
    if (type === 'OUT' && !hasCheckedIn) return alert("กรุณาลงเวลาเข้างานก่อนครับ");

    setTimestampType(type);
    setIsCameraOpen(true);
    setActiveFilter('none');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { alert(t.errorPrefix + err.message); setIsCameraOpen(false); }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current; const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 300; canvas.height = video.videoHeight || 225;
    
    // 🛠️ พลิกซ้ายขวาให้เหมือนกระจก
    ctx.translate(canvas.width, 0); 
    ctx.scale(-1, 1);
    
    if (activeFilter === 'tiktok') {
        ctx.filter = cameraFilters.tiktok.css;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        ctx.globalAlpha = 0.4;
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(6px)';
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'none';
        
        ctx.fillStyle = "rgba(255, 105, 180, 0.4)";
        ctx.filter = "blur(15px)";
        ctx.beginPath();
        ctx.arc(canvas.width/2 - 60, canvas.height/2 + 20, 25, 0, Math.PI*2); 
        ctx.arc(canvas.width/2 + 60, canvas.height/2 + 20, 25, 0, Math.PI*2); 
        ctx.fill();
        ctx.filter = 'none';
        
        ctx.translate(canvas.width, 0); 
        ctx.scale(-1, 1);
        ctx.font = "30px Arial";
        ctx.fillText("✨", 20, 40);
        ctx.fillText("💖", canvas.width - 50, 60);
        ctx.fillText("✨", canvas.width - 40, canvas.height - 40);
        ctx.font = "20px Arial";
        ctx.fillText("🌸", 40, canvas.height - 30);

    } else {
        ctx.filter = cameraFilters[activeFilter].css;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    setImageSrc(canvas.toDataURL('image/jpeg', 0.8)); stopCamera(); setIsCameraOpen(false);
  };

  const handleCheckIn = async () => {
    if (!imageSrc || isUploading) return;
    setIsUploading(true);
    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const randomStr = Math.random().toString(36).substring(7);
      
      const safeEmpCode = (user.employee_code || user.username || 'EMP').toString().replace(/[^a-zA-Z0-9-]/g, '_');
      const fileName = `${safeEmpCode}_${Date.now()}_${randomStr}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from("selfies")
        .upload(fileName, blob, { contentType: 'image/jpeg' });
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage.from("selfies").getPublicUrl(fileName);

      const now = new Date();
      let lateMins = 0;
      let otMins = 0; let logStatus = 'normal';
      let targetShiftTime = "ไม่ระบุกะ";
      
      const { data: shiftData } = await supabase.from('system_settings').select('setting_value').eq('setting_key', 'shift_roster').maybeSingle();
      let allShifts = {};
      
      if (shiftData && shiftData.setting_value) {
        allShifts = JSON.parse(shiftData.setting_value);
      }

      const dayNum = now.getDay(); 
      const myShifts = allShifts[user.id]?.[dayNum];
      const sessions = Array.isArray(myShifts) ? myShifts : (myShifts && !myShifts.off ? [myShifts] : []);
      const isOffDay = !myShifts || myShifts.off === true || sessions.length === 0;

      if (timestampType === 'IN' && !isOffDay) {
        let bestMatchShift = sessions[0];
        const nowMins = now.getHours() * 60 + now.getMinutes();
        let minDiff = Infinity;
        
        sessions.forEach(s => {
          if(!s.in) return;
          const [sH, sM] = s.in.split(':').map(Number);
          const shiftMins = sH * 60 + sM;
          const diff = Math.abs(nowMins - shiftMins);
          if (diff < minDiff) { minDiff = diff; bestMatchShift = s; }
        });
        
        if (bestMatchShift && bestMatchShift.in) {
          targetShiftTime = bestMatchShift.in;
          const [inH, inM] = bestMatchShift.in.split(':').map(Number);
          const shiftStart = new Date();
          shiftStart.setHours(inH, inM, 0, 0);
          
          if (now > shiftStart) { 
            lateMins = Math.floor((now - shiftStart) / 60000);
            logStatus = 'late';
          }
        }
      } else if (timestampType === 'OUT' && !isOffDay) {
        let lastShift = sessions[sessions.length - 1];
        if (lastShift && lastShift.out) {
          const [outH, outM] = lastShift.out.split(':').map(Number);
          const shiftEnd = new Date();
          shiftEnd.setHours(outH, outM, 0, 0);
          if (now > shiftEnd) otMins = Math.floor((now - shiftEnd) / 60000);
        }
      }

      // ✅ บังคับ Override ค่าสายให้เป็น 0 และสถานะปกติ เพื่อไม่ให้โชว์คำว่าสายในระบบ
      lateMins = 0;
      logStatus = 'normal';

      const logEntry = { 
        employee_id: user.id, 
        branch_id: nearestBranch.id, 
        lat: location.lat, 
        lng: location.lng, 
        distance_m: distance, 
        is_within_radius: true, 
        selfie_url: urlData.publicUrl, 
        log_type: timestampType === 'IN' ? 'check_in' : 'check_out', 
        status: logStatus, 
        late_minutes: lateMins, 
        ot_minutes: otMins,
        timestamp: now.toISOString() 
      };
      
      const { error: dbError } = await supabase.from("attendance_logs").insert([logEntry]);
      if (dbError) throw dbError;
      
      const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      const formatDuration = (mins) => {
        if (mins < 60) return `${mins} นาที`;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return m > 0 ? `${h} ชั่วโมง ${m} นาที` : `${h} ชั่วโมง`;
      };
     
      Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 1500, customClass: { popup: 'rounded-3xl' } });
      setImageSrc(null); 
      setTimestampType(null); 
      setActiveFilter('none');
      if (typeof fetchTodayLog === 'function') fetchTodayLog();
    } catch (err) { 
      Swal.fire('ผิดพลาด', err.message, 'error');
    } finally { 
      setIsUploading(false); 
    }
  };

  const changeLang = (newLang) => { setLang(newLang);
    localStorage.setItem("titan_lang", newLang); 
  };

  return (
    <div className="flex h-screen bg-[#fffbfb] font-sans overflow-hidden relative">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 z-[90] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>}
      
      {/* 🏰 SIDEBAR Luxury Edition */}
      <div className={`fixed lg:static inset-y-0 left-0 z-[100] w-72 bg-gradient-to-b from-[#881337] via-[#9f1239] to-[#4c0519] transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out shadow-2xl flex flex-col justify-between lg:translate-x-0`}>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-8 flex flex-col items-center justify-center border-b border-rose-300/20 relative flex-shrink-0">
            <style>
              {`
                @keyframes premium-shine {
                  0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
                  20% { transform: translateX(150%) skewX(-20deg); opacity: 0.5; }
                  100% { transform: translateX(150%) skewX(-20deg); opacity: 0; }
                }
                .animate-premium-shine {
                  animation: premium-shine 3s infinite;
                }
              `}
            </style>

            <div className="relative mb-3 group overflow-hidden rounded-full p-1 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <CrownLogo className="w-16 h-16 drop-shadow-[0_0_15px_rgba(253,224,71,0.4)] transition-transform duration-500 group-hover:scale-110 relative z-10" />
              <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 -z-10 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent animate-premium-shine z-20 pointer-events-none"></div>
            </div>

            <h2 className="text-white font-serif font-black text-2xl tracking-tighter text-center leading-tight cursor-pointer" onClick={() => navigate('/dashboard')}>Pancake</h2>
            <p className="text-[10px] font-bold text-rose-300 uppercase tracking-[0.15em] mt-1 text-center italic cursor-pointer" onClick={() => navigate('/dashboard')}>Lovely Enrichment HR</p>
            <p className="text-[8px] text-amber-400/80 font-black uppercase tracking-widest mt-1">Premium HR Platform</p>
        
            <div className="mt-2 -mb-4 flex flex-col items-center justify-center select-none group cursor-default">
              <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-all duration-500">
                <div className="w-1.5 h-[1px] bg-rose-400/50 group-hover:w-4 group-hover:bg-rose-400 transition-all duration-500"></div>
                <span className="text-[6.5px] font-bold text-rose-200/80 uppercase tracking-[0.3em] leading-none">DEVELOPED BY</span>
                <div className="w-1.5 h-[1px] bg-rose-400/50 group-hover:w-4 group-hover:bg-rose-400 transition-all duration-500"></div>
              </div>
              
              <span className="text-[8px] sm:text-[9px] font-black mt-1 uppercase tracking-[0.15em] text-white/30 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-200 group-hover:to-amber-200 transition-all duration-500 transform group-hover:scale-105 leading-none pb-1">
                {String.fromCharCode(83, 105, 110, 115, 97, 114, 117, 100, 32, 87, 111, 111, 116, 116, 105, 115, 105, 110)}
              </span>
            </div>
            
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 text-rose-200/50 hover:text-white text-xl">✕</button>
          </div>

          <div className="px-6 py-6 flex-shrink-0">
            <div className="flex flex-col items-center text-center gap-3 bg-white/10 p-5 rounded-2xl border border-white/10 shadow-inner relative group">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#881337] font-black text-3xl shadow-md overflow-hidden border-2 border-white/50 relative">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="User" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  (typeof lang !== 'undefined' && lang === 'EN' && user?.name_en) ? user.name_en.charAt(0) : (user?.full_name?.charAt(0) || 'U')
                )}
              </div>
              
              <div className="flex flex-col items-center w-full overflow-hidden">
                <span className="font-bold text-sm text-white truncate w-full" title={user?.full_name}>
                  {(typeof lang !== 'undefined' && lang === 'EN' && user?.name_en) ? user.name_en : (user?.full_name || 'ไม่ระบุชื่อ')}
                </span>
                <span className="text-[10px] font-medium text-rose-200 truncate mt-0.5 w-full">
                  {user?.position || 'Staff'}
                </span>
                
                <span className="text-[9px] px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md text-white font-black tracking-widest uppercase mt-2 w-fit border border-amber-400/50 shadow-md">
                  ROLE: {user?.role === 'admin' ? 'SUPER ADMIN' : user?.role === 'ceo' ? 'CEO' : 'USER'}
                </span>

                <button
                  onClick={() => {
                    const empCode = user?.employee_code || 'N/A';
                    const fullName = user?.full_name || 'ชื่อ-นามสกุล';
                    const nickname = user?.nickname ? `(${user.nickname})` : '';
                    const profileImg = user?.profile_picture;
                    const position = user?.position || 'STAFF';

                    const roleSettings = {
                      'ceo': { name: 'CHIEF EXECUTIVE OFFICER', color: '#B45309', bg: '#FFFBEB', border: '#FDE68A' },
                      'admin': { name: 'SYSTEM ADMINISTRATOR', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' },
                      'employee': { name: 'STAFF / STREAMER', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' }
                    };
                    const myRole = roleSettings[user?.role] || roleSettings['employee'];

                    Swal.fire({
                      showConfirmButton: false, showCloseButton: true, background: 'transparent',
                      backdrop: `rgba(0, 0, 0, 0.85) backdrop-filter backdrop-blur-lg`,
                      customClass: { popup: 'p-0 border-0 bg-transparent shadow-none', closeButton: 'text-white hover:text-rose-500 text-5xl mt-2' },
                      html: `
                        <div style="width: 320px; height: 620px; background: white; border-radius: 35px; overflow: hidden; position: relative; display: flex; flex-direction: column; box-shadow: 0 40px 100px rgba(0,0,0,0.7); margin: auto;">
                          <div style="height: 250px; background: linear-gradient(180deg, #E11D48 0%, #9F1239 100%); display: flex; flex-direction: column; align-items: center; position: relative; padding-top: 20px;">
                            <div style="width: 55px; height: 11px; background: rgba(0,0,0,0.3); border-radius: 10px; margin-bottom: 30px;"></div>
                            <h1 style="color: white; margin: 0; font-size: 44px; font-weight: 900; letter-spacing: -1.5px; font-style: italic; font-family: 'Arial Black', sans-serif;">Pancake</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 11px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;">Lovely Enrichment</p>
                            <div style="height: 50px;"></div> 
                          </div>
                          <div style="display: flex; justify-content: center; margin-top: -95px; z-index: 10; position: relative;">
                            <div style="width: 155px; height: 155px; background: white; border-radius: 50%; padding: 8px; box-shadow: 0 15px 35px rgba(0,0,0,0.25);">
                              <div style="width: 100%; height: 100%; background: #F1F5F9; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid #E2E8F0; overflow: hidden;">
                                ${profileImg ? `<img src="${profileImg}" style="width: 100%; height: 100%; object-fit: cover;" />` : `<span style="font-size: 65px; font-weight: 900; color: #CBD5E1;">${fullName.substring(0,1)}</span>`}
                              </div>
                            </div>
                          </div>
                          <div style="flex: 1; padding: 25px 20px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="margin-bottom: 20px;">
                              <h2 style="margin: 0; font-size: 20px; font-weight: 950; color: #1E293B; line-height: 1.2;">${fullName}</h2>
                              <p style="margin: 5px 0 0 0; font-size: 13px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 1.5px;">${position}</p>
                              ${nickname ? `<p style="margin: 8px 0 0 0; font-size: 15px; font-weight: 700; color: #E11D48; letter-spacing: 0.5px;">${nickname}</p>` : ''}
                            </div>
                            <div style="background: ${myRole.bg}; border: 1.5px solid ${myRole.border}; padding: 7px 22px; border-radius: 50px; margin-bottom: 25px;">
                              <p style="margin: 0; font-size: 11px; font-weight: 900; color: ${myRole.color}; letter-spacing: 1.5px; text-transform: uppercase;">${myRole.name}</p>
                            </div>
                            <div style="margin-top: auto; width: 100%; display: flex; flex-direction: column; align-items: center; padding-bottom: 10px;">
                              <div style="display: flex; justify-content: center; gap: 3px; height: 35px; margin-bottom: 10px; opacity: 0.5;">
                                <div style="width: 3px; height: 100%; background: #000;"></div><div style="width: 5px; height: 100%; background: #000;"></div><div style="width: 1px; height: 100%; background: #000;"></div><div style="width: 7px; height: 100%; background: #000;"></div><div style="width: 2px; height: 100%; background: #000;"></div><div style="width: 4px; height: 100%; background: #000;"></div>
                              </div>
                              <p style="margin: 0; font-size: 15px; font-weight: 900; color: #64748B; letter-spacing: 4px; text-transform: uppercase;">ID: ${empCode}</p>
                            </div>
                          </div>
                          <div style="height: 15px; background: linear-gradient(90deg, #E11D48, #9F1239, #E11D48);"></div>
                        </div>
                      `
                    });
                  }}
                  className="mt-4 w-full bg-white/10 hover:bg-white/20 border border-white/20 py-2.5 rounded-xl text-[11px] font-black text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  🪪 ดูบัตรพนักงานของฉัน
                </button>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto custom-scrollbar">
            <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm text-rose-200/70 hover:bg-white/5 hover:text-white transition-all">{t.menuDash}</button>
            <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm bg-white/20 text-white shadow-lg border border-white/10">{t.menuCheck}</button>
          </nav>
        </div>

        <div className="p-6 border-t border-rose-300/10 flex-shrink-0">
          <button onClick={() => { stopCamera(); localStorage.removeItem('titan_user'); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-950/40 hover:bg-rose-500 text-rose-200 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">🚪 {t.menuLogout}</button>
        </div>
      </div>

      {/* 📱 MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative items-center p-4 md:p-8 w-full bg-[#fffbfb]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>

        {/* Top Bar Mobile */}
        <div className="w-full flex items-center justify-between mb-6 z-10 lg:hidden">
          <button className="text-slate-800 bg-white p-2.5 rounded-xl shadow-sm border border-slate-100" onClick={() => setIsSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-rose-100 flex items-center gap-2">
            <CrownLogo className="w-5 h-5" />
            <span className="text-[#881337] font-black text-[10px] uppercase tracking-widest">Pancake HR</span>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="hidden lg:flex absolute top-6 right-8 z-20 bg-white p-1 rounded-full shadow-sm border border-rose-200 items-center">
           <button onClick={() => changeLang("TH")} className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all ${lang === "TH" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>TH</button>
           <button onClick={() => changeLang("EN")} className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all ${lang === "EN" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>EN</button>
        </div>

        <div className="w-full max-w-md space-y-4 md:space-y-6 z-10 flex-1 flex flex-col justify-start mt-4">
          <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-white text-center">
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#881337] tracking-tight mb-2">{t.title}</h1>
            <p className="text-slate-500 font-medium text-xs md:text-sm italic">{t.subtitle}</p>
          </div>

          <div className={`p-6 rounded-[2.5rem] shadow-sm border text-center transition-all duration-500 ${isInside ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className={`text-3xl md:text-4xl animate-pulse`}>{isInside ? '👑' : '📍'}</span>
              <p className={`text-lg md:text-xl font-black tracking-tight ${isInside ? 'text-emerald-700' : 'text-rose-700'}`}>{statusMsg}</p>
              {distance !== null && <p className="text-[10px] md:text-xs font-bold text-slate-500 bg-white px-4 py-1.5 rounded-full border border-slate-100">{t.distLabel} {distance} {t.unitMeter}</p>}
            </div>
          </div>

          {isInside && !isCameraOpen && !imageSrc && (
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => openCameraFor('IN')} 
                disabled={hasCheckedIn} 
                className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all ${hasCheckedIn ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-rose-100 hover:border-rose-300 shadow-sm active:scale-95'}`}
              >
                <span className="text-4xl bg-rose-50 p-2 rounded-2xl">🌞</span>
                <div className="text-left">
                  <span className="font-black text-slate-800 text-base block">{t.btnClockIn}</span>
                  {hasCheckedIn ? <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md italic">เข้างานล่าสุด: {checkInTime}</span> : <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">พร้อมเริ่มงานรอบใหม่</span>}
                </div>
              </button>

              <button 
                onClick={() => openCameraFor('OUT')} 
                disabled={!hasCheckedIn} 
                className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all ${(!hasCheckedIn) ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-amber-100 hover:border-amber-300 shadow-sm active:scale-95'}`}
              >
                <span className="text-4xl bg-amber-50 p-2 rounded-2xl">🌙</span>
                <div className="text-left">
                  <span className="font-black text-slate-800 text-base block">{t.btnClockOut}</span>
                  {!hasCheckedIn && checkOutTime ? <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md italic">ออกงานล่าสุด: {checkOutTime}</span> : <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">จบกะงาน</span>}
                </div>
              </button>
            </div>
          )}

          {/* 📸 CAMERA SECTION */}
          {isInside && (isCameraOpen || imageSrc) && (
            <div className="bg-white/80 backdrop-blur-xl p-5 md:p-6 rounded-[2.5rem] shadow-xl border border-white animate-pop-in">
              <canvas ref={canvasRef} className="hidden"></canvas>
              {!imageSrc ? (
                <>
                  <div className="flex justify-between items-center mb-4 px-2">
                    <p className="font-black text-[#881337] text-sm">📸 {timestampType === 'IN' ? t.btnClockIn : t.btnClockOut}</p>
                    <button onClick={() => { stopCamera(); setIsCameraOpen(false); setActiveFilter('none'); }} className="text-rose-500 text-[10px] font-black bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 uppercase">{t.btnCancel}</button>
                  </div>
                  
                  <div className="relative rounded-3xl overflow-hidden border-4 border-rose-50 bg-slate-900 w-full aspect-[4/3] flex items-center justify-center shadow-inner group">
                    
                    {/* ✨ แถบเลื่อนเลือกฟิลเตอร์ด้านบนกล้อง */}
                    <div className="absolute top-4 left-0 w-full overflow-x-auto flex gap-2 px-4 pb-2 z-30 custom-scrollbar" style={{ scrollbarWidth: 'none' }}>
                      {Object.entries(cameraFilters).map(([key, f]) => (
                        <button
                          key={key}
                          onClick={() => setActiveFilter(key)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all shadow-md backdrop-blur-md ${activeFilter === key ? 'bg-amber-400 text-amber-900 border-2 border-white scale-105' : 'bg-slate-900/60 text-white border border-white/20 hover:bg-slate-800/80'}`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>

                    {/* ✨ Overlay เอฟเฟกต์โหมด TikTok (ตอนส่องกล้อง) */}
                    {activeFilter === 'tiktok' && (
                      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent mix-blend-screen"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-10 flex justify-between px-2">
                          <div className="w-12 h-12 bg-pink-400/40 rounded-full blur-md"></div>
                          <div className="w-12 h-12 bg-pink-400/40 rounded-full blur-md"></div>
                        </div>
                        <div className="absolute top-4 left-4 text-3xl animate-pulse drop-shadow-md">✨</div>
                        <div className="absolute top-10 right-6 text-4xl animate-bounce drop-shadow-md">💖</div>
                        <div className="absolute bottom-10 right-4 text-2xl animate-pulse drop-shadow-md">✨</div>
                        <div className="absolute bottom-8 left-8 text-2xl animate-bounce drop-shadow-md">🌸</div>
                      </div>
                     )}

                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover scale-x-[-1] transition-all duration-300"
                      style={{ filter: cameraFilters[activeFilter].css }}
                    ></video>
                    
                    <button onClick={capturePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-rose-400 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all active:scale-90 z-30">📸</button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <img src={imageSrc} className="w-full aspect-[4/3] object-cover rounded-3xl border-4 border-emerald-100 shadow-md" alt="selfie" />
                  <button onClick={handleCheckIn} disabled={isUploading} className="w-full py-4 bg-gradient-to-r from-[#881337] to-[#be123c] text-white rounded-2xl font-black text-lg shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:opacity-50">
                    {isUploading ? t.btnSaving : (timestampType === 'IN' ? t.btnConfirmIn : t.btnConfirmOut)}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => { setImageSrc(null); openCameraFor(timestampType); }} className="flex-1 py-3 text-slate-500 hover:text-slate-800 font-bold text-xs bg-slate-50 rounded-xl transition-all">{t.btnRetake}</button>
                    <button onClick={() => { setImageSrc(null); setIsCameraOpen(false); setTimestampType(null); setActiveFilter('none'); }} className="flex-1 py-3 text-rose-400 hover:text-rose-600 font-bold text-xs bg-rose-50 rounded-xl transition-all">{t.btnCancel}</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
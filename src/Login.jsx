import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // <--- เพิ่มบรรทัดนี้เข้าไปครับ!!

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ใส่ไว้เพื่อเช็คว่าโค้ดใหม่อัปเดตเข้าระบบสำเร็จแล้ว
  useEffect(() => {
    console.log("✅ โหลดหน้า Login เวอร์ชันใหม่ล่าสุดแล้ว! (ถ้าไม่เห็นข้อความนี้แปลว่าระบบยังค้างโค้ดเก่า)");
  }, []);

  // 📢 ฟังก์ชันแจ้งเตือนผ่าน LINE Messaging API (LINE OA) - ปล่อยไว้แบบนี้ไม่เป็นไรครับ เผื่ออนาคตอยากใช้
  const notifyLineOA = async (userFullName) => {
    try {
      await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_LINE_CHANNEL_ACCESS_TOKEN" 
        },
        body: JSON.stringify({
          to: "YOUR_ADMIN_USER_ID", 
          messages: [{ type: "text", text: `🚀 แจ้งเตือน: พนักงาน ${userFullName} เข้าสู่ระบบสำเร็จ` }]
        })
      });
    } catch (error) {
      console.error("❌ LINE OA Notification Error:", error);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault(); // 🛑 ป้องกันหน้าเว็บรีเฟรช 

    // 🛑 ดักจับกรณีไม่ได้กรอก Username หรือ Password
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน!',
        text: 'กรุณากรอก Username และ Password ให้ครบถ้วนก่อนเข้าสู่ระบบครับ',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ec4899',
        background: '#ffffff',
        backdrop: `rgba(15, 23, 42, 0.6) backdrop-blur-sm`,
        customClass: {
          popup: 'rounded-[2rem] shadow-2xl border border-pink-100',
          title: 'text-pink-600 font-black text-xl mt-2',
          confirmButton: 'px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-md'
        }
      });
      return; // หยุดการทำงานทันที
    }

    setLoading(true);
    console.clear();
    const searchUsername = username.trim().toLowerCase();
    console.log("🔍 กำลังเช็ค Username:", searchUsername);

    try {
      // 1. 🟢 ใช้ .eq() แบบเพียวๆ
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("username", searchUsername);

      if (error) {
        console.error("❌ Supabase Error:", error);
        throw new Error("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล");
      }

      // 2. เช็คจาก Array 
      if (!data || data.length === 0) {
        throw new Error("ไม่พบชื่อผู้ใช้งานนี้ในระบบ");
      }

      const userData = data[0]; 

      // 3. 🔴 ตรวจสอบ Password 
      if (String(userData.password) === String(password)) {
        console.log("✅ ล็อกอินสำเร็จ");
        
        // จัดการ Remember Me
        if (rememberMe) {
          localStorage.setItem("remembered_username", username);
        } else {
          localStorage.removeItem("remembered_username");
        }

        // เซฟข้อมูล
        localStorage.setItem("titan_user", JSON.stringify(userData));
        
        // 🌟 แจ้งเตือนเข้าสู่ระบบสำเร็จ (Success Popup)
        await Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ!',
          text: `ยินดีต้อนรับคุณ ${userData.full_name || userData.username} 🎉`,
          showConfirmButton: false,
          timer: 1500, 
          background: '#ffffff',
          backdrop: `rgba(15, 23, 42, 0.6) backdrop-blur-sm`,
          customClass: {
            popup: 'rounded-[2rem] shadow-2xl border border-emerald-100',
            title: 'text-emerald-600 font-black text-xl mt-2'
          }
        });
        
        navigate("/");
        
      } else {
        throw new Error("รหัสผ่านไม่ถูกต้อง");
      }

    } catch (err) {
      // 🌟 แจ้งเตือนข้อผิดพลาด
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ!',
        text: err.message,
        confirmButtonText: 'ลองใหม่อีกครั้ง',
        confirmButtonColor: '#f43f5e',
        background: '#ffffff',
        backdrop: `rgba(15, 23, 42, 0.6) backdrop-blur-sm`,
        customClass: {
          popup: 'rounded-[2rem] shadow-2xl border border-rose-100',
          title: 'text-rose-600 font-black text-xl mt-2',
          confirmButton: 'px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-md'
        }
      });
    } finally {
      setLoading(false);
    }
  };

// 🔑 ระบบจัดการลืมรหัสผ่าน (เวอร์ชันสมบูรณ์ 100% แก้โลโก้เบี้ยว + ลิงก์ตรง + ส่งเมล)
  const handleForgotPassword = async () => {
    const { value: username } = await Swal.fire({
      title: 'ลืมรหัสผ่าน?',
      text: 'กรุณากรอก Username ของคุณ',
      input: 'text',
      inputPlaceholder: 'เช่น somchai123',
      showCancelButton: true,
      confirmButtonColor: '#ec4899',
      confirmButtonText: 'ส่งรหัสชั่วคราว',
      customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-pink-100', input: 'rounded-xl text-center font-bold' }
    });

    if (username) {
      Swal.fire({ title: 'กำลังดำเนินการ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        // 1. ค้นหาพนักงานจาก Username
        const { data: emp, error } = await supabase.from('employees').select('*').eq('username', username.trim().toLowerCase()).single();
        if (error || !emp) throw new Error('ไม่พบ Username นี้ในระบบครับ');
        
        // 🛡️ เช็คว่ามีเมลใน DB ไหม
        if (!emp.email) throw new Error('พนักงานท่านนี้ไม่ได้ลงทะเบียนอีเมลไว้ กรุณาติดต่อแอดมินครับ');

        // 2. สุ่มรหัสใหม่
        const tempPass = Math.random().toString(36).slice(-4).toUpperCase() + Math.floor(Math.random() * 100);
        
        // 3. อัปเดตลง Supabase และเปิดโหมดบังคับเปลี่ยนรหัส
        const { error: updateErr } = await supabase.from('employees').update({ 
          password: tempPass, 
          require_password_change: true 
        }).eq('id', emp.id);
        if (updateErr) throw updateErr;

        // 4. 📝 บันทึกประวัติลง System Logs
        await supabase.from('system_logs').insert([{
          action: 'RESET_PASSWORD',
          details: `รีเซ็ตรหัสผ่านชั่วคราวเป็น: ${tempPass}`,
          employee_id: emp.id
        }]);

        // 5. 📧 Template อีเมลแบบพรีเมียม (ใช้ Table จัดกึ่งกลางโลโก้ + ลิงก์ไดนามิก)
       const htmlTemplate = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fffbfb; padding: 20px; border: 1px solid #fce7f3; border-radius: 30px;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px rgba(136, 19, 55, 0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 50px; margin-bottom: 10px;">👑</div>
              <h1 style="color: #881337; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">Pancake</h1>
              <p style="color: #be123c; margin: 5px 0 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-style: italic;">Lovely Enrichment HR</p>
            </div>
            
            <h2 style="color: #1e293b; font-size: 20px; text-align: center; font-weight: 800; border-bottom: 2px solid #fff1f2; padding-bottom: 20px; margin-bottom: 25px;">ข้อมูลบัญชีผู้ใช้งานใหม่</h2>
            
            <div style="background-color: #fff7ed; border: 1px solid #ffedd5; padding: 30px; margin: 25px 0; border-radius: 20px; text-align: center;">
              <p style="margin: 0 0 5px; color: #9a3412; font-size: 12px; font-weight: 800; text-transform: uppercase;">Username</p>
              <p style="margin: 0 0 20px; color: #881337; font-size: 26px; font-weight: 900;">${username}</p>
              
              <p style="margin: 0 0 5px; color: #9a3412; font-size: 12px; font-weight: 800; text-transform: uppercase;">Initial Password</p>
              <p style="margin: 0; color: #881337; font-size: 26px; font-weight: 900; letter-spacing: 2px;">${tempPass}</p>
            </div>
            
            <p style="color: #be123c; font-size: 13px; font-weight: 700; text-align: center; background-color: #fff1f2; padding: 15px; border-radius: 12px;">
              ⚠️ ระบบจะบังคับให้คุณเปลี่ยนรหัสผ่านใหม่ในการเข้าสู่ระบบครั้งแรก
            </p>
          </div>
        </div>
      `;

        // ยิงไปที่ URL Google Script
        await fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ 
            email: emp.email, 
            subject: "[Pancake ERP] รหัสผ่านชั่วคราวของคุณ", 
            html: htmlTemplate 
          })
        });

        Swal.fire({ 
          icon: 'success', 
          title: 'ส่งอีเมลเรียบร้อย!', 
          html: `รหัสผ่านชั่วคราวถูกส่งไปที่ <b class="text-pink-600">${emp.email}</b> แล้วครับ`,
          customClass: { popup: 'rounded-[2rem]' }
        });

      } catch (err) {
        Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: err.message, customClass: { popup: 'rounded-[2rem]' }});
      }
    }
  };

 return (
    // ✨ 1. เพิ่ม p-4 ตรงนี้ เพื่อไม่ให้กรอบขาวติดขอบจอมือถือ
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans p-4 sm:p-0">
      
      {/* 🌟 ฝังลูกเล่นทั้งหมดไว้ที่นี่ ก๊อปวางทีเดียวจบ ไม่ต้องยุ่งกับไฟล์ CSS อื่น */}
      <style>
        {`
          @keyframes premium-shine {
            0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
            20% { transform: translateX(150%) skewX(-20deg); opacity: 0.5; }
            100% { transform: translateX(150%) skewX(-20deg); opacity: 0; }
          }
          .animate-premium-shine { animation: premium-shine 3s infinite; }
          
          @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-bob { animation: bob 4s infinite ease-in-out; }
        `}
      </style>

      <div className="absolute w-[40rem] h-[40rem] bg-pink-200 rounded-full blur-[100px] opacity-50 top-[-10%] left-[-10%] animate-pulse"></div>
      <div className="absolute w-[40rem] h-[40rem] bg-purple-200 rounded-full blur-[100px] opacity-50 bottom-[-10%] right-[-10%] animate-pulse"></div>

      {/* ✨ 2. ปรับ p-10 เดิม ให้กลายเป็น p-6 บนมือถือ และ sm:p-10 บนคอมพ์ + 🌟 เพิ่มลูกเล่น animate-bob ให้ลอยนุ่มๆ และ group สำหรับ Hover โลโก้ */}
      <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-2xl p-6 sm:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white z-10 relative overflow-hidden animate-bob group">
        
        {/* 🌟 3. แสง Sheen วิ่งพาดการ์ด */}
        <div className="absolute top-0 left-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white to-transparent animate-premium-shine z-20 pointer-events-none mix-blend-overlay"></div>

        {/* 🌟 เพิ่ม relative z-30 เพื่อให้ตัวหนังสือ/ฟอร์มอยู่เหนือแสง Sheen */}
        <div className="text-center mb-6 sm:mb-8 relative z-30">
          {/* ✨ 3. ย่อขนาดโลโก้ลงนิดนึงบนมือถือ (w-20 h-20) + เพิ่มเอฟเฟกต์เด้งตอน Hover */}
          <PancakeLogo className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 drop-shadow-xl animate-fade-in transition-transform duration-500 group-hover:scale-110" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Pancake ERP</h1>
          <p className="text-slate-400 font-medium text-[11px] sm:text-sm mt-1">Welcome back, please login to your account.</p>
        </div>

        <div className="space-y-4 sm:space-y-5 relative z-30">
          <div>
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2 block ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(e); }}
              className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 text-slate-700 font-bold placeholder-slate-400 outline-none transition-all text-sm"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2 block ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(e); }}
              className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 text-slate-700 font-bold placeholder-slate-400 outline-none transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end mt-1">
            <button 
              type="button" 
              onClick={handleForgotPassword} 
              className="text-[10px] sm:text-xs font-bold text-pink-500 hover:text-pink-600 transition-colors"
            >
              ลืมรหัสผ่านใช่ไหม?
            </button>
          </div>

          <div className="flex items-center pt-1 sm:pt-2">
            <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-pink-500 focus:ring-pink-500/30 transition-all cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-bold text-slate-600">Remember me</span>
            </label>
          </div>

          <div className="pt-2 sm:pt-4 space-y-2.5 sm:space-y-3">
            <button
              type="button" // 👈 สำคัญมาก! ช่วยป้องกันไม่ให้หน้าเว็บรีเฟรชเอง
              onClick={(e) => handleLogin(e)} // 👈 แก้ให้เรียกใช้ handleLogin
              disabled={loading} // 👈 แก้ให้ใช้ state 'loading' ตรงกับด้านบน
              className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl font-bold text-sm sm:text-base shadow-[0_10px_20px_rgba(236,72,153,0.2)] transition-all transform hover:-translate-y-0.5"
            >
              {loading ? 'Loading...' : '🚀 เข้าสู่ระบบ (Dashboard)'}
            </button>

            <button
              type="button" // 👈 สำคัญมาก!
              onClick={() => navigate("/check-in")} // 👈 แก้ให้ลิงก์ไปหน้าเช็คอินตรงๆ หรือถ้ามีฟังก์ชันอื่นก็เปลี่ยนได้ครับ
              disabled={loading}
              className="w-full py-3.5 sm:py-4 bg-white border-2 border-slate-200 hover:border-pink-500 hover:text-pink-600 text-slate-600 rounded-xl font-bold text-sm sm:text-base shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              ⏰ ลงเวลาทำงาน (Timestamp)
            </button>
          </div>

          {/* 🌟 4. ลายเซ็นคนทำ (เท่ๆ จางๆ ท้ายการ์ด) */}
          <div className="mt-6 pt-5 border-t border-slate-200/50 flex flex-col items-center select-none pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-bold text-pink-500/60 uppercase tracking-[0.3em]">DEVELOPED BY</span>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mt-1.5">{String.fromCharCode(83, 105, 110, 115, 97, 114, 117, 100)} W.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
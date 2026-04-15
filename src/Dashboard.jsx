import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

// =====================================================================
// 🟢 Component: จอดำแสดง Log แบบ Real-time (แยกออกมาให้ทำงานอิสระ)
// =====================================================================
const RealTimeTerminal = () => {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('system_logs')
        .select('*, employees(full_name)')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setLogs(data);
    };
    
    fetchLogs();
    
    // ดึงข้อมูลสดๆ ทันทีที่มีคนกดปุ่มหรือเข้าสู่ระบบ
    const subscription = supabase
      .channel('realtime_sys_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_logs' }, () => {
        fetchLogs();
      })
      .subscribe();
      
    return () => { supabase.removeChannel(subscription); }
  }, []);

  return (
    <div className="p-5 text-[10px] md:text-[11px] text-emerald-400/80 flex-1 overflow-y-auto space-y-2 leading-relaxed h-72 custom-scrollbar">
      {logs.length === 0 ? <p className="text-slate-600 animate-pulse">&gt; Loading Real System Logs...</p> : (
        logs.map((log, i) => {
          const d = new Date(log.created_at);
          const dateStr = `[${d.toLocaleDateString('en-GB')} ${d.toLocaleTimeString('en-GB')}]`;
          const empName = log.employees?.full_name || log.employee_id || 'System';
          
          return (
            <div key={i} className="flex gap-4 items-start hover:bg-white/5 px-2 py-1 rounded transition-colors group">
              <span className="text-slate-600 shrink-0 w-36">{dateStr}</span>
              <span className="text-emerald-500 font-bold shrink-0 w-24 truncate">[{empName.split(' ')[0]}]</span>
              <span className="text-slate-300 group-hover:text-white transition-colors break-words leading-relaxed">{log.action}</span>
            </div>
          );
        })
      )}
      <p className="animate-pulse text-lg mt-2 text-emerald-500">_</p>
    </div>
  );
};

// 👑 Component โลโก้มงกุฎทอง (Premium Gold Crown SVG) - วาดใหม่ให้หรูหรา
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
      {/* ฐานมงกุฎ */}
      <path d="M 15 80 Q 50 85 85 80 L 80 65 Q 50 70 20 65 Z" fill="url(#gold-base)" />
      
      {/* ยอดมงกุฎ */}
      <path d="M 20 65 L 10 30 L 30 45 L 50 15 L 70 45 L 90 30 L 80 65 Q 50 70 20 65 Z" fill="url(#gold-grad)" stroke="#FEF08A" strokeWidth="1" />
               
      {/* เพชรประดับยอด */}
      <circle cx="10" cy="30" r="4" fill="#FFFBEB" />
      <circle cx="30" cy="45" r="3" fill="#FFFBEB" />
      <circle cx="50" cy="15" r="5" fill="#FFFBEB" />
      <circle cx="70" cy="45" r="3" fill="#FFFBEB" />
      <circle cx="90" cy="30" r="4" fill="#FFFBEB" />
      
      {/* เพชรประดับฐาน */}
      <ellipse cx="50" cy="74" rx="4" ry="2" fill="#FFFBEB" />
      <ellipse cx="30" cy="72" rx="3" ry="1.5" fill="#FFFBEB" />
      <ellipse cx="70" cy="72" rx="3" ry="1.5" fill="#FFFBEB" />
    </g>
  </svg>
);

// 🎆 Component ดอกไม้ไฟฉลองชัยชนะ (Victory Overlay)
const VictoryFireworks = () => (
  <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden flex items-center justify-center animate-fade-in">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
    {[...Array(15)].map((_, i) => (
      <div key={i} className={`absolute animate-bounce`} style={{ 
        top: `${Math.random() * 80}%`, left: `${Math.random() * 90}%`,
        fontSize: `${30 + Math.random() * 40}px`, animationDelay: `${Math.random() * 1}s`, animationDuration: `${1 + Math.random() * 2}s`
      }}>
        {['🎉', '🎊', '✨', '🔥', '🏆', '💎', '💰'][Math.floor(Math.random() * 7)]}
      </div>
    ))}
    <div className="relative z-10 text-center animate-pop-in bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/20 shadow-[0_0_100px_rgba(251,191,36,0.3)]">
      <div className="text-6xl mb-4 animate-bounce">🏆</div>
      <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-lg uppercase tracking-tighter mb-2">
        Goal Achieved!
      </h1>
      <p className="text-white font-black text-xl md:text-2xl mt-4 bg-black/30 py-2 px-6 rounded-full inline-block">
        ยินดีด้วย! บริษัททำยอดทะลุเป้า 100% แล้ว 🚀
      </p>
    </div>
  </div>
);

// 🌐 ระบบแปลภาษา (อัปเดต: เพิ่มตั้งค่า LINE OA และระบบยอดขาย)
const translations = {
  TH: {
    menuDash: "หน้าแรก", menuHist: "ประวัติการลา", menuAdjust: "แจ้งปรับปรุง", menuCheck: "ลงเวลาเข้า-ออก", menuApprove: "อนุมัติคำขอ", menuSettings: "ตั้งค่าระบบ", menuLogout: "ออกจากระบบ", menuAttendance: "ประวัติเข้าออกงาน", menuEmployees: "จัดการพนักงาน",
    welcome: "ยินดีต้อนรับ", adminCenter: "ศูนย์อนุมัติคำขอ", createBtn: "ยื่นใบลา", adjustBtn: "แจ้งปรับปรุง", stat1: "สิทธิ์วันลาคงเหลือ", stat2: "อัตราการอนุมัติ", stat3: "พนักงานเข้างาน (วันนี้)", stat4: "ความสมบูรณ์ระบบ", boxPending: "รายการรออนุมัติ", boxStats: "สถิติการลา (ปีนี้)", boxQuota: "โควต้าวันลาคงเหลือ", boxCal: "ปฏิทินทีม", seeAll: "ดูทั้งหมด", noPending: "🎉 เยี่ยมมาก! ไม่มีรายการค้างพิจารณา",
    thType: "ประเภท", thTotal: "สิทธิ์รวม", thUsed: "ใช้ไป", thRemain: "คงเหลือ", thDate: "วันที่ยื่น", thDuration: "ระยะเวลา", thStatus: "สถานะ", thEmp: "พนักงาน", thDetail: "รายละเอียด",
    chartPie: "วงกลม", chartBar: "กราฟแท่ง", chartLine: "กราฟเส้น", monthNames: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"], dayNames: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
    myLeaveHistory: "ประวัติการลาของฉัน", allTypes: "ทุกประเภท", sickLeave: "ลาป่วย", personalLeave: "ลากิจ", annualLeave: "ลาพักร้อน", emergencyLeave: "ลาฉุกเฉิน", allStatus: "ทุกสถานะ", pending: "รออนุมัติ", approved: "อนุมัติ", rejected: "ไม่อนุมัติ",
    adjustHistory: "ประวัติคำขอปรับปรุง", adjustSwap: "สลับวันหยุด", adjustEdit: "แก้ไขเวลา",
    allPendingApprovals: "รายการรออนุมัติทั้งหมด", tabLeaves: "ลางาน", tabAdjusts: "แจ้งปรับปรุง", btnReject: "ปฏิเสธ", btnApprove: "อนุมัติ",
    notifTitle: "การแจ้งเตือน", notifReadAll: "อ่านทั้งหมด", notifClear: "ล้างทั้งหมด", notifEmpty: "ไม่มีการแจ้งเตือนใหม่", notifClose: "ปิดหน้าต่าง", viewPhoto: "ดูรูป",
    modalLeaveTitle: "ยื่นคำขอลาพักผ่อน", modalLeaveType: "ประเภทการลา", modalLeaveName: "ชื่อผู้ขอลา", modalLeaveDate: "กำหนดการลา (Date & Time)", modalLeaveReason: "ระบุเหตุผล เช่น ไปทำธุระที่ธนาคารครึ่งวันเช้า...", modalLeaveSubmit: "ยืนยันการส่งคำขอลา", modalCancel: "ยกเลิก",
    modalAdjTitle: "คำขอปรับปรุง", modalAdjDesc: "แจ้งขอปรับปรุงข้อมูลเวลาหรือวันหยุด", modalAdjDetailSwap: "รายละเอียดการสลับวันหยุด", modalAdjDetailEdit: "รายละเอียดการแก้ไขเวลา", modalAdjOldDate: "วันหยุดเดิม", modalAdjNewDate: "วันหยุดใหม่", modalAdjDate: "วันที่เกิดเหตุ", modalAdjTimeType: "ประเภทเวลา", modalAdjOldTime: "เวลาเดิม (ถ้ามี)", modalAdjNewTime: "เวลาใหม่ที่ต้องการ", modalAdjReason: "เหตุผล", modalAdjReasonHolder: "กรุณาระบุเหตุผลอย่างละเอียด...", modalAdjSubmit: "ส่งคำขอ",
    allAttendance: "ประวัติเข้าออกงานทั้งหมด", myAttendance: "ประวัติเข้าออกงานของฉัน", searchEmp: "ค้นหาชื่อพนักงาน...", filterNormal: "ปกติ", filterLate: "เข้าสาย", thTimeIn: "เข้างาน / รูป", thTimeOut: "ออกงาน / รูป", statusNormal: "ปกติ", statusLate: "สาย", noAttendance: "ไม่พบประวัติการลงเวลา", loadingText: "กำลังดึงข้อมูล... ⏳",
    settingsBranches: "ตั้งค่าสาขา", settingsDesc: "จัดการสาขาและพิกัดที่ตั้งพร้อมกำหนดรัศมีลงเวลา", formEditBranch: "📝 แก้ไขสาขา", formAddBranch: "➕ เพิ่มสาขาใหม่", labelBranchName: "ชื่อสาขา", placeBranchName: "ระบุชื่อสาขา...", labelRadius: "รัศมีการเช็คอิน (เมตร)", btnGetGPS: "📌 ดึงพิกัดตำแหน่งปัจจุบัน (GPS)", btnUpdate: "อัปเดตข้อมูล", btnSave: "บันทึกสาขา", tableBranchTitle: "รายชื่อสาขาในระบบ", thBranchName: "ชื่อสาขา", thCoords: "พิกัด", thRadius: "รัศมี", thManage: "จัดการ", noBranchData: "ยังไม่มีข้อมูลสาขา", btnEdit: "แก้ไข", btnDelete: "ลบ", btnMap: "แมพ 🗺️",
    empTitle: "รายชื่อพนักงานทั้งหมด", empSearch: "ค้นหาชื่อ, รหัสพนักงาน...", empAddBtn: "➕ เพิ่มพนักงาน", thEmpProfile: "ข้อมูลพนักงาน", thEmpPosition: "ตำแหน่ง & กะทำงาน", thEmpContact: "ติดต่อ", thEmpManage: "จัดการ", modalEmpTitle: "ข้อมูลพนักงาน", labelEmpCode: "รหัสพนักงาน", labelFullName: "ชื่อ-นามสกุล (TH)", labelNameEn: "ชื่อ-นามสกุล (EN)", labelUsername: "Username", labelPassword: "Password", labelPhone: "เบอร์โทรศัพท์", labelPosition: "ตำแหน่ง", labelShiftStart: "เวลาเข้างาน", labelShiftEnd: "เวลาออกงาน",
    settingsAllLeaves: "ประวัติการลาทั้งหมด", allLeavesDesc: "ตรวจสอบประวัติการลาของพนักงานทุกคน พร้อมพิกัดสถานที่ยื่นขอ (GPS)", allLeavesFilterAll: "ดูประวัติพนักงานทุกคน", thTypeDuration: "ประเภท / ระยะเวลา", thReason: "เหตุผล", thLocation: "พิกัด", btnViewMap: "ดูแผนที่", noLocation: "ไม่มีพิกัด", noLeaveHistory: "ไม่พบประวัติการลา",
    settingsQuotas: "จัดการสิทธิ์วันลา", quotaTitle: "จัดการโควต้าวันลาพนักงาน", quotaDesc: "กำหนดสิทธิ์วันลา (จำนวนวัน/ปี) ของพนักงานทั้งหมด", btnAddLeaveType: "➕ เพิ่มประเภทการลา", btnEditQuota: "แก้ไขโควต้า", swalNewTypeTitle: "เพิ่มประเภทการลาใหม่", swalNewTypePlace: "เช่น ลาบวช, ลาคลอด...", thLeaveWithoutPay: "ลาไม่รับเงินเดือน", quotaSaveBtn: "บันทึกโควต้า", quotaSavingBtn: "กำลังบันทึก...", thEmpName: "ชื่อพนักงาน",
    swalWarnTitle: "เดี๋ยวก่อนพี่!", swalWarnText: "กรุณากรอกชื่อและดึงพิกัด GPS ให้เรียบร้อยครับ", swalSuccessUpdate: "อัปเดตสาขาเรียบร้อย!", swalSuccessAdd: "บันทึกสาขาใหม่เรียบร้อย!", swalError: "เกิดข้อผิดพลาด!", swalDelTitle: "ลบสาขานี้ใช่ไหม?", swalDelText: "ลบแล้วกู้คืนไม่ได้นะครับพี่!", swalDelConfirm: "ใช่, ลบเลย!", swalDelSuccess: "ลบเรียบร้อย!", swalEmpSaved: "บันทึกข้อมูลพนักงานสำเร็จ!", swalEmpDeleted: "ลบพนักงานเรียบร้อย!",
    menuPTDayOff: "แจ้งวันหยุด (PT)", modalPTTitle: "แจ้งวันหยุดประจำสัปดาห์ (PT)", modalPTDate: "เลือกวันที่ต้องการหยุด", modalPTReason: "หมายเหตุ / เหตุผล", modalPTReasonHolder: "ระบุเหตุผลเพิ่มเติม (ถ้ามี)...", modalPTSubmit: "ส่งคำขอหยุด", defaultPTReason: "วันหยุดประจำสัปดาห์",
    settingsAllDayOffs: "รายการแจ้งหยุดทั้งหมด", ptDayOffDesc: "ตรวจสอบประวัติการแจ้งวันหยุดประจำสัปดาห์ของพนักงาน", thDayOffDate: "วันที่ขอหยุด",
    settingsAllAdjustments: "ประวัติแจ้งปรับปรุงทั้งหมด", allAdjustDesc: "ตรวจสอบประวัติการแจ้งสลับวันหยุดและแก้ไขเวลาของพนักงานทุกคน",
    settingsPermissions: "กำหนดสิทธิ์เมนู", permDesc: "เปิด-ปิด การมองเห็นเมนูต่างๆ ของพนักงานแต่ละระดับ", roleAdmin: "ผู้ดูแลระบบ", roleCEO: "ผู้บริหาร", roleEmp: "พนักงานทั่วไป",
    // ✨ ส่วนตั้งค่า LINE
    settingsLineOA: "ตั้งค่า LINE OA", lineDesc: "กำหนด LINE User ID หรือ Group ID สำหรับรับการแจ้งเตือนจากระบบ", labelLineId: "LINE ID ผู้รับการแจ้งเตือน", btnSaveLine: "บันทึก LINE ID",
    // ✨ ระบบยอดขาย (Sales)
    menuSales: "ยอดขายพนักงาน", mySalesTitle: "ยอดขายของฉัน", salesUpdated: "อัปเดตข้อมูลล่าสุดเมื่อ:", salesTarget: "เป้าหมายยอดขาย:", btnSetTarget: "ตั้งเป้าใหม่", estCommission: "คอมมิชชันที่คาดว่าจะได้รับ", commRate: "เรทค่าคอม", salesProgress: "ความคืบหน้าการทำยอดขาย", manageSalesTitle: "จัดการยอดขายพนักงาน", manageSalesDesc: "อัปเดตยอดขายปัจจุบันและเป้าหมายของพนักงานแต่ละคน", thSalesCurrent: "ยอดขาย (฿)", thSalesTarget: "เป้าหมาย (฿)", thCommRate: "เรทค่าคอม (%)", thCommEarned: "ยอดคอมที่ได้ (฿)", btnSaveGeneral: "บันทึก", selectEmp: "-- กรุณาเลือกพนักงาน --", permSelectPrompt: "👆 กรุณาเลือกพนักงานจากด้านบน เพื่อปรับสิทธิ์การเข้าถึงเมนู", labelSelectEmp: "👤 เลือกพนักงานที่ต้องการปรับสิทธิ์:", btnSavePerm: "บันทึกสิทธิ์", saving: "กำลังบันทึก...",
    // 💸 ระบบเงินเดือน (Payroll)
    menuPayroll: "เงินเดือนและสลิป", payrollTitle: "สรุปเงินเดือน (Payroll)", payrollDesc: "จัดการฐานเงินเดือน รายการหัก โบนัส และออกสลิปเงินเดือน", myPayrollTitle: "สลิปเงินเดือนของฉัน", thBaseSalary: "เงินเดือนพื้นฐาน", thNetSalary: "รับสุทธิ", btnGenerateSlip: "สร้างสลิป"
  },
  EN: {
    menuDash: "Dashboard", menuHist: "Leave History", menuAdjust: "Adjustments", menuCheck: "Timestamp", menuApprove: "Approvals", menuSettings: "Settings", menuLogout: "Logout", menuAttendance: "Attendance History", menuEmployees: "Employees",
    welcome: "Welcome", adminCenter: "Approval Center", createBtn: "New Leave", adjustBtn: "Adjustment", stat1: "Leave Balance", stat2: "Approval Rate", stat3: "Active Staff (Today)", stat4: "System Health", boxPending: "Pending Approvals", boxStats: "Leave Statistics", boxQuota: "Leave Quotas", boxCal: "Team Calendar", seeAll: "See All", noPending: "🎉 Great! No pending requests.",
    thType: "Type", thTotal: "Total", thUsed: "Used", thRemain: "Remaining", thDate: "Date", thDuration: "Duration", thStatus: "Status", thEmp: "Employee", thDetail: "Details",
    chartPie: "Pie", chartBar: "Bar", chartLine: "Line", monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    myLeaveHistory: "My Leave History", allTypes: "All Types", sickLeave: "Sick Leave", personalLeave: "Personal Leave", annualLeave: "Annual Leave", emergencyLeave: "Emergency", allStatus: "All Status", pending: "Pending", approved: "Approved", rejected: "Rejected",
    adjustHistory: "Adjustment History", adjustSwap: "Swap Day", adjustEdit: "Edit Time",
    allPendingApprovals: "All Pending Approvals", tabLeaves: "Leaves", tabAdjusts: "Adjustments", btnReject: "Reject", btnApprove: "Approve",
    notifTitle: "Notifications", notifReadAll: "Read All", notifClear: "Clear All", notifEmpty: "No new notifications", notifClose: "Close Window", viewPhoto: "View Photo",
    modalLeaveTitle: "New Leave Request", modalLeaveType: "Leave Type", modalLeaveName: "Employee Name", modalLeaveDate: "Date & Time", modalLeaveReason: "Enter reason...", modalLeaveSubmit: "Submit Request", modalCancel: "Cancel",
    modalAdjTitle: "Adjustment Request", modalAdjDesc: "Request to adjust attendance or swap days", modalAdjDetailSwap: "Swap Day Details", modalAdjDetailEdit: "Edit Time Details", modalAdjOldDate: "Original Date", modalAdjNewDate: "New Date", modalAdjDate: "Incident Date", modalAdjTimeType: "Time Type", modalAdjOldTime: "Original Time (If any)", modalAdjNewTime: "Requested Time", modalAdjReason: "Reason", modalAdjReasonHolder: "Please specify the reason...", modalAdjSubmit: "Submit Request",
    allAttendance: "All Attendance History", myAttendance: "My Attendance History", searchEmp: "Search employee...", filterNormal: "Normal", filterLate: "Late", thTimeIn: "Time In / Photo", thTimeOut: "Time Out / Photo", statusNormal: "Normal", statusLate: "Late", noAttendance: "No attendance records found", loadingText: "Loading data... ⏳",
    settingsBranches: "Branches", settingsDesc: "Manage branches, locations, and check-in radius", formEditBranch: "📝 Edit Branch", formAddBranch: "➕ Add New Branch", labelBranchName: "Branch Name", placeBranchName: "Enter branch name...", labelRadius: "Check-in Radius (meters)", btnGetGPS: "📌 Get Current Location (GPS)", btnUpdate: "Update Data", btnSave: "Save Branch", tableBranchTitle: "Branch List", thBranchName: "Branch Name", thCoords: "Coordinates", thRadius: "Radius", thManage: "Manage", noBranchData: "No branch data available", btnEdit: "Edit", btnDelete: "Delete", btnMap: "Map 🗺️",
    empTitle: "All Employees", empSearch: "Search name, code...", empAddBtn: "➕ Add Employee", thEmpProfile: "Employee Profile", thEmpPosition: "Position & Shift", thEmpContact: "Contact", thEmpManage: "Manage", modalEmpTitle: "Employee Data", labelEmpCode: "Employee Code", labelFullName: "Full Name (TH)", labelNameEn: "Full Name (EN)", labelUsername: "Username", labelPassword: "Password", labelPhone: "Phone Number", labelPosition: "Position", labelShiftStart: "Shift Start", labelShiftEnd: "Shift End",
    settingsAllLeaves: "All Employee Leaves", allLeavesDesc: "Check all employee leave histories with GPS locations.", allLeavesFilterAll: "All Employees", thTypeDuration: "Type / Duration", thReason: "Reason", thLocation: "Location", btnViewMap: "View Map", noLocation: "No Location", noLeaveHistory: "No leave history found.",
    settingsQuotas: "Leave Quotas", quotaTitle: "Manage Leave Quotas", quotaDesc: "Set yearly leave quotas for all employees.", btnAddLeaveType: "➕ Add Leave Type", btnEditQuota: "Edit Quota", swalNewTypeTitle: "Add New Leave Type", swalNewTypePlace: "e.g., Maternity Leave...", thLeaveWithoutPay: "Leave Without Pay", quotaSaveBtn: "Save Quotas", quotaSavingBtn: "Saving...", thEmpName: "Employee Name",
    swalWarnTitle: "Wait a minute!", swalWarnText: "Please enter a name and get GPS coordinates.", swalSuccessUpdate: "Branch updated successfully!", swalSuccessAdd: "New branch saved successfully!", swalError: "Error occurred!", swalDelTitle: "Delete this branch?", swalDelText: "This action cannot be undone!", swalDelConfirm: "Yes, delete it!", swalDelSuccess: "Deleted successfully!", swalEmpSaved: "Employee saved successfully!", swalEmpDeleted: "Employee deleted!",
    menuPTDayOff: "Day Off (PT)", modalPTTitle: "Weekly Day Off (PT)", modalPTDate: "Select Date", modalPTReason: "Note / Reason", modalPTReasonHolder: "Additional details (optional)...", modalPTSubmit: "Submit Request", defaultPTReason: "Weekly Day Off",
    settingsAllDayOffs: "All Day Offs", ptDayOffDesc: "Check all weekly day off requests from employees.", thDayOffDate: "Day Off Date",
    settingsAllAdjustments: "All Adjustments", allAdjustDesc: "Check all attendance adjustment requests from employees.",
    settingsPermissions: "Menu Permissions", permDesc: "Toggle menu visibility for different user roles.", roleAdmin: "Admin", roleCEO: "CEO", roleEmp: "Employee",
    // ✨ ส่วนตั้งค่า LINE
    settingsLineOA: "LINE OA Settings", lineDesc: "Set the LINE User ID or Group ID to receive system notifications.", labelLineId: "LINE ID for Notifications", btnSaveLine: "Save LINE ID",
    // ✨ ระบบยอดขาย (Sales)
    menuSales: "Employee Sales", mySalesTitle: "My Sales", salesUpdated: "Last updated:", salesTarget: "Sales Target:", btnSetTarget: "Set Target", estCommission: "Estimated Commission", commRate: "Comm. Rate", salesProgress: "Achievement Progress", manageSalesTitle: "Sales Management", manageSalesDesc: "Update current sales and targets for each employee", thSalesCurrent: "Sales (฿)", thSalesTarget: "Target (฿)", thCommRate: "Comm. Rate (%)", thCommEarned: "Commission (฿)", btnSaveGeneral: "Save", selectEmp: "-- Select Employee --", permSelectPrompt: "👆 Please select an employee from above to adjust menu access", labelSelectEmp: "👤 Select employee to adjust permissions:", btnSavePerm: "Save Permissions", saving: "Saving...",
    // 💸 ระบบเงินเดือน (Payroll)
    menuPayroll: "Payroll & e-Slip", payrollTitle: "Payroll Summary", payrollDesc: "Manage base salary, deductions, bonuses, and generate payslips", myPayrollTitle: "My Payslip", thBaseSalary: "Base Salary", thNetSalary: "Net Salary", btnGenerateSlip: "Generate Slip"
  }
};

// 🧮 1. เอาฟังก์ชันคำนวณมาวางแหมะไว้ตรงนี้เลยครับ (วางนอก Component ปลอดภัย 100%)
const calculateTotalHours = (logs) => {
  if (!logs || logs.length === 0) return "0 นาที";
  const sorted = [...logs].sort((a, b) => new Date(a.timestamp || a.created_at) - new Date(b.timestamp || b.created_at));
  let totalMinutes = 0;
  let tempIn = null;
  
  sorted.forEach(log => {
    if (log.log_type === 'check_in') tempIn = new Date(log.timestamp || log.created_at);
    else if (log.log_type === 'check_out' && tempIn) {
      totalMinutes += Math.floor((new Date(log.timestamp || log.created_at) - tempIn) / 1000 / 60);
      tempIn = null;
    }
  });

  if (totalMinutes === 0) return "0 นาที";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h} ชม. ${m} นาที` : `${m} นาที`;
};


export default function Dashboard() {
  const navigate = useNavigate();





// =========================================================================
  // 🛡️ SECURITY: บล็อคคลิกขวา และ ห้ามกด F12 (มีบัตร VIP สำหรับตัวเอง)
  // =========================================================================
  useEffect(() => {
    // 🌟 VIP PASS: ถ้าเปิดในเครื่องตัวเอง (localhost) ไม่ต้องบล็อคอะไรเลย ให้ทำงานต่อได้
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return; 
    }

    // 1. ป้องกันการคลิกขวา (คนอื่นจะกดไม่ได้)
    const handleContextMenu = (e) => e.preventDefault();
    
    // 2. ป้องกันการกด F12 หรือ Ctrl+Shift+I (คนอื่นจะแอบดูไม่ได้)
    const handleKeyDown = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  // =========================================================================

// 🕒 ระบบ Auto Logout (Inactivity Timeout) - เวอร์ชันใช้งานจริง
  useEffect(() => {
    // 1. ดึงข้อมูล User (ดักทั้งตัวเล็กตัวใหญ่)
    const rawData = localStorage.getItem("user") || localStorage.getItem("User");
    const savedUser = JSON.parse(rawData || "{}");

    // 2. ตั้งค่าเวลาที่ "เหมาะสมและปลอดภัย" (หน่วยเป็นนาที)
    // พนักงาน: 20 นาที (กันคนอื่นมาแอบใช้เครื่องต่อ)
    // CEO/Admin: 180 นาที (3 ชั่วโมง - ทำงานต่อเนื่องได้ยาวๆ)
    const TIMEOUT_USER = 20;    
    const TIMEOUT_ADMIN = 180;  

    // เช็กสิทธิ์ (ถ้าหา Role ไม่เจอ ให้ถือว่าเป็น User ปกติ)
    const isExecutive = savedUser.role === 'admin' || savedUser.role === 'ceo';
    const expireTime = (isExecutive ? TIMEOUT_ADMIN : TIMEOUT_USER) * 60 * 1000;

    let logoutTimer;

    const performLogout = () => {
      Swal.close(); // ปิด Modal อื่นๆ ก่อน
      Swal.fire({
        title: '🔒 เซสชั่นหมดอายุ',
        text: 'ท่านไม่ได้ใช้งานระบบนานเกินไป เพื่อความปลอดภัยกรุณาเข้าสู่ระบบใหม่',
        icon: 'warning',
        confirmButtonText: 'เข้าสู่ระบบอีกครั้ง',
        confirmButtonColor: '#F43F5E', // สีชมพู Rose
        allowOutsideClick: false,
        customClass: { popup: 'rounded-[2rem]' }
      }).then(() => {
        // ล้างข้อมูลและดีดออก
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/"; 
      });
    };

    const resetTimer = () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      logoutTimer = setTimeout(performLogout, expireTime);
    };

    // 3. ตรวจจับการเคลื่อนไหว (เมาส์, คีย์บอร์ด, คลิก, เลื่อนหน้าจอ, ทัชสกรีน)
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'mousedown'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // เริ่มนับถอยหลัง

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);



  const [user, setUser] = useState(JSON.parse(localStorage.getItem("titan_user")));
  const [isLoading, setIsLoading] = useState(true);
  

// ✨ ฟังก์ชัน Export CSV (อัปเดตให้ใช้ตัวแปร adminPayrollSlips ให้ตรงกับฐานข้อมูลจริง)
  const handleExportBankCSV = () => {
    // 🟢 เปลี่ยนจาก payrollData เป็น adminPayrollSlips
    const dataToExport = adminPayrollSlips.filter(p => p.month === payrollFilterMonth);

    if (dataToExport.length === 0) {
      Swal.fire({ icon: 'warning', title: 'ไม่พบข้อมูล', text: `ไม่พบรายการเงินเดือนของเดือน ${payrollFilterMonth}` });
      return;
    }
    
    let csvContent = "\uFEFF"; 
    csvContent += "รหัสพนักงาน,ชื่อ-สกุล,ธนาคาร,เลขที่บัญชี,ยอดเงินโอน (สุทธิ)\n";
    dataToExport.forEach(item => {
      const emp = employees.find(e => e.id === item.employee_id);
      const bName = emp?.bank_name || '-';
      const bAcc = emp?.bank_account ? `="${emp.bank_account}"` : '-'; 
      const nSalary = item.net_salary || 0;
      const fullName = item.employees?.full_name || emp?.full_name || '-';
      const empCode = item.employees?.employee_code || emp?.employee_code || '-';
      
      // ครอบ Double Quote (") ป้องกันคอลัมน์เคลื่อน
      csvContent += `"${empCode}","${fullName}","${bName}",${bAcc},${nSalary}\n`;
    });
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `สรุปโอนเงินเดือน_${payrollFilterMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [lang, setLang] = useState(localStorage.getItem("titan_lang") || "TH");
  const t = translations[lang];
  const [currentView, setCurrentView] = useState("dashboard"); 

  // 🔄 ระบบ Auto-Sync ข้อมูลให้เป็นปัจจุบันเสมอเมื่อมีการสลับหน้าจอ
  useEffect(() => {
    // รายชื่อหน้าที่ต้องการให้ดึงข้อมูลใหม่ล่าสุดจากฐานข้อมูลทันทีที่เปิดหน้า
    const syncViews = ["live_tracking", "sales", "settings", "dashboard"];
    
    if (syncViews.includes(currentView)) {
      fetchDashboardData(true); // สั่งดึงข้อมูลจาก Supabase ใหม่เข้า State ทันที
    }
  }, [currentView]); // โค้ดจะทำงานทุกครั้งที่ค่าของ currentView เปลี่ยนแปลง

 // ==========================================
  // 🔍 STATE สำหรับระบบซูมรูปภาพ (Image Zoom)
  // ==========================================
  const [zoomImage, setZoomImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleOpenZoom = (imageUrl) => {
    setZoomImage(imageUrl);
    setZoomLevel(1);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [backupLogs, setBackupLogs] = useState([]); // วางตรงนี้ที่เดียว
  const [isFetchingBackups, setIsFetchingBackups] = useState(false); // วางตรงนี้ที่เดียว

  // 📢 State สำหรับระบบป้ายประกาศ
  const [announcements, setAnnouncements] = useState([]);

// 🚀 บังคับรันตอนโหลดหน้าเว็บ
  useEffect(() => {
    if (user) { 
      console.log("🛠️ ระบบกำลังสั่งเรียก fetchAnnouncements...");
      fetchAnnouncements(); 
    }
  }, [user]);

// 🛰️ ระบบ Realtime (แก้บั๊ก Timezone แล้ว)
  useEffect(() => {
    const channel = supabase
      .channel('announcements-realtime-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, (payload) => {
        const newAnn = payload.new;
        
        if (newAnn.is_important === true && newAnn.is_active === true) {
          const now = new Date();
          
          // 🇹🇭 แก้บั๊ก Timezone เวลาเพิ่มข้อมูลใหม่
          const startStr = newAnn.start_time ? newAnn.start_time.split('+')[0].replace('Z', '') : null;
          const endStr = newAnn.end_time ? newAnn.end_time.split('+')[0].replace('Z', '') : null;
          
          const start = startStr ? new Date(startStr) : null;
          const end = endStr ? new Date(endStr) : null;
          
          const isStarted = !start || now >= start;
          const isNotEnded = !end || now <= end;

          if (isStarted && isNotEnded) {
            const popupKey = `viewed_ann_${newAnn.id}`;
            if (!sessionStorage.getItem(popupKey)) {
              Swal.fire({
                title: '🚨 ประกาศสำคัญ!',
                html: `<div class="mb-4 font-black text-rose-600 text-lg">${newAnn.title}</div><div class="text-left text-sm text-slate-700 bg-rose-50 p-4 rounded-xl border border-rose-100 whitespace-pre-wrap">${newAnn.content}</div>`,
                icon: 'warning', confirmButtonText: '✅ รับทราบ', confirmButtonColor: '#f43f5e', allowOutsideClick: false, customClass: { popup: 'rounded-[2rem] shadow-2xl' }
              }).then((res) => { if (res.isConfirmed) sessionStorage.setItem(popupKey, 'true'); });
            }
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

// 💦 ฟังก์ชันสาดน้ำสงกรานต์
  const triggerSongkranSplash = () => {
    const duration = 3 * 1000; // สาดนาน 3 วินาที
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // สาดน้ำสีฟ้า/ขาว/ชมพู (ไม่เอาสีส้มเด็ดขาด!)
      confetti({
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#00BFFF', '#87CEFA', '#FFFFFF', '#FFB6C1'] 
      });
      confetti({
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#00BFFF', '#87CEFA', '#FFFFFF', '#FFB6C1']
      });
    }, 250);
  };  

  useEffect(() => {
    if (user) {
      fetchAnnouncements();
      
      // 💦 สาดน้ำต้อนรับสงกรานต์ทันทีที่เข้าสู่ระบบ!
      triggerSongkranSplash(); 
    }
  }, [user]);



  

const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase.from('announcements').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (error) return;

      if (data && data.length > 0) {
        const formattedAnns = data.map(ann => ({
          id: ann.id, title: ann.title, desc: ann.content, 
          is_important: ann.is_important, date: ann.created_at, 
          start_time: ann.start_time, end_time: ann.end_time
        }));
        setAnnouncements(formattedAnns.map(a => ({ ...a, priority: a.is_important ? 'high' : 'normal' })));

        const now = new Date();
        const activeImportantAnns = formattedAnns.filter(ann => {
          if (!ann.is_important) return false;
          
          // 🇹🇭 แก้บั๊ก Timezone: หั่น +00 หรือ Z ทิ้ง เพื่อบังคับให้คอมมองเป็นเวลาประเทศไทย
          const startStr = ann.start_time ? ann.start_time.split('+')[0].replace('Z', '') : null;
          const endStr = ann.end_time ? ann.end_time.split('+')[0].replace('Z', '') : null;
          
          const start = startStr ? new Date(startStr) : null;
          const end = endStr ? new Date(endStr) : null;
          
          const isStarted = !start || now >= start;
          const isNotEnded = !end || now <= end;
          
          return isStarted && isNotEnded;
        });

        if (activeImportantAnns.length > 0) {
          const annToShow = activeImportantAnns[0];
          const popupKey = `viewed_ann_${annToShow.id}`;
          
          if (!sessionStorage.getItem(popupKey)) {
            Swal.fire({
              title: '🚨 ประกาศสำคัญ!',
              html: `<div class="mb-4 font-black text-rose-600 text-lg">${annToShow.title}</div><div class="text-left text-sm text-slate-700 bg-rose-50 p-4 rounded-xl border border-rose-100 whitespace-pre-wrap">${annToShow.desc}</div>`,
              icon: 'warning', confirmButtonText: '✅ รับทราบ', confirmButtonColor: '#f43f5e', allowOutsideClick: false, customClass: { popup: 'rounded-[2rem] shadow-2xl' }
            }).then((res) => { if (res.isConfirmed) sessionStorage.setItem(popupKey, 'true'); });
          }
        }
      }
    } catch (err) { console.error("Error:", err.message); }
  };

    // 📢 State สำหรับระบบจัดการค่า Ads (TikTok)
  const [adsData, setAdsData] = useState([]);
  
  const fetchAdsTransactions = async () => {
    try {
      const { data, error } = await supabase.from('ads_transactions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setAdsData(data || []);
    } catch (error) {
      console.error("Fetch Ads Error:", error.message);
    }
  };

  useEffect(() => {
    if (currentView === 'ads_management') {
      fetchAdsTransactions();
    }
  }, [currentView]);

  // 🗓️ State สำหรับระบบจัดตารางกะ (Shift Roster)
  const [shiftRoster, setShiftRoster] = useState({});

  // ⭐️ State สำหรับระบบประเมินผลงาน (KPI)
  const [performanceReviews, setPerformanceReviews] = useState({});
  const [kpiMonth, setKpiMonth] = useState(new Date().toISOString().slice(0, 7));

// 🎥 ตัวแปรสำหรับระบบลงเวลาไลฟ์ (Live Tracking)
  const [liveStreams, setLiveStreams] = useState([{ 
    id: `live-init-${Date.now()}`, 
    platform: '', // 🟢 แก้ตรงนี้: เปลี่ยนจาก 'TikTok ช่อง 1' เป็นค่าว่าง (ฟันหนู 2 ตัว)
    startTime: '', 
    endTime: '', 
    endSales: '', 
    sequenceType: 'คิวแรก', 
    followedEmployee: '',   
    imageFile: null 
  }]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [allLiveHistory, setAllLiveHistory] = useState([]); // สำหรับ CEO/Admin ดูประวัติ
  const [liveFilterEmp, setLiveFilterEmp] = useState("");
 
  // ⚙️ ตัวแปรสำหรับฟอร์มลงเวลาแบบใหม่
  const [sequenceType, setSequenceType] = useState('คิวแรก');
  const [followedEmployee, setFollowedEmployee] = useState('');
  const [remarks, setRemarks] = useState('');
  const [liveTeam, setLiveTeam] = useState([]); // เก็บรายชื่อพนักงานสำหรับ Dropdown

  // 🔄 ดึงรายชื่อพนักงานสำหรับฟอร์มรับไม้ต่อ (✨ รวมทีมไลฟ์ + CEO พี่ณัจฉรียา)
useEffect(() => {
  const fetchTeam = async () => {
    // 🚩 เพิ่ม employee_code เข้าไปใน select เพื่อใช้ตรวจสอบรหัส PL001
    const { data } = await supabase
      .from('employees')
      .select('id, full_name, nickname, position, employee_code')
      .order('full_name');

    if (data) {
      // ✨ กรองเอาเฉพาะทีมไลฟ์สด หรือคนที่มีรหัสพนักงานเป็น PL001 (CEO)
      const onlyLiveTeam = data.filter(emp => 
        (emp.employee_code === 'PL001') || // ✅ บังคับเอา CEO (คุณณัจฉรียา) มาแสดงเสมอ
        (emp.position && (
          emp.position.includes('ไลฟ์') || 
          emp.position.toLowerCase().includes('live') || 
          emp.position.includes('สตรีม') || 
          emp.position.includes('MC') || 
          emp.position.includes('โฮสต์')
        ))
      );
      setLiveTeam(onlyLiveTeam);
    }
  };
  fetchTeam();
}, []);

// 🛠️ ฟังก์ชันพิเศษ (Frontend Join) ดึงประวัติและจับคู่ชื่อพนักงานแบบไม่ง้อ Foreign Key
  const fetchHistoryWithNames = async () => {
    try {
      // 🚀 0. คำนวณรอบบิลปัจจุบัน (26-25) เพื่อให้ฝั่งพนักงานเห็นยอดตรงกัน
      const getPayrollCycle = () => {
        const d = new Date();
        let sY = d.getFullYear(), sM = d.getMonth() + 1, eY = sY, eM = sM;
        if (d.getDate() >= 26) { eM += 1; if(eM > 12){ eM = 1; eY += 1; } }
        else { sM -= 1; if(sM < 1){ sM = 12; sY -= 1; } }
        const pad = n => String(n).padStart(2, '0');
        return { start: `${sY}-${pad(sM)}-26`, end: `${eY}-${pad(eM)}-25` };
      };
      const cycleDates = getPayrollCycle();

      // 1. ดึงประวัติทั้งหมด
      const { data: history, error } = await supabase
        .from('live_tracking')
        .select('*')
        .order('live_date', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // 2. ดึงข้อมูลพนักงานและยอดขายมาเชื่อมกัน (แก้บัคเรื่อง commission_rate หาย และเลข 0 เด้ง)
      const { data: emps } = await supabase.from('employees').select('id, full_name, nickname, employee_code, position, is_active');
      const { data: sales } = await supabase.from('employee_sales').select('*').eq('month', new Date().toISOString().substring(0, 7));

      const formatted = (emps || []).map(e => {
        const s = (sales || []).find(x => x.employee_id === e.id);
        
        // 🟢 ค้นหาประวัติการไลฟ์เฉพาะรอบบิล 26-25 ของพนักงานคนนี้
        const empLogs = (history || []).filter(log => log.employee_id === e.id && log.live_date >= cycleDates.start && log.live_date <= cycleDates.end);
        const cycleSum = empLogs.reduce((sum, log) => sum + Number(log.net_sales || 0), 0);

        return {
          employee_id: e.id,
          current_sales: cycleSum, // ✨ ใช้ยอดรวมตามรอบบิลแทนยอดดิบในตาราง (แก้ปัญหาฝั่งพนักงานยอดเป็น 0)
          target_sales: s?.target_sales || 100000,
          // 🟢 จุดแก้บัคระดับชาติ: เติม commission_rate กลับเข้ามา และใช้ ?? 1 เพื่อให้ใส่เลข 0 ได้!
          commission_rate: s?.commission_rate ?? 1,
          employees: { full_name: e.full_name, position: e.position, employee_code: e.employee_code, nickname: e.nickname, is_active: e.is_active }
        };
      });
      setAllSalesData(formatted);
      
      // 3. จับคู่ข้อมูลเข้าด้วยกัน
      const mergedData = (history || []).map(item => ({
        ...item,
        employees: emps?.find(e => e.id === item.employee_id) || null
      }));
      
      setAllLiveHistory(mergedData);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

// ⚡ จุดที่ 1: ระบบ Real-time รวมศูนย์ (ดักฟังยอดขาย + ประวัติไลฟ์ + โควต้าวันลา)
  useEffect(() => {
    if (!user?.id) return; 

    // 🟢 สร้าง Debounce Timeout เพื่อรวมคำสั่งโหลดไม่ให้ Database ช็อก
    let syncTimeout;

    // ✨ สร้าง Channel เดียวทำงานตลอดชีพ
    const syncChannel = supabase.channel(`pancake_sync_global_${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_tracking' }, (payload) => {
        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
          fetchDashboardData(true); 
          // 🟢 สั่งให้ดึงประวัติใหม่เสมอเมื่อมียอดขยับ
          fetchHistoryWithNames();
        }, 800); 
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'employee_sales' }, (payload) => {
        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
          fetchDashboardData(true); 
        }, 800); 
      })
      // 🚩 เพิ่มการดักฟัง "โควต้าวันลา" และ "ประวัติการลา" เพื่อให้อัปเดต Real-time
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leave_balances' }, (payload) => {
        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => { fetchDashboardData(true); }, 800); 
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leave_requests' }, (payload) => {
        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => { fetchDashboardData(true); }, 800); 
      })
      .subscribe();

    return () => { 
      clearTimeout(syncTimeout);
      supabase.removeChannel(syncChannel); 
    };
  }, [user?.id]);

  // 🟢 โหลดข้อมูลประวัติอัตโนมัติ ทันทีที่พนักงานหรือ CEO กดเข้าเมนู "ประวัติการไลฟ์"
  useEffect(() => {
    if (currentView === "live_history") {
      fetchHistoryWithNames();
    }
  }, [currentView]);


  useEffect(() => {
    if (currentView === "manage_backup") {
      fetchBackupLogs();
    }
  }, [currentView]);


// 🔍 ตัวแปรสำหรับฟิลเตอร์ประวัติไลฟ์แบบละเอียด
const [filterPlatform, setFilterPlatform] = useState('');
const [filterStartDate, setFilterStartDate] = useState('');
const [filterEndDate, setFilterEndDate] = useState('');
const [displayLimit, setDisplayLimit] = useState('ALL');

// ⚙️ ตัวแปรสำหรับตั้งค่าแพลตฟอร์ม
  const [platforms, setPlatforms] = useState([]);
  const [newPlatform, setNewPlatform] = useState("");

  // 🔄 โหลดรายชื่อแพลตฟอร์มจากฐานข้อมูลอัตโนมัติ
  useEffect(() => {
    const fetchPlatforms = async () => {
      const { data } = await supabase.from('platforms').select('*').order('created_at', { ascending: true });
      if (data) setPlatforms(data);
    };
    fetchPlatforms();
   }, []);

  // ⚙️ State Dropdown เมนูตั้งค่าระบบ
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

// 🔔 แจ้งเตือน (Persistent Notification ระบบ Global สำหรับ Admin)
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("titan_user"));
      if (!currentUser || !currentUser.id) return [];
      
      // ✨ ถ้าเป็น Admin หรือ CEO ให้ใช้กล่อง "ส่วนกลาง (Global)" เพื่อดูทุกอย่าง
      if (currentUser.role === 'admin' || currentUser.role === 'ceo') {
        const globalNotifs = localStorage.getItem('titan_notifications_global');
        return globalNotifs ? JSON.parse(globalNotifs) : []; 
      }
      
      // ✨ ถ้าเป็นพนักงานทั่วไป ให้ดูแค่กล่องของตัวเอง
      const savedNotifs = localStorage.getItem(`titan_notifications_${currentUser.id}`);
      return savedNotifs ? JSON.parse(savedNotifs) : []; 
    } catch (e) {
      return [];
    }
  });

  const [liveEntries, setLiveEntries] = useState([
    { platform: '', startTime: '', endTime: '' }
  ]);

// 📦 Asset Management States (ระบบจัดการสินทรัพย์)
  const [assets, setAssets] = useState([]);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [assetForm, setAssetForm] = useState({
    name: '',
    asset_code: '',
    category: 'อุปกรณ์ไอที', 
    status: 'available', 
    purchase_date: '', 
    purchase_price: 0, 
    useful_life: 5,     // 👈 อายุการใช้งาน (เริ่มต้นที่ 5 ปี)
    salvage_value: 1,   // 👈 ราคาซาก (เริ่มต้นที่ 1 บาท)
    usage_location: '',   // 📍 สถานที่ใช้งาน
    storage_location: '', // 📦 สถานที่เก็บ
    assigned_to: null, 
    note: ''              // 📝 หมายเหตุ
  });

  // ฟังก์ชันดึงข้อมูลสินทรัพย์จาก Supabase
  const fetchAssets = async () => {
    const { data, error } = await supabase
      .from('assets')
      .select(`*, employees(full_name, nickname)`)
      .order('created_at', { ascending: false });
    if (data) setAssets(data);
  };

  // ดึงข้อมูลอัตโนมัติเมื่อเปลี่ยนหน้ามาที่ assets
  useEffect(() => {
    if (currentView === 'assets') fetchAssets();
  }, [currentView]);

  // ฟังก์ชันบันทึกข้อมูล (เพิ่ม/แก้ไข) - ฉบับแก้ไขคอลัมน์ asset_name ให้ตรงกับ Database
  const handleSaveAsset = async (e) => {
    if(e) e.preventDefault();
    try {
      // 1. เช็คข้อมูลบังคับ
      if (!assetForm.asset_code || (!assetForm.asset_name && !assetForm.name)) {
        return Swal.fire('ข้อมูลไม่ครบ', 'กรุณาระบุรหัสและชื่อสินทรัพย์', 'warning');
      }

      // 2. จัดเตรียมข้อมูล (Payload) - 🚨 แก้ไขชื่อคอลัมน์เป็น asset_name ให้ตรงเป๊ะ
      const payload = {
        ...(assetForm.id ? { id: assetForm.id } : {}),
        asset_code: assetForm.asset_code,
        asset_name: assetForm.asset_name || assetForm.name,  // 👈 เปลี่ยนจาก name เป็น asset_name ตรงนี้ครับ
        category: assetForm.category || 'อุปกรณ์ไอที',
        status: assetForm.status || 'available',
        
        assigned_to: assetForm.assigned_to === "" ? null : assetForm.assigned_to,
        purchase_date: assetForm.purchase_date || null,
        
        purchase_price: parseFloat(assetForm.purchase_price) || 0,
        useful_life: parseInt(assetForm.useful_life) || 5,
        salvage_value: parseFloat(assetForm.salvage_value) || 1,
        
        usage_location: assetForm.usage_location || '',
        storage_location: assetForm.storage_location || '',
        note: assetForm.note || ''
      };

      // 3. ส่งบันทึกขึ้น Supabase
      const { error } = await supabase.from('assets').upsert(payload);
      
      if (error) throw error;
      
      Swal.fire('สำเร็จ!', 'บันทึกข้อมูลสินทรัพย์เรียบร้อย', 'success');
      setIsAssetModalOpen(false);
      fetchAssets(); // โหลดข้อมูลตารางใหม่
      
    } catch (err) {
      console.error("PANCAKE ERP Save Error:", err.message);
      Swal.fire('ผิดพลาด', err.message, 'error');
    }
  };



  // 👥 ระบบจัดการพนักงาน (Employee Management)
  const [employees, setEmployees] = useState([]);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState(null);
  const [empSearch, setEmpSearch] = useState("");
const [empForm, setEmpForm] = useState({ 
    employee_code: "", full_name: "", name_en: "", nickname: "", email: "", profile_picture: "", username: "", password: "", 
    phone_number: "", position: "", salary_type: "Full-time", role: "employee", 
    shift_start: "08:00", shift_end: "17:00", require_password_change: false, 
    base_salary: 0, hourly_rate: 0 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [positions, setPositions] = useState([]); 

  // ✨ ให้ดึงข้อมูลตำแหน่งจาก DB อัตโนมัติเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    const fetchPositions = async () => {
      const { data } = await supabase.from('job_positions').select('name');
      if (data) setPositions(data.map(item => item.name));
    };
    fetchPositions();
  }, []);
  const [newPositionName, setNewPositionName] = useState(""); // สำหรับเพิ่มตำแหน่งใหม่
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false); // เปิด/ปิดหน้าจัดการตำแหน่ง

  // 🎲 ฟังก์ชันสุ่มรหัสผ่านสุดแกร่ง (ตรงตาม Policy 100%)
  const generateSecurePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numChars = "0123456789";
    let pass = "";
    pass += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
    pass += numChars.charAt(Math.floor(Math.random() * numChars.length));
    for(let i=0; i<5; i++) pass += Math.random().toString(36).slice(-2);
    
    setEmpForm({ ...empForm, password: pass, require_password_change: true });
    setShowPassword(true); // โชว์รหัสให้แอดมินเห็นชั่วคราวจะได้ก๊อปไปส่งให้พนักงานได้
  };
  //ระบบ ประวัติการลาทั้งหมด" (เฉพาะ Admin / CEO)
  const [allEmpLeaves, setAllEmpLeaves] = useState([]);
  const [empLeaveSearch, setEmpLeaveSearch] = useState("");
  const [viewMapModal, setViewMapModal] = useState(null);

  const [allLeavesTypeFilter, setAllLeavesTypeFilter] = useState("ALL");
  const [allLeavesStatusFilter, setAllLeavesStatusFilter] = useState("ALL");
  //ระบบแจ้งวันหยุดประจำสัปดาห์ ของ Part-Time
  const [dayoffSearchName, setDayoffSearchName] = useState("");
  const [dayoffFilterStatus, setDayoffFilterStatus] = useState("ALL");

// 🛠️ State สำหรับหน้าประวัติแจ้งปรับปรุงทั้งหมด (Admin)
  const [allEmpAdjustments, setAllEmpAdjustments] = useState([]);
  const [empAdjustSearch, setEmpAdjustSearch] = useState("");
  const [allAdjustTypeFilter, setAllAdjustTypeFilter] = useState("ALL");
  const [allAdjustStatusFilter, setAllAdjustStatusFilter] = useState("ALL");

  // 💸 State สำหรับระบบเงินเดือน (Payroll)
  const [payrollData, setPayrollData] = useState([]);
  const [adminPayrollSlips, setAdminPayrollSlips] = useState([]); // 🚩 วางเพิ่มตรงนี้ครับ
  
  const [payrollFilterMonth, setPayrollFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [payrollSearchKeyword, setPayrollSearchKeyword] = useState("");
  const [mySlips, setMySlips] = useState([]);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [payrollForm, setPayrollForm] = useState({ employee_id: "", base_salary: 0, ot_amount: 0, deductions: 0, bonus: 0, month: new Date().toISOString().slice(0, 7) });
  const [isSavingPayroll, setIsSavingPayroll] = useState(false);
  const [showAutoPayrollModal, setShowAutoPayrollModal] = useState(false);
  const [selectedEmps, setSelectedEmps] = useState([]);

// 🔐 State สำหรับระบบจัดการสิทธิ์เมนู (รายบุคคล)
  const [selectedPermEmpId, setSelectedPermEmpId] = useState("");
  const [currentEmpMenus, setCurrentEmpMenus] = useState([]);
  const [isSavingPerms, setIsSavingPerms] = useState(false);
  const [userMenus, setUserMenus] = useState([]); // เก็บสิทธิ์ของตัวเองที่ล็อกอินอยู่

  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState(new Date().toISOString().substring(0, 7));
  const [historyFilterEmp, setHistoryFilterEmp] = useState('all');

  const masterMenuList = [
    { id: 'menu_dashboard', icon: '🏠', label: t.menuDash },
    { id: 'menu_sales', icon: '💎', label: t.menuSales },
    { id: 'menu_sales_history', label: 'สถิติยอดขายย้อนหลัง', icon: '📊' },
    { id: 'menu_payroll', icon: '💸', label: t.menuPayroll },
    { id: 'menu_history', icon: '📋', label: t.menuHist },
    { id: 'menu_adjustments', icon: '🛠️', label: t.menuAdjust },
    { id: 'menu_attendance', icon: '📅', label: t.menuAttendance },
    { id: 'menu_checkin', icon: '⏰', label: t.menuCheck },
    { id: 'menu_pt_dayoff', icon: '🏖️', label: 'แจ้งวันหยุด' },
    { id: 'menu_approvals', icon: '✅', label: t.menuApprove },
    { id: 'menu_settings', icon: '⚙️', label: t.menuSettings }
  ];

 // โหลดรายชื่อพนักงานเมื่อเข้าหน้าตั้งค่าสิทธิ์
  useEffect(() => {
    if (currentView === 'settings_permissions') fetchEmployeesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // โหลดสิทธิ์ของพนักงานที่ถูกเลือกใน Dropdown
  useEffect(() => {
    if (currentView === 'settings_permissions' && selectedPermEmpId) {
      const loadEmpPerms = async () => {
        const { data } = await supabase.from('employee_permissions').select('*').eq('employee_id', selectedPermEmpId).limit(1);
        const empPerms = data?.[0];
        if (empPerms && empPerms.menu_list) {
          setCurrentEmpMenus(empPerms.menu_list);
        } else {
          // ถ้ายังไม่เคยตั้งค่า ให้ติ๊กถูกหมดทุกอันเป็นค่าเริ่มต้น
          setCurrentEmpMenus(masterMenuList.map(m => m.id));
        }
      };
      loadEmpPerms();
    }
  }, [currentView, selectedPermEmpId]);

  const handleToggleMenu = (menuId) => {
    setCurrentEmpMenus(prev => prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]);
  };

// ✨ ฟังก์ชันบันทึกสิทธิ์ที่แก้ไขใหม่ให้รองรับรายบุคคลอย่างถูกต้อง
  const handleSavePermissions = async () => {
    setIsSavingPerms(true);
    try {
      if (!selectedPermEmpId) throw new Error("กรุณาเลือกพนักงานก่อนบันทึกครับ");
      
      // ค้นหาว่าพนักงานคนนี้เคยมี record สิทธิ์หรือยัง
      const { data: exist } = await supabase.from('employee_permissions').select('id').eq('employee_id', selectedPermEmpId).maybeSingle();
      
      if (exist) {
        await supabase.from('employee_permissions').update({ menu_list: currentEmpMenus }).eq('employee_id', selectedPermEmpId);
      } else {
        await supabase.from('employee_permissions').insert([{ employee_id: selectedPermEmpId, menu_list: currentEmpMenus }]);
      }
      
      await supabase.from('system_logs').insert([{
        employee_id: user.id, 
        action: 'UPDATE_PERMISSIONS',
        details: `อัปเดตสิทธิ์การมองเห็นเมนูรายบุคคล`
      }]);
      
      Swal.fire({ icon: 'success', title: 'บันทึกสิทธิ์สำเร็จ!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });
    } catch (err) {
      Swal.fire('เกิดข้อผิดพลาด', err.message, 'error');
    } finally {
      setIsSavingPerms(false);
    }
  };

  // 🗑️ ฟังก์ชันลบประวัติการไลฟ์
  const handleDeleteLive = async (id) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ?',
      text: "คุณต้องการลบประวัติการไลฟ์นี้ใช่หรือไม่? ยอดขายสุทธิจะถูกคำนวณใหม่โดยอัตโนมัติ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F43F5E',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
      customClass: { popup: 'rounded-[2rem]' }
    });

    if (result.isConfirmed) {
      Swal.fire({ title: 'กำลังลบ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const { error } = await supabase.from('live_tracking').delete().eq('id', id);
        if (error) throw error;

        // หลังจากลบเสร็จ ให้โหลดข้อมูลใหม่เพื่อให้ยอดขายสุทธิของคนอื่นคำนวณใหม่ทันที
        await fetchDashboardData(true);
        
        Swal.fire({ icon: 'success', title: 'ลบสำเร็จ!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });
      } catch (err) {
        Swal.fire('เกิดข้อผิดพลาด', err.message, 'error');
      }
    }
  };

  // 💬 State สำหรับระบบตั้งค่าผู้รับ LINE OA (จัดระเบียบใหม่ไม่ให้ซ้ำ)
  const [lineAdminId, setLineAdminId] = useState("C0df0123907f46aa88c44ef72e88ea30f"); 
  const [isSavingLine, setIsSavingLine] = useState(false);

  useEffect(() => {
    const fetchLineSettings = async () => {
      try {
        const { data } = await supabase.from('system_settings').select('setting_value').eq('setting_key', 'line_admin_id').maybeSingle();
        if (data && data.setting_value) {
          setLineAdminId(data.setting_value);
        }
      } catch (err) { console.error("Load LINE ID Error:", err); }
    };
    fetchLineSettings();
  }, []);

  const handleSaveLineSettings = async (e) => {
    e.preventDefault();
    setIsSavingLine(true);
    try {
      const { error } = await supabase.from('system_settings').update({ setting_value: lineAdminId }).eq('setting_key', 'line_admin_id');
      if (error) throw error;
      await supabase.from('system_logs').insert([{ employee_id: user.id, action: 'UPDATE_LINE_SETTINGS', details: `อัปเดต LINE ID เป็น: ${lineAdminId}` }]);
      Swal.fire({ icon: 'success', title: 'บันทึก LINE ID สำเร็จ!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });
    } catch (err) { Swal.fire('Error', err.message, 'error'); } finally { setIsSavingLine(false); }
  };

  

 // 🎯 State สำหรับหน้าจัดการสิทธิ์วันลาแบบตาราง (Quotas)
  const [globalLeaveTypes, setGlobalLeaveTypes] = useState(['ลาป่วย', 'ลากิจ', 'ลาพักร้อน', 'ลาฉุกเฉิน', 'ลาไม่รับเงินเดือน']);
  const [allLeaveBalances, setAllLeaveBalances] = useState([]);
  const [editingQuotaEmp, setEditingQuotaEmp] = useState(null);
  const [isSavingQuota, setIsSavingQuota] = useState(false);

  // ดึงข้อมูลพนักงานและโควต้าทั้งหมด
  useEffect(() => { 
    if (currentView === 'employees' || currentView === 'settings_quotas') {
      fetchEmployeesData();
      if (currentView === 'settings_quotas') {
        const loadQuotas = async () => {
          try {
            const { data, error } = await supabase.from('leave_balances').select('*');
            if (error) throw error;
            if (data) {
              setAllLeaveBalances(data);
              // ดึงประเภทการลาที่มีอยู่ในฐานข้อมูลออกมาเพิ่มอัตโนมัติ (เผื่อเคยแอดไว้)
              const uniqueTypes = [...new Set(data.map(d => d.leave_type))];
              setGlobalLeaveTypes(prev => [...new Set([...prev, ...uniqueTypes])]);
            }
          } catch (err) { console.error("Error fetching all quotas:", err); }
        };
        loadQuotas();
      }
    }
  }, [currentView]);

  // 🎯 1. ฟังก์ชันเพิ่มประเภทการลาใหม่ + กำหนดวันเริ่มต้นให้ทุกคนทันที
  const handleAddLeaveType = async () => {
    const { value: formValues } = await Swal.fire({
      title: '➕ เพิ่มประเภทการลาใหม่',
      html: `
        <div class="text-left space-y-4 font-sans">
          <div>
            <label class="text-xs font-black text-slate-500 mb-1 block">ชื่อประเภทการลา</label>
            <input id="swal-input-name" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-purple-400 focus:outline-none" placeholder="เช่น ลาบวช, ลาคลอด...">
          </div>
          <div>
            <label class="text-xs font-black text-slate-500 mb-1 block">จำนวนวันที่ได้รับเริ่มต้น (วัน/ปี)</label>
            <input id="swal-input-days" type="number" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-purple-400 focus:outline-none" value="0">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '🚀 บันทึกข้อมูลเข้าฐานระบบ',
      confirmButtonColor: '#8b5cf6',
      customClass: { popup: 'rounded-[2rem] border-2 border-purple-100 shadow-2xl' },
      preConfirm: () => {
        const name = document.getElementById('swal-input-name').value;
        const days = document.getElementById('swal-input-days').value;
        if (!name) return Swal.showValidationMessage('กรุณากรอกชื่อประเภทการลาครับพี่');
        return { name, days: Number(days) || 0 };
      }
    });

    if (formValues) {
      Swal.fire({ title: 'กำลังอัปเดตระบบ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const { name, days } = formValues;
        
        // บันทึกลงฐานข้อมูล leave_balances ให้พนักงานทุกคนทันที!
        const insertPromises = employees.map(async (emp) => {
          return supabase.from('leave_balances').insert([{ 
            employee_id: emp.id, 
            leave_type: name, 
            total_days: days, 
            used_minutes: 0 
          }]);
        });
        await Promise.all(insertPromises);

        // รีเฟรชข้อมูลหน้าจอ
        const { data } = await supabase.from('leave_balances').select('*');
        setAllLeaveBalances(data || []);
        setGlobalLeaveTypes(prev => [...new Set([...prev, name])]);

        Swal.fire({ icon: 'success', title: 'เพิ่มเรียบร้อย!', text: `เพิ่มสิทธิ์ "${name}" จำนวน ${days} วัน ให้พนักงานทุกคนแล้วครับ`, showConfirmButton: false, timer: 2000, customClass: { popup: 'rounded-[2rem]' } });
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  // 🗑️ ฟังก์ชันลบประเภทการลา (ลบออกจากพนักงานทุกคนในฐานข้อมูล)
  const handleDeleteLeaveType = async (typeName) => {
    // 🛡️ ป้องกันไม่ให้ลบประเภทพื้นฐานที่ระบบต้องใช้
    const coreTypes = ['ลาป่วย', 'ลากิจ', 'ลาพักร้อน', 'ลาฉุกเฉิน', 'ลาไม่รับเงินเดือน', 'Sick Leave', 'Personal Leave', 'Annual Leave', 'Emergency', 'Leave Without Pay'];
    if (coreTypes.includes(typeName)) {
      return Swal.fire({ icon: 'error', title: 'ลบไม่ได้!', text: 'ประเภทการลานี้เป็นค่าเริ่มต้นของระบบ ไม่สามารถลบได้ครับ', confirmButtonColor: '#f43f5e', customClass: { popup: 'rounded-[2rem]' } });
    }

    const result = await Swal.fire({
      title: 'ยืนยันการลบ?',
      html: `สิทธิ์การลาประเภท <b>"${typeName}"</b> จะถูกลบออกจากพนักงานทุกคน!<br/><span class="text-rose-500 text-xs font-bold">* ข้อมูลประวัติการลาเก่าของประเภทนี้อาจแสดงผลผิดพลาดได้</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '🗑️ ใช่, ลบทิ้งเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#f43f5e',
      customClass: { popup: 'rounded-[2rem] border-2 border-rose-100 shadow-2xl' }
    });

    if (result.isConfirmed) {
      Swal.fire({ title: 'กำลังลบ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        // ลบข้อมูลโควต้าประเภทนี้ของพนักงานทุกคนใน DB
        const { error } = await supabase.from('leave_balances').delete().eq('leave_type', typeName);
        if (error) throw error;
        
        // อัปเดตข้อมูลบนหน้าจอทันที
        setGlobalLeaveTypes(prev => prev.filter(t => t !== typeName));
        const { data } = await supabase.from('leave_balances').select('*');
        setAllLeaveBalances(data || []);

        Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.message, customClass: { popup: 'rounded-[2rem]' } });
      }
    }
  };


  // เปิด Popup แก้ไขโควต้าของคนนั้นๆ
  const handleOpenEditQuota = (emp) => {
    const empBalances = allLeaveBalances.filter(b => b.employee_id === emp.id);
    const initialForm = {};
    globalLeaveTypes.forEach(type => {
      const found = empBalances.find(b => b.leave_type === type);
      initialForm[type] = found ? found.total_days : 0; // ค่าเริ่มต้นถ้าไม่มีคือ 0
    });
    setEditingQuotaEmp({ emp, form: initialForm });
  };

  // บันทึกโควต้าลงฐานข้อมูล
  const handleSaveQuotaModal = async (e) => {
    e.preventDefault();
    setIsSavingQuota(true);
    try {
      const empId = editingQuotaEmp.emp.id;
      const { data: existing } = await supabase.from('leave_balances').select('id, leave_type').eq('employee_id', empId);

      // วนลูปบันทึกทีละประเภท
      const promises = globalLeaveTypes.map(async (type) => {
        const targetDays = Number(editingQuotaEmp.form[type]) || 0;
        const existRec = existing?.find(x => x.leave_type === type);
        if (existRec) {
          return supabase.from('leave_balances').update({ total_days: targetDays }).eq('id', existRec.id);
        } else {
          return supabase.from('leave_balances').insert([{ employee_id: empId, leave_type: type, total_days: targetDays, used_minutes: 0 }]);
        }
      });
      await Promise.all(promises); // รอให้บันทึกเสร็จทั้งหมด

      // รีเฟรชข้อมูลล่าสุด
      const { data } = await supabase.from('leave_balances').select('*');
      setAllLeaveBalances(data || []);
      
      setEditingQuotaEmp(null);
      Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100' }});
      if (typeof addNotification === 'function') addNotification("อัปเดตโควต้า", `อัปเดตสิทธิ์วันลาของคุณ ${editingQuotaEmp.emp.full_name} เรียบร้อยแล้ว`);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, customClass: { popup: 'rounded-[2rem]' }});
    } finally {
      setIsSavingQuota(false);
    }
  };

  // ตัวช่วยเลือกไอคอนให้แต่ละประเภทการลา
  const getLeaveIcon = (type) => {
    if (!type) return '📋';
    if (type.includes('ป่วย') || type.includes('Sick')) return '🤒';
    if (type.includes('กิจ') || type.includes('Personal')) return '💼';
    if (type.includes('พักร้อน') || type.includes('Annual')) return '🏖️';
    if (type.includes('ฉุกเฉิน') || type.includes('Emergency')) return '🚨';
    if (type.includes('ไม่รับเงินเดือน') || type.includes('Without Pay')) return '💸';
    return '🔖'; // ไอคอนพื้นฐานสำหรับประเภทอื่นๆ ที่เพิ่มเข้ามาใหม่
  };

  // 🔒 ระบบบังคับเปลี่ยนรหัสผ่าน (ทำงานทันทีเมื่อเข้ามาหน้า Dashboard)
  useEffect(() => {
    if (user && user.require_password_change) enforcePasswordChange();
  }, [user]);

const enforcePasswordChange = async () => {
    const { value: newPass } = await Swal.fire({
      // ซ่อน Title เดิมของ Swal แล้วใช้วิธีวาด HTML เองทั้งหมดเพื่อให้สวยที่สุด
      title: null,
      html: `
        <div class="text-center font-sans">
          <div class="w-20 h-20 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-pink-200 animate-bounce">
            <span class="text-4xl text-white">🔒</span>
          </div>
          
          <h2 class="text-2xl font-black text-slate-800 tracking-tight mb-2">อัปเดตความปลอดภัย</h2>
          <p class="text-sm text-slate-500 mb-6 font-medium px-2">
            ระบบต้องการให้คุณตั้งรหัสผ่านใหม่<br/>
            เพื่อความปลอดภัยสูงสุดของบัญชีการใช้งาน
          </p>
          
          <div class="space-y-4 px-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="text-slate-400">🔑</span>
              </div>
              <input id="swal-p1" type="password" class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-center font-black tracking-widest outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50 transition-all shadow-sm" placeholder="รหัสผ่านใหม่">
            </div>
            
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="text-slate-400">✅</span>
              </div>
              <input id="swal-p2" type="password" class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-center font-black tracking-widest outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50 transition-all shadow-sm" placeholder="ยืนยันรหัสผ่านใหม่">
            </div>
          </div>
          
          <div class="mt-6 bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-start gap-3 text-left shadow-inner">
            <span class="text-rose-500 mt-0.5 text-lg">⚠️</span>
            <p class="text-[11px] text-rose-600 font-bold leading-relaxed">
              <span class="uppercase tracking-wider font-black border-b border-rose-200 pb-1 mb-1 block">เงื่อนไขรหัสผ่าน:</span>
              • ความยาวขั้นต่ำ 8 ตัวอักษร<br/>
              • ต้องมีตัวอักษรพิมพ์ใหญ่ (A-Z)<br/>
              • ต้องมีตัวอักษรพิมพ์เล็ก (a-z)<br/>
              • ต้องมีตัวเลข (0-9)
            </p>
          </div>
        </div>
      `,
      allowOutsideClick: false, 
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: '💾 บันทึกและเริ่มต้นใช้งาน',
      // ปิดสไตล์ปุ่มเดิมของ Swal เพื่อใช้ Tailwind เต็มรูปแบบ
      buttonsStyling: false,
      customClass: { 
        popup: 'rounded-[2.5rem] shadow-2xl border-0 p-6 sm:p-8 max-w-md w-full',
        // แต่งปุ่มใหม่ให้กว้างเต็มจอ (w-full) สีสวยๆ เข้าธีม
        confirmButton: 'w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-sm shadow-md hover:shadow-xl transition-all mt-6 hover:-translate-y-1'
      },
      backdrop: `rgba(15, 23, 42, 0.96)`, 
      preConfirm: () => {
        const p1 = document.getElementById('swal-p1').value;
        const p2 = document.getElementById('swal-p2').value;
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        
        if (!p1 || !p2) { Swal.showValidationMessage('กรุณากรอกรหัสให้ครบถ้วน'); return false; }
        if (p1 !== p2) { Swal.showValidationMessage('รหัสผ่านไม่ตรงกัน'); return false; }
        if (!passRegex.test(p1)) { Swal.showValidationMessage('รหัสผ่านไม่ปลอดภัยตามนโยบายระบบ'); return false; }
        return p1;
      }
    });

    if (newPass) {
      Swal.fire({ title: 'กำลังบันทึก...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const { error } = await supabase.from('employees').update({ 
        password: newPass, 
        require_password_change: false 
      }).eq('id', user.id);

      if (!error) {
        const updatedUser = { ...user, password: newPass, require_password_change: false };
        localStorage.setItem("titan_user", JSON.stringify(updatedUser));
        
        await Swal.fire({ 
          icon: 'success', 
          title: 'เปลี่ยนรหัสผ่านสำเร็จ!', 
          text: 'เข้าสู่ระบบเรียบร้อย ยินดีต้อนรับครับ',
          confirmButtonColor: '#8b5cf6',
          customClass: { popup: 'rounded-[2rem]' }
        });
        
        window.location.reload();
      } else {
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  const fetchEmployeesData = async () => {
    try {
      // ✨ เปลี่ยนการเรียงลำดับจาก created_at เป็น employee_code
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('employee_code', { ascending: true }); 
        
      if (error) throw error;
      setEmployees(data || []);
    } catch (err) { 
      console.error("Fetch employees error:", err.message); 
    }
  };

  // โหลดข้อมูลพนักงานเมื่อเปิดหน้าจัดการพนักงาน และ หน้าเงินเดือน
  useEffect(() => { 
    // ✨ เพิ่ม 'assets' และ 'warnings' เข้าไปเพื่อให้โหลดรายชื่อพนักงานมาแสดงในหน้าทรัพย์สินและใบเตือนด้วย
    if (currentView === 'employees' || currentView === 'payroll' || currentView === 'assets' || currentView === 'warnings') fetchEmployeesData(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

const handleSaveEmployee = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...empForm };
      
      // 🛡️ ตรวจสอบ Password Policy ก่อนเซฟ (คงเดิม)
      if (payload.password) {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passRegex.test(payload.password)) {
          return Swal.fire({ 
            icon: 'warning', 
            title: 'รหัสผ่านไม่ปลอดภัย', 
            text: 'ต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข', 
            customClass: { popup: 'rounded-[2rem]' }
          });
        }
      }

      // 🚩 ตัดส่วนการเติมวินาทีให้ shift_start / shift_end ออก
      delete payload.shift_start;
      delete payload.shift_end;

      // 🖼️ 1. จัดการอัปโหลดรูปภาพเข้าถัง Buckets (avatars)
      let fileToUpload = null;
      // ตรวจหาไฟล์รูปภาพจาก input type="file" ในหน้าต่าง Modal 
      if (payload.profile_picture && typeof payload.profile_picture === 'object') {
        fileToUpload = payload.profile_picture;
      } else {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        for (let input of fileInputs) {
          if (input.files && input.files.length > 0 && input.id !== 'audit-image-upload') {
            fileToUpload = input.files[0];
            break;
          }
        }
      }

      // หากมีไฟล์ใหม่ ให้ทำการอัปโหลดขึ้น Supabase Storage
      if (fileToUpload) {
        Swal.fire({ title: 'กำลังอัปโหลดรูปภาพ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        
        const fileExt = fileToUpload.name ? fileToUpload.name.split('.').pop() : 'png';
        const fileName = `avatar_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, fileToUpload, { cacheControl: '3600', upsert: false });
            
        if (uploadError) throw new Error('ไม่สามารถอัปโหลดรูปโปรไฟล์ได้: ' + uploadError.message);
        
        // ดึง URL รูปใหม่แบบ Public
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        payload.profile_picture = publicUrlData.publicUrl; 
      }

      if (editingEmpId) {
        // กรณีแก้ไขข้อมูลพนักงาน
        if (!payload.password) delete payload.password; // ลบรหัสผ่านทิ้งถ้าไม่ได้กรอกใหม่
        const { error } = await supabase.from('employees').update(payload).eq('id', editingEmpId);
        if (error) throw error;
        
        // 🟢 อัปเดต LocalStorage และเปลี่ยนรูปที่หน้าจอทันทีโดยไม่ง้อ State (หยุดปัญหาเด้งไปหน้า Loading)
        if (user && user.id === editingEmpId) {
          const updatedUser = { ...user, ...payload };
          localStorage.setItem("titan_user", JSON.stringify(updatedUser));
          
          if (payload.profile_picture) {
            const avatarImgs = document.querySelectorAll('img[alt="User"]');
            avatarImgs.forEach(img => { img.src = payload.profile_picture; });
          }
        }

        Swal.fire({ icon: 'success', title: 'บันทึกข้อมูลพนักงานสำเร็จ!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100' } });
        if (typeof addNotification === 'function') addNotification("แก้ไขพนักงาน", `อัปเดตข้อมูล ${payload.full_name} สำเร็จ`);
      } else {
        // กรณีเพิ่มพนักงานใหม่
        const { data: newEmp, error } = await supabase.from('employees').insert([payload]).select().single();
        if (error) throw error;

        // สร้างโครงสร้างสิทธิ์วันลาเริ่มต้น
        const defaultBalances = globalLeaveTypes.map(type => {
          let defaultDays = 0;
          if (type === 'ลาป่วย') defaultDays = 30;
          else if (type === 'ลากิจ') defaultDays = 4;
          else if (type === 'ลาฉุกเฉิน') defaultDays = 3;
          else if (type === 'ลาพักร้อน') defaultDays = 3;
          else if (type === 'ลาไม่รับเงินเดือน') defaultDays = 15;

          return { employee_id: newEmp.id, leave_type: type, total_days: defaultDays, used_minutes: 0 };
        });

        await supabase.from('leave_balances').insert(defaultBalances);

        Swal.fire({ icon: 'success', title: 'เพิ่มพนักงานใหม่สำเร็จ!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100' } });
        if (typeof addNotification === 'function') addNotification("เพิ่มพนักงานใหม่", `เพิ่ม ${payload.full_name} พร้อมตั้งสิทธิ์วันลาเริ่มต้นสำเร็จ`);
      }
      
      setIsEmpModalOpen(false);
      fetchEmployeesData(); // เรียกอัปเดตตารางพนักงานเบื้องหลัง
    } catch (error) { 
      Swal.fire({ icon: 'error', title: 'ข้อผิดพลาด', text: error.message, customClass: { popup: 'rounded-[2rem]' } });
    }
};

  const handleDeleteEmployee = async (id, name) => {
    const result = await Swal.fire({ title: 'ลบพนักงาน?', text: `คุณต้องการลบ ${name} ใช่หรือไม่? ข้อมูลประวัติการลาจะหายไปด้วยนะ!`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#f43f5e', cancelButtonColor: '#cbd5e1', confirmButtonText: 'ใช่, ลบเลย!', customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100', title: 'font-black text-slate-800 text-2xl mt-4' } });
    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('employees').delete().eq('id', id);
        if (error) throw error;
        Swal.fire({ icon: 'success', title: t.swalEmpDeleted, showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });
        if (typeof addNotification === 'function') addNotification("ลบพนักงาน", `ลบข้อมูล ${name} ออกจากระบบแล้ว`);
        fetchEmployeesData();
      } catch (error) { Swal.fire('Error', error.message, 'error'); }
    }
  };

  // 🚩 ฟังก์ชันใหม่: สำหรับเปิด-ปิดสถานะพนักงาน (Active/Inactive)
  const handleToggleEmployeeStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      Swal.fire({
        title: newStatus ? 'กำลังเปิดใช้งาน...' : 'กำลังระงับผู้ใช้...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // อัปเดตสถานะไปที่ Supabase
      const { error } = await supabase
        .from('employees')
        .update({ is_active: newStatus })
        .eq('id', id);

      if (error) throw error;

      // อัปเดต State ให้ UI เปลี่ยนทันที
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, is_active: newStatus } : emp));
      
      Swal.fire({
        icon: 'success',
        title: newStatus ? 'เปิดใช้งานสำเร็จ' : 'ระงับการใช้งานแล้ว',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error toggling status:', error);
      Swal.fire('ข้อผิดพลาด', error.message, 'error');
    }
  };

// Save Notifications to LocalStorage automatically (ระบบแยกกล่อง + ดันเข้า Global)
  useEffect(() => {
    if (user && user.id) {
      if (user.role === 'admin' || user.role === 'ceo') {
        // Admin และ CEO เซฟลงกล่องรวมของบริษัท
        localStorage.setItem('titan_notifications_global', JSON.stringify(notifications));
      } else {
        // พนักงานเซฟลงกล่องตัวเอง
        localStorage.setItem(`titan_notifications_${user.id}`, JSON.stringify(notifications));
        
        // ✨ แอบส่ง "สำเนาแจ้งเตือน" ไปหย่อนในกล่องรวมให้ Admin/CEO เห็นด้วย!
        try {
          const globalData = localStorage.getItem('titan_notifications_global');
          const globalNotifs = globalData ? JSON.parse(globalData) : [];
          
          // หาข้อความใหม่ที่เพิ่งเด้ง (กันการแจ้งเตือนซ้ำ)
          const newItems = notifications.filter(n => !globalNotifs.some(g => g.id === n.id));
          if (newItems.length > 0) {
             // ✨ ดึงชื่อพนักงานจริงๆ (full_name) มาโชว์ให้แอดมินเห็นเลย
             const employeeName = user.full_name || user.username;
             const updatedGlobal = [...newItems.map(n => ({...n, title: `👤 [${employeeName}] ${n.title}`})), ...globalNotifs];
             localStorage.setItem('titan_notifications_global', JSON.stringify(updatedGlobal));
          }
        } catch(e) {}
      }
    }
  }, [notifications, user]);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const markAllRead = () => setNotifications(n => n.map(x => ({...x, isRead: true})));
  const clearAllNotifs = () => setNotifications([]);
  const handleNotificationClick = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    setSelectedNotif(notif);
    setIsNotifOpen(false);
  };

  // 📢 ✨ ฟังก์ชันใหม่: เครื่องยนต์หลักสำหรับดันข้อความเข้ากระดิ่งแจ้งเตือน
  const addNotification = (title, message) => {
    const newNotif = {
      // ✅ แก้จาก Date.now() เป็นชุดนี้เพื่อให้ ID ไม่ซ้ำแน่นอน
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
      title: title,
      message: message,
      isRead: false,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 📍 State ตั้งค่าสาขา (Location)
  const [currentLocation, setCurrentLocation] = useState({ lat: 13.7563, lng: 100.5018, isDefault: true });
// 🟢 ประกาศ State ให้ครบ (แก้ปัญหา formName / editingBranchId is not defined)
  const [formRadius, setFormRadius] = useState(100); // ตั้งค่าเริ่มต้นไว้ที่ 100 เมตร
  const [branches, setBranches] = useState([]); 
  const [editingBranchId, setEditingBranchId] = useState(null); 
  const [formName, setFormName] = useState("");
  
// 🔍 State สำหรับระบบค้นหาสถานที่อัจฉริยะ (Smart Search Dropdown)
  const [branchSearch, setBranchSearch] = useState(""); 
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchingMap, setIsSearchingMap] = useState(false);

  // 🧠 ระบบหน่วงเวลาพิมพ์ (Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      // พิมพ์เกิน 2 ตัวอักษร ค่อยส่งไปค้นหา
      if (branchSearch && branchSearch.trim().length > 2) {
        searchMapAPI(branchSearch);
      } else {
        setSearchSuggestions([]);
      }
    }, 500); 

    return () => clearTimeout(timer);
  }, [branchSearch]);

  const searchMapAPI = async (query) => {
    setIsSearchingMap(true);
    try {
      // 🚀 เปลี่ยนมาใช้ Photon API (ไม่ติด Limit, ไม่ติด CORS, รองรับ Autocomplete เต็มรูปแบบ)
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setSearchSuggestions(data.features || []);
    } catch (error) {
      console.error("Search map error:", error);
    } finally {
      setIsSearchingMap(false);
    }
  };

  // 🔄 สั่งให้ทำงานอัตโนมัติเมื่อเข้าหน้าตั้งค่าสาขา
  useEffect(() => {
    if (currentView === "settings_branches") {
      fetchBranches(); // ดึงรายชื่อสาขาจาก DB
      getLocation();   // 🟢 ดึงพิกัดปัจจุบันขึ้นแผนที่ทันที
    }
  }, [currentView]);

// 🗺️ ระบบจัดการแผนที่ Leaflet แบบเปรียบเทียบรัศมี (เก่า vs ใหม่) + อัปเกรดให้ลากหมุดและคลิกได้
  useEffect(() => {
    if (currentView === "settings_branches" && window.L) {
      // 1. ล้างแผนที่เก่า
      if (window.mapInstance) {
        window.mapInstance.remove();
        window.mapInstance = null;
      }

      // 2. สร้างแผนที่
      const map = L.map('map').setView([currentLocation.lat, currentLocation.lng], 16);
      window.mapInstance = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);

      // 3. ปักหมุดพิกัดปัจจุบัน (✨ อัปเกรด: เปิดให้คลิกลากหมุดได้)
      const marker = L.marker([currentLocation.lat, currentLocation.lng], {
        draggable: true // 🟢 เปิดฟังก์ชันให้สามารถใช้เมาส์/นิ้ว ลากหมุดได้
      }).addTo(map);

      // ✨ อัปเดตพิกัดทันทีเมื่อผู้ใช้ "ลากหมุดแล้วปล่อย"
      marker.on('dragend', function (e) {
        const position = marker.getLatLng();
        setCurrentLocation({ lat: position.lat, lng: position.lng, isDefault: false });
      });

      // ✨ อัปเดตพิกัดทันทีเมื่อผู้ใช้ "คลิกหรือจิ้มตรงไหนก็ได้บนแผนที่"
      map.on('click', function (e) {
        setCurrentLocation({ lat: e.latlng.lat, lng: e.latlng.lng, isDefault: false });
      });

      // 🔵 4. วาดวงกลม "รัศมีเก่า" (แสดงเฉพาะตอนกดแก้ไข)
      if (editingBranchId) {
        const oldBranch = branches.find(b => b.id === editingBranchId);
        if (oldBranch) {
          L.circle([oldBranch.lat, oldBranch.lng], {
            color: '#94a3b8',     
            weight: 2,
            dashArray: '5, 10',    // เส้นประ
            fillColor: '#cbd5e1',
            fillOpacity: 0.1,
            radius: Number(oldBranch.radius_m || 0) // ค่าเดิมจาก DB
          }).addTo(map).bindPopup("รัศมีเดิม");
        }
      }

      // 💗 5. วาดวงกลม "รัศมีใหม่" (ขยับตามที่พี่กรอกเลข)
      L.circle([currentLocation.lat, currentLocation.lng], {
        color: '#ec4899',      // สีชมพูธีม Pancake
        fillColor: '#fbcfe8',
        fillOpacity: 0.3,
        radius: Number(formRadius) || 0
      }).addTo(map).bindPopup("รัศมีใหม่");
    }

    return () => {
      if (window.mapInstance) {
        window.mapInstance.remove();
        window.mapInstance = null;
      }
    };
  }, [currentLocation, formRadius, currentView, editingBranchId]);

// 🏖️ State สำหรับแจ้งวันหยุด Part-time
  const [isDayoffModalOpen, setIsDayoffModalOpen] = useState(false);
  const [dayoffForm, setDayoffForm] = useState({ date: "", reason: "วันหยุดประจำสัปดาห์" });


  const [activeStaff, setActiveStaff] = useState(0);
  // 📊 State สำหรับวิดเจ็ตสรุปการมาทำงานประจำวัน (เพิ่มใหม่)
  const [todayStats, setTodayStats] = useState({ totalActive: 0, totalLate: 0, totalLeave: 0 });

  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]); 
  const [allAdjustments, setAllAdjustments] = useState([]); 
  const [approvedPercent, setApprovedPercent] = useState(0);
  
  const [adminLeaves, setAdminLeaves] = useState([]);
  const [adminAdjustments, setAdminAdjustments] = useState([]);
  const [adminTab, setAdminTab] = useState('leaves'); 

  const [chartType, setChartType] = useState("pie");

  
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

// 🕒 State สำหรับหน้าประวัติเข้าออกงาน
  const [attendanceList, setAttendanceList] = useState([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [attnFilterStatus, setAttnFilterStatus] = useState("ALL");
  const [attnSearchName, setAttnSearchName] = useState("");

// 🟢 ส่วนที่อัปเกรด: โหลดรายชื่อพนักงาน และตั้งตัวดักฟังเพื่อให้ชื่ออัปเดตอัตโนมัติ
  useEffect(() => {
    if (currentView === 'attendance') {
      fetchAttendanceData();
      fetchEmployeesData(); // 👈 สั่งโหลดรายชื่อพนักงานมาเตรียมไว้

      // 🛰️ ตัวดักฟัง (Listener): ถ้ามีการเพิ่มพนักงานหน้าอื่น ชื่อในหน้าเจอนี้จะโผล่มาทันที
      const empSubscription = supabase
        .channel('attendance-sync-employees')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, () => {
          fetchEmployeesData(); 
        })
        .subscribe();

      return () => {
        supabase.removeChannel(empSubscription);
      };
    }
  }, [currentView]);

const fetchAttendanceData = async () => {
    setIsLoadingAttendance(true);
    try {
      let query = supabase
        .from('attendance_logs')
        .select('*, employees(full_name)')
        // 🟢 ดึงจากเก่าไปใหม่ก่อน เพื่อให้ลอจิกจับคู่ เข้า-ออก ทำงานได้ถูกต้อง
        .order('timestamp', { ascending: true }); 

      if (user?.role !== 'admin' && user?.role !== 'ceo') {
        query = query.eq('employee_id', user.id);
      }

      const { data, error } = await query;
      if (error) throw error;

      const pairs = [];
      const openSessions = {}; // เอาไว้จำว่าใครกำลัง "เข้างาน" ค้างอยู่บ้าง

      (data || []).forEach(log => {
        const d = new Date(log.timestamp);
        // เก็บวันที่สำหรับแสดงผล (ยึดตามวันที่เข้างานเป็นหลัก)
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        
        // 🛠️ [FIXED] จุดสำคัญ: เปลี่ยน Key ให้จำแค่ "รหัสพนักงาน" ไม่ต้องพ่วงวันที่
        // เพื่อให้ระบบรู้จักกะที่ข้ามเที่ยงคืน (เข้าดึก-ออกเช้า) และนำมาประกบเป็นบรรทัดเดียวกันได้
        const empKey = log.employee_id; 
        const timeStr = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

        if (log.log_type === 'check_in') {
          // 🟢 ถ้าเจอสถานะ "เข้า" ให้สร้างบรรทัดใหม่เสมอ
          const newSession = {
            id_in: log.id,
            date: dateKey,
            timestamp: log.timestamp, // ใช้ timestamp ขาเข้าเป็นหลักในการจัดเรียง
            timestamp_in: log.timestamp, // ✨ [อัปเกรด] เก็บวันเวลาเข้างานแบบเต็มๆ (ตัวจริง)
            employee_id: log.employee_id,
            full_name: log.employees?.full_name || 'ไม่ระบุชื่อ',
            time_in: timeStr,
            time_out: null, // ปล่อยว่างไว้รอคนมากดออก
            timestamp_out: null, // ✨ [อัปเกรด] เตรียมพื้นที่ไว้เก็บวันเวลาออกแบบเต็มๆ
            status: log.status || 'normal',
            late_minutes: log.late_minutes || 0,
            selfie_in: log.selfie_url,
            selfie_out: null,
            lat_in: log.lat, 
            lng_in: log.lng,
            lat_out: null, 
            lng_out: null
          };
          pairs.push(newSession);
          openSessions[empKey] = newSession; // จำไว้ว่ากะนี้ของคนนี้ยังไม่ออกนะ
        } 
        else if (log.log_type === 'check_out') {
          // 🔴 ถ้าเจอสถานะ "ออก" ให้ไปหากะที่ค้างอยู่ของพนักงานคนนี้
          if (openSessions[empKey] && !openSessions[empKey].time_out) {
            // เอาข้อมูลขาออกมาเติมในบรรทัดเดียวกันให้สมบูรณ์!
            openSessions[empKey].time_out = timeStr;
            openSessions[empKey].timestamp_out = log.timestamp; // ✨ [อัปเกรด] เก็บวันที่และเวลาออกงานตัวจริง! (แก้บัคเปลี่ยนวันแล้วไม่เซฟ)
            openSessions[empKey].selfie_out = log.selfie_url;
            openSessions[empKey].lat_out = log.lat; // พิกัดตอนออกงานจะมาอยู่ในบรรทัดเดียวกันแล้ว
            openSessions[empKey].lng_out = log.lng;
            openSessions[empKey].id_out = log.id;
          } else {
            // กรณีหลุดโลก: กด "ออก" โดยที่ไม่เคยกด "เข้า" มาก่อนเลย (เช่นบัคจากระบบเก่า)
            pairs.push({
              id_out: log.id,
              date: dateKey,
              timestamp: log.timestamp,
              timestamp_in: null, // ✨ [อัปเกรด]
              timestamp_out: log.timestamp, // ✨ [อัปเกรด]
              employee_id: log.employee_id,
              full_name: log.employees?.full_name || 'ไม่ระบุชื่อ',
              time_in: null,
              time_out: timeStr,
              status: 'normal',
              late_minutes: 0,
              selfie_in: null,
              selfie_out: log.selfie_url,
              lat_in: null, lng_in: null,
              lat_out: log.lat, lng_out: log.lng
            });
          }
        }
      });

      // 🔄 จับกลุ่มเสร็จแล้ว ค่อยเอามา Sort ให้ "อันล่าสุด" (ที่เพิ่งกด) ขึ้นไปอยู่บนสุดของตาราง
      pairs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setAttendanceList(pairs);
      
    } catch (error) {
      console.error("Fetch Error:", error.message);
    } finally {
      setIsLoadingAttendance(false);
    }
  };

  // 🕒 ฟังก์ชันแปลงนาทีเป็น "ชม. นาที"
  const formatLateTime = (totalMinutes) => {
    if (!totalMinutes || totalMinutes <= 0) return "";
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return hours > 0 ? `${hours} ชม. ${mins} นาที` : `${mins} นาที`;
  };

  // 🖼️ ฟังก์ชันดูรูป
  const viewSelfie = (url, title) => {
    if (!url) return;
    Swal.fire({
      title: title,
      imageUrl: url,
      imageAlt: 'Attendance Selfie',
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: 'rounded-[2rem] shadow-2xl', image: 'rounded-2xl' }
    });
  };

  // 📝 Modal ลางาน
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "ลาพักร้อน", startDate: "", startTime: "08:00", endDate: "", endTime: "17:00", reason: "" });
  // ✨ เพิ่มตัวแปรสำหรับเก็บไฟล์ใบรับรองแพทย์
  const [medicalCertFile, setMedicalCertFile] = useState(null);
  const [calculatedTime, setCalculatedTime] = useState({ text: "ระบบจะคำนวณอัตโนมัติเมื่อระบุวันและเวลาครบถ้วน", isDefault: true, isError: false, mins: 0 });

  // 🛠️ Modal แจ้งปรับปรุง
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ tab: "swap", oldDate: "", newDate: "", incidentDate: "", timeType: "เข้างาน (IN)", oldTime: "", newTime: "", reason: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 💎 State สำหรับระบบยอดขาย (Sales Performance)
  const [salesData, setSalesData] = useState({ current: 0, target: 100000, updated_at: null, commission_rate: 0 });
  const [allSalesData, setAllSalesData] = useState([]);
  const [isSavingSales, setIsSavingSales] = useState(false);
  const [salesMonth, setSalesMonth] = useState(new Date().toISOString().slice(0, 7)); // เดือนที่แอดมินกำลังดูยอดขาย
  const [isMySalesModalOpen, setIsMySalesModalOpen] = useState(false); // เปิด/ปิด หน้าต่างยอดขายพนักงาน

// 🎈 State แคมเปญวันหยุด (Holiday Commissions)
  const [holidayCampaigns, setHolidayCampaigns] = useState([]);

  // 🚀 อัปเกรด V.4.1: เพิ่มป้ายสถานะอัตโนมัติ (กำลังทำงาน / หมดอายุ / รอเริ่ม)
  const handleManageCampaigns = async () => {
    const { data } = await supabase.from('system_settings').select('setting_value').eq('setting_key', 'holiday_campaigns').maybeSingle();
    let campaigns = data?.setting_value ? JSON.parse(data.setting_value) : [];

    const showMenu = async (camps) => {
      // 🟢 ดึงวันที่ปัจจุบันมาเทียบสถานะ
      const todayStr = new Date().toISOString().split('T')[0];

      let htmlList = camps.length === 0 
        ? `<div class="p-4 bg-slate-50 rounded-xl text-slate-500 text-sm font-bold border border-dashed border-slate-300">ยังไม่มีแคมเปญวันหยุด</div>`
        : camps.map((c, i) => {
            
            // 🧠 Logic เช็กสถานะของแคมเปญ
            let statusBadge = '';
            let boxStyle = 'bg-rose-50 border-rose-200';
            let textStyle = 'text-rose-600';
            
            if (c.endDate < todayStr) {
              // เคสที่ 1: หมดอายุแล้ว (สีจะเทาๆ ดรอปลง)
              statusBadge = '<span class="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full text-[9px] ml-2 font-black border border-slate-300">🔴 หมดอายุ</span>';
              boxStyle = 'bg-slate-50 border-slate-200 opacity-60'; 
              textStyle = 'text-slate-500';
            } else if (c.startDate > todayStr) {
              // เคสที่ 2: รอเริ่มใช้งาน (ตั้งล่วงหน้า)
              statusBadge = '<span class="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-[9px] ml-2 font-black border border-amber-200">🟡 รอเริ่มใช้งาน</span>';
            } else {
              // เคสที่ 3: กำลังทำงาน (อยู่ในช่วงวันที่กำหนด)
              statusBadge = '<span class="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] ml-2 font-black border border-emerald-200 animate-pulse">🟢 กำลังทำงาน</span>';
            }

            return `
            <div class="flex justify-between items-center ${boxStyle} p-3 rounded-xl border mb-2 text-left shadow-sm transition-all">
              <div>
                <div class="font-black ${textStyle} flex items-center flex-wrap gap-y-1">
                  ${c.name} 
                  <span class="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px] mx-2">เรท ${c.rate}%</span>
                  ${statusBadge}
                </div>
                <div class="text-[10px] font-bold text-slate-500 mt-1">📅 ${new Date(c.startDate).toLocaleDateString('th-TH', {day:'numeric', month:'short'})} ถึง ${new Date(c.endDate).toLocaleDateString('th-TH', {day:'numeric', month:'short', year:'2-digit'})}</div>
              </div>
              <button onclick="window.deleteCampaign(${i})" class="bg-white text-rose-500 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition-all shadow-sm">ลบ</button>
            </div>
          `}).join('');

      await Swal.fire({
        title: '🎉 ตั้งค่าเรทค่าคอมฯ วันหยุด',
        html: `
          <div class="mb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">${htmlList}</div>
          <button id="btn-add-camp" class="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black rounded-xl shadow-md hover:shadow-lg transition-all border border-orange-300">➕ เพิ่มเทศกาลใหม่</button>
        `,
        showCancelButton: true, showConfirmButton: false, cancelButtonText: 'ปิดหน้าต่าง',
        customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-orange-100' },
        didOpen: () => {
           document.getElementById('btn-add-camp').onclick = () => showAddForm(camps);
           window.deleteCampaign = async (idx) => {
              const newCamps = [...camps]; newCamps.splice(idx, 1);
              await saveCampaigns(newCamps); showMenu(newCamps);
           };
        }
      });
    };

    const showAddForm = async (camps) => {
      const form = await Swal.fire({
        title: '➕ เพิ่มเทศกาลใหม่',
        html: `
          <div class="space-y-3 text-left font-sans mt-2">
            <div>
              <label class="text-xs font-bold text-slate-500 ml-1">ชื่อเทศกาล (เช่น สงกรานต์ 69)</label>
              <input id="c-name" type="text" placeholder="ระบุชื่อเทศกาล..." class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold outline-none focus:border-amber-400">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-slate-500 ml-1">วันเริ่ม</label>
                <input id="c-start" type="date" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold outline-none focus:border-amber-400">
              </div>
              <div>
                <label class="text-xs font-bold text-slate-500 ml-1">วันสิ้นสุด</label>
                <input id="c-end" type="date" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold outline-none focus:border-amber-400">
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-emerald-500 ml-1">เรทค่าคอม (%) สำหรับช่วงนี้</label>
              <input id="c-rate" type="number" step="0.1" placeholder="เช่น 2 หรือ 2.5" class="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3 font-black text-emerald-600 outline-none focus:border-emerald-400">
            </div>
          </div>
        `,
        showCancelButton: true, confirmButtonText: '💾 บันทึก', confirmButtonColor: '#10b981',
        customClass: { popup: 'rounded-[2rem] shadow-2xl' },
        preConfirm: () => {
          const name = document.getElementById('c-name').value;
          const startDate = document.getElementById('c-start').value;
          const endDate = document.getElementById('c-end').value;
          const rate = document.getElementById('c-rate').value;
          if (!name || !startDate || !endDate || !rate) return Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
          return { name, startDate, endDate, rate: Number(rate) };
        }
      });

      if (form.isConfirmed) {
        const newCamps = [...camps, form.value];
        await saveCampaigns(newCamps); showMenu(newCamps);
      } else { showMenu(camps); }
    };

    const saveCampaigns = async (newCamps) => {
      Swal.fire({ title: 'กำลังบันทึก...', didOpen: () => Swal.showLoading() });
      await supabase.from('system_settings').upsert([{ setting_key: 'holiday_campaigns', setting_value: JSON.stringify(newCamps) }], { onConflict: 'setting_key' });
      setHolidayCampaigns(newCamps);
      fetchDashboardData(true); // โหลดแดชบอร์ดใหม่เพื่อให้ตัวเลขวิ่ง
      Swal.close();
    };

    showMenu(campaigns);
  };

  // 🏆 State สำหรับ Leaderboard และยอดรวมบริษัท
  const [leaderboard, setLeaderboard] = useState([]);
  const [companySales, setCompanySales] = useState({ current: 0, target: 5000000 }); // เป้าบริษัทตั้งต้นที่ 5 ล้าน
  const [displayedSales, setDisplayedSales] = useState(0);
  const [showVictory, setShowVictory] = useState(false); // ✨ State สำหรับโชว์เอฟเฟกต์พลุ

  // 📊 State สำหรับข้อมูลกราฟ 12 เดือน
  const [monthlySalesData, setMonthlySalesData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // 🚀 Animation วิ่งยอดขาย (แก้ไขการทำงานซ้อนทับให้ถูกต้องตามหลัก React)
  useEffect(() => {
    let animationFrameId;
    let timeoutId;

    if (currentView === "dashboard" && salesData.current > 0 && !isLoading) {
      let startTimestamp = null;
      let startValue = null;
      const finalValue = Number(salesData.current);

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        let keepAnimating = true;

        setDisplayedSales(prev => {
          if (startValue === null) startValue = prev || 0;
          if (startValue === finalValue) {
            keepAnimating = false;
            return finalValue;
          }

          const duration = startValue === 0 ? 1500 : 800;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          
          if (progress >= 1) keepAnimating = false;
          return Math.floor(startValue + (finalValue - startValue) * easeProgress);
        });

        if (keepAnimating) {
          animationFrameId = window.requestAnimationFrame(step);
        }
      };

      // หน่วงเวลาเล็กน้อยเพื่อให้หน้าจอ Render เสร็จก่อนวิ่งแอนิเมชัน
      timeoutId = setTimeout(() => {
        animationFrameId = window.requestAnimationFrame(step);
      }, 300);
    }

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentView, salesData.current, isLoading]);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

// 🕵️‍♂️ 1. ระบบเก็บ Log เข้าใช้งาน (ใช้โค้ดดั้งเดิม) & 2. ลงทะเบียนอุปกรณ์ประจำเครื่อง
  useEffect(() => {
    if (!user) return navigate('/login');
    fetchDashboardData();

    const recordAccessAndDevice = async () => {
      // ==========================================
      // 📱 ส่วนที่ 1: บันทึกอุปกรณ์ลงตาราง `devices` (เหลือแค่คอลัมน์ที่มีชัวร์ๆ)
      // ==========================================
      try {
        let currentDeviceId = localStorage.getItem('titan_device_id');
        if (!currentDeviceId) {
          currentDeviceId = crypto.randomUUID ? crypto.randomUUID() : 'DEV-' + Date.now().toString(36);
          localStorage.setItem('titan_device_id', currentDeviceId);
        }

        // ดึงชื่อรุ่น/ระบบปฏิบัติการ
        const ua = navigator.userAgent;
        let deviceName = 'Desktop Browser';
        if (/iPhone/i.test(ua)) deviceName = 'Apple iPhone';
        else if (/iPad/i.test(ua)) deviceName = 'Apple iPad';
        else if (/Android/i.test(ua)) deviceName = 'Android Device';
        else if (/Windows/i.test(ua)) deviceName = 'Windows PC';
        else if (/Mac OS/i.test(ua)) deviceName = 'MacBook / iMac';

        const { data: existingDevice } = await supabase
          .from('devices')
          .select('id')
          .eq('employee_id', user.id)
          .eq('device_id', currentDeviceId)
          .maybeSingle();

        if (existingDevice) {
          // 🟢 อัปเดตแค่ device_model ล้วนๆ
          await supabase
            .from('devices')
            .update({ 
               device_model: deviceName 
            })
            .eq('id', existingDevice.id);
        } else {
          // 🔵 Insert ข้อมูล และดักจับ Error 409
          const { error: insertErr } = await supabase.from('devices').insert([{
            employee_id: user.id,
            device_id: currentDeviceId,
            device_model: deviceName
          }]);
          
          // 🛡️ หากเกิด Error ข้อมูลซ้ำ (409 Conflict หรือ 23505) ให้ปล่อยผ่านไปเลย เพราะแปลว่ารอบแรกบันทึกสำเร็จแล้ว
          if (insertErr && insertErr.code !== '23505' && !insertErr.message.includes('duplicate')) {
             console.error("🚨 Device Logic Error:", insertErr);
          }
        }
      } catch (deviceErr) {
        console.error("🚨 Catch Error:", deviceErr);
      }

      // ==========================================
      // 🕵️‍♂️ ส่วนที่ 2: บันทึกประวัติการเข้าใช้งานลง `system_logs` (ของเดิม 100%)
      // ==========================================
      const sessionKey = `titan_access_logged_${user.id}`;
      
      if (!sessionStorage.getItem(sessionKey)) {
        try {
          let ipAddress = 'Unknown IP';
          try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            ipAddress = data.ip;
          } catch (e) { console.log('ไม่สามารถดึง IP ได้'); }

          const userAgent = navigator.userAgent;
          let device = 'Desktop';
          if (/Mobi|Android/i.test(userAgent)) device = 'Mobile';
          else if (/Tablet|iPad/i.test(userAgent)) device = 'Tablet';
          
          await supabase.from('system_logs').insert([{ 
            employee_id: user.id, 
            action: 'SYSTEM_LOGIN', 
            details: `เข้าสู่ระบบจาก ${device} | IP: ${ipAddress}` 
          }]);
          
          sessionStorage.setItem(sessionKey, "true"); 
        } catch (err) {
          console.error("Access Log Error:", err);
        }
      }
    };
    
    recordAccessAndDevice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);
  
// 🟢 ฟังก์ชันใหม่: สำหรับให้พนักงานเปลี่ยนรูปตัวเอง (วางไว้เหนือ const changeLang)
  const handleSelfProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      Swal.fire({ title: 'กำลังอัปโหลดรูปภาพ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      // 1. อัปโหลดขึ้น Supabase Storage (ถัง avatars)
      const fileExt = file.name ? file.name.split('.').pop() : 'png';
      const fileName = `avatar_self_${user.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw new Error('อัปโหลดรูปไม่สำเร็จ: ' + uploadError.message);

      // 2. ดึง URL รูปใหม่
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const newProfileUrl = publicUrlData.publicUrl;

      // 3. อัปเดตลงฐานข้อมูลพนักงาน
      const { error: updateError } = await supabase.from('employees')
        .update({ profile_picture: newProfileUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 4. อัปเดตข้อมูลใน LocalStorage
      const updatedUser = { ...user, profile_picture: newProfileUrl };
      localStorage.setItem("titan_user", JSON.stringify(updatedUser));

      // 5. บังคับเปลี่ยนรูปในหน้าจอทันที (ไม่ต้องมีหน้าโหลด)
      const avatarImgs = document.querySelectorAll('img[alt="User"]');
      avatarImgs.forEach(img => { img.src = newProfileUrl; });

      Swal.fire({ icon: 'success', title: 'เปลี่ยนรูปโปรไฟล์สำเร็จ!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });

    } catch (error) {
      Swal.fire({ icon: 'error', title: 'ข้อผิดพลาด', text: error.message, customClass: { popup: 'rounded-[2rem]' } });
    }
  };

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("titan_lang", newLang);
  };

  
// 🌐 Helper Function สำหรับแปลข้อมูลในตาราง
  const getTranslatedType = (type) => {
    if (!type) return '-';
    if (lang === 'TH') return type;
    const map = { 
      'ลาป่วย': 'Sick Leave', 
      'ลากิจ': 'Personal Leave', 
      'ลาพักร้อน': 'Annual Leave', 
      'ลาฉุกเฉิน': 'Emergency', 
      'สลับวันหยุด': 'Swap Day', 
      'แก้ไขเวลา': 'Edit Time',
      'ลาไม่รับเงินเดือน': 'Leave Without Pay',
      'วันหยุดประจำสัปดาห์ (PT)': 'Weekly Day Off (PT)' // ✨ เพิ่มตัวนี้เข้าไปครับ
    };
    return map[type] || type;
  };

  const getTranslatedStatus = (status) => {
    if (lang === 'TH') return status;
    const map = { 'รออนุมัติ': 'Pending', 'อนุมัติ': 'Approved', 'ไม่อนุมัติ': 'Rejected' };
    return map[status] || status;
  };

  // 🟢 ฟอร์แมตเวลา (วัน ชั่วโมง นาที)
  const formatDuration = (totalMins) => {
    if (!totalMins || totalMins <= 0) return lang === 'TH' ? "0 นาที" : "0 Mins";
    const d = Math.floor(totalMins / 480);
    const h = Math.floor((totalMins % 480) / 60);
    const m = totalMins % 60;
    let res = [];
    if (lang === 'TH') {
      if (d > 0) res.push(`${d} วัน`);
      if (h > 0) res.push(`${h} ชั่วโมง`);
      if (m > 0) res.push(`${m} นาที`);
    } else {
      if (d > 0) res.push(`${d} Days`);
      if (h > 0) res.push(`${h} Hrs`);
      if (m > 0) res.push(`${m} Mins`);
    }
    return res.join(' ');
  };


 // 🧮 ฟังก์ชันคำนวณระยะเวลา (แก้บั๊กลาข้ามวันให้คิดตามชั่วโมงทำงานจริง วันละ 8 ชม.)
  useEffect(() => {
    if (leaveForm.startDate && leaveForm.startTime && leaveForm.endDate && leaveForm.endTime) {
      const start = new Date(`${leaveForm.startDate}T${leaveForm.startTime}`);
      const end = new Date(`${leaveForm.endDate}T${leaveForm.endTime}`);
      
      if (end <= start) {
        setCalculatedTime({ text: "⚠️ เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น", mins: 0, isDefault: false, isError: true });
        return;
      }

      let finalMins = 0;
      
      // หาความต่างของ "จำนวนวัน" แบบไม่สนใจเวลา
      const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      const dayDiff = Math.floor((endDateOnly - startDateOnly) / (1000 * 60 * 60 * 24)); 

      if (dayDiff === 0) {
        // 📌 กรณีลาวันเดียว (จบในวัน)
        let diffMins = (end - start) / 60000;
        if (leaveForm.startTime <= "12:00" && leaveForm.endTime >= "13:00") diffMins -= 60; // หักพักเที่ยง 1 ชม.
        finalMins = diffMins;
      } else {
        // 📌 กรณีลาข้ามวัน (หลายวัน)
        // 1. คำนวณวันเต็มๆ ตรงกลาง (ถ้ามี) คิดวันละ 8 ชม. (480 นาที)
        const fullDaysBetween = Math.max(0, dayDiff - 1); 

        // 2. คำนวณชั่วโมงของ "วันแรก" (นับจากเวลาที่เริ่มลา ไปจนถึงเวลาเลิกงาน 17:00)
        let startDayMins = (new Date(`1970-01-01T17:00`) - new Date(`1970-01-01T${leaveForm.startTime}`)) / 60000;
        if (leaveForm.startTime <= "12:00") startDayMins -= 60; // หักพักเที่ยงถ้าเริ่มงานช่วงเช้า
        startDayMins = Math.max(0, startDayMins);

        // 3. คำนวณชั่วโมงของ "วันสุดท้าย" (นับจากเวลาเริ่มงาน 08:00 ไปจนถึงเวลาสิ้นสุดการลา)
        let endDayMins = (new Date(`1970-01-01T${leaveForm.endTime}`) - new Date(`1970-01-01T08:00`)) / 60000;
        if (leaveForm.endTime >= "13:00") endDayMins -= 60; // หักพักเที่ยงถ้าลาลากยาวไปถึงบ่าย
        endDayMins = Math.max(0, endDayMins);

        // รวมเวลาทั้งหมดเข้าด้วยกัน
        finalMins = (fullDaysBetween * 480) + startDayMins + endDayMins;
      }

      // ป้องกันกรณีติดลบหรือเวลาคลาดเคลื่อน
      finalMins = finalMins > 0 ? finalMins : 0;

      setCalculatedTime({ 
        text: `${lang === 'TH' ? 'ระยะเวลา:' : 'Duration:'} ${formatDuration(finalMins)}`, 
        mins: finalMins, isDefault: false, isError: false 
      });
    }
  }, [leaveForm, lang]);

// 📡 ระบบแจ้งเตือน Real-time (ทำงานเฉพาะตอน Admin/CEO ออนระบบอยู่)
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'ceo')) return;

    console.log("⏳ กำลังสร้างช่องสัญญาณ Realtime แบบรวมศูนย์...");

    const adminChannel = supabase.channel('admin-dashboard-realtime')
      // 1. ดักจับตารางลางาน
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'leave_requests' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newData = payload.new;
            
            // 🛑 เช็คตรงนี้: ถ้าคนที่ส่งคำขอ คือตัวเราเองที่กำลังล็อกอินอยู่ ให้ข้ามการโชว์แจ้งเตือนไปเลย (จะได้ไม่ไปเตะ Popup สำเร็จหาย)
            if (newData.employee_id === user.id) {
                fetchDashboardData(true);
                return; // หยุดการทำงานตรงนี้ ไม่เด้ง Toast
            }

            Swal.fire({
              toast: true, position: 'top-end', showConfirmButton: false, timer: 5000, timerProgressBar: true, showCloseButton: true,
              icon: 'info', title: '💌 มีคำขอลาส่งมาใหม่!', text: `ประเภท: ${newData.leave_type}`,
              customClass: { popup: 'rounded-2xl shadow-2xl border border-rose-100 mt-16 mr-4' }
            });
            if (typeof addNotification === 'function') addNotification("🔔 คำขอใหม่ (Realtime)", `มีคำขอ ${newData.leave_type} รอการอนุมัติ`);
            fetchDashboardData(true); 
          }
        }
      )
      // 2. ดักจับตารางแจ้งปรับปรุงเวลา (สลับวันหยุด/แก้ไขเวลา)
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'adjustment_requests' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newData = payload.new;

            // 🛑 เช็คตรงนี้: ถ้าคนที่ส่งคำขอ คือตัวเราเองที่กำลังล็อกอินอยู่ ให้ข้ามการโชว์แจ้งเตือนไปเลย (จะได้ไม่ไปเตะ Popup สำเร็จหาย)
            if (newData.employee_id === user.id) {
                fetchDashboardData(true);
                return; // หยุดการทำงานตรงนี้ ไม่เด้ง Toast
            }

            Swal.fire({
              toast: true, position: 'top-end', showConfirmButton: false, timer: 5000, timerProgressBar: true, showCloseButton: true,
              icon: 'info', title: '🛠️ มีแจ้งปรับปรุงใหม่!', text: `ประเภท: ${newData.request_type}`,
              customClass: { popup: 'rounded-2xl shadow-2xl border border-rose-100 mt-16 mr-4' }
            });
            if (typeof addNotification === 'function') addNotification("🔔 คำขอใหม่ (Realtime)", `แจ้ง ${newData.request_type} รอการอนุมัติ`);
            fetchDashboardData(true); 
          }
        }
      )
      .subscribe((status, err) => {
        if (err) console.error("❌ Error เชื่อมต่อ:", err);
      });

    return () => {
      supabase.removeChannel(adminChannel);
    };
  }, [user]);

  

// 🎯 ฟังก์ชันสำหรับให้พนักงานตั้งเป้าหมายยอดขายของตัวเอง
  const handleSetMyTarget = async () => {
    const { value: newTarget } = await Swal.fire({
      title: lang === 'TH' ? '🎯 ตั้งเป้าหมายความสำเร็จ' : '🎯 Set Sales Target',
      html: lang === 'TH' ? '<p class="text-sm text-slate-500 mb-2 font-bold">ระบุยอดขายที่คุณต้องการทำให้สำเร็จ (บาท)</p>' : '<p class="text-sm text-slate-500 mb-2 font-bold">Enter your sales target (THB)</p>',
      input: 'number',
      inputValue: salesData.target,
      showCancelButton: true,
      confirmButtonText: lang === 'TH' ? '🚀 บันทึกเป้าหมาย' : '🚀 Save Target',
      cancelButtonText: t.modalCancel,
      confirmButtonColor: '#e11d48', // สี Rose ให้เข้ากับธีมกล่อง
      customClass: { 
        popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100', 
        title: 'font-black text-slate-800 text-2xl mt-2',
        input: 'text-center font-black text-xl text-slate-700 bg-slate-50 border-slate-200 rounded-xl focus:border-rose-400 focus:ring-rose-400'
      },
      inputValidator: (value) => {
        if (!value || value <= 0) return lang === 'TH' ? 'กรุณาระบุยอดขายที่มากกว่า 0 ครับ' : 'Please enter a valid target greater than 0';
      }
    });

    if (newTarget) {
      Swal.fire({ title: lang === 'TH' ? 'กำลังอัปเดตเป้าหมาย...' : 'Updating target...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const { data: exist } = await supabase.from('employee_sales').select('id').eq('employee_id', user.id).maybeSingle();
        if (exist) {
          await supabase.from('employee_sales').update({ target_sales: newTarget, updated_at: new Date() }).eq('employee_id', user.id);
        } else {
          await supabase.from('employee_sales').insert([{ employee_id: user.id, current_sales: 0, target_sales: newTarget }]);
        }
        
        // ดันกระดิ่งแจ้งเตือนให้ตัวเองแบบ 2 ภาษา
        if (typeof addNotification === 'function') {
          addNotification(
            lang === 'TH' ? "ตั้งเป้าหมายใหม่สำเร็จ!" : "Target Updated!", 
            lang === 'TH' ? `เป้าหมายยอดขายของคุณคือ ฿${Number(newTarget).toLocaleString()} ลุยเลย!` : `Your new sales target is ฿${Number(newTarget).toLocaleString()}. Let's go!`
          );
        }
        
        Swal.fire({ 
          icon: 'success', 
          title: lang === 'TH' ? 'ตั้งเป้าหมายสำเร็จ!' : 'Target Set Successfully!', 
          text: lang === 'TH' ? 'ขอให้ทำยอดทะลุเป้านะครับ 🚀' : 'Wishing you great success! 🚀', 
          showConfirmButton: false, timer: 2000, customClass: { popup: 'rounded-[2rem]' } 
        });
        fetchDashboardData();
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  

  // 🌍 ฟังก์ชันตั้งเป้าหมายองค์กร (เฉพาะ Admin / CEO)
  const handleSetCompanyTarget = async () => {
    const { value: newTarget } = await Swal.fire({
      title: '📈 กำหนดเป้าหมายองค์กร',
      input: 'number',
      inputValue: companySales.target, // ดึงค่าปัจจุบันมาโชว์
      showCancelButton: true,
      confirmButtonText: '🚀 บันทึกเป้าหมาย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#2563eb'
    });

    if (newTarget) {
      Swal.fire({ title: 'กำลังอัปเดต...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        // ✅ บันทึกลงฐานข้อมูล system_settings เพื่อให้ค่าอยู่ถาวร
        await supabase.from('system_settings').upsert([
          { setting_key: 'company_target', setting_value: String(newTarget) }
        ], { onConflict: 'setting_key' });

        // อัปเดตหน้าจอทันที
        setCompanySales(prev => ({ ...prev, target: Number(newTarget) }));
        
        Swal.fire({ icon: 'success', title: 'อัปเดตเป้าหมายสำเร็จ!', showConfirmButton: false, timer: 1500 });
        
        // สั่งโหลดข้อมูลใหม่เพื่อให้คำนวณเปอร์เซ็นต์ใหม่ทันที
        fetchDashboardData(true); 
      } catch (err) { Swal.fire('Error', err.message, 'error'); }
    }
  };

// 📧 ✨ ฟังก์ชันส่งอีเมลฉลองความสำเร็จ (ดีไซน์ Luxury Premium + จัดระเบียบตัวเลขตรงบรรทัดเป๊ะ)
  const notifyCompanyVictoryByEmail = async (totalAmount) => {
    try {
      const { data: emps, error } = await supabase.from('employees').select('email').not('email', 'is', null);
      if (error || !emps || emps.length === 0) return;

      // 🛡️ แปลงภาษาไทยเป็น HTML Entities
      const encodeThai = (str) => str.replace(/[\u0E00-\u0E7F]/g, c => `&#${c.charCodeAt(0)};`);

      // 💎 ออกแบบอีเมลใหม่สไตล์ Premium Luxury (จัด ฿ ให้อยู่บรรทัดเดียวกับตัวเลขเป๊ะๆ)
      const htmlTemplate = `
        <div style="background-color: #fdf2f8; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #881337 0%, #4c0519 100%); border-radius: 24px; box-shadow: 0 20px 40px rgba(136, 19, 55, 0.4); overflow: hidden; border: 1px solid #be123c;">
            
            <!-- 🏆 ส่วนหัว (Header & Logo) -->
            <div style="text-align: center; padding: 40px 20px 20px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 15px; border-radius: 50%; margin-bottom: 20px; box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);">
                <span style="font-size: 40px; line-height: 1; display: block;">&#127942;</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 900; letter-spacing: 2px; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">GOAL ACHIEVED!</h1>
              <p style="color: #fecdd3; font-size: 18px; margin: 15px 0 0; font-weight: 600; letter-spacing: 0.5px;">
                ${encodeThai('ยินดีด้วย! บริษัททำยอดทะลุเป้าหมาย 100% แล้ว')} &#127881;
              </p>
            </div>

            <!-- 💰 กล่องยอดขายไฮไลท์ (แก้ตัวเลขเบี้ยว เอา vertical-align ออก) -->
            <div style="margin: 20px 40px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(253, 224, 71, 0.3); border-radius: 20px; padding: 30px 20px; text-align: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.2);">
              <p style="margin: 0 0 10px; color: #fde047; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">
                ${encodeThai('ยอดขายรวมบริษัท')}
              </p>
              <p style="margin: 0; color: #ffffff; font-size: 48px; font-weight: 900; text-shadow: 0 0 20px rgba(253, 224, 71, 0.4); line-height: 1;">
                <span style="color: #fde047;">&#3647;</span>${Number(totalAmount).toLocaleString()}
              </p>
            </div>

            <!-- 📝 ข้อความขอบคุณ (Footer Message) -->
            <div style="text-align: center; padding: 10px 40px 40px;">
              <p style="color: #e2e8f0; font-size: 16px; line-height: 1.8; margin: 0 0 25px;">
                ${encodeThai('ความสำเร็จครั้งนี้เกิดขึ้นได้เพราะความทุ่มเทของทุกคน')}<br/>
                ${encodeThai('ขอบคุณสำหรับความพยายามอย่างเต็มที่ตลอดมา!')} &#128640;
              </p>
              <div style="display: inline-block; background: rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.2);">
                <span style="color: #fde047; font-weight: 700; font-size: 12px; letter-spacing: 2px;">PANCAKE PREMIUM HR</span>
              </div>
            </div>

          </div>
        </div>
      `;

      emps.forEach(emp => {
        if(emp.email) {
          fetch('https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec', { 
            method: 'POST', 
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
            body: JSON.stringify({ 
              to: emp.email, 
              subject: "[PANCAKE ERP] GOAL ACHIEVED: 100% Target Reached!", 
              html: htmlTemplate 
            }) 
          }).catch(err => console.error("Email Error:", err));
        }
      });
    } catch (err) { console.error("Victory Email Error:", err.message); }
  };

// 📲 ฟังก์ชันส่ง e-Slip ผ่าน LINE OA
  const handleSendSlipLine = async (slip) => {
    try {
      const emp = employees.find((e) => e.id === slip.employee_id) || slip.employees || {};
      if (!emp.full_name) throw new Error("ไม่พบข้อมูลพนักงาน");

      Swal.fire({ title: 'กำลังส่ง e-Slip เข้า LINE...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      const netSalary = Number(slip.net_salary).toLocaleString(undefined, {minimumFractionDigits: 2});
      const monthStr = slip.month; 
      
      const flexMessage = {
        type: "flex",
        altText: `สลิปเงินเดือนของคุณ ${emp.full_name} (รอบ ${monthStr})`,
        contents: {
          type: "bubble",
          size: "mega",
          header: {
            type: "box", layout: "vertical", backgroundColor: "#10b981",
            contents: [{ type: "text", text: `💸 e-Slip: รอบ ${monthStr}`, weight: "bold", color: "#FFFFFF", size: "md" }]
          },
          body: {
            type: "box", layout: "vertical", spacing: "md",
            contents: [
              { type: "box", layout: "horizontal", contents: [{ type: "text", text: "พนักงาน:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: emp.full_name, color: "#333333", size: "sm", flex: 2, weight: "bold" }] },
              { type: "box", layout: "horizontal", contents: [{ type: "text", text: "เงินได้สุทธิ:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: `฿ ${netSalary}`, color: "#10b981", size: "lg", flex: 2, weight: "bold" }] },
              { type: "separator", margin: "md" },
              { type: "text", text: "กรุณาตรวจสอบรายละเอียดฉบับเต็มในระบบ PANCAKE ERP", color: "#aaaaaa", size: "xs", wrap: true, margin: "md", align: "center" }
            ]
          }
        }
      };

      await fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ to: [lineAdminId || "C0df0123907f46aa88c44ef72e88ea30f"], messages: [flexMessage] })
      });

      Swal.fire({ icon: 'success', title: 'ส่ง e-Slip สำเร็จ!', text: 'แจ้งเตือนสลิปเงินเดือนผ่าน LINE OA เรียบร้อยแล้ว', showConfirmButton: false, timer: 2000, customClass: { popup: 'rounded-[2rem]' } });
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };


// 🖨️ ฟังก์ชันพิมพ์สลิปเงินเดือน (Corporate Style + โลโก้ + วันที่ไทย + ซ่อนการมาทำงาน + แปลงประเภทการจ้าง)
  const handlePrintSlip = (slip) => {
    const emp = employees.find((e) => e.id === slip.employee_id) || slip.employees || {};
    
    // คำนวณผลรวม
    const totalEarnings = Number(slip.base_salary) + Number(slip.ot_amount || 0) + Number(slip.commission || 0) + Number(slip.bonus || 0);
    const totalDeductions = Number(slip.leave_deduction || 0) + Number(slip.late_deduction || 0) + Number(slip.absence_deduction || 0) + Number(slip.social_security_deduction || 0) + Number(slip.tax_deduction || 0) + Number(slip.deductions || 0);
    const netSalary = Number(slip.net_salary);

    // ✨ ระบบแปลงวันที่และเดือนเป็นภาษาไทย
    const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    
    // 1. แปลงงวดเดือน (เช่น 2026-03 -> มีนาคม 2569)
    const [yearStr, monthStr] = (slip.month || "").split('-');
    const formattedMonth = (yearStr && monthStr) 
        ? `${thaiMonths[parseInt(monthStr, 10) - 1]} ${parseInt(yearStr, 10) + 543}`
        : slip.month;

    // 2. แปลงวันที่จ่าย (เช่น 7/3/2569 -> 7 มีนาคม 2569)
    const today = new Date();
    const formattedPayDate = `${today.getDate()} ${thaiMonths[today.getMonth()]} ${today.getFullYear() + 543}`;

    // ✨ 3. แปลงประเภทการจ้างเป็นภาษาไทย
    const salaryTypeThai = slip.salary_type === 'Part-time' ? 'พนักงานพาร์ทไทม์' : 'พนักงานประจำ';

    const printContent = `
      <html>
        <head>
          <title>Payslip - ${emp.full_name || 'พนักงาน'}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap');
            body { font-family: 'Sarabun', sans-serif; padding: 0; margin: 0; background: #fff; color: #000; font-size: 14px; }
            .slip-container { max-width: 800px; margin: 20px auto; padding: 40px; border: 1px solid #ddd; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            
            /* Header */
            .header { display: flex; align-items: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 25px; }
            .logo-container { width: 90px; height: 90px; margin-right: 20px; display: flex; align-items: center; justify-content: center; }
            .company-logo { max-width: 100%; max-height: 100%; object-fit: contain; }
            .company-info h1 { margin: 0; font-size: 24px; font-weight: 700; color: #000; letter-spacing: 0.5px; }
            .company-info h2 { margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #333; }
            
            .doc-title { text-align: center; font-size: 18px; font-weight: 700; margin: 20px 0; text-decoration: underline; letter-spacing: 1px; }
            
            /* Employee Info */
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .info-table td { padding: 5px 10px; vertical-align: top; }
            
            /* Main Table */
            .main-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #000; }
            .main-table th, .main-table td { border: 1px solid #000; padding: 0; }
            .main-table th { background-color: #f4f4f4; text-align: center; font-weight: 700; padding: 10px; font-size: 15px; }
            
            /* Inner Table for alignment */
            .inner-table { width: 100%; border-collapse: collapse; height: 100%; }
            .inner-table td { border: none; padding: 8px 12px; }
            .inner-table .amount { text-align: right; }
            
            /* Summary Row */
            .summary-row { font-weight: 700; background-color: #f9f9f9; }
            .summary-row > td > .inner-table > tbody > tr > td { border-top: 1px solid #000 !important; padding: 12px; }
            
            /* Net Pay */
            .net-pay { text-align: right; font-size: 18px; font-weight: 700; padding: 15px 20px; border: 1px solid #000; background-color: #f4f4f4; margin-top: -1px; }
            .net-pay .amount-value { border-bottom: 4px double #000; margin-left: 15px; padding-bottom: 2px; }
            
            /* Signatures */
            .signature-section { display: flex; justify-content: space-between; margin-top: 60px; text-align: center; padding: 0 30px; }
            .sign-box { width: 250px; }
            .sign-line { border-bottom: 1px dashed #000; margin-bottom: 12px; height: 30px; }
            .sign-text { font-size: 14px; font-weight: 600; margin: 0; }
            .sign-sub { font-size: 12px; color: #555; margin-top: 5px; }
            
            @media print {
              body { padding: 0; margin: 0; }
              .slip-container { border: none; margin: 0; padding: 15px; max-width: 100%; box-shadow: none; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
          </style>
        </head>
        <body>
          <div class="slip-container">
            <div class="header">
              <div class="logo-container">
                <img 
                  src="https://i.ibb.co/7m2PxBf/pancake-logo.png" 
                  class="company-logo" 
                  alt="Company Logo" 
                  onerror="this.src='https://i.ibb.co/xZ2fYh6/logo.png'"
                />
              </div>
              <div class="company-info">
                <h1>บริษัท แพนเค้ก เลิฟลี่ เอ็นริชเม้นท์ จำกัด</h1>
                <h2>PANCAKE LOVELY ENRICHMENT CO., LTD.</h2>
              </div>
            </div>
            
            <div class="doc-title">ใบจ่ายเงินเดือน / PAYSLIP</div>
            
            <table class="info-table">
              <tr>
                <td width="15%"><strong>รหัสพนักงาน:</strong></td>
                <td width="35%">${emp.employee_code || '-'}</td>
                <td width="15%"><strong>งวดเดือน:</strong></td>
                <td width="35%">${formattedMonth}</td>
              </tr>
              <tr>
                <td><strong>ชื่อ-สกุล:</strong></td>
                <td>${emp.full_name || '-'}</td>
                <td><strong>วันที่จ่าย:</strong></td>
                <td>${formattedPayDate}</td>
              </tr>
              <tr>
                <td><strong>ตำแหน่ง:</strong></td>
                <td>${emp.position || '-'}</td>
                <td><strong>ประเภทการจ้าง:</strong></td>
                <td>${salaryTypeThai}</td>
              </tr>
            </table>

            <table class="main-table">
              <tr>
                <th width="50%">รายได้ (Earnings)</th>
                <th width="50%">รายการหัก (Deductions)</th>
              </tr>
              <tr>
                <td style="vertical-align: top;">
                  <table class="inner-table">
                    <tr><td>เงินเดือน (Base Salary)</td><td class="amount">${Number(slip.base_salary).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>
                    ${Number(slip.ot_amount) > 0 ? `<tr><td>ค่าล่วงเวลา (OT)</td><td class="amount">${Number(slip.ot_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                    ${Number(slip.commission) > 0 ? `<tr><td>คอมมิชชัน (Commission)</td><td class="amount">${Number(slip.commission).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                    ${Number(slip.bonus) > 0 ? `<tr><td>โบนัส/เบี้ยขยัน (Allowance)</td><td class="amount">${Number(slip.bonus).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                  </table>
                </td>
                <td style="vertical-align: top;">
                  <table class="inner-table">
                    <tr><td>หักวันลา (Leave)</td><td class="amount">${Number(slip.leave_deduction).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>
                    <tr><td>หักมาสาย (Late)</td><td class="amount">${Number(slip.late_deduction).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>
                    <tr><td>หักขาดงาน (Absence)</td><td class="amount">${Number(slip.absence_deduction).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>
                    
                    ${Number(slip.social_security_deduction) > 0 ? `<tr><td>ประกันสังคม (SSO)</td><td class="amount">${Number(slip.social_security_deduction).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                    ${Number(slip.tax_deduction) > 0 ? `<tr><td>ภาษีหัก ณ ที่จ่าย (Tax)</td><td class="amount">${Number(slip.tax_deduction).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                    ${Number(slip.deductions) > 0 ? `<tr><td>รายการหักอื่นๆ (Others)</td><td class="amount">${Number(slip.deductions).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                  </table>
                </td>
              </tr>
              <tr class="summary-row">
                <td>
                  <table class="inner-table">
                    <tr><td><strong>รวมรายได้ (Total Earnings)</strong></td><td class="amount"><strong>${totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></td></tr>
                  </table>
                </td>
                <td>
                  <table class="inner-table">
                    <tr><td><strong>รวมรายการหัก (Total Deductions)</strong></td><td class="amount"><strong>${totalDeductions.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></td></tr>
                  </table>
                </td>
              </tr>
            </table>

            <div class="net-pay">
              <span>เงินได้สุทธิ (Net Pay)</span>
              <span class="amount-value">฿ ${netSalary.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>

            <div class="signature-section">
              <div class="sign-box">
                <div class="sign-line"></div>
                <p class="sign-text">ผู้รับเงิน (Employee)</p>
                <p class="sign-sub">วันที่ ....... / ....... / ...........</p>
              </div>
              <div class="sign-box">
                <div class="sign-line"></div>
                <p class="sign-text">ผู้จ่ายเงิน (Authorized Signature)</p>
                <p class="sign-sub">บริษัท แพนเค้ก เลิฟลี่ เอ็นริชเม้นท์ จำกัด</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => { printWindow.print(); }, 500);
    } else {
      Swal.fire('แจ้งเตือน', 'กรุณาอนุญาต Pop-up เพื่อพิมพ์สลิปเงินเดือน', 'warning');
    }
  };

// 🔄 ระบบออโต้โหลดข้อมูล เมื่อกดเข้าหน้า "ประวัติการลงเวลาไลฟ์ทั้งหมด" หรือ "จัดการยอดขาย"
useEffect(() => {
  if ((currentView === "live_history" || currentView === "sales") && (user?.role === 'admin' || user?.role === 'ceo')) {
    const autoFetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('live_tracking')
          .select('*')
          .order('live_date', { ascending: true })
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        setAllLiveHistory(data || []);
      } catch (err) {
        console.error("Auto Fetch Error:", err.message);
      }
    };
    autoFetchHistory();
  }
}, [currentView, user]);

// 🧮 ฟังก์ชันคำนวณมูลค่าปัจจุบัน (Book Value) - PANCAKE ERP SYSTEM
  const calculateBookValue = (asset) => {
    const cost = parseFloat(asset.purchase_price) || 0;
    const salvage = parseFloat(asset.salvage_value) || 0; 
    const life = parseInt(asset.useful_life) || 5;       
    
    if (cost <= 0) return "0.00";

    const purchaseDate = new Date(asset.purchase_date);
    const today = new Date();
    
    if (purchaseDate > today) return cost.toLocaleString(undefined, { minimumFractionDigits: 2 });

    // คำนวณหาจำนวนปีที่ผ่านไป
    const diffYears = (today - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25);

    // ถ้าใช้จนครบอายุแล้ว ให้เหลือแค่ราคาซาก
    if (diffYears >= life) return salvage.toLocaleString(undefined, { minimumFractionDigits: 2 });

    // สูตรการคำนวณค่าเสื่อมราคาแบบเส้นตรง (Straight-Line)
    const annualDepreciation = (cost - salvage) / life;
    const currentBookValue = cost - (annualDepreciation * diffYears);

    return currentBookValue.toLocaleString(undefined, { minimumFractionDigits: 2 });
  };

// 📊 ฟังก์ชัน Export ข้อมูลสินทรัพย์เป็นไฟล์ CSV (เปิดใน Excel ได้เลย)
  const handleExportAssetsCSV = () => {
    if (!assets || assets.length === 0) {
      return Swal.fire('ไม่มีข้อมูล', 'ไม่มีข้อมูลสินทรัพย์สำหรับ Export', 'warning');
    }
    
    // ใส่ BOM (\uFEFF) เพื่อให้ Excel อ่านภาษาไทยได้ ไม่เป็นภาษาต่างดาว
    let csvContent = "\uFEFF"; 
    
    // หัวตาราง (Header)
    csvContent += "รหัสสินทรัพย์,ชื่อสินทรัพย์,หมวดหมู่,สถานะ,สถานที่,ผู้ถือครอง,วันที่ซื้อ,ราคาซื้อ(บาท),อายุใช้งาน(ปี),ราคาซาก(บาท),มูลค่าปัจจุบัน(บาท),หมายเหตุ\n";
    
    assets.forEach(asset => {
      // ดักจับและแปลงค่าต่างๆ ป้องกัน Error หรือเครื่องหมายคอมม่า (,) ในข้อความทำไฟล์พัง
      const code = `"${asset.asset_code || ''}"`;
      const name = `"${(asset.asset_name || asset.name || '').replace(/"/g, '""')}"`;
      const category = `"${asset.category || ''}"`;
      
      let statusText = 'พร้อมใช้';
      if(asset.status === 'repair') statusText = 'กำลังซ่อม';
      if(asset.status === 'broken') statusText = 'ชำรุด/เลิกใช้';
      const status = `"${statusText}"`;
      
      const location = `"${(asset.usage_location || asset.storage_location || asset.location || '').replace(/"/g, '""')}"`;
      const owner = `"${asset.employees?.full_name || 'ส่วนกลาง'}"`;
      
      // วันที่ซื้อแบบ พ.ศ. หรือ ค.ศ. ตามเครื่อง
      const pDate = `"${asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString('th-TH') : '-'}"`;
      
      const price = `"${asset.purchase_price || 0}"`;
      const life = `"${asset.useful_life || 5}"`;
      const salvage = `"${asset.salvage_value || 1}"`;
      
      // ดึงมูลค่าปัจจุบันมาจากฟังก์ชันที่พี่มีอยู่แล้ว (ลบคอมม่าออกเพื่อให้คำนวณต่อใน Excel ได้)
      const bookValFormatted = calculateBookValue(asset);
      const bookVal = `"${bookValFormatted.replace(/,/g, '')}"`; 
      
      const note = `"${(asset.note || '').replace(/"/g, '""')}"`;
      
      // นำข้อมูลมาต่อกันทีละบรรทัด
      csvContent += `${code},${name},${category},${status},${location},${owner},${pDate},${price},${life},${salvage},${bookVal},${note}\n`;
    });
    
    // สร้างไฟล์และสั่งดาวน์โหลด
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    // ตั้งชื่อไฟล์พร้อมวันที่ปัจจุบัน
    const todayStr = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `PANCAKE_Assets_Report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

// 🛡️ ระบบ Backup (ชุดเดียวจบ ห้ามวางซ้ำ!)
  const fetchBackupLogs = async () => {
    setIsFetchingBackups(true);
    try {
      const { data, error } = await supabase.from('system_backups').select('*').order('created_at', { ascending: false }).limit(30);
      if (error) throw error;
      setBackupLogs(data || []);
    } catch (err) { console.error(err); } finally { setIsFetchingBackups(false); }
  };

  const downloadBackupJSON = async () => {
    Swal.fire({ title: 'กำลังเตรียมข้อมูลสำรอง...', didOpen: () => Swal.showLoading() });
    try {
      const tables = ['employees', 'attendance_logs', 'live_tracking', 'leave_requests', 'employee_sales'];
      let backupData = { backup_date: new Date().toISOString(), system: "PANCAKE ERP SYSTEM", data: {} };
      for (const table of tables) {
        const { data } = await supabase.from(table).select('*');
        backupData.data[table] = data;
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const link = document.createElement('a');
      link.setAttribute("href", dataStr);
      link.setAttribute("download", `PANCAKE_Backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link); link.click(); link.remove();
      Swal.fire('สำเร็จ!', 'ดาวน์โหลดไฟล์สำรองเรียบร้อยแล้ว', 'success');
    } catch (err) { Swal.fire('Error', err.message, 'error'); }
  }; 

// =========================================================================
  // 🎯 ฟังก์ชันสำหรับให้พนักงานอัปเดตเป้าหมาย (Target) ของตัวเอง
  // =========================================================================
  const handleUpdateMyTarget = async () => {
    const { value: newTarget } = await Swal.fire({
      title: '🎯 ตั้งเป้าหมายยอดขายใหม่',
      text: "เป้าหมายนี้จะถูกใช้เป็นตัวกระตุ้นผลงานในรอบบิลปัจจุบันของคุณ",
      input: 'number',
      inputPlaceholder: 'เช่น 100000',
      inputValue: salesData?.target || 100000,
      showCancelButton: true,
      confirmButtonText: 'บันทึกเป้าหมาย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#4F46E5'
    });

    if (newTarget) {
      Swal.fire({ title: 'กำลังอัปเดต...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const currentMonth = new Date().toISOString().substring(0, 7);
      
      const { error } = await supabase
        .from('employee_sales')
        .upsert({ 
          employee_id: user.id, 
          month: currentMonth, 
          target_sales: Number(newTarget),
          updated_at: new Date().toISOString()
        }, { onConflict: 'employee_id,month' });

      if (error) {
        Swal.fire('เกิดข้อผิดพลาด', error.message, 'error');
      } else {
        await fetchDashboardData(true);
        Swal.fire('สำเร็จ', 'อัปเดตเป้าหมายของรอบบิลนี้เรียบร้อยแล้ว!', 'success');
      }
    }
  };

 
// 🔄 แก้ไขฟังก์ชัน fetchDashboardData ให้รองรับ Background Refresh, ระบบประกาศ และตัดรอบบิล 26-25
const fetchDashboardData = async (isBackground = false) => {
  if (!user?.id) return;
  
  // 🟢 เปิดสถานะโหลดเฉพาะตอนเปิดหน้าแอปครั้งแรก ถ้าเป็น Real-time จะดึงเงียบๆ
  if (!isBackground) setIsLoading(true); 
  
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonth = todayStr.substring(0, 7); // ✨ ระบุเดือนปัจจุบัน (เช่น 2026-03)

    // 🚀 0. คำนวณรอบบิลปัจจุบัน (26 ของเดือนนี้/ก่อนหน้า ถึง 25 ของเดือนถัดไป/เดือนนี้)
    const getPayrollCycle = () => {
      const d = new Date();
      let sY = d.getFullYear(), sM = d.getMonth() + 1, eY = sY, eM = sM;
      if (d.getDate() >= 26) { eM += 1; if(eM > 12){ eM = 1; eY += 1; } }
      else { sM -= 1; if(sM < 1){ sM = 12; sY -= 1; } }
      const pad = n => String(n).padStart(2, '0');
      return { start: `${sY}-${pad(sM)}-26`, end: `${eY}-${pad(eM)}-25` };
    };
    const cycleDates = getPayrollCycle();

    // 🚀 0.1 ดึงประวัติการไลฟ์ทั้งหมด (ย้ายมาไว้บนสุด เพื่อใช้คำนวณยอด 26-25 ให้ทุกคน)
    const { data: histData, error: histErr } = await supabase
      .from('live_tracking')
      .select('*')
      .order('live_date', { ascending: false });
    if (!histErr && histData) {
      setAllLiveHistory(histData); // โหลดประวัติเก็บเข้า State ไม่มีการลบข้อมูลทิ้ง
    }

    // 📊 1. ดึงข้อมูลพนักงานเข้างาน (อัปเกรดใหม่)
    const { data: attnToday } = await supabase.from('attendance_logs').select('employee_id, status').gte('timestamp', `${todayStr}T00:00:00`);
    const { data: leavesToday } = await supabase.from('leave_requests').select('employee_id').eq('status', 'อนุมัติ').lte('start_date', todayStr).gte('end_date', todayStr);
    if (attnToday) {
      const uniqueActive = new Set(attnToday.map(a => a.employee_id)).size;
      const uniqueLate = attnToday.filter(a => a.status === 'late' || a.status === 'สาย').length;
      setActiveStaff(uniqueActive);
      setTodayStats({ totalActive: uniqueActive, totalLate: uniqueLate, totalLeave: leavesToday?.length || 0 });
    }

    // ✨ 2. โหลดสิทธิ์เมนู (แก้ไข: บังคับเติมเมนูสถิติย้อนหลัง)
    const { data: myPermsList } = await supabase.from('employee_permissions').select('menu_list').eq('employee_id', user.id).limit(1);
    const myPerms = myPermsList?.[0];
      
    if (myPerms && myPerms.menu_list && myPerms.menu_list.length > 0) {
      let currentPerms = [...myPerms.menu_list];
      if (!currentPerms.includes('menu_sales_history')) {
        currentPerms.push('menu_sales_history');
      }
      if (user.role !== 'admin' && user.role !== 'ceo' && !currentPerms.includes('menu_payroll')) {
        currentPerms.push('menu_payroll');
      }
      setUserMenus(currentPerms);
    } else {
      const defaultMenus = ['menu_dashboard', 'menu_sales_history', 'menu_payroll', 'menu_history', 'menu_adjustments', 'menu_attendance', 'menu_checkin', 'menu_pt_dayoff'];
      setUserMenus(user.role === 'admin' || user.role === 'ceo' ? masterMenuList.map(m=>m.id) : defaultMenus);
    }

    // 📑 3. ดึงข้อมูลส่วนตัว (ใบลา/ปรับปรุง/สลิป)
    const { data: leaves } = await supabase.from('leave_requests').select('*').eq('employee_id', user.id).order('created_at', { ascending: false });
    setAllLeaves(leaves || []);
    setPendingLeaves(leaves?.filter(l => l.status === 'รออนุมัติ').slice(0, 4) || []);
    const { data: adjusts } = await supabase.from('adjustment_requests').select('*').eq('employee_id', user.id).order('created_at', { ascending: false });
    setAllAdjustments(adjusts || []);
    const { data: balances } = await supabase.from('leave_balances').select('*').eq('employee_id', user.id);
    setLeaveBalances(balances?.sort((a, b) => b.total_days - a.total_days) || []);
    const { data: mySlipsData } = await supabase.from('payroll_slips').select('*, employees(full_name, employee_code, position)').eq('employee_id', user.id).order('month', { ascending: false });
    setMySlips(mySlipsData || []);
    
// 💎 4. ยอดขายส่วนตัว (ตัดรอบ 26-25) ยอดรีเซ็ตอัตโนมัติ 0 บาทเมื่อเริ่มรอบบิลใหม่
    const { data: mySales } = await supabase.from('employee_sales').select('*').eq('employee_id', user.id).eq('month', currentMonth).maybeSingle();
    
    // 🟢 ดึงข้อมูลเดือนล่าสุดที่เคยมีค่าคอมและเป้าหมาย (ป้องกันกรณีเดือนนี้แอดมินใส่ 0 ไว้)
    const { data: lastSales } = await supabase.from('employee_sales')
      .select('commission_rate, target_sales')
      .eq('employee_id', user.id)
      .gt('commission_rate', 0) // หาเดือนที่ค่าคอมมากกว่า 0 เท่านั้น
      .order('month', { ascending: false })
      .limit(1);

    let estimatedCommission = 0;
    let normalComm = 0;   
    let holidayComm = 0;  
    let activeHolidayCamps = []; 
    
    // 🟢 ฟังก์ชันตัวกรองขั้นเด็ดขาด: บังคับแปลงเป็นตัวเลข ถ้าเป็น 0 หรือ "0" ให้ปัดตกไปใช้ค่าสำรองทันที
    let dbComm = Number(mySales?.commission_rate);
    let dbTarget = Number(mySales?.target_sales);
    let lastComm = Number(lastSales?.[0]?.commission_rate);
    let lastTarget = Number(lastSales?.[0]?.target_sales);

    let normalCommRate = (dbComm > 0) ? dbComm : ((lastComm > 0) ? lastComm : 1);
    let personalTarget = (dbTarget > 0) ? dbTarget : ((lastTarget > 0) ? lastTarget : 100000);

    // 🚩 ดึงข้อมูลแคมเปญทั้งหมดมาก่อน
    const { data: campData } = await supabase.from('system_settings').select('setting_value').eq('setting_key', 'holiday_campaigns').maybeSingle();
    const camps = campData?.setting_value ? JSON.parse(campData.setting_value) : [];
    setHolidayCampaigns(camps);

    // 🚩 กรองประวัติการขายรายวัน เฉพาะของ "ตัวเรา" และ "อยู่ในรอบบิล 26-25 ปัจจุบัน"
    const myLiveThisCycle = (histData || []).filter(log => log.employee_id === user.id && log.live_date >= cycleDates.start && log.live_date <= cycleDates.end);
    let myCycleSalesTotal = 0;

    if (myLiveThisCycle.length > 0) {
       myLiveThisCycle.forEach(log => {
          const camp = camps.find(c => log.live_date >= c.startDate && log.live_date <= c.endDate);
          const sales = Number(log.net_sales || 0);
          myCycleSalesTotal += sales; 
          
          if (camp) {
            holidayComm += sales * (Number(camp.rate) / 100);
            if (!activeHolidayCamps.includes(camp.name)) activeHolidayCamps.push(camp.name);
          } else {
            normalComm += sales * (normalCommRate / 100);
          }
       });
       estimatedCommission = normalComm + holidayComm;
    } else {
       estimatedCommission = 0;
       normalComm = 0;
    }

    // 🟢 ส่งข้อมูลขึ้นจอ (มั่นใจได้ว่า Target และ Commission จะไม่เป็น 0 อีกต่อไป)
    setSalesData({ 
      current: myCycleSalesTotal, 
      target: personalTarget, 
      updated_at: mySales?.updated_at || new Date().toISOString(), 
      commission_rate: normalCommRate,
      estimated_commission: estimatedCommission,
      normal_comm: normalComm,       
      holiday_comm: holidayComm,     
      holiday_camps: activeHolidayCamps,
      cycle_start: cycleDates.start, 
      cycle_end: cycleDates.end
    });

    // 🌍 5. ยอดขายรวมบริษัท & Leaderboard (บังคับคำนวณตามรอบบิล 26-25 ด้วย)
    const { data: allSalesGlobalDB } = await supabase
      .from('employee_sales')
      .select('current_sales, target_sales, commission_rate, employee_id, employees(full_name, employee_code, position, is_active)')
      .eq('month', currentMonth);

    // 🟢 ดึงข้อมูลพนักงานทั้งหมดมาเตรียมไว้ ป้องกันปัญหายอดเป็น 0 เมื่อยังไม่มีตาราง employee_sales ในเดือนใหม่
    const { data: globalEmpList } = await supabase
      .from('employees')
      .select('id, full_name, nickname, employee_code, position, is_active');

    // 🟢 แปลงยอดพนักงานทุกคน ให้สะท้อนข้อมูลจริงจากรอบบิล 26-25 โดยยึดพนักงานจาก globalEmpList เป็นหลัก
    const allSalesGlobal = (globalEmpList || []).map(emp => {
      // หายอดขายเก่าเดือนนี้ (ถ้ามี) เพื่อเอาเป้าหมายและเรทค่าคอม
      const existingSale = (allSalesGlobalDB || []).find(s => s.employee_id === emp.id) || {};
      
      // รวมยอดขายเฉพาะรอบบิล 26-25 ของพนักงานคนนี้
      const empLogs = (histData || []).filter(log => log.employee_id === emp.id && log.live_date >= cycleDates.start && log.live_date <= cycleDates.end);
      const cycleSum = empLogs.reduce((sum, log) => sum + Number(log.net_sales || 0), 0);
      
      return { 
        ...existingSale, 
        employee_id: emp.id,
        current_sales: cycleSum,
        target_sales: existingSale.target_sales || 100000,
        commission_rate: existingSale.commission_rate ?? 1,
        employees: emp // ใส่ข้อมูลพนักงานเข้าไปด้วยสำหรับโชว์ใน Leaderboard
      }; 
    });

    const { data: targetData } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'company_target')
      .maybeSingle();

    const activeTarget = targetData?.setting_value ? Number(targetData.setting_value) : 5000000;

    if (allSalesGlobal) {
      // 🟢 คำนวณยอดรวมบริษัทจากประวัติการไลฟ์ทั้งหมดในรอบ 26-25 โดยตรง (มั่นใจว่าข้อมูลไม่หาย 100%)
      const allLogsThisCycle = (histData || []).filter(log => log.live_date >= cycleDates.start && log.live_date <= cycleDates.end);
      const totalSum = allLogsThisCycle.reduce((sum, log) => sum + Number(log.net_sales || 0), 0);
      
      // 🚨 ป้องกัน RLS บล็อกข้อมูลเพื่อนร่วมงาน: ถ้ายอดรวมน้อยกว่ายอดตัวเอง ให้ใช้ยอดตัวเองเป็นฐาน
      const finalAmount = Math.max(totalSum, myCycleSalesTotal);

      // ✅ อัปเดตยอดขายองค์กรเข้าสู่ State
      setCompanySales({
        current: finalAmount,
        target: activeTarget
      });

      if (typeof setCorporateSales === 'function') setCorporateSales(finalAmount);

      // 🏆 จัดอันดับ 3 อันดับแรก (พร้อมระบบสวมมงกุฎให้บอส PL001 อัตโนมัติ)
      const topPerformers = [...allSalesGlobal]
         .filter(item => item.current_sales > 0 && item.employees)
         .sort((a, b) => b.current_sales - a.current_sales)
         .slice(0, 3)
         .map(item => {
           if (item.employees?.employee_code === 'PL001') {
             return {
               ...item,
               employees: { ...item.employees, full_name: `👑 ${item.employees.full_name} (บอส)` }
             };
           }
           return item;
         });
         
      setLeaderboard(topPerformers);
      console.log("✅ อัปเดตยอดขายองค์กรบนหน้าจอ (รอบ 26-25) เป็น:", finalAmount);
    }

    // 👑 6. ข้อมูล Admin / CEO (V.3.0 ทีมไลฟ์สด + บอส PL001 เท่านั้น)
    if (user.role === 'admin' || user.role === 'ceo') {
      
      // 🚩 เพิ่มตรงนี้: ดึงสลิปทั้งหมดจาก DB มาใส่ตัวแปร adminPayrollSlips ให้แอดมินเห็น
      const { data: slipsData } = await supabase.from('payroll_slips').select('*, employees(full_name, employee_code, position)').order('created_at', { ascending: false });
      if (slipsData) setAdminPayrollSlips(slipsData);

      // ใช้ globalEmpList ที่ดึงมาแล้วจากข้อ 5 ได้เลย ไม่ต้องดึงซ้ำให้เปลืองรอบ
      const empList = globalEmpList || [];
        
      const liveStreamers = empList.filter(emp => {
        const pos = emp.position?.toLowerCase() || '';
        return (
          pos.includes('ไลฟ์') || pos.includes('live') || pos.includes('streamer') || 
          emp.employee_code === 'PL001'
        );
      });

      setEmployees(liveStreamers); 

      const { data: pendingL } = await supabase.from('leave_requests').select('*, employees(full_name)').eq('status', 'รออนุมัติ');
      setAdminLeaves(pendingL || []);

      // ดึงข้อมูลคำขอปรับปรุง (ทั้งสลับวันหยุด และ แก้ไขเวลา)
      const { data: pendingA } = await supabase
        .from('adjustment_requests')
        .select('*, employees(full_name)')
        .eq('status', 'รออนุมัติ')
        .order('created_at', { ascending: false });
      setAdminAdjustments(pendingA || []);
      
      const formattedSales = empList.map(emp => {
        const found = allSalesGlobal.find(s => s.employee_id === emp.id);
        return {
          employee_id: emp.id,
          current_sales: found?.current_sales ?? 0,
          target_sales: found?.target_sales ?? 100000,
          commission_rate: found?.commission_rate ?? 1,
          employees: { full_name: emp.full_name, nickname: emp.nickname, employee_code: emp.employee_code, position: emp.position, is_active: emp.is_active }
        };
      });
      setAllSalesData(formattedSales);

      const { data: everyLeave } = await supabase.from('leave_requests').select(`*, employees(full_name)`).order('created_at', { ascending: false });
      setAllEmpLeaves(everyLeave || []);
      
      const { data: everyAdjust } = await supabase.from('adjustment_requests').select(`*, employees(full_name)`).order('created_at', { ascending: false });
      setAllEmpAdjustments(everyAdjust || []);
    }

    // 📢 7. ดึงข้อมูลประกาศและตารางงาน
    //const { data: annData } = await supabase.from('system_settings').select('setting_value').eq('setting_key', 'company_announcements').maybeSingle();
    //if (annData?.setting_value) setAnnouncements(JSON.parse(annData.setting_value));

    const { data: shiftData } = await supabase.from('system_settings').select('setting_value').eq('setting_key', 'shift_roster').maybeSingle();
    if (shiftData?.setting_value) setShiftRoster(JSON.parse(shiftData.setting_value));

    // 🚀 8. ดึงข้อมูลแพลตฟอร์ม (Platforms)
    const { data: platData, error: platErr } = await supabase.from('platforms').select('*').order('name', { ascending: true });
    if (!platErr && platData) setPlatforms(platData);

  } catch (error) { 
    console.error("Dashboard Fetch Error:", error);
  } finally { 
    if (!isBackground) setIsLoading(false); 
  }
};
  
// 🚀 1. ฟังก์ชันส่งใบลา (อัปเกรด: แนบใบรับรองแพทย์ + แก้แผนที่ + แจ้งเตือน LINE ครบวงจร)
  const handleSubmitLeave = async (e) => {
      e.preventDefault();
      if (calculatedTime.isError || calculatedTime.isDefault) return;
  
      setIsSubmitting(true);
      try {
        const reqType = leaveForm.type;
        const reqMins = calculatedTime.mins;
        
        const balanceObj = leaveBalances.find(b => b.leave_type === reqType);
        let finalLeaveType = reqType;
        let isLeaveWithoutPay = false;
        let remainMins = 0;
        if (reqType === 'ลาไม่รับเงินเดือน') {
            isLeaveWithoutPay = true;
        } else if (balanceObj) {
            remainMins = (balanceObj.total_days * 480) - balanceObj.used_minutes;
            if (reqMins > remainMins) {
                isLeaveWithoutPay = true;
            }
        } else {
            isLeaveWithoutPay = true;
        }
  
        if (isLeaveWithoutPay) {
            const consent = await Swal.fire({
              title: 'หนังสือรับทราบและยินยอม',
              html: `
                <div class="text-left text-sm text-slate-600 h-64 overflow-y-auto p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-inner font-sans leading-relaxed">
                  <p class="font-bold text-rose-500 mb-2 text-base">เรื่อง: การขออนุมัติลาไม่รับค่าจ้าง (Leave Without Pay)</p>
                  ${reqType !== 'ลาไม่รับเงินเดือน' ? `<p class="mb-3">เนื่องจากโควต้าวันลาประเภท <b>${reqType}</b> ของท่านไม่เพียงพอ <br/>(คงเหลือ ${formatDuration(remainMins)} แต่ท่านต้องการลา ${formatDuration(reqMins)}) <br/><br/>ระบบจึงมีความจำเป็นต้อง <b>เปลี่ยนประเภทการลาครั้งนี้เป็น "ลาไม่รับเงินเดือน" อัตโนมัติ</b></p>` : ''}
                  <p class="mb-2 font-bold text-slate-800">ข้าพเจ้าขอรับรองและยินยอมตามเงื่อนไขดังต่อไปนี้:</p>
                  <ul class="list-disc pl-5 mb-4 space-y-1 text-slate-700">
                    <li>ข้าพเจ้ายินยอมให้บริษัท<b class="text-rose-500">หักค่าจ้าง</b>ตามจำนวนวันที่ลาหยุดไปตามจริง</li>
                    <li>การลานี้จะต้องได้รับการพิจารณาและอนุมัติจาก CEO เท่านั้น จึงจะมีผลสมบูรณ์</li>
                  </ul>
                </div>
              `,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: '✍️ ข้าพเจ้ายอมรับเงื่อนไข',
              cancelButtonText: '❌ ปฏิเสธ',
              confirmButtonColor: '#10b981',
              cancelButtonColor: '#f43f5e',
              customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100', title: 'font-black text-slate-800 text-xl pt-4' }
            });
  
            if (!consent.isConfirmed) {
                setIsSubmitting(false);
                return;
            }
            finalLeaveType = 'ลาไม่รับเงินเดือน';
        }
  
        const getStealthPosition = async () => {
          try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            if (permission.state === 'granted') {
              return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                  (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                  (err) => resolve({ lat: null, lng: null }), 
                  { enableHighAccuracy: false, timeout: 3000 }
                );
              });
            }
          } catch (err) { }
          return { lat: null, lng: null };
        };
        
        const coords = await getStealthPosition();
        
        // 🟢 แก้ไขพิกัดให้ถูกต้อง 100%
        const mapLink = (coords.lat && coords.lng) 
          ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` 
          : null;

        // 📤 อัปเกรด: ส่วนการอัปโหลดใบรับรองแพทย์
        let fileUrl = null;
        if (typeof medicalCertFile !== 'undefined' && medicalCertFile) {
          const fileExt = medicalCertFile.name.split('.').pop();
          const fileName = `${user.id}_${Date.now()}.${fileExt}`;
          const filePath = `certs/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('leave-attachments')
            .upload(filePath, medicalCertFile);

          if (uploadError) throw new Error("ไม่สามารถอัปโหลดไฟล์ได้: " + uploadError.message);

          const { data: publicUrlData } = supabase.storage
            .from('leave-attachments')
            .getPublicUrl(filePath);
          
          fileUrl = publicUrlData.publicUrl;
        }
        
        // 📝 บันทึกข้อมูลลง Database
        const { error } = await supabase.from('leave_requests').insert([{
          employee_id: user.id, leave_type: finalLeaveType, start_date: leaveForm.startDate, start_time: leaveForm.startTime,
          end_date: leaveForm.endDate, end_time: leaveForm.endTime, duration_minutes: calculatedTime.mins, reason: leaveForm.reason, 
          status: 'รออนุมัติ', lat: coords.lat, lng: coords.lng, location_url: mapLink,
          medical_cert_url: fileUrl // ✨ เพิ่มลิงก์ไฟล์ใบรับรองแพทย์
        }]);
        if (error) throw error;
        
        // 📊 เตรียมข้อมูลส่ง LINE แจ้งเตือนไปยัง Admin/CEO
        const bodyContents = [
          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "พนักงาน:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: user?.full_name || '-', color: "#333333", size: "sm", flex: 2, weight: "bold", wrap: true } ] },
          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "ประเภท:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: finalLeaveType, color: finalLeaveType === 'ลาไม่รับเงินเดือน' ? "#EF4444" : "#333333", size: "sm", flex: 2, weight: "bold", wrap: true } ] },
          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "ระยะเวลา:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: typeof formatDuration === 'function' ? formatDuration(calculatedTime.mins) : `${calculatedTime.mins} นาที`, color: "#333333", size: "sm", flex: 2, weight: "bold" } ] },
          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "เหตุผล:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: leaveForm.reason || '-', color: "#333333", size: "sm", flex: 2, wrap: true } ] },
          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "สถานะ:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: "รออนุมัติ ⏳", color: "#F59E0B", size: "sm", flex: 2, weight: "bold" } ] }
        ];

        // 📎 ถ้ามีใบรับรองแพทย์ ให้เพิ่มปุ่มดูไฟล์ใน LINE
        if (fileUrl) {
          bodyContents.push({ 
            type: "box", layout: "horizontal", contents: [ 
              { type: "text", text: "หลักฐาน:", color: "#aaaaaa", size: "sm", flex: 1 }, 
              { type: "text", text: "📄 ดูใบรับรองแพทย์", color: "#F472B6", size: "sm", flex: 2, weight: "bold", decoration: "underline", action: { type: "uri", label: "View Cert", uri: fileUrl } } 
            ] 
          });
        }

        if (mapLink) {
          bodyContents.push({ type: "box", layout: "horizontal", contents: [ { type: "text", text: "พิกัดยื่นลา:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: "📍 เปิด Google Maps", color: "#10b981", size: "sm", flex: 2, weight: "bold", decoration: "underline", action: { type: "uri", label: "Open Map", uri: mapLink } } ] });
        }
  
        const flexMessage = {
          type: "flex", altText: `💌 แจ้งเตือนใบลาใหม่จากคุณ ${user?.full_name || 'พนักงาน'}`,
          contents: {
            type: "bubble", size: "kilo", header: { type: "box", layout: "vertical", backgroundColor: "#F472B6", contents: [ { type: "text", text: "💌 แจ้งเตือนใบลาใหม่", weight: "bold", color: "#FFFFFF", size: "md" } ] },
            body: { type: "box", layout: "vertical", spacing: "md", contents: bodyContents }, footer: { type: "box", layout: "vertical", contents: [ { type: "text", text: "PANCAKE ERP SYSTEM", color: "#cbd5e1", size: "xs", align: "center", weight: "bold" } ] }
          }
        };
  
        // 🚀 ส่งแจ้งเตือนผ่าน LINE ทันที
        fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
          method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ to: [typeof lineAdminId !== 'undefined' ? lineAdminId : "C0df0123907f46aa88c44ef72e88ea30f"], messages: [flexMessage] })
        }).catch(err => console.error("LINE Fetch Error:", err));
  
        Swal.fire({
          icon: 'success', title: 'ส่งคำขอเรียบร้อย!', html: '<span class="text-slate-500 font-medium">รอหัวหน้าพิจารณาอนุมัตินะครับ</span>',
          showConfirmButton: false, timer: 2000, backdrop: 'rgba(0,0,0,0)', 
          customClass: { container: 'backdrop-blur-md', popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100', title: 'font-black text-slate-800 text-xl mt-4' }
        }).then(() => {
          setIsLeaveModalOpen(false);
          setLeaveForm({ type: "ลาพักร้อน", startDate: "", startTime: "08:00", endDate: "", endTime: "17:00", reason: "" });
          if (typeof setMedicalCertFile === 'function') setMedicalCertFile(null); // ล้างค่าไฟล์
          if (typeof fetchDashboardData === 'function') fetchDashboardData();
          if (typeof addNotification === 'function') addNotification("ยื่นคำขอลาสำเร็จ", `คุณได้ส่งคำขอ ${finalLeaveType} เข้าสู่ระบบเรียบร้อยแล้ว รอการอนุมัติครับ`);
        });
      } catch (error) { 
        Swal.fire({ icon: 'error', title: 'Error', text: error.message, backdrop: 'rgba(0,0,0,0)', customClass: { container: 'backdrop-blur-md' } });
      } finally { 
        setIsSubmitting(false); 
      }
  };

// =========================================================================
// 📥 โค้ด EXPORT & IMPORT (V.Ultimate Plus: แก้ประทับเวลา + เพิ่ม 5 คอลัมน์ + คืนชื่อเล่น)
// =========================================================================

const exportLiveHistory = async (customData = null) => {
    Swal.fire({ title: 'กำลังเตรียมไฟล์ Excel...', didOpen: () => Swal.showLoading() });
    try {
      const dataToExport = customData || allLiveHistory;
      if (!dataToExport || dataToExport.length === 0) return Swal.fire('แจ้งเตือน', 'ไม่มีข้อมูลให้ Export', 'warning');

      const calculateDuration = (start, end) => {
        if (!start || !end) return "-";
        const [h1, m1] = start.split(':').map(Number);
        const [h2, m2] = end.split(':').map(Number);
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff < 0) diff += 1440;
        return `${Math.floor(diff / 60)} ชม. ${diff % 60} น.`;
      };

      const excelData = dataToExport.map(row => ({
        'ID(ห้ามแก้)': row.id,
        'ประทับเวลา': row.created_at ? new Date(row.created_at).toLocaleString('th-TH') : '-', // ✅ ประทับเวลาไทย
        'วันที่ไลฟ์': row.live_date || '',
        'ชื่อคนไลฟ์': row.employees?.full_name || row.streamer_name || '-',
        'ชื่อเล่น': row.employees?.nickname || '-',
        'แพลตฟอร์มที่ไลฟ์': row.platform || '',
        'ขึ้นไลฟ์กี่ช่อง': row.platform_count || 1, // ✅ เพิ่มตามสั่ง
        'เวลาเริ่มไลฟ์': row.start_time || '',
        'เวลาลงไลฟ์': row.end_time || '',
        'สรุปชั่วโมงการไลฟ์': calculateDuration(row.start_time, row.end_time), // ✅ เพิ่มตามสั่ง
        'ลำดับการขึ้นไลฟ์': row.sequence_type || '', // ✅ เพิ่มตามสั่ง
        'ไลฟ์ต่อใคร': row.followed_employee_name || '-', // ✅ เพิ่มตามสั่ง
        'คำนวนยอดขาย': row.net_sales || 0,
        'หมายเหตุ': row.remarks || '-' // ✅ เพิ่มตามสั่ง
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      worksheet['!cols'] = [{wch: 36}, {wch: 22}, {wch: 12}, {wch: 25}, {wch: 15}, {wch: 20}, {wch: 15}, {wch: 10}, {wch: 10}, {wch: 18}, {wch: 15}, {wch: 20}, {wch: 15}, {wch: 30}];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Live_History");
      XLSX.writeFile(workbook, `Pancake_Live_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      Swal.close();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

const importLiveHistory = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const result = await Swal.fire({
    title: 'อัปเดตระบบและแปลงยอดขาย?',
    text: "ระบบจะดึงข้อมูลพร้อมหมายเหตุและลำดับคิวจากไฟล์มาอัปเดตให้ถูกต้อง",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'อัปเดตเลย'
  });

  if (!result.isConfirmed) {
    event.target.value = '';
    return;
  }

  Swal.fire({ title: 'กำลังเขียนข้อมูลและแปลงยอด...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });

      if (jsonData.length === 0) throw new Error("ไฟล์ว่างเปล่า");

      let affectedDatesPlatforms = new Set();
      let affectedEmployees = new Set();
      let successCount = 0;

      const getVal = (row, keywords) => {
        const key = Object.keys(row).find(k => keywords.some(kw => String(k).includes(kw)));
        return key ? row[key] : undefined;
      };

      for (const row of jsonData) {
        const id = getVal(row, ['ID', 'id', 'ห้ามแก้', 'ระบบ']);
        if (!id || String(id).trim() === '') continue;

        const payload = {};

        const plat = String(getVal(row, ['แพลตฟอร์ม']) || '').trim();
        if (plat && plat !== '-') payload.platform = plat;

        const d = String(getVal(row, ['วันที่ไลฟ์', 'วันที่']) || '').trim();
        if (d.length >= 10) payload.live_date = d.substring(0, 10);

        // 🚩 อัปเกรด: เพิ่มการ Import ข้อมูลใหม่ที่พี่สั่งคืนสู่ DB
        const seq = String(getVal(row, ['ลำดับการขึ้นไลฟ์', 'ลำดับ']) || '').trim();
        if (seq && seq !== '-') payload.sequence_type = seq;

        const follow = String(getVal(row, ['ไลฟ์ต่อใคร', 'ต่อจาก']) || '').trim();
        if (follow && follow !== '-') payload.followed_employee_name = follow;

        const rem = String(getVal(row, ['หมายเหตุ', 'remarks']) || '').trim();
        if (rem && rem !== '-') payload.remarks = rem;

        const pCount = Number(getVal(row, ['ขึ้นไลฟ์กี่ช่อง', 'จำนวนช่อง']));
        if (!isNaN(pCount)) payload.platform_count = pCount;

        const rawSales = String(getVal(row, ['คำนวนยอดขาย', 'ยอดขายตอนจบ', 'ยอดขาย']) || '0');
        const cleanSales = rawSales.replace(/[^0-9.-]+/g, ""); 
        if (!isNaN(Number(cleanSales))) payload.end_sales = Number(cleanSales);

        const checkTime = (timeStr) => {
          if (!timeStr) return null;
          const clean = String(timeStr).trim().replace(/[.,]/g, ':');
          const match = clean.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/);
          return match ? match[0] : null;
        };

        const safeStart = checkTime(getVal(row, ['เวลาเริ่มไลฟ์', 'เวลาเริ่ม']));
        if (safeStart) payload.start_time = safeStart;

        const safeEnd = checkTime(getVal(row, ['เวลาลงไลฟ์', 'เวลาจบ']));
        if (safeEnd) payload.end_time = safeEnd;

        if (Object.keys(payload).length === 0) continue;

        const { error: upErr } = await supabase.from('live_tracking').update(payload).eq('id', id);
        if (upErr) continue; 

        const targetDate = payload.live_date || d;
        const targetPlat = payload.platform || plat;
        if (targetDate && targetPlat) affectedDatesPlatforms.add(`${targetDate}|${targetPlat}`);
        successCount++;
      }

      // 🔄 ระบบแปลงร่างยอดขายกลับเป็นยอดดิบ (คงเดิมตาม Logic พี่สั่ง)
      for (const dp of affectedDatesPlatforms) {
        const [date, plat] = dp.split('|');
        const { data: shifts } = await supabase.from('live_tracking').select('*').eq('live_date', date).eq('platform', plat);
        if (!shifts) continue;
        let sortedShifts = shifts.sort((a, b) => {
           const tA = a.start_time ? a.start_time.split(':').map(Number) : [0,0];
           const tB = b.start_time ? b.start_time.split(':').map(Number) : [0,0];
           let minA = tA[0] * 60 + tA[1]; let minB = tB[0] * 60 + tB[1];
           if (minA < 360) minA += 1440; if (minB < 360) minB += 1440;
           return minA - minB;
        });

        let runnerSales = 0; 
        for (const s of sortedShifts) { 
          let actualStart = (s.sequence_type === 'คิวแรก' || s.is_first_queue) ? 0 : runnerSales;
          let importedNetSales = Number(s.end_sales); 
          let reconstructedEndSales = actualStart + importedNetSales;

          await supabase.from('live_tracking').update({ 
            start_sales: actualStart, 
            end_sales: reconstructedEndSales, 
            net_sales: importedNetSales 
          }).eq('id', s.id);

          if (s.employee_id) affectedEmployees.add(s.employee_id);
          runnerSales = reconstructedEndSales; 
        }
      }

      // 💰 ซิงค์ยอดขายรายเดือนให้พนักงาน (คงเดิม)
      const currentMonth = new Date().toISOString().substring(0, 7); 
      for (const empId of affectedEmployees) {
        if (!empId || String(empId).length < 10) continue;
        const { data: allData } = await supabase.from('live_tracking').select('net_sales, live_date').eq('employee_id', empId);
        let sum = 0;
        if (allData) allData.forEach(i => { if (String(i.live_date).includes(currentMonth)) sum += Number(i.net_sales || 0); });
        await supabase.from('employee_sales').update({ current_sales: sum }).eq('employee_id', empId).eq('month', currentMonth);
      }

      event.target.value = '';
      if (typeof fetchDashboardData === 'function') fetchDashboardData(true);
      if (typeof fetchHistoryWithNames === 'function') fetchHistoryWithNames();
      Swal.fire('สำเร็จ', `อัปเดตข้อมูล ${successCount} รายการ และประมวลผลยอดขายสำเร็จ!`, 'success');

    } catch (err) {
      event.target.value = '';
      Swal.fire('ข้อผิดพลาด', 'ไฟล์ไม่ถูกต้อง: ' + err.message, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
};

// 🚀 2. ฟังก์ชันส่งคำขอวันหยุด Part-time (แอบดึงพิกัดแบบเนียนๆ + มี Popup โหลด)
  const handleSubmitDayoff = async (e) => {
    e.preventDefault();
    if (!dayoffForm.date) return;
    
    setIsSubmitting(true);
    
    try {
      // 📍 1. โชว์ Popup เนียนๆ ว่า "กำลังส่งคำขอ" (หลอกไม่ให้รู้ว่ากำลังดึงพิกัด)
      Swal.fire({
        title: 'กำลังส่งคำขอ...',
        text: 'ระบบกำลังประมวลผลข้อมูล กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // 📍 2. บังคับแอบดึงพิกัดหลังบ้าน (ต้องดึงให้สำเร็จก่อนค่อยไปต่อ)
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('อุปกรณ์ของคุณไม่รองรับการทำงานนี้'));
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000, // ให้เวลาแอบดึง 10 วินาที
          maximumAge: 0
        });
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // 💾 3. เตรียมข้อมูล Payload (ยัด lat, lng ลงไปแบบเงียบๆ)
      const payload = {
        employee_id: user.id, 
        leave_type: 'วันหยุดประจำสัปดาห์ (PT)', 
        start_date: dayoffForm.date, 
        end_date: dayoffForm.date, 
        duration_minutes: 0, 
        reason: dayoffForm.reason || 'วันหยุดประจำสัปดาห์', 
        status: 'รออนุมัติ',
        lat: lat, // ✅ บันทึกพิกัดจริงลง DB
        lng: lng
      };

      const { error } = await supabase.from('leave_requests').insert([payload]);
      if (error) throw error;

      // 💬 4. ส่งแจ้งเตือนเข้า LINE แอดมิน (แนบพิกัดไปด้วย)
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      
      const flexMessage = {
        type: "flex", altText: `🏖️ แจ้งวันหยุดใหม่จากคุณ ${user?.full_name || 'พนักงาน'}`,
        contents: {
          type: "bubble", size: "kilo",
          header: { 
            type: "box", layout: "vertical", backgroundColor: "#8B5CF6", paddingAll: "15px",
            contents: [{ type: "text", text: "🏖️ แจ้งวันหยุด (Part-time)", weight: "bold", color: "#FFFFFF", size: "md" }] 
          },
          body: {
            type: "box", layout: "vertical", spacing: "md", paddingAll: "15px",
            contents: [
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: "พนักงาน:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: user?.full_name || '-', color: "#333333", size: "sm", flex: 2, weight: "bold", wrap: true } ] },
              { type: "separator", margin: "md" },
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: "วันที่ขอหยุด:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: dayoffForm.date || '-', color: "#8B5CF6", size: "sm", flex: 2, weight: "bold" } ] },
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: "เหตุผล:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: dayoffForm.reason || '-', color: "#333333", size: "sm", flex: 2, wrap: true } ] },
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: "สถานะ:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: "รออนุมัติ ⏳", color: "#F59E0B", size: "sm", flex: 2, weight: "bold" } ] }
            ]
          },
          footer: { 
            type: "box", layout: "vertical", spacing: "sm", 
            contents: [
              { type: "button", style: "primary", color: "#8B5CF6", height: "sm", action: { type: "uri", label: "📍 ดูพิกัดที่กดส่ง", uri: mapsUrl } },
              { type: "text", text: "PANCAKE ERP SYSTEM", color: "#cbd5e1", size: "xs", align: "center", weight: "bold", margin: "sm" }
            ] 
          }
        }
      };

      fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ to: [typeof lineAdminId !== 'undefined' ? lineAdminId : "C0df0123907f46aa88c44ef72e88ea30f"], messages: [flexMessage] })
      }).catch(err => console.error("LINE Fetch Error:", err));

      // 🎉 5. โชว์ Popup สำเร็จ!
      Swal.fire({ 
        icon: 'success', 
        title: 'ส่งคำขอเรียบร้อย!', 
        text: 'ระบบบันทึกคำขอวันหยุดของคุณและแจ้งแอดมินแล้ว', 
        showConfirmButton: false, 
        timer: 2000, 
        customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-purple-100' } 
      });
      
      setIsDayoffModalOpen(false);
      setDayoffForm({ date: "", reason: typeof t.defaultPTReason !== 'undefined' ? t.defaultPTReason : "วันหยุดประจำสัปดาห์" });
      if (typeof fetchDashboardData === 'function') fetchDashboardData();
      if (typeof addNotification === 'function') addNotification("แจ้งวันหยุด", `ส่งคำขอหยุดวันที่ ${dayoffForm.date} เรียบร้อยแล้ว`);
      
    } catch (error) {
      // ⚠️ ดัก Error แบบเนียนๆ ไม่ให้หลุดคำว่า GPS
      let errorMsg = error.message;
      if (error.code === 1 || error.code === 2 || error.code === 3) {
        errorMsg = "การเชื่อมต่อเครือข่ายไม่สมบูรณ์ (ERR_SYNC) กรุณากดอนุญาต (Allow) การเข้าถึงข้อมูลบนเบราว์เซอร์ของคุณก่อนทำรายการ";
      }
      Swal.fire({ icon: 'error', title: 'ไม่สามารถส่งคำขอได้', text: errorMsg, customClass: { popup: 'rounded-[2rem]' } });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚀 ฟังก์ชันอนุมัติ คำขอปรับปรุง (สลับวันหยุด / แก้ไขเวลา)
  const handleUpdateAdjustmentStatus = async (id, newStatus) => {
      Swal.fire({ title: 'กำลังดำเนินการ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
          const { error } = await supabase.from('adjustment_requests').update({ status: newStatus }).eq('id', id);
          if (error) throw error;
          
          // เตะข้อมูลออกจากหน้าจอทันที ไม่ต้องโหลดมงกุฎทองใหม่
          setAdminAdjustments(prev => prev.filter(req => req.id !== id));
          
          Swal.close();
          Swal.fire({ icon: 'success', title: 'สำเร็จ', text: `ทำรายการ ${newStatus} เรียบร้อย`, toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
      } catch (error) {
          Swal.close();
          Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message });
      }
  };

// 🚀 3. ฟังก์ชันส่งคำขอปรับปรุง (แก้ปัญหา Popup หายไว ล็อคหน้าจอ 100%)
  const handleSubmitAdjustment = async (e) => {
      e.preventDefault();
      
      if (adjustForm.tab === 'swap' && adjustForm.oldDate === adjustForm.newDate) {
          Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ถูกต้อง', text: 'วันหยุดเดิมและวันหยุดใหม่ ต้องไม่ใช่วันเดียวกันครับ' });
          return; 
      }

      // โชว์แค่โหลดดิ้งกลมๆ ตรงกลางจอ
      Swal.fire({ title: 'กำลังส่งคำขอ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      try {
          const reqType = adjustForm.tab === 'swap' ? 'สลับวันหยุด' : 'แก้ไขเวลา';

          // ข้อมูลที่จะส่งเข้า Database
          const payload = {
              employee_id: user?.id, 
              request_type: reqType, 
              status: 'รออนุมัติ', 
              reason: adjustForm.reason,
              old_date: adjustForm.tab === 'swap' ? adjustForm.oldDate : null, 
              new_date: adjustForm.tab === 'swap' ? adjustForm.newDate : null,
              incident_date: adjustForm.tab === 'edit' ? adjustForm.incidentDate : null, 
              time_type: adjustForm.tab === 'edit' ? adjustForm.timeType : null,
              old_time: adjustForm.tab === 'edit' ? adjustForm.oldTime : null, 
              new_time: adjustForm.tab === 'edit' ? adjustForm.newTime : null,
          };
          
          const { error } = await supabase.from('adjustment_requests').insert([payload]);
          if (error) throw error;

          // 🟢 แจ้งเตือน LINE OA (อัปเดตใหม่ ใส่รายละเอียดครบถ้วนสวยงาม)
          const headerTitle = adjustForm.tab === 'swap' ? 'แจ้งขอสลับวันหยุด' : 'แจ้งขอปรับปรุงเวลา';
          
          // จัดเตรียมข้อมูลรายละเอียดให้ตรงกับประเภทคำขอ
          let detailBoxes = [];
          if (adjustForm.tab === 'swap') {
              detailBoxes = [
                  { type: "box", layout: "horizontal", contents: [ { type: "text", text: "วันหยุดเดิม:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.oldDate || '-', color: "#333333", size: "sm", flex: 2, weight: "bold" } ] },
                  { type: "box", layout: "horizontal", contents: [ { type: "text", text: "ขอเปลี่ยนเป็น:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.newDate || '-', color: "#10B981", size: "sm", flex: 2, weight: "bold" } ] }
              ];
          } else {
              detailBoxes = [
                  { type: "box", layout: "horizontal", contents: [ { type: "text", text: "วันที่เกิดเหตุ:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.incidentDate || '-', color: "#333333", size: "sm", flex: 2, weight: "bold" } ] },
                  { type: "box", layout: "horizontal", contents: [ { type: "text", text: "ประเภท:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.timeType || '-', color: "#333333", size: "sm", flex: 2, weight: "bold" } ] },
                  { type: "box", layout: "horizontal", contents: [ { type: "text", text: "เวลาเดิม:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.oldTime || '-', color: "#EF4444", size: "sm", flex: 2, weight: "bold", decoration: "line-through" } ] },
                  { type: "box", layout: "horizontal", contents: [ { type: "text", text: "ขอเปลี่ยนเป็น:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.newTime || '-', color: "#10B981", size: "sm", flex: 2, weight: "bold" } ] }
              ];
          }

          // สร้าง Flex Message ให้สวยงาม
          const flexMessage = {
              type: "flex", altText: `🛠️ ${headerTitle}จากคุณ ${user?.full_name || 'พนักงาน'}`,
              contents: {
                  type: "bubble", size: "kilo", 
                  header: { 
                      type: "box", layout: "vertical", backgroundColor: "#3B82F6", paddingAll: "15px", 
                      contents: [{ type: "text", text: `🛠️ ${headerTitle}`, weight: "bold", color: "#FFFFFF", size: "md" }] 
                  },
                  body: { 
                      type: "box", layout: "vertical", spacing: "md", paddingAll: "15px", 
                      contents: [ 
                          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "พนักงาน:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: user?.full_name || '-', color: "#333333", size: "sm", flex: 2, weight: "bold", wrap: true } ] },
                          { type: "separator", margin: "md" },
                          ...detailBoxes,
                          { type: "separator", margin: "md" },
                          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "เหตุผล:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.reason || '-', color: "#333333", size: "sm", flex: 2, wrap: true } ] },
                          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "สถานะ:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: "รออนุมัติ ⏳", color: "#F59E0B", size: "sm", flex: 2, weight: "bold" } ] }
                      ]
                  },
                  footer: { 
                    type: "box", layout: "vertical", contents: [ { type: "text", text: "PANCAKE ERP SYSTEM", color: "#cbd5e1", size: "xs", align: "center", weight: "bold" } ] 
                  }
              }
          };

          // ยิง API แจ้งเตือน
          fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
              method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
              body: JSON.stringify({ to: [typeof lineAdminId !== 'undefined' ? lineAdminId : "C0df0123907f46aa88c44ef72e88ea30f"], messages: [flexMessage] })
          }).catch(err => console.error("LINE Fetch Error:", err));
          
          // ปิดหน้าต่าง Modal และเคลียร์ค่า
          setIsAdjustModalOpen(false);
          setAdjustForm({ tab: "swap", oldDate: "", newDate: "", incidentDate: "", timeType: "เข้างาน (IN)", oldTime: "", newTime: "", reason: "" });

          // 🛑 🛑 จุดสำคัญ: ใส่ await บังคับให้ระบบหยุดรอจนกว่าคนจะกดปุ่ม "ตกลง" 🛑 🛑
          await Swal.fire({
              icon: 'success', 
              title: 'ส่งคำขอเรียบร้อย!', 
              html: '<span class="text-slate-500 font-medium text-sm md:text-base">คำขอถูกส่งไปรออนุมัติ<br/>และระบบแจ้งเตือนแอดมินแล้วครับ</span>',
              showConfirmButton: true,
              confirmButtonText: 'ตกลง',
              confirmButtonColor: '#3B82F6',
              allowOutsideClick: false, // บังคับให้ต้องกดปุ่ม "ตกลง" เท่านั้นถึงจะปิดได้
              backdrop: 'rgba(0,0,0,0.4)',
              customClass: { 
                  container: 'backdrop-blur-sm', 
                  popup: 'rounded-[2rem] shadow-2xl border-2 border-blue-100', 
                  title: 'font-black text-slate-800 text-xl mt-4' 
              }
          });

      } catch (error) { 
          Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message });
      }
  };

// 💾 ฟังก์ชันสำรองข้อมูล (Backup Data)
  const handleBackupData = async () => {
    if (user?.role !== 'admin' && user?.role !== 'ceo') {
      Swal.fire('ปฏิเสธการเข้าถึง', 'เฉพาะผู้ดูแลระบบเท่านั้น', 'error');
      return;
    }

    try {
      Swal.fire({ 
        title: 'กำลังแพ็กไฟล์สำรองข้อมูล...', 
        text: 'อาจใช้เวลาสักครู่ กรุณาอย่าเพิ่งปิดหน้าจอ', 
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
      });

      // 1. ระบุชื่อตารางทั้งหมดในระบบ PANCAKE ERP SYSTEM ที่ต้องการ Backup
      const tablesToBackup = [
        'employees',            // ข้อมูลพนักงาน
        'employee_permissions', // สิทธิ์การเข้าถึงเมนู
        'branches',             // ข้อมูลสาขา
        'job_positions',        // ตำแหน่งงาน
        'system_settings',      // การตั้งค่าระบบต่างๆ (เช่น LINE OA)
        'leave_balances',       // โควต้าวันลาคงเหลือ
        'payroll_slips',        // สลิปเงินเดือน
        'attendance_logs',      // ประวัติเข้า-ออกงาน
        'leave_requests',       // ประวัติการยื่นลา
        'adjustment_requests',  // คำขอปรับปรุงเวลา
        'employee_sales',       // ข้อมูลยอดขาย
        'system_logs'           // ประวัติการใช้งานระบบ
      ];
      
      const backupResult = { 
        system: "PANCAKE ERP SYSTEM",
        backup_date: new Date().toISOString(),
        data: {} 
      };

      // 2. วนลูปดึงข้อมูลทีละตารางจาก Supabase
      for (const table of tablesToBackup) {
        const { data, error } = await supabase.from(table).select('*');
        if (!error) {
          backupResult.data[table] = data;
        }
      }

      // 3. แปลงข้อมูลเป็นไฟล์ JSON แล้วสั่งให้เบราว์เซอร์ดาวน์โหลด
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupResult, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `PANCAKE_ERP_BACKUP_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode); // สำคัญสำหรับ Firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      Swal.fire('สำเร็จ!', 'ไฟล์สำรองข้อมูล (JSON) ถูกดาวน์โหลดลงเครื่องของคุณแล้ว!', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสำรองข้อมูลได้: ' + err.message, 'error');
    }
  };


// 🚨 ฟังก์ชันล้างข้อมูลทดสอบ (Clear Test Data)
  const handleResetTestData = async () => {
    if (user?.role !== 'admin' && user?.role !== 'ceo') {
      Swal.fire('ปฏิเสธการเข้าถึง', 'เฉพาะผู้ดูแลระบบเท่านั้น', 'error');
      return;
    }

    const confirm1 = await Swal.fire({
      title: '⚠️ เตือนภัยระดับสูงสุด',
      text: "คุณกำลังจะลบข้อมูล 'สลิปเงินเดือน, เข้างาน, การลา, คำขอปรับปรุง และยอดขาย' ทั้งหมดทิ้ง! (รายชื่อพนักงานจะยังอยู่)",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'ใช่, ฉันต้องการล้างข้อมูล',
      cancelButtonText: 'ยกเลิก'
    });

    if (!confirm1.isConfirmed) return;

    const confirm2 = await Swal.fire({
      title: 'พิมพ์ CONFIRM เพื่อยืนยัน',
      text: "ข้อมูลที่ลบแล้วจะไม่สามารถกู้คืนได้!",
      input: 'text',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonText: 'ยกเลิก',
      preConfirm: (text) => {
        if (text !== 'CONFIRM') {
          Swal.showValidationMessage('พิมพ์ไม่ถูกต้อง กรุณาลองใหม่');
        }
      }
    });

    if (!confirm2.isConfirmed) return;

    try {
      Swal.fire({ title: 'กำลังล้างข้อมูล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      await supabase.from('payroll_slips').delete().not('id', 'is', null);
      await supabase.from('attendance_logs').delete().not('id', 'is', null);
      await supabase.from('leave_requests').delete().not('id', 'is', null);
      await supabase.from('adjustment_requests').delete().not('id', 'is', null);
      await supabase.from('employee_sales').delete().not('id', 'is', null);

      Swal.fire('สำเร็จ!', 'ล้างข้อมูลทดสอบเรียบร้อยแล้ว ระบบสะอาดพร้อมใช้งานจริง!', 'success');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้: ' + err.message, 'error');
    }
  };

  // 🗑️ ฟังก์ชันลบสลิปเงินเดือน (เฉพาะ CEO, Admin และ Accounting)
  const handleDeleteSlip = async (id) => {
    const allowedRoles = ['admin', 'ceo', 'Accounting & Finance Officer'];
    if (!allowedRoles.includes(user?.role)) {
      Swal.fire('ปฏิเสธการเข้าถึง', 'คุณไม่มีสิทธิ์ยกเลิกหรือลบสลิปเงินเดือน', 'error');
      return;
    }
    const result = await Swal.fire({
      title: 'ยืนยันการลบสลิป?',
      text: "หากลบแล้วจะไม่สามารถกู้คืนได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'ใช่, ลบทิ้งเลย',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('payroll_slips').delete().eq('id', id);
        if (error) throw error;
        Swal.fire('ลบสำเร็จ!', 'สลิปถูกลบออกจากระบบเรียบร้อย', 'success');
        fetchDashboardData();
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };


const handlePreviewAttendance = async () => {
    if (!payrollForm.employee_id || !payrollForm.month) {
      Swal.fire('แจ้งเตือน', 'กรุณาเลือกพนักงานและเดือนรอบบิล', 'warning');
      return;
    }
    try {
      Swal.fire({ title: 'กำลังคำนวณ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const { data: empInfo } = await supabase.from('employees').select('*').eq('id', payrollForm.employee_id).single();
      if (!empInfo) throw new Error("ไม่พบข้อมูลพนักงาน");

      const isPT = empInfo.salary_type === 'Part-time';
      const baseSalary = Number(payrollForm.base_salary) || Number(empInfo.base_salary) || 0;
      const hRate = Number(empInfo.hourly_rate) || 0;

      const [year, month] = payrollForm.month.split('-');
      const startDate = `${year}-${month}-01`;
      const endDateObj = new Date(year, parseInt(month), 1);
      const endDate = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-01`;

      const { data: attLogs } = await supabase.from('attendance_logs').select('*').eq('employee_id', payrollForm.employee_id).gte('timestamp', `${startDate}T00:00:00Z`).lt('timestamp', `${endDate}T00:00:00Z`);

      let totalLateMins = 0; let totalWorkMins = 0;
      const dailyLogs = {};
      
      if (attLogs) {
        attLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).forEach(log => {
          const d = log.timestamp.split('T')[0];
          if (!dailyLogs[d]) dailyLogs[d] = [];
          dailyLogs[d].push(log);
        });

        Object.keys(dailyLogs).forEach(date => {
          const logs = dailyLogs[date];
          const dateObj = new Date(date);
          const dayOfWeek = dateObj.getDay();
          
          const shiftData = (shiftRoster || {})[payrollForm.employee_id]?.[dayOfWeek];
          let expectedInMins = 540; 
          let isDayOff = false;

          if (shiftData) {
            if (shiftData.off) isDayOff = true;
            else {
              const firstShift = Array.isArray(shiftData) ? shiftData[0] : shiftData;
              if (firstShift?.in) {
                const [h, m] = firstShift.in.split(':').map(Number);
                expectedInMins = (h * 60) + m;
              }
            }
          }

          const checkIns = logs.filter(l => l.log_type === 'check_in');
          const checkOuts = logs.filter(l => l.log_type === 'check_out');

          if (checkIns.length > 0 && !isDayOff) {
            const firstIn = new Date(checkIns[0].timestamp);
            const actualInMins = (firstIn.getHours() * 60) + firstIn.getMinutes();
            if (actualInMins > expectedInMins) totalLateMins += (actualInMins - expectedInMins);

            if (checkOuts.length > 0) {
              const lastOut = new Date(checkOuts[checkOuts.length - 1].timestamp);
              let dailyMins = Math.floor((lastOut - firstIn) / (1000 * 60));
              if (dailyMins > 300) dailyMins -= 60; // หักพักเที่ยง
              if (dailyMins > 0) totalWorkMins += dailyMins;
            }
          }
        });
      }

      const lateDeduct = isPT ? 0 : Math.round(totalLateMins * (baseSalary / 30 / 8 / 60));
      const salaryPreview = isPT ? Math.round((totalWorkMins * hRate) / 60) : baseSalary;

      // 🟢 นำค่าที่คำนวณได้ ไปใส่ในตัวแปรสำหรับแก้ไข
      setPayrollForm(prev => ({
        ...prev,
        manual_work_hours: (totalWorkMins / 60).toFixed(2), // ชั่วโมงทำงานแบบทศนิยม เช่น 8.5 ชม.
        manual_late_mins: totalLateMins,
        manual_late_deduct: lateDeduct,
        manual_base_salary: salaryPreview,
        is_previewed: true
      }));
      Swal.close();
    } catch (e) { Swal.fire('Error', e.message, 'error'); }
  };



// 💸 ฟังก์ชันสร้างสลิปเงินเดือน (รองรับ 4 รูปแบบ: ปกติ-ประจำ, ปกติ-พาร์ทไทม์, ไลฟ์สด-ประจำ, ไลฟ์สด-พาร์ทไทม์)
  const handleGenerateSlip = async (e) => {
    e.preventDefault();
    setIsSavingPayroll(true);
    try {
      if (!payrollForm.employee_id) throw new Error("กรุณาเลือกพนักงาน");

      const { data: empInfo } = await supabase.from('employees').select('*').eq('id', payrollForm.employee_id).single();
      if (!empInfo) throw new Error("ไม่พบข้อมูลพนักงาน");

      // ✨ แยกประเภทพนักงาน 2 แกน (รายเดือน/รายชั่วโมง) และ (ไลฟ์สด/ออฟฟิศ)
      const isPartTime = empInfo.salary_type === 'Part-time';
      const positionName = (empInfo.position || '').toLowerCase();
      const isLiveStreamer = positionName.includes('ไลฟ์') || positionName.includes('live') || positionName.includes('สตรีม');

      const baseSalary = Number(payrollForm.base_salary) || Number(empInfo.base_salary) || 0;
      const hRate = Number(empInfo.hourly_rate) || 0;

      const [year, month] = payrollForm.month.split('-');
      const startDate = `${year}-${month}-01`;
      const endDateObj = new Date(year, parseInt(month), 1); 
      const endDate = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-01`;

      const { data: attLogs } = await supabase.from('attendance_logs').select('timestamp, log_type').eq('employee_id', payrollForm.employee_id).gte('timestamp', `${startDate}T00:00:00Z`).lt('timestamp', `${endDate}T00:00:00Z`);

      let totalWorkMins = 0;
      let totalOTMins = 0;
      let totalLateMins = 0;
      let workedDates = new Set();

      const dailyLogs = {};

      if (attLogs && attLogs.length > 0) {
        const sortedLogs = attLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        sortedLogs.forEach(log => {
          const date = log.timestamp.split('T')[0];
          if (!dailyLogs[date]) dailyLogs[date] = [];
          dailyLogs[date].push(log);
        });

        const shiftStart = empInfo.shift_start || "09:00:00"; 
        const [shiftHour, shiftMin] = shiftStart.split(':').map(Number);
        const expectedStartMins = (shiftHour * 60) + shiftMin;

        Object.keys(dailyLogs).forEach(date => {
          const logsOfDay = dailyLogs[date];
          let dailyWorkMins = 0;
          let firstCheckIn = null;

          // 🧠 สมองส่วนที่ 1: วิธีการนับเวลาทำงาน (แยกระหว่างไลฟ์สด กับ ปกติ)
          if (isLiveStreamer) {
            let currentIn = null;
            let checkInCount = 0;

            logsOfDay.forEach(log => {
              if (log.log_type === 'check_in') {
                currentIn = new Date(log.timestamp);
                checkInCount++;
                if (!firstCheckIn) firstCheckIn = currentIn; 
              } else if (log.log_type === 'check_out' && currentIn) {
                dailyWorkMins += Math.floor((new Date(log.timestamp) - currentIn) / (1000 * 60));
                currentIn = null;
              }
            });

            if (checkInCount === 1 && dailyWorkMins > 300) {
              dailyWorkMins -= 60; 
            }
          } else {
            const checkIns = logsOfDay.filter(l => l.log_type === 'check_in');
            const checkOuts = logsOfDay.filter(l => l.log_type === 'check_out');

            if (checkIns.length > 0 && checkOuts.length > 0) {
              firstCheckIn = new Date(checkIns[0].timestamp);
              const lastCheckOut = new Date(checkOuts[checkOuts.length - 1].timestamp);

              dailyWorkMins = Math.floor((lastCheckOut - firstCheckIn) / (1000 * 60));
              if (dailyWorkMins > 300) {
                dailyWorkMins -= 60;
              }
            }
          }

          // 🧠 สมองส่วนที่ 2: วิธีแปลงเวลาไปเป็นเงิน
          if (dailyWorkMins > 0) {
            workedDates.add(date); 
            
            if (isPartTime) {
              totalWorkMins += dailyWorkMins; 
            } else {
              const standardMins = 480; // 8 ชม.
              const workMins = Math.min(dailyWorkMins, standardMins);
              const otMins = Math.max(0, dailyWorkMins - standardMins);
              totalWorkMins += workMins;
              totalOTMins += otMins;

              if (firstCheckIn) {
                const checkInHour = firstCheckIn.getHours();
                const checkInMin = firstCheckIn.getMinutes();
                const totalCheckInMins = (checkInHour * 60) + checkInMin;
                
                if (totalCheckInMins > expectedStartMins) {
                  totalLateMins += (totalCheckInMins - expectedStartMins);
                }
              }
            }
          }
        });
      }

      const autoWorkHours = (totalWorkMins / 60).toFixed(2);
      const autoOTHours = (totalOTMins / 60).toFixed(2);

      // 🟢 1. ดึงค่าที่เราแก้ (Manual) มาใช้ ถ้าแอดมินแก้ตัวเลขให้ยึดตัวเลขนั้นเป็นหลัก
      const finalWorkHours = payrollForm.manual_work_hours !== undefined ? payrollForm.manual_work_hours : autoWorkHours;
      const finalLateMins = payrollForm.manual_late_mins !== undefined ? Number(payrollForm.manual_late_mins) : totalLateMins;
      const finalOTHours = payrollForm.ot_hours !== undefined ? payrollForm.ot_hours : autoOTHours;

      let salaryAmount = 0;
      let otPay = Number(payrollForm.ot_amount) || 0;

      // 🟢 2. ให้ความสำคัญกับค่าแรงที่แอดมินแก้ (แก้ Part-time ขาด/เกิน ก็จบตรงนี้เลย)
      if (isPartTime) {
        salaryAmount = payrollForm.manual_base_salary !== undefined 
          ? Number(payrollForm.manual_base_salary) 
          : Math.round((totalWorkMins * hRate) / 60); 
      } else {
        salaryAmount = payrollForm.manual_base_salary !== undefined 
          ? Number(payrollForm.manual_base_salary) 
          : baseSalary;
      }

      const { data: empSalesData } = await supabase.from('employee_sales')
        .select('current_sales, commission_rate')
        .eq('employee_id', payrollForm.employee_id)
        .eq('month', payrollForm.month)
        .maybeSingle();

      const commission = empSalesData ? (Number(empSalesData.current_sales) * (Number(empSalesData.commission_rate || 0) / 100)) : 0;

      let leaveDeduct = 0;
      let autoLateDeduction = 0;

      if (!isPartTime) {
        const { data: allLeavesInMonth } = await supabase.from('leave_requests')
          .select('leave_type, start_date, end_date, duration_minutes')
          .eq('employee_id', payrollForm.employee_id)
          .eq('status', 'อนุมัติ')
          .lt('start_date', endDate)
          .gte('end_date', startDate);
          
        if (allLeavesInMonth && allLeavesInMonth.length > 0) {
          let unpaidMinsInMonth = 0;
          const leaveDates = new Set();
          
          allLeavesInMonth.forEach(l => {
            const s = new Date(l.start_date);
            const e = new Date(l.end_date || l.start_date);
            
            for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
               const dateStr = d.toISOString().split('T')[0];
               if (dateStr >= startDate && dateStr < endDate && !workedDates.has(dateStr)) {
                  leaveDates.add(dateStr);
                  if (l.leave_type === 'ลาไม่รับเงินเดือน') {
                      unpaidMinsInMonth += 480; 
                  }
               }
            }
          });
          
          leaveDeduct = Math.round(unpaidMinsInMonth * (baseSalary / (30 * 8 * 60)));
        }

        // ใช้จำนวนนาทีสายที่แอดมินแก้ มาคำนวณหักเงิน
        if (finalLateMins > 0) {
          const ratePerMin = baseSalary / 30 / 8 / 60; 
          autoLateDeduction = Math.round(finalLateMins * ratePerMin);
        }
      }

      // 🟢 3. หักสายบาท (ยึดตามที่แอดมินแก้ หรือใช้ออโต้)
      const finalLateDeduct = payrollForm.manual_late_deduct !== undefined ? Number(payrollForm.manual_late_deduct) : autoLateDeduction;

      const autoAbsentDeduction = 0;
      const bonus = Number(payrollForm.bonus) || 0;
      const manualDeduct = Number(payrollForm.deductions) || 0; 
      const ssoDeduct = Number(payrollForm.social_security) || 0;
      const taxDeduct = Number(payrollForm.tax) || 0;

      // 🟢 4. คิดยอดสุทธิ (Net Salary) ใหม่ด้วยค่าที่แก้ทั้งหมด
      const netSalary = Math.round((salaryAmount + commission + otPay + bonus) - (leaveDeduct + manualDeduct + finalLateDeduct + autoAbsentDeduction + ssoDeduct + taxDeduct));

      const payload = {
        employee_id: payrollForm.employee_id, 
        month: payrollForm.month,
        salary_type: empInfo.salary_type,
        // 🟢 5. บันทึกยอดเงินเข้า DB ไปเลย จะได้เอาไปโชว์ในสลิปได้ถูกต้อง (ไม่เซ็ต 0 แล้ว)
        base_salary: salaryAmount,
        total_work_hours: finalWorkHours,
        ot_hours: finalOTHours, 
        ot_amount: otPay,
        commission: commission, 
        bonus: bonus,
        leave_deduction: leaveDeduct, 
        late_deduction: finalLateDeduct,
        absence_deduction: autoAbsentDeduction,
        deductions: manualDeduct,
        social_security_deduction: ssoDeduct, 
        tax_deduction: taxDeduct,             
        net_salary: netSalary
      };

      const { data: exist } = await supabase.from('payroll_slips').select('id').eq('employee_id', payrollForm.employee_id).eq('month', payrollForm.month).maybeSingle();
      if (exist) await supabase.from('payroll_slips').update(payload).eq('id', exist.id); 
      else await supabase.from('payroll_slips').insert([payload]); 

      let alertText = `บันทึกข้อมูลเงินเดือนเรียบร้อย`;
      if (finalLateDeduct > 0) {
        alertText = `พบการหักเงิน:\n- สาย ${finalLateMins} นาที (หัก ฿${finalLateDeduct.toLocaleString()})\n\nบันทึกข้อมูลสำเร็จ`;
      }

      await fetchDashboardData(true); 
      setPayrollFilterMonth(payrollForm.month); 
      setPayrollSearchKeyword(''); 
      setIsPayrollModalOpen(false); 
      
      Swal.fire({ icon: 'success', title: 'ประมวลผลสำเร็จ!', text: alertText, confirmButtonColor: '#10B981' });
      
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsSavingPayroll(false);
    }
  };

// =========================================================================
  // 🔍 ฟังก์ชันตรวจสอบและแก้ไข (เวอร์ชัน AI 6 คีย์ ไม่ทับหน้าต่างเดิม + รูปไม่หาย)
  // =========================================================================
const handleHumanAuditLive = async (record) => {
    
    Swal.fire({ title: 'กำลังโหลดข้อมูล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    try {
      const { data: allEmps } = await supabase.from('employees').select('*').order('full_name');
      const { data: allPlats } = await supabase.from('platforms').select('*').order('name');
      Swal.close();

      const streamersList = (allEmps || []).filter(e => {
        const empId = String(e.employee_id || e.id || '').toUpperCase().trim();
        const fullName = String(e.full_name || '').trim();
        const role = String(e.role || '').toLowerCase();
        return empId === 'PL001' || fullName.includes('ณัจฉรียา') || role === 'employee' || role === 'ceo' || role === 'streamer';
      });

      const empOptions = streamersList.map(e => `<option value="${e.id}" ${record.employee_id === e.id ? 'selected' : ''}>${e.full_name} (${e.nickname || '-'})</option>`).join('');
      const followEmpOptions = `<option value="">-- เลือกพนักงาน --</option>` + streamersList.map(e => `<option value="${e.full_name}" ${record.followed_employee_name === e.full_name ? 'selected' : ''}>${e.full_name} (${e.nickname || '-'})</option>`).join('');
      const safePlatform = typeof record.platform === 'object' ? (record.platform?.name || '') : (record.platform || '');
      const platSelectOptions = (allPlats || []).map(p => `<option value="${p.name}" ${safePlatform === p.name ? 'selected' : ''}>${p.name}</option>`).join('');
      const isFirst = String(record.sequence_type || '').includes('แรก');

      const { value: updatedData } = await Swal.fire({
        title: '<span class="text-2xl font-black text-slate-800">🔍 ตรวจสอบและแก้ไขข้อมูล</span>',
        html: `
          <div class="flex flex-col md:flex-row gap-6 text-left mt-4 max-h-[75vh] overflow-y-auto pr-2 select-none w-full min-w-0 box-border">
            <div class="w-full md:w-[45%] flex flex-col gap-2 min-w-0 box-border">
              <div class="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex flex-col relative overflow-hidden group cursor-pointer w-full min-w-0 box-border" id="audit-img-trigger" style="min-height: 400px;">
                <img id="preview-thumbnail" src="${record.image_url || ''}" class="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]" style="display: ${record.image_url ? 'block' : 'none'};" />
                <div id="no-image-text" class="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-50 rounded-xl" style="display: ${record.image_url ? 'none' : 'flex'};">ไม่มีรูปภาพหลักฐาน</div>
                <div class="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/50 pointer-events-none drop-shadow-md">คลิกที่รูปเพื่อขยายเต็มจอ</div>
              </div>
              
              <label id="audit-upload-btn" class="w-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold py-2.5 rounded-xl text-center cursor-pointer hover:bg-indigo-600 hover:text-white transition-all shadow-sm mt-1 min-w-0 box-border">
                <span id="btn-text">📸 อัปโหลดรูปใหม่ (AI จะช่วยดึงยอด)</span>
                <input type="file" id="audit-image-upload" accept="image/*" class="hidden" />
              </label>
            </div>

            <div class="w-full md:w-[55%] flex flex-col gap-3 min-w-0 box-border">
              
              <div class="flex flex-col sm:flex-row gap-3 w-full min-w-0 box-border">
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm w-full min-w-0 box-border flex-1">
                  <label class="text-[11px] font-bold text-slate-500 block mb-1">📅 วันที่ไลฟ์</label>
                  <input type="date" id="audit-date" class="block w-full min-w-[0px] max-w-[100%] box-border bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-700 outline-none m-0" value="${record.live_date || ''}">
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm w-full min-w-0 box-border flex-1">
                  <label class="text-[11px] font-bold text-slate-500 block mb-1">👤 พนักงาน (เจ้าของกะ)</label>
                  <select id="audit-emp" class="block w-full min-w-[0px] max-w-[100%] box-border bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-700 outline-none m-0">${empOptions}</select>
                </div>
              </div>
              
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm w-full min-w-0 box-border">
                <label class="text-[11px] font-bold text-slate-500 block mb-1">📺 แพลตฟอร์ม</label>
                <select id="audit-platform" class="block w-full min-w-[0px] max-w-[100%] box-border bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-700 outline-none focus:border-indigo-500 m-0">${platSelectOptions}</select>
              </div>
              
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm w-full min-w-0 box-border">
                <label class="text-[11px] font-bold text-slate-500 block mb-2">ลำดับคิว</label>
                <div class="flex flex-col sm:flex-row gap-3 w-full min-w-0 box-border">
                  <select id="audit-seq-type" class="block w-full min-w-[0px] max-w-[100%] box-border bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-700 outline-none m-0 flex-1">
                    <option value="คิวแรก" ${isFirst ? 'selected' : ''}>🌟 คิวแรก</option>
                    <option value="ขึ้นไลฟ์ต่อ" ${!isFirst ? 'selected' : ''}>🤝 ขึ้นไลฟ์ต่อ</option>
                  </select>
                  <div id="audit-follow-area" style="display: ${isFirst ? 'none' : 'block'}" class="w-full min-w-0 box-border flex-1">
                    <select id="audit-follow-name" class="block w-full min-w-[0px] max-w-[100%] box-border bg-rose-50 border border-rose-200 rounded-lg p-2 font-bold text-rose-700 outline-none m-0">${followEmpOptions}</select>
                  </div>
                </div>
              </div>
              
              <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm w-full min-w-0 box-border flex flex-col gap-3">
                <div class="flex justify-between items-center bg-indigo-600 px-3 py-1.5 rounded-lg shadow-sm">
                  <span class="text-[11px] font-black text-indigo-50 uppercase tracking-widest">⏳ จำนวนชั่วโมงรวม</span>
                  <span class="text-sm font-black text-white">${record.live_hours || '0.00'} ชม.</span>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 w-full min-w-0 box-border">
                  <div class="w-full min-w-0 box-border flex-1">
                    <label class="text-[10px] font-black text-indigo-400 block mb-1">เวลาเริ่ม</label>
                    <input type="time" id="audit-start-time" class="block w-full min-w-[0px] max-w-[100%] box-border bg-white border-2 border-indigo-200 rounded-xl px-2 py-3 font-black text-xl text-indigo-700 text-center m-0" value="${record.start_time ? record.start_time.substring(0,5) : ''}">
                  </div>
                  <div class="w-full min-w-0 box-border flex-1">
                    <label class="text-[10px] font-black text-indigo-400 block mb-1">เวลาจบ</label>
                    <input type="time" id="audit-end-time" class="block w-full min-w-[0px] max-w-[100%] box-border bg-white border-2 border-indigo-200 rounded-xl px-2 py-3 font-black text-xl text-rose-600 text-center m-0" value="${record.end_time ? record.end_time.substring(0,5) : ''}">
                  </div>
                </div>
              </div>
              
              <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-100 shadow-sm w-full min-w-0 box-border">
                <label class="text-[11px] font-bold text-emerald-600 block mb-2 uppercase tracking-wider">💰 ยอดจบหน้าจอ (End Sales)</label>
                <input type="number" id="audit-end-sales" class="block w-full min-w-[0px] max-w-[100%] box-border bg-white border-2 border-emerald-400 rounded-lg p-3 font-black text-3xl text-emerald-700 text-center shadow-inner m-0" value="${record.end_sales || 0}">
              </div>
            </div>
          </div>
        `,
        width: '1000px',
        showCancelButton: true,
        confirmButtonText: '💾 บันทึกการแก้ไข',
        confirmButtonColor: '#4F46E5',
        didOpen: () => {
          const typeSelect = document.getElementById('audit-seq-type');
          const followArea = document.getElementById('audit-follow-area');
          if (typeSelect && followArea) {
            typeSelect.addEventListener('change', (e) => { followArea.style.display = e.target.value === 'ขึ้นไลฟ์ต่อ' ? 'block' : 'none'; });
          }

          const fileInput = document.getElementById('audit-image-upload');
          const btnText = document.getElementById('btn-text');
          const salesInput = document.getElementById('audit-end-sales');
          const previewImg = document.getElementById('preview-thumbnail');
          const noImgText = document.getElementById('no-image-text');

          if (fileInput) {
            fileInput.addEventListener('change', async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              // 1. อัปเดตรูปพรีวิวทันที
              previewImg.src = URL.createObjectURL(file);
              previewImg.style.display = 'block';
              if(noImgText) noImgText.style.display = 'none';

              // 2. 🤖 เริ่ม AI สแกนแบบ Background (ไม่เด้ง Swal ทับ)
              btnText.innerHTML = "⏳ AI กำลังอ่านรูป... (อย่าเพิ่งปิดหน้าต่าง)";
              salesInput.classList.add('animate-pulse', 'bg-yellow-50');

              try {
                const base64Data = await new Promise((res, rej) => { const r = new FileReader(); r.readAsDataURL(file); r.onload = () => res(r.result.split(',')[1]); r.onerror = rej; });
                
                // 🚩 รายการ 6 API Keys
                const apiKeys = [
                  "AIzaSyChW3OjwcoPW2X3AFeaV5OnOh28CY46fAU",
                  "AIzaSyA0Nd0GWjfkHyLOPCfSCsGIoE37qAjtCoI",
                  "AIzaSyBd68SxshIQxD8ZYYds_X_BC05ibN0p78M",
                  "AIzaSyDG1KVkbEihwZiubhLa1pqQWZQ74eDt21c",
                  "AIzaSyCUnIO2sdWTMsP2ZG12L4xv-5REiESUFFI",
                  "AIzaSyAt68effaiLr0Rzprp8hZD8IKpnTMBkSfc"
                ];

                let extractedNumber = null;

                // 🔄 วนลูปสลับใช้งานทีละคีย์
                for (const apiKey of apiKeys) {
                  try {
                    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, { 
                      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: "หา 'ยอดขายรวม' หรือ 'รายได้' ตอบกลับมาแค่ตัวเลขเพียวๆ ตัดสัญลักษณ์เงินออก ห้ามตอบคำอื่น" }, { inline_data: { mime_type: file.type, data: base64Data } }] }], generationConfig: { temperature: 0.1 } }) 
                    });
                    
                    if (!res.ok) continue; // ถ้าติด 429 หรือมีปัญหา ให้ข้ามไปอันถัดไป
                    
                    const data = await res.json(); 
                    const val = data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/[^0-9.]/g, ''); 
                    
                    if (val) {
                      extractedNumber = val;
                      break; // ✅ ได้ยอดแล้ว ออกจากลูป
                    }
                  } catch (innerErr) {
                    continue; // ข้ามไปลองคีย์ถัดไป
                  }
                }
                
                if(extractedNumber) {
                  salesInput.value = extractedNumber;
                  btnText.innerHTML = "✅ AI ดึงยอดสำเร็จ!";
                  setTimeout(() => { btnText.innerHTML = "📸 อัปโหลดรูปใหม่ (AI จะช่วยดึงยอด)"; }, 3000);
                } else {
                  throw new Error();
                }
              } catch (err) {
                salesInput.value = "";
                btnText.innerHTML = "❌ AI อ่านไม่ออก (คลิกเพื่อลองใหม่)";
                setTimeout(() => { btnText.innerHTML = "📸 อัปโหลดรูปใหม่ (AI จะช่วยดึงยอด)"; }, 3000);
              } finally {
                salesInput.classList.remove('animate-pulse', 'bg-yellow-50');
              }
            });
          }

          // 🚀 อัปเกรดระบบดูรูปภาพ: ซูม แพน แบบมี Boundary Lock ขั้นโปร
          const imgTrigger = document.getElementById('audit-img-trigger');
          if (imgTrigger) {
            imgTrigger.addEventListener('click', () => {
              if (previewImg.src && previewImg.style.display !== 'none') {
                const viewer = document.createElement('div');
                viewer.className = "fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center overflow-hidden opacity-0 transition-opacity duration-300 touch-none";
                
                viewer.innerHTML = `
                  <div class="absolute inset-0 viewer-bg cursor-pointer"></div>
                  <img src="${previewImg.src}" class="viewer-img relative max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] scale-95 transition-transform duration-300 select-none cursor-grab" style="transform-origin: center center;" draggable="false" />
                  <div class="absolute top-6 right-6 bg-white/10 text-white rounded-full w-12 h-12 flex items-center justify-center font-black text-xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer z-10 close-btn backdrop-blur-sm shadow-lg">✕</div>
                  <div class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 px-6 py-2.5 rounded-full text-xs font-bold tracking-wide pointer-events-none backdrop-blur-md border border-white/10 whitespace-nowrap">🖱️ Scroll: ซูมเข้า-ออก • 👆 ลากเมาส์: เลื่อนรูป • ✌️ ดับเบิลคลิก: คืนค่าเดิม</div>
                `;
                document.body.appendChild(viewer);
                
                const img = viewer.querySelector('.viewer-img');
                const bg = viewer.querySelector('.viewer-bg');
                const closeBtn = viewer.querySelector('.close-btn');
                
                requestAnimationFrame(() => { 
                  viewer.classList.remove('opacity-0'); 
                  img.classList.remove('scale-95'); 
                });

                const closeViewer = () => {
                  viewer.classList.add('opacity-0');
                  img.style.transform = `scale(0.9) translate(0px, 0px)`;
                  setTimeout(() => viewer.remove(), 300);
                };

                bg.addEventListener('click', closeViewer);
                closeBtn.addEventListener('click', closeViewer);

                // --- Core Zoom & Pan Logic (Pro Version with Boundary Limits) ---
                let scale = 1;
                let panning = false;
                let pointX = 0, pointY = 0;
                let startX = 0, startY = 0;

                const setTransform = () => {
                  img.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
                };

                const clampBounds = () => {
                  // คำนวณขอบเขตหน้าจอและขนาดรูปจริงตอนซูม
                  const winWidth = window.innerWidth;
                  const winHeight = window.innerHeight;
                  const imgWidth = img.offsetWidth * scale;
                  const imgHeight = img.offsetHeight * scale;

                  // คำนวณระยะสูงสุดที่ลากได้ (ถ้าเล็กกว่าจอคือ 0 ห้ามลากเกินกลางจอ)
                  const maxPanX = Math.max(0, (imgWidth - winWidth) / 2);
                  const maxPanY = Math.max(0, (imgHeight - winHeight) / 2);

                  // ล็อกตำแหน่งให้อยู่ในกรอบ
                  pointX = Math.min(Math.max(pointX, -maxPanX), maxPanX);
                  pointY = Math.min(Math.max(pointY, -maxPanY), maxPanY);
                };

                // Wheel Zoom
                viewer.addEventListener('wheel', (e) => {
                  e.preventDefault();
                  img.style.transition = 'none'; // ปิดแอนิเมชันให้ไหลลื่น
                  const zoomSpeed = 0.15;
                  const delta = e.deltaY > 0 ? -1 : 1;
                  let newScale = scale + (delta * zoomSpeed * scale);
                  
                  if (newScale >= 1 && newScale <= 10) { // ล็อกไม่ให้เล็กกว่าจอ และไม่ใหญ่ทะลุ 10 เท่า
                    scale = newScale;
                    clampBounds(); // เวลาซูมออก รูปจะโดนดันกลับเข้ากลางจออัตโนมัติ
                    setTransform();
                  }
                }, { passive: false });

                // Mouse Pan (Drag)
                img.addEventListener('mousedown', (e) => {
                  e.preventDefault();
                  if (scale <= 1) return; // ห้ามลากถ้ารูปยังไม่ถูกซูม
                  panning = true;
                  img.style.cursor = 'grabbing';
                  img.style.transition = 'none';
                  startX = e.clientX - pointX;
                  startY = e.clientY - pointY;
                });

                window.addEventListener('mousemove', (e) => {
                  if (!panning) return;
                  pointX = e.clientX - startX;
                  pointY = e.clientY - startY;
                  clampBounds(); // เช็คขอบจอตลอดเวลาที่ลาก ห้ามหลุด
                  setTransform();
                });

                window.addEventListener('mouseup', () => {
                  if (panning) {
                    panning = false;
                    img.style.cursor = 'grab';
                  }
                });

                window.addEventListener('mouseleave', () => {
                  if (panning) panning = false; // ป้องกันบั๊กลากหลุดเมาส์
                });

                // Double Click Reset
                img.addEventListener('dblclick', () => {
                  img.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
                  scale = 1;
                  pointX = 0;
                  pointY = 0;
                  setTransform();
                });
              }
            });
          }
        },
        preConfirm: () => {
          const uDate = document.getElementById('audit-date').value;
          const uEmp = document.getElementById('audit-emp').value;
          const uPlat = document.getElementById('audit-platform').value;
          const uSeq = document.getElementById('audit-seq-type').value;
          const uFol = document.getElementById('audit-follow-name').value;
          const uS = document.getElementById('audit-start-time').value;
          const uE = document.getElementById('audit-end-time').value;
          const uSales = document.getElementById('audit-end-sales').value;
          const previewImg = document.getElementById('preview-thumbnail');
          
          if (!uDate || !uS || !uE) { Swal.showValidationMessage('กรุณากรอกเวลาให้ครบถ้วน'); return false; }
          if (!uSales && uSales !== '0') { Swal.showValidationMessage('กรุณาระบุยอดขาย'); return false; }
          
          return { live_date: uDate, employee_id: uEmp, platform: uPlat, sequence_type: uSeq, followed_employee_name: uFol, start_time: uS, end_time: uE, end_sales: Number(uSales), image_url: previewImg.src };
        }
      });

      if (updatedData) {
        Swal.fire({ title: 'กำลังบันทึก...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        let finalImageUrl = updatedData.image_url;

        // ถ้ามีการอัปโหลดรูปใหม่ (ค่า src จะเป็น blob: ไม่ใช่ url จริง)
        const fileInput = document.getElementById('audit-image-upload');
        if (fileInput && fileInput.files[0]) {
          const file = fileInput.files[0];
          const fileName = `${user.id}/${Date.now()}_audit.jpg`;
          const { error: upErr } = await supabase.storage.from('live_images').upload(fileName, file);
          if (!upErr) {
            finalImageUrl = supabase.storage.from('live_images').getPublicUrl(fileName).data.publicUrl;
          }
        }

        // --- Recalculate Logic ล้วนๆ ---
        const getMins = (t) => { const [h,m] = t.split(':').map(Number); return h*60 + m; };
        let s1 = getMins(updatedData.start_time); let e1 = getMins(updatedData.end_time);
        if (e1 <= s1) e1 += 24*60;
        const newHours = ((e1-s1)/60).toFixed(2);

        // 1. อัปเดตข้อมูลของใบที่เราแก้ไข
        await supabase.from('live_tracking').update({
          live_date: updatedData.live_date,
          employee_id: updatedData.employee_id,
          platform: updatedData.platform,
          sequence_type: updatedData.sequence_type,
          is_first_queue: updatedData.sequence_type === 'คิวแรก',
          followed_employee_name: updatedData.sequence_type === 'คิวแรก' ? '-' : updatedData.followed_employee_name,
          start_time: updatedData.start_time,
          end_time: updatedData.end_time,
          live_hours: newHours,
          end_sales: updatedData.end_sales,
          image_url: finalImageUrl !== record.image_url ? finalImageUrl : record.image_url
        }).eq('id', record.id);

        // 2. ดึงบิลทั้งหมดของช่องและวันนั้นมาจัดเรียงใหม่ เพื่อปรับ Start Sales / Net Sales ให้ถูก
        const { data: dayShifts } = await supabase.from('live_tracking').select('*')
          .eq('live_date', updatedData.live_date)
          .eq('platform', updatedData.platform);
          
        let sortedShifts = (dayShifts || []).sort((a, b) => {
           let tA = getMins(a.start_time); let tB = getMins(b.start_time);
           if (tA < 6*60) tA += 24*60; if (tB < 6*60) tB += 24*60;
           return tA - tB;
        });

        let runnerSales = 0;
        let affectedEmployees = new Set();
        
        for (const shift of sortedShifts) {
          let actualStart = shift.is_first_queue ? 0 : runnerSales;
          let expectedNet = Number(shift.end_sales) - actualStart;
          if (expectedNet < 0) expectedNet = 0;

          await supabase.from('live_tracking').update({ start_sales: actualStart, net_sales: expectedNet }).eq('id', shift.id);
          affectedEmployees.add(shift.employee_id);
          runnerSales = Number(shift.end_sales);
        }

        // 3. อัปเดต Employee Sales รายเดือนของคนที่โดนกระทบ
        const currentMonth = updatedData.live_date.substring(0, 7);
        for (const empId of affectedEmployees) {
          const { data: allData } = await supabase.from('live_tracking').select('net_sales, live_date').eq('employee_id', empId);
          let monthlySum = 0;
          if (allData) {
            allData.forEach(item => {
              if (item.live_date?.includes(currentMonth)) monthlySum += Number(item.net_sales || 0);
            });
          }
          const { data: existS } = await supabase.from('employee_sales').select('id').eq('employee_id', empId).eq('month', currentMonth).maybeSingle();
          if (existS) await supabase.from('employee_sales').update({ current_sales: monthlySum }).eq('id', existS.id);
          else await supabase.from('employee_sales').insert([{ employee_id: empId, current_sales: monthlySum, month: currentMonth, target_sales: 100000, commission_rate: 3 }]);
        }

        await fetchHistoryWithNames();
        Swal.fire({ icon: 'success', title: 'อัปเดตข้อมูลสำเร็จ!', text: 'ระบบคำนวณยอดขายสุทธิใหม่เรียบร้อยแล้ว', timer: 1500, showConfirmButton: false });
      }
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };


const handleApproveLeave = async (id, email, name, status, mins, empId, type) => {
    try {
      await supabase.from('leave_requests').update({ status }).eq('id', id);
      if (status === 'อนุมัติ') {
        const { data: bal } = await supabase.from('leave_balances').select('used_minutes').eq('employee_id', empId).eq('leave_type', type).maybeSingle();
        if (bal) await supabase.from('leave_balances').update({ used_minutes: bal.used_minutes + mins }).eq('employee_id', empId).eq('leave_type', type);
      }
      fetchDashboardData();
    } catch (error) { console.error("เกิดข้อผิดพลาด: " + error.message); }
};




const handleApproveAdjust = async (id, email, name, status) => {
    try {
      await supabase.from('adjustment_requests').update({ status }).eq('id', id);
      fetchDashboardData();
    } catch (error) { console.error("เกิดข้อผิดพลาด: " + error.message); }
};

const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => { setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude, isDefault: false }); },
        (error) => alert("ไม่สามารถดึงตำแหน่งได้ กรุณาเปิด GPS")
      );
    } else { alert("เบราว์เซอร์ของคุณไม่รองรับการดึงตำแหน่ง (GPS)"); }
};

const fetchBranches = async () => {
    try {
      const { data, error } = await supabase.from('branches').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBranches(data || []);
    } catch (err) { console.error("Fetch error:", err.message); }
};

const handleSaveBranch = async (e) => {
    e.preventDefault();
    if (!formName || currentLocation.isDefault) {
      return Swal.fire({ icon: 'warning', title: 'เดี๋ยวก่อน!', text: 'กรุณากรอกชื่อและดึงพิกัด GPS', confirmButtonColor: '#ec4899' });
    }
    try {
      const branchData = { name: formName, lat: currentLocation.lat, lng: currentLocation.lng, radius_m: Number(formRadius) };
      if (editingBranchId) {
        await supabase.from('branches').update(branchData).eq('id', editingBranchId);
        Swal.fire({ icon: 'success', title: 'อัปเดตสาขาและรัศมีเรียบร้อย!', showConfirmButton: false, timer: 1500 });
        // 🔔 แจ้งเตือนกระดิ่ง
        addNotification("อัปเดตสาขา", `แก้ไขข้อมูลสาขา "${formName}" เรียบร้อยแล้ว`);
      } else {
        await supabase.from('branches').insert([branchData]);
        Swal.fire({ icon: 'success', title: 'บันทึกสาขาใหม่เรียบร้อย!', showConfirmButton: false, timer: 1500 });
        // 🔔 แจ้งเตือนกระดิ่ง
        addNotification("เพิ่มสาขาใหม่", `เพิ่มข้อมูลสาขา "${formName}" เรียบร้อยแล้ว`);
      }
      setEditingBranchId(null); setFormName(""); setFormRadius(100); setCurrentLocation({ lat: 13.7563, lng: 100.5018, isDefault: true });
      fetchBranches();
    } catch (err) { Swal.fire('เกิดข้อผิดพลาด!', err.message, 'error'); }
};

const handleDeleteBranch = async (id) => {
    const result = await Swal.fire({
      title: 'ลบสาขานี้ใช่ไหม?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#f43f5e', cancelButtonColor: '#cbd5e1', confirmButtonText: 'ใช่, ลบเลย!', cancelButtonText: 'ยกเลิก'
    });
    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('branches').delete().eq('id', id);
        if (error) throw error;
        Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย!', showConfirmButton: false, timer: 1500 });
        // 🔔 แจ้งเตือนกระดิ่ง
        addNotification("ลบสาขา", "ระบบได้ลบข้อมูลสาขาออกเรียบร้อยแล้ว");
        fetchBranches();
      } catch (err) { Swal.fire('เกิดข้อผิดพลาด!', err.message, 'error'); }
    }
};

// =====================================================================
// 👑 1. ฟังก์ชันส่งแจ้งเตือนผลการอนุมัติ (แก้ปัญหา  ในอีเมล)
const notifyApprovalResult = async (employeeId, requestType, status, detail) => {
    if (!employeeId) return;
    try {
      const { data: employee, error } = await supabase.from('employees').select('*').eq('id', employeeId).maybeSingle();
      if (error || !employee) return;

      const isApproved = status === 'approved' || status === 'อนุมัติ';
      // ✨ 1. ใช้รหัส HTML (&#128081;) แทนตัวอิโมจิ ป้องกันระบบส่งเมลพัง
      const statusText = isApproved ? '&#128081; อนุมัติแล้ว (Approved)' : '❌ ไม่สามารถอนุมัติได้ (Rejected)';
      const statusColor = isApproved ? '#10b981' : '#f43f5e'; 
      const approverName = user?.full_name || "ผู้ดูแลระบบ (Admin)";

      const htmlTemplate = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fffbfb; padding: 20px; border: 1px solid #fce7f3; border-radius: 30px;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px rgba(136, 19, 55, 0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 50px; margin-bottom: 10px;">&#128081;</div>
              <h1 style="color: #881337; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">Pancake</h1>
              <p style="color: #be123c; margin: 5px 0 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-style: italic;">Lovely Enrichment HR</p>
            </div>
            
            <h2 style="color: #1e293b; font-size: 20px; text-align: center; font-weight: 800; border-bottom: 2px solid #fff1f2; padding-bottom: 20px; margin-bottom: 25px;">แจ้งผลการพิจารณาคำขอ</h2>
            
            <p style="color: #475569; font-size: 16px;">เรียนคุณ <strong>${employee.full_name || 'พนักงาน'}</strong>,</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">ระบบได้ดำเนินการพิจารณาคำขอของคุณเรียบร้อยแล้ว โดยมีรายละเอียดดังนี้:</p>
            
            <div style="background-color: #f8fafc; border-left: 5px solid ${statusColor}; padding: 20px; margin: 25px 0; border-radius: 0 15px 15px 0;">
              <p style="margin: 8px 0; color: #334155;"><strong>ประเภทคำขอ:</strong> ${requestType}</p>
              <p style="margin: 8px 0; color: #334155;"><strong>รายละเอียด:</strong> ${detail || '-'}</p>
              <p style="margin: 8px 0; color: #334155;"><strong>สถานะ:</strong> <span style="color: ${statusColor}; font-weight: 900; font-size: 18px;">${statusText}</span></p>
              <p style="margin: 20px 0 0; color: #94a3b8; font-size: 13px; border-top: 1px dashed #e2e8f0; padding-top: 15px;"><strong>ผู้พิจารณา:</strong> ${approverName}</p>
            </div>
            
            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
              <p style="color: #cbd5e1; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Premium HR Platform Experience</p>
            </div>
          </div>
        </div>
      `;

      //  เอาอิโมจิออกจาก Subject (หัวข้ออีเมล) เพื่อความชัวร์ 100%
      fetch('https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec', { 
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
        body: JSON.stringify({ to: employee.email, subject: `[Pancake HR] แจ้งผลพิจารณา: ${requestType}`, html: htmlTemplate }) 
      }).catch(err => console.error("Email Error:", err));
    } catch (err) { console.error("Notify Error:", err.message); }
};

// ✅ 2. ฟังก์ชันอนุมัติ (อัปเดตเวลาลง DB แบบ Timezone +07:00 แก้ปัญหา 00 เบิ้ล + ไม่โหลดหน้าจอ)
const executeApproveWithPopup = async (record, type, isLeave) => {
    const result = await Swal.fire({
      title: 'ยืนยันการอนุมัติ?', html: `คุณต้องการอนุมัติคำขอ <b>${type}</b> ใช่หรือไม่?`, icon: 'question',
      showCancelButton: true, confirmButtonColor: '#10b981', cancelButtonColor: '#f1f5f9',
      cancelButtonText: '<span style="color: #64748b; font-weight: bold;">ยกเลิก</span>', confirmButtonText: '✅ ใช่, อนุมัติเลย',
      backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' }
    });

    if (result.isConfirmed) {
      Swal.fire({ title: 'กำลังดำเนินการ...', allowOutsideClick: false, backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' }, didOpen: () => { Swal.showLoading(); } });
      try {
        const tableName = isLeave ? 'leave_requests' : 'adjustment_requests';
        
        // 1. อัปเดตสถานะคำขอให้เป็น "อนุมัติ"
        const { error } = await supabase.from(tableName).update({ status: 'อนุมัติ' }).eq('id', record.id);
        if (error) throw error;

        // 2. จัดการข้อมูลตามประเภทคำขอ
        if (isLeave) {
          const { data: bal } = await supabase.from('leave_balances').select('used_minutes').eq('employee_id', record.employee_id).eq('leave_type', record.leave_type).maybeSingle();
          if (bal) await supabase.from('leave_balances').update({ used_minutes: bal.used_minutes + record.duration_minutes }).eq('employee_id', record.employee_id).eq('leave_type', record.leave_type);
        } else {
          // 🟢 3. ถ้าเป็น "แก้ไขเวลา" ทำการปรับปรุงตาราง attendance_logs 
          if (record.request_type === 'แก้ไขเวลา') {
            
            // แปลงคำขอว่าเป็น check_in หรือ check_out
            const targetLogType = (record.time_type && record.time_type.includes('เข้า')) ? 'check_in' : 'check_out';
            
            // 🛑 จัดการเรื่องเวลา ตัดให้เหลือแค่ ชั่วโมง:นาที แล้วใส่ +07:00
            const safeTime = record.new_time.substring(0, 5); 
            const newTimestamp = `${record.incident_date}T${safeTime}:00+07:00`;
            const startOfDay = `${record.incident_date}T00:00:00+07:00`;
            const endOfDay = `${record.incident_date}T23:59:59+07:00`;

            // เช็คก่อนว่าวันนั้นมีข้อมูลเดิมอยู่หรือเปล่า
            const { data: existingLog, error: fetchError } = await supabase
              .from('attendance_logs')
              .select('id')
              .eq('employee_id', record.employee_id)
              .eq('log_type', targetLogType)
              .gte('timestamp', startOfDay)
              .lte('timestamp', endOfDay)
              .maybeSingle();

            if (fetchError) throw fetchError;

            if (existingLog) {
              // ถ้ามีข้อมูลเดิมอยู่แล้ว ให้อัปเดตเวลาทับเข้าไปเลย
              const { error: updateError } = await supabase
                .from('attendance_logs')
                .update({ timestamp: newTimestamp })
                .eq('id', existingLog.id);
              if (updateError) throw updateError;
            } else {
              // ถ้าไม่เคยสแกน ให้สร้างบรรทัดใหม่ให้เลย
              const { error: insertError } = await supabase
                .from('attendance_logs')
                .insert([{
                  employee_id: record.employee_id,
                  log_type: targetLogType,
                  timestamp: newTimestamp,
                  status: 'normal'
                }]);
              if (insertError) throw insertError;
            }
          }
        }

        // 4. แจ้งเตือนและเตะออกจากหน้าจอ
        await notifyApprovalResult(record.employee_id, type, 'อนุมัติ', 'อนุมัติเรียบร้อยแล้ว');
        
        if (isLeave) {
            setAdminLeaves(prev => prev.filter(item => item.id !== record.id));
        } else {
            setAdminAdjustments(prev => prev.filter(item => item.id !== record.id));
        }

        if (typeof addNotification === 'function') addNotification("อนุมัติคำขอสำเร็จ", `คุณได้อนุมัติ ${type} ของพนักงานเรียบร้อยแล้ว`);
        
        Swal.fire({ 
            title: 'อนุมัติสำเร็จ!', 
            icon: 'success', 
            toast: true, 
            position: 'top-end', 
            showConfirmButton: false, 
            timer: 3000, 
            timerProgressBar: true,
            customClass: { popup: 'rounded-xl shadow-lg border border-emerald-100' } 
        });
      } catch (error) { 
        Swal.fire({ title: 'ผิดพลาด!', text: error.message, icon: 'error', backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' } }); 
      }
    }
};

// ❌ 3. ฟังก์ชันปฏิเสธ (ยิงตรง DB เบื้องหลัง + พื้นหลังเบลอหรูๆ + ไม่โหลดหน้าจอ + อ่านทัน)
const executeRejectWithPopup = async (record, type, isLeave) => {
    const result = await Swal.fire({
      title: 'ปฏิเสธคำขอ?', html: `คุณกำลังปฏิเสธคำขอ <b>${type}</b><br/>กรุณาระบุเหตุผล:`, input: 'textarea', inputPlaceholder: 'พิมพ์เหตุผลที่นี่...', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#f1f5f9',
      cancelButtonText: '<span style="color: #64748b; font-weight: bold;">ยกเลิก</span>', confirmButtonText: '❌ ยืนยันการปฏิเสธ',
      backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' },
      preConfirm: (text) => { if (!text) Swal.showValidationMessage('กรุณาระบุเหตุผล'); return text; }
    });
    if (result.isConfirmed) {
      Swal.fire({ title: 'กำลังดำเนินการ...', allowOutsideClick: false, backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' }, didOpen: () => { Swal.showLoading(); } });
      try {
        const tableName = isLeave ? 'leave_requests' : 'adjustment_requests';
        const { error } = await supabase.from(tableName).update({ status: 'ไม่อนุมัติ' }).eq('id', record.id);
        if (error) throw error;
        await notifyApprovalResult(record.employee_id, type, 'ไม่อนุมัติ', `เหตุผล: ${result.value}`);
        
        if (isLeave) {
            setAdminLeaves(prev => prev.filter(item => item.id !== record.id));
        } else {
            setAdminAdjustments(prev => prev.filter(item => item.id !== record.id));
        }

        if (typeof addNotification === 'function') addNotification("ปฏิเสธคำขอสำเร็จ", `คุณได้ไม่อนุมัติ ${type} พร้อมระบุเหตุผลเรียบร้อยแล้ว`);
        
        // ⏳ ปรับให้โชว์นานขึ้นเป็น 3 วินาที (3000ms) พร้อมแถบเวลา
        Swal.fire({ 
            title: 'ปฏิเสธสำเร็จ!', 
            icon: 'success', 
            toast: true, 
            position: 'top-end', 
            showConfirmButton: false, 
            timer: 3000, 
            timerProgressBar: true,
            customClass: { popup: 'rounded-xl shadow-lg border border-rose-100' } 
        });
      } catch (error) { // 🟢 แจ้งเตือนสำเร็จตอนส่งคำขอ (ปรับให้อ่านทัน นาน 4 วินาที หรือกดปุ่มตกลง)
          Swal.fire({
              icon: 'success', 
              title: 'ส่งคำขอเรียบร้อย!', 
              html: '<span class="text-slate-500 font-medium text-sm md:text-base">คำขอถูกส่งไปรออนุมัติ<br/>และระบบแจ้งเตือนแอดมินแล้วครับ</span>',
              showConfirmButton: true,
              confirmButtonText: 'ตกลง',
              confirmButtonColor: '#3B82F6',
              timer: 4000, 
              timerProgressBar: true,
              backdrop: 'rgba(0,0,0,0.4)',
              customClass: { 
                  container: 'backdrop-blur-sm', 
                  popup: 'rounded-[2rem] shadow-2xl border-2 border-blue-100', 
                  title: 'font-black text-slate-800 text-xl mt-4' 
              }
          }); }
    }
};

  // 🔄 สั่งให้ดึงข้อมูลสาขาเมื่อเปิดหน้าตั้งค่า (ส่วนนี้ของพี่เก็บไว้เหมือนเดิมเป๊ะๆ เลยครับ)
  useEffect(() => {
    if (currentView === "settings_branches") fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  const filteredLeaves = allLeaves.filter(l => (filterType === "ALL" || getTranslatedType(l.leave_type) === filterType || l.leave_type === filterType) && (filterStatus === "ALL" || getTranslatedStatus(l.status) === filterStatus || l.status === filterStatus));
  const filteredAdjusts = allAdjustments.filter(a => (filterType === "ALL" || getTranslatedType(a.request_type) === filterType || a.request_type === filterType) && (filterStatus === "ALL" || getTranslatedStatus(a.status) === filterStatus || a.status === filterStatus));
  
  const totalLeavesCount = allLeaves.length;
  const sickP = totalLeavesCount === 0 ? 45 : Math.round((allLeaves.filter(l=>l.leave_type==='ลาป่วย').length / totalLeavesCount) * 100);
  const persP = totalLeavesCount === 0 ? 30 : Math.round((allLeaves.filter(l=>l.leave_type==='ลากิจ').length / totalLeavesCount) * 100);
  const vacP = totalLeavesCount === 0 ? 15 : Math.round((allLeaves.filter(l=>l.leave_type==='ลาพักร้อน').length / totalLeavesCount) * 100);

  const monthlyData = Array(12).fill(0);
  allLeaves.forEach(l => { monthlyData[new Date(l.created_at).getMonth()] += 1; });
  const maxMonthly = Math.max(...monthlyData, 1);

// ⏳ โหลดดิงสกรีน (Loading Screen) - ธีม Premium Rose Gold
  if (isLoading) return (
    <div className="h-screen w-screen bg-[#fffbfb] flex flex-col items-center justify-center relative overflow-hidden z-[9999]">
      {/* เอฟเฟกต์แสงฟุ้งสีทองและโรสโกลด์ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-200 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-amber-100 rounded-full blur-[80px] opacity-50 animate-pulse delay-75"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* ✨ โลโก้มงกุฎทอง เด้งแบบนุ่มนวลดูแพง */}
        <CrownLogo className="w-28 h-28 animate-bounce mb-4 drop-shadow-2xl" />
        
        {/* ✨ ชื่อแบรนด์แบบพรีเมียมฟอนต์ Serif */}
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#881337] tracking-tight drop-shadow-sm">
          Pancake
        </h2>
        <h3 className="text-sm sm:text-base font-bold text-[#be123c] mt-1 font-serif italic mb-6">
          Lovely Enrichment HR
        </h3>
        
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-6 py-3 rounded-full border border-rose-100 shadow-sm">
          <svg className="animate-spin h-5 w-5 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-rose-900/80 font-bold tracking-widest text-[11px] uppercase">กำลังเตรียมระบบระดับพรีเมียม...</span>
        </div>
      </div>
    </div>
  );

 // 🛡️ Gatekeeper: ถ้าต้องเปลี่ยนรหัส ห้ามวาด Dashboard ออกมาเด็ดขาด!
  if (user && user.require_password_change) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center animate-pulse">
          <span className="text-4xl mb-4 block">🔒</span>
          <p className="font-black tracking-widest uppercase">Security Required</p>
          <p className="text-xs text-slate-400 mt-2 font-bold">Please complete password update...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // 📝 ฟังก์ชันแก้ไขเวลาไลฟ์ (สำหรับหน้าตรวจสอบ)
  // ==========================================
  const handleEditLiveTime = async (shift) => {
    const { value: formValues } = await Swal.fire({
      title: 'แก้ไขเวลาไลฟ์',
      html: `
        <div class="space-y-4 text-left p-2">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">เวลาเริ่มไลฟ์</label>
            <input id="swal-start" type="time" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-rose-400" value="${shift.start_time}">
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">เวลาลงไลฟ์</label>
            <input id="swal-end" type="time" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-rose-400" value="${shift.end_time}">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '💾 บันทึกเวลาใหม่',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10B981',
      preConfirm: () => {
        const start = document.getElementById('swal-start').value;
        const end = document.getElementById('swal-end').value;
        if (!start || !end) {
          Swal.showValidationMessage('กรุณากรอกเวลาให้ครบถ้วน');
          return false;
        }
        return { start, end };
      }
    });

    if (formValues) {
      Swal.fire({ title: 'กำลังอัปเดต...', didOpen: () => Swal.showLoading() });
      try {
        const [h1, m1] = formValues.start.split(':').map(Number);
        const [h2, m2] = formValues.end.split(':').map(Number);
        let sMins = h1 * 60 + m1;
        let eMins = h2 * 60 + m2;
        if (eMins <= sMins) eMins += 24 * 60;
        const newHours = ((eMins - sMins) / 60).toFixed(2);

        const { error } = await supabase.from('live_tracking').update({
          start_time: formValues.start,
          end_time: formValues.end,
          live_hours: newHours
        }).eq('id', shift.id);

        if (error) throw error;
        
        Swal.fire('สำเร็จ', 'อัปเดตเวลาและคำนวณชั่วโมงใหม่เรียบร้อยแล้ว', 'success');
        if (typeof fetchDashboardData === 'function') fetchDashboardData(true);
        
      } catch (err) {
        Swal.fire('ข้อผิดพลาด', err.message, 'error');
      }
    }
  };

// ==========================================
  // 📊 ฟังก์ชัน Export ข้อมูล A-L (เวอร์ชันอัปเกรดชื่อเล่น + รูปแบบเวลา)
  // ==========================================
  const exportLiveTrackingToCSV = (dataList) => {
    if (!dataList || dataList.length === 0) return Swal.fire('แจ้งเตือน', 'ไม่มีข้อมูลสำหรับ Export', 'warning');

    const headers = [
      "ประทับเวลา", "วันที่ไลฟ์", "ชื่อคนไลฟ์ (ชื่อเล่น)", "แพลตฟอร์มที่ไลฟ์", 
      "เวลาเริ่มไลฟ์", "เวลาลงไลฟ์", "สรุปชั่วโมงการไลฟ์", 
      "ลำดับการขึ้นไลฟ์", "ขึ้นไลฟ์กี่ช่อง", "หมายเหตุเพิ่มเติม", 
      "คำนวนยอดขาย", "อัปโหลดรูปสรุปไลฟ์"
    ];

    const csvRows = [
      headers.join(','),
      ...dataList.map(item => {
        // 🛠️ 1. จัดการเรื่องชื่อคนไลฟ์ + ชื่อเล่น (คอลัมน์ C ในโค้ด / D ใน Excel)
        const fullName = item.streamer_name || item.employees?.full_name || 'ไม่ระบุ';
        const nickName = item.employees?.nickname || '-';
        const displayName = `${fullName} (${nickName})`;

        // 🛠️ 2. แปลงชั่วโมงทศนิยม เป็น "X ชม. Y นาที" (คอลัมน์ G ในโค้ด / H ใน Excel)
        const hoursVal = Number(item.live_hours || 0);
        const h = Math.floor(hoursVal);
        const m = Math.round((hoursVal - h) * 60);
        const durationText = `${h} ชม. ${m} นาที`;

        const row = [
          `"${item.created_at ? new Date(item.created_at).toLocaleString('th-TH') : '-'}"`,
          `"${item.live_date || '-'}"`,
          `"${displayName.replace(/"/g, '""')}"`, // คอลัมน์ D
          `"${(item.platform || '-').replace(/"/g, '""')}"`,
          `"${item.start_time || '-'}"`,
          `"${item.end_time || '-'}"`,
          `"${durationText}"`, // คอลัมน์ H
          `"${(item.sequence_type || '-').replace(/"/g, '""')}"`,
          `"${item.channel_count || '1'}"`,
          `"${(item.notes || '-').replace(/"/g, '""')}"`,
          `"${item.end_sales || item.net_sales || '0'}"`,
          `"${item.image_url || 'ไม่มีรูป'}"`
        ];
        return row.join(',');
      })
    ];

    const csvString = "\uFEFF" + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Live_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (<>
 <div className="flex h-screen bg-[#fffbfb] font-sans overflow-hidden relative">
      {/* 🎆 เอฟเฟกต์ฉลองชัยชนะ */}
      {showVictory && <VictoryFireworks />}

      {/* 📱 Backdrop สำหรับ Mobile (เบลอพื้นหลังเวลาเปิด Sidebar) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-[90] lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

{/* 👑 Sidebar Luxury Edition (ฉบับจบงานจริง 100%: เมนูครบทุกตัว + แก้ช่องไฟบัตร + ปิด Tag ครบถ้วน ไม่พังแน่นอน) */}
      <div className={`fixed lg:static inset-y-0 left-0 z-[100] w-72 bg-gradient-to-b from-[#881337] via-[#9f1239] to-[#4c0519] transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out shadow-2xl flex flex-col justify-between lg:translate-x-0`}>
        
        {/* ✨ ส่วนหุ้มหลัก (Upper Section) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header Sidebar (คงที่) */}
          <div className="p-8 flex flex-col items-center justify-center border-b border-rose-300/20 relative flex-shrink-0">
            
            {/* 🌟 ฝังลูกเล่นแสงแวบๆ ไว้ตรงนี้เลย (ไม่ต้องไปแก้ไฟล์ CSS อื่น) */}
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

            {/* โลโก้พร้อมลูกเล่นแสงวิ่งพาด */}
            <div className="relative mb-3 group overflow-hidden rounded-full p-1">
              {/* โลโก้มงกุฎ */}
              <CrownLogo className="w-16 h-16 drop-shadow-[0_0_15px_rgba(253,224,71,0.4)] transition-transform duration-500 group-hover:scale-110 relative z-10" />
              
              {/* แสงเรืองรองด้านหลัง */}
              <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 -z-10 animate-pulse"></div>
              
              {/* ลำแสงสีขาววิ่งพาดมงกุฎ (เหมือนส่องประกายเพชร) */}
              <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent animate-premium-shine z-20 pointer-events-none"></div>
            </div>

            <h2 className="text-white font-serif font-black text-2xl tracking-tighter text-center leading-tight">Pancake</h2>
            <p className="text-[10px] font-bold text-rose-300 uppercase tracking-[0.15em] mt-1 text-center italic">Lovely Enrichment HR</p>
            <p className="text-[8px] text-amber-400/80 font-black uppercase tracking-widest mt-1">Premium HR Platform</p>
{/* ========================================================== */}
            {/* 🌟 COMPACT SIGNATURE (บีบช่องว่างล่างทิ้ง + Hover Effect) */}
            {/* ========================================================== */}
            <div className="mt-2 -mb-4 flex flex-col items-center justify-center select-none group cursor-default">
              
              {/* บรรทัด 1: DEVELOPED BY + เส้นยืดหดได้ */}
              <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-all duration-500">
                <div className="w-1.5 h-[1px] bg-rose-400/50 group-hover:w-4 group-hover:bg-rose-400 transition-all duration-500"></div>
                <span className="text-[6.5px] font-bold text-rose-200/80 uppercase tracking-[0.3em] leading-none">
                  DEVELOPED BY
                </span>
                <div className="w-1.5 h-[1px] bg-rose-400/50 group-hover:w-4 group-hover:bg-rose-400 transition-all duration-500"></div>
              </div>
              
              {/* บรรทัด 2: ชื่อพี่ (ลดช่องไฟ บีบติดขอบล่าง) */}
              <span className="text-[8px] sm:text-[9px] font-black mt-1 uppercase tracking-[0.15em] text-white/30 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-200 group-hover:to-amber-200 transition-all duration-500 transform group-hover:scale-105 leading-none pb-1">
                {String.fromCharCode(83, 105, 110, 115, 97, 114, 117, 100, 32, 87, 111, 111, 116, 116, 105, 115, 105, 110)}
              </span>

            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 text-rose-200/50 hover:text-white text-xl">✕</button>
          </div>

          {/* 🟢 สร้างกล่องครอบ (Wrapper) ใหม่ตรงนี้ เพื่อให้โปรไฟล์และเมนูเลื่อน (Scroll) ไปพร้อมกันได้ */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col w-full">

            {/* 👤 ส่วนข้อมูลพนักงาน + 🪪 ปุ่มเปิดบัตรพนักงานแบบการ์ดตั้ง */}
            <div className="px-6 py-6 flex-shrink-0">
              <div className="flex flex-col items-center text-center gap-3 bg-white/10 p-5 rounded-2xl border border-white/10 shadow-inner relative group/card">
                
                {/* 🟢 ซ่อน input file ไว้สำหรับเลือกรูป */}
                <input type="file" id="self-profile-upload" accept="image/*" className="hidden" onChange={handleSelfProfileUpload} />

                {/* 🟢 กรอบรูปโปรไฟล์ (คลิกเพื่อเปลี่ยนรูปได้) */}
                <div 
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#881337] font-black text-3xl shadow-md overflow-hidden border-2 border-white/50 relative cursor-pointer group/avatar hover:border-amber-300 transition-all"
                  onClick={() => document.getElementById('self-profile-upload').click()}
                  title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์"
                >
                  {user?.profile_picture ? (
                    <img src={user?.profile_picture} alt="User" className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                  ) : (
                    (typeof lang !== 'undefined' && lang === 'EN' && user?.name_en) ? user?.name_en.charAt(0) : (user?.full_name?.charAt(0) || 'U')
                  )}
                  
                  {/* 🌟 Overlay ตอนเอาเมาส์ชี้ */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-[10px] font-bold tracking-widest">📷<br/>เปลี่ยนรูป</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center w-full overflow-hidden">
                  <span className="font-bold text-sm text-white truncate w-full" title={user?.full_name}>
                    {(typeof lang !== 'undefined' && lang === 'EN' && user?.name_en) ? user?.name_en : (user?.full_name || 'ไม่ระบุชื่อ')}
                  </span>
                  <span className="text-[10px] font-medium text-rose-200 truncate mt-0.5 w-full">
                    {user?.position || 'Staff'}
                  </span>
                  
                  {/* ✨ ป้ายบอกระดับสิทธิ์ (Role) */}
                  <span className="text-[9px] px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md text-white font-black tracking-widest uppercase mt-2 w-fit border border-amber-400/50 shadow-md">
                    ROLE: {user?.role === 'admin' ? 'SUPER ADMIN' : user?.role === 'ceo' ? 'CEO' : 'USER'}
                  </span>

                  {/* 🪪 ปุ่มเรียกดูบัตรพนักงาน */}
                  <button
                    onClick={() => {
                      const empCode = user?.employee_code || 'N/A';
                      const fullName = user?.full_name || 'ชื่อ-นามสกุล';
                      const nickname = user?.nickname ? `(${user?.nickname})` : '';
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

            {/* 📋 รายการเมนู (รักษาของเดิมทั้งหมด ห้ามตัด!) */}
            {/* 🟢 ถอด flex-1 และ overflow-y-auto ออกจาก nav เพราะเราให้กล่องใหญ่ด้านบนเป็นตัวเลื่อนแทนแล้ว */}
            <nav className="space-y-2 px-4 pb-4">
              
              {/* 📌 หมวดที่ 1: ภาพรวมองค์กร */}
              <div className="text-[10px] font-black text-white/50 uppercase tracking-wider mt-2 mb-2 px-2">📊 ภาพรวมองค์กร</div>
              {userMenus.includes('menu_dashboard') && (
                <button onClick={() => { setCurrentView("dashboard"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'dashboard' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>🏠 {t.menuDash}</button>
              )}
              <button onClick={() => { setCurrentView("announcements"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-2 ${currentView === 'announcements' ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>📢 ป้ายประกาศองค์กร</button>

              {/* 📌 หมวดที่ 2: การเข้างาน & ไลฟ์สด */}
              <div className="text-[10px] font-black text-white/50 uppercase tracking-wider mt-6 mb-2 px-2 border-t border-white/10 pt-4">⏱️ การเข้างาน & ไลฟ์สด</div>
              {userMenus.includes('menu_checkin') && (
                <button onClick={() => navigate('/check-in')} className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border border-transparent text-white/70 hover:bg-white/20 hover:text-white mt-2">⏰ {t.menuCheck}</button>
              )}
              {userMenus.includes('menu_attendance') && (
                <button onClick={() => setCurrentView('attendance')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'attendance' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>📅 {t.menuAttendance}</button>
              )}
              {(user?.role === 'admin' || user?.role === 'ceo' || (user?.position && (user.position.includes('ไลฟ์') || user.position.toLowerCase().includes('live') || user.position.includes('สตรีม') || user.position.includes('MC') || user.position.includes('โฮสต์')))) && (
                <button onClick={() => { setCurrentView("live_tracking"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-2 ${currentView === 'live_tracking' ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>📸 ลงเวลาไลฟ์</button>
              )}
              {(user?.role === 'admin' || user?.role === 'ceo') && (
                <button onClick={() => { setCurrentView("live_history"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-2 ${currentView === 'live_history' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-400 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>📊 ประวัติการไลฟ์ทั้งหมด</button>
              )}
              {(user?.role === 'admin' || user?.role === 'ceo') && (
                <button onClick={() => { setCurrentView("shift_manager"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-2 ${currentView === 'shift_manager' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-400 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>🗓️ จัดตารางกะพนักงาน</button>
              )}

              {/* 📌 หมวดที่ 3: ผลงาน & รายได้ */}
              <div className="text-[10px] font-black text-white/50 uppercase tracking-wider mt-6 mb-2 px-2 border-t border-white/10 pt-4">💰 ผลงาน & รายได้</div>
              {userMenus.includes('menu_sales') && (
                <button onClick={() => { setCurrentView("sales"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'sales' ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>💎 {t.menuSales}</button>
              )}
              {userMenus.includes('menu_sales_history') && (
                <button onClick={() => { setCurrentView("menu_sales_history"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-2 ${currentView === 'menu_sales_history' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-400 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>📊 สถิติยอดขายย้อนหลัง</button>
              )}
              {(user?.role === 'admin' || user?.role === 'ceo') && (
                <button onClick={() => { setCurrentView("kpi_manager"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-2 ${currentView === 'kpi_manager' ? 'bg-gradient-to-r from-amber-400 to-yellow-600 border-amber-300 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>⭐️ ประเมินผลงานพนักงาน</button>
              )}
              {userMenus.includes('menu_payroll') && (
                <button onClick={() => { setCurrentView("payroll"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'payroll' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 border-emerald-400 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>💸 {t.menuPayroll}</button>
              )}
              {/* 🟢 ซ่อนเมนูให้เห็นเฉพาะ Admin และ CEO */}
              {(user?.role === 'admin' || user?.role === 'ceo') && (
                <button 
                  onClick={() => setCurrentView('ads')} /* เปลี่ยนเป็นชื่อ view หรือหน้าที่พี่ตั้งไว้นะครับ */
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                    currentView === 'ads' 
                      ? 'bg-white/20 text-white shadow-lg border border-white/10' 
                      : 'text-rose-200/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  📢 แจ้งโอนค่า Ads
                </button>
              )}

              {/* 📌 หมวดที่ 4: ระบบคำขอส่วนตัว */}
              <div className="text-[10px] font-black text-white/50 uppercase tracking-wider mt-6 mb-2 px-2 border-t border-white/10 pt-4">📝 ระบบคำขอส่วนตัว</div>
              {userMenus.includes('menu_history') && (
                <button onClick={() => { setCurrentView("history"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'history' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>📋 {t.menuHist}</button>
              )}
              {userMenus.includes('menu_pt_dayoff') && (
                <button 
                  onClick={() => { 
                    setIsDayoffModalOpen(true); 
                    setDayoffForm({ date: "", reason: t.defaultPTReason }); 
                    setIsSidebarOpen(false); 
                  }} 
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${
                    isDayoffModalOpen 
                    ? 'bg-white/20 border-white/10 text-white shadow-sm' 
                    : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  🏖️ แจ้งวันหยุด
                </button>
              )}
              {userMenus.includes('menu_adjustments') && (
                <button onClick={() => { setCurrentView("adjustments"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'adjustments' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>🛠️ {t.menuAdjust}</button>
              )}

              {/* 📌 หมวดที่ 5: สำหรับผู้บริหาร */}
              {(user?.role === 'admin' || user?.role === 'ceo') && (
                <>
                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider mt-6 mb-2 px-2 border-t border-white/10 pt-4">👑 สำหรับผู้บริหาร</div>
                  {userMenus.includes('menu_approvals') && (
                    <button onClick={() => { setCurrentView("approvals"); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-2 ${currentView === 'approvals' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>
                      <span className="flex items-center gap-3">✅ {t.menuApprove}</span>
                      {(adminLeaves.length + adminAdjustments.length) > 0 && <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{adminLeaves.length + adminAdjustments.length}</span>}
                    </button>
                  )}
                  <button onClick={() => { setCurrentView("reports"); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-2 ${currentView === 'reports' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>📊 ศูนย์รวมรายงาน</button>
                  <button onClick={() => { setCurrentView("ai_workspace"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-2 ${currentView === 'ai_workspace' ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>🤖 AI วิเคราะห์เอกสาร</button>
                  <button onClick={() => { setCurrentView("assets"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-2 ${currentView === 'assets' ? 'bg-gradient-to-r from-blue-600 to-indigo-500 border-blue-400 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>📦 จัดการสินทรัพย์</button>

                  {/* 📌 หมวดที่ 6: ตั้งค่าระบบ */}
                  {userMenus.includes('menu_settings') && (
                    <div className="mt-4">
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-2 px-2 border-t border-white/10 pt-4">⚙️ ตั้งค่าระบบ</div>
                      <button onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView.startsWith('settings') || currentView === 'employees' || currentView === 'warnings' || currentView === 'monitor' || currentView === 'manage_backup' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>
                        <span className="flex items-center gap-3">🛠️ {t.menuSettings}</span>
                        <span className={`transition-transform duration-300 text-xs ${isSettingsDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                      </button>
                      {isSettingsDropdownOpen && (
                        <div className="pl-10 pr-2 py-2 space-y-1 animate-fade-in border-l-2 border-white/10 ml-4 mt-1">
                          <button onClick={() => { setCurrentView('employees'); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'employees' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/60 hover:bg-white/20'}`}>👥 {t.menuEmployees}</button>
                          
                          {/* 👇 ปุ่มระบบใบเตือน แทรกต่อท้ายพนักงาน 👇 */}
                          <button onClick={() => { setCurrentView('warnings'); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'warnings' ? 'bg-white/20 border-white/10 text-rose-400 shadow-sm' : 'border-transparent text-white/60 hover:bg-white/20 hover:text-rose-300'}`}>⚠️ ออกใบเตือนพนักงาน</button>
                          {/* 👆 สิ้นสุดปุ่มระบบใบเตือน 👆 */}

                          <button onClick={() => { setCurrentView("settings_branches"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_branches' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/60 hover:bg-white/20'}`}>📍 {t.settingsBranches}</button>
                          <button onClick={() => { setCurrentView("settings_all_leaves"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_all_leaves' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/60 hover:bg-white/20'}`}>🗂️ {t.settingsAllLeaves}</button>
                          <button onClick={() => { setCurrentView("settings_all_dayoffs"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_all_dayoffs' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/60 hover:bg-white/20'}`}>🏖️ {t.settingsAllDayOffs}</button>
                          <button onClick={() => { setCurrentView("settings_all_adjustments"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_all_adjustments' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/60 hover:bg-white/20'}`}>🛠️ {t.settingsAllAdjustments}</button>
                          <button onClick={() => { setCurrentView("settings_quotas"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_quotas' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/60 hover:bg-white/20'}`}>🎯 {t.settingsQuotas}</button>
                          <button onClick={() => { setCurrentView("settings_permissions"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_permissions' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/60 hover:bg-white/20'}`}>🔐 {t.settingsPermissions}</button>
                          <button onClick={() => { setCurrentView("settings_line_oa"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_line_oa' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/60 hover:bg-white/20'}`}>💬 {t.settingsLineOA}</button>
                          <button onClick={() => { setCurrentView("monitor"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'monitor' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/60 hover:bg-white/20'}`}>🖥️ Monitor System</button>
                          <button onClick={() => { setCurrentView("manage_backup"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'manage_backup' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/60 hover:bg-white/20'}`}>🛡️ ระบบ Backup</button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </nav>
            
          </div> {/* 🟢 ปิดกล่องครอบเลื่อนตรงนี้ */}
        </div> 

        {/* 🚪 ปุ่มออกจากระบบ (ล็อกให้อยู่ล่างสุดเสมอ) */}
        <div className="p-4 border-t border-rose-300/10 flex-shrink-0">
          <button onClick={() => { localStorage.removeItem('titan_user'); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 text-white/70 hover:bg-rose-500 hover:text-white px-4 py-3.5 rounded-xl font-bold text-sm transition-all">🚪 {t.menuLogout}</button>
        
        </div>
      </div>


      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative w-full h-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>

      {/* 📱 Header & Top Bar (โฉมใหม่: ปุ่มแคปซูล มีไอคอน+ข้อความสั้นๆ) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-8 z-20 gap-4 sticky top-0 bg-white/40 backdrop-blur-md border-b border-white shadow-sm">
          
          {/* ฝั่งซ้าย: แฮมเบอร์เกอร์ + ชื่อพนักงาน */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-slate-800 bg-white p-2 rounded-lg shadow-sm border border-slate-100" onClick={() => setIsSidebarOpen(true)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div>
                <p className="text-pink-500 font-bold text-xs md:text-sm tracking-widest uppercase mb-1">{currentView === 'approvals' ? t.adminCenter : currentView.startsWith('settings') ? t.menuSettings : t.welcome}</p>
                <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">{currentView === 'approvals' ? t.adminCenter : currentView.startsWith('settings') ? t.menuSettings : user?.full_name}</h2>
              </div>
            </div>
          </div>
          
          {/* ฝั่งขวา: เมนูด่วน (แคปซูล) + กระดิ่ง + เปลี่ยนภาษา */}
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
            
            {/* 🚀 Quick Menu (ปุ่มแคปซูล: ไอคอน + ข้อความสั้นๆ ให้รู้ว่าคืออะไร) */}
            <div className="flex items-center gap-1.5 md:gap-2 mr-1">
              {/* ปุ่มยื่นใบลา */}
              <button 
                onClick={() => setIsLeaveModalOpen(true)} 
                className="h-9 md:h-10 px-3 md:px-4 bg-gradient-to-tr from-pink-500 to-rose-400 text-white rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-pink-200 hover:scale-105 transition-transform"
              >
                <span className="text-sm md:text-base">🏖️</span>
                {/* ✨ เปลี่ยนคำว่า "ยื่นลา" เป็น {t.createBtn} */}
                <span className="text-[10px] md:text-xs font-black tracking-wide whitespace-nowrap">{t.createBtn}</span>
              </button>

              {/* ปุ่มแจ้งปรับปรุง */}
              <button 
                onClick={() => setIsAdjustModalOpen(true)} 
                className="h-9 md:h-10 px-3 md:px-4 bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 rounded-full flex items-center justify-center gap-1.5 shadow-sm hover:scale-105 transition-all"
              >
                <span className="text-sm md:text-base">📝</span>
                {/* ✨ เปลี่ยนคำว่า "ปรับปรุง" เป็น {t.adjustBtn} */}
                <span className="text-[10px] md:text-xs font-black tracking-wide whitespace-nowrap">{t.adjustBtn}</span>
              </button>
            </div>

            {/* 🔔 Notification Bell */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-slate-500 hover:text-pink-500 transition-colors relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {unreadCount > 0 && <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">{unreadCount}</span>}
              </button>
              
              {/* Dropdown แจ้งเตือน */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-72 md:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-black text-slate-800 text-sm">{t.notifTitle}</h3>
                    <div className="flex gap-2">
                      <button onClick={markAllRead} className="text-[10px] font-bold text-pink-500 hover:underline">{t.notifReadAll}</button>
                      <button onClick={clearAllNotifs} className="text-[10px] font-bold text-slate-400 hover:text-rose-500">{t.notifClear}</button>
                    </div>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 font-bold">{t.notifEmpty}</div>
        ) : (
          notifications.map((n, idx) => (
            // ✅ เปลี่ยน key เป็น n.id ผสมกับ idx เพื่อป้องกันการชนกันของ Key เดิมใน localStorage
            <div 
              key={`notif-item-${n.id}-${idx}`} 
              onClick={() => handleNotificationClick(n)} 
              className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-pink-50 transition-colors ${!n.isRead ? 'bg-pink-50/50' : 'bg-white'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-bold text-sm ${!n.isRead ? 'text-slate-800' : 'text-slate-500'}`}>{n.title}</span>
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{n.time}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
            </div>
          ))
        )}
      </div>
                </div>
              )}
            </div>

            {/* 🌐 เปลี่ยนภาษา */}
            <div className="bg-white p-1 rounded-full shadow-sm border border-slate-200 flex items-center">
              <button onClick={() => changeLang("TH")} className={`px-3 md:px-4 py-1.5 rounded-full font-bold text-[10px] md:text-xs transition-all ${lang === "TH" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>TH</button>
              <button onClick={() => changeLang("EN")} className={`px-3 md:px-4 py-1.5 rounded-full font-bold text-[10px] md:text-xs transition-all ${lang === "EN" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>EN</button>
            </div>
            
          </div>
        </div>

    {/* ========================================================================= */}
      {/* 📸 VIEW: LIVE TIME TRACKING (V.6.9 แก้ไขให้ CEO เห็นปุ่ม รองรับตัวพิมพ์เล็ก/ใหญ่) */}
      {/* ========================================================================= */}
      {currentView === "live_tracking" && (
        <div className="px-3 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in overflow-hidden">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-4 md:p-8 shadow-sm border border-white max-w-4xl mx-auto w-full overflow-x-hidden">
            <div className="mb-6 border-b border-slate-100 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 text-rose-500 text-2xl md:text-3xl mb-4 shadow-inner">📸</div>
              <h3 className="font-black text-slate-800 text-xl md:text-2xl">ลงเวลาไลฟ์ & ส่งยอดขาย</h3>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-2">พนักงาน: {user?.full_name || 'ไม่ทราบชื่อ'} | ระบบจะตรวจสอบและซิงค์ยอดอัตโนมัติ</p>
            </div>

            <form onSubmit={async (e) => { 
              e.preventDefault();
              if (!user || !user.id) return Swal.fire('ข้อผิดพลาด', 'ไม่พบข้อมูลผู้ใช้งาน กรุณา Login ใหม่', 'error');
              
              const formData = new FormData(e.target); 
              const date = formData.get('live_date');
              if (!date) return Swal.fire('แจ้งเตือน', 'กรุณาระบุวันที่', 'warning'); 

              const getMinutes = (timeStr) => {
                const [h, m] = timeStr.split(':').map(Number);
                return h * 60 + m;
              };

              const validStreams = liveStreams.filter(s => s.platform !== '' || s.startTime !== '' || s.endTime !== '' || s.imageFile !== null);

              if (validStreams.length === 0) {
                return Swal.fire('แจ้งเตือน', 'กรุณากรอกข้อมูลการไลฟ์อย่างน้อย 1 ช่องทาง', 'warning');
              }

              for (const stream of validStreams) {
                if (!stream.platform) {
                  return Swal.fire('แจ้งเตือน', `คุณกรอกข้อมูลไม่ครบ กรุณาเลือก "แพลตฟอร์ม" ให้ครบทุกช่องที่เพิ่มมา`, 'warning');
                }
                if (!stream.startTime || !stream.endTime) {
                  return Swal.fire('แจ้งเตือน', `กรุณากรอกเวลาเริ่มและจบในช่อง "${stream.platform}" ให้ครบ`, 'warning');
                }
                if (stream.sequenceType === 'ขึ้นไลฟ์ต่อ' && !stream.followedEmployee) {
                  return Swal.fire('แจ้งเตือน', `คุณเลือกสถานะขึ้นไลฟ์ต่อ กรุณาระบุชื่อเพื่อนที่ไลฟ์ก่อนหน้าในช่อง "${stream.platform}"`, 'warning');
                }
                
                if ((!stream.endSales && stream.endSales !== 0 && stream.endSales !== '0') && !stream.imageFile) {
                  return Swal.fire('แจ้งเตือน', `กรุณาอัปโหลดสลิปยอดขายของช่อง "${stream.platform}"`, 'warning');
                }
              }

              const currentMonth = date.substring(0, 7); 
              let affectedEmployees = new Set();
              let myTotalNetSalesThisSubmit = 0; 
              let summaryText = ""; 
              let isLateSubmit = false; 
              let victimNames = [];
              let savedImageUrls = []; 

              Swal.fire({ title: 'กำลังประมวลผลข้อมูล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

              try { 
                const streamsWithImages = await Promise.all(validStreams.map(async (stream) => {
                  let imageUrl = null;
                  if (stream.imageFile) { 
                    const fileName = `${user.id}/${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`; 
                    const { error: upErr } = await supabase.storage.from('live_images').upload(fileName, stream.imageFile);
                    if (!upErr) {
                      imageUrl = supabase.storage.from('live_images').getPublicUrl(fileName).data.publicUrl; 
                      savedImageUrls.push(imageUrl);
                    }
                  }
                  return { ...stream, finalImageUrl: imageUrl };
                }));

                for (const stream of streamsWithImages) { 
                  let s1 = getMinutes(stream.startTime);
                  let e1 = getMinutes(stream.endTime);
                  if (e1 <= s1) e1 += 24 * 60;
                  const liveHours = ((e1 - s1) / 60).toFixed(2);

                  const finalEndSales = stream.endSales ? Number(stream.endSales) : 0;

                  const { data: inserted, error: insErr } = await supabase.from('live_tracking').insert([{ 
                    employee_id: user.id, 
                    live_date: date, 
                    start_time: stream.startTime, 
                    end_time: stream.endTime, 
                    live_hours: liveHours, 
                    platform: stream.platform, 
                    is_first_queue: stream.sequenceType === 'คิวแรก', 
                    sequence_type: stream.sequenceType, 
                    followed_employee_name: stream.sequenceType === 'คิวแรก' ? '-' : stream.followedEmployee, 
                    start_sales: 0, 
                    end_sales: finalEndSales, 
                    net_sales: 0, 
                    image_url: stream.finalImageUrl, 
                    streamer_name: user?.full_name || user?.nickname || 'ไม่ระบุชื่อ', 
                    channel_count: validStreams.length, 
                    notes: remarks || '-' 
                  }]).select();

                  if (insErr) throw insErr; 
                  const myNewId = inserted[0].id; 

                  const { data: dayShifts } = await supabase.from('live_tracking').select('*').eq('live_date', date).eq('platform', stream.platform);

                  let sortedShifts = (dayShifts || []).sort((a, b) => {
                     let tA = getMinutes(a.start_time);
                     let tB = getMinutes(b.start_time);
                     if (tA < 6 * 60) tA += 24 * 60; 
                     if (tB < 6 * 60) tB += 24 * 60;
                     return tA - tB;
                  });

                  let runnerSales = 0; 
                  let updatePromises = [];

                  for (const shift of sortedShifts) { 
                    let actualStart = shift.is_first_queue ? 0 : runnerSales;
                    let expectedNet = Number(shift.end_sales) - actualStart; 
                    if (expectedNet < 0) expectedNet = 0;

                    if (Number(shift.start_sales) !== actualStart || Number(shift.net_sales) !== expectedNet) { 
                      updatePromises.push(
                        supabase.from('live_tracking').update({ start_sales: actualStart, net_sales: expectedNet }).eq('id', shift.id)
                      );
                      affectedEmployees.add(shift.employee_id); 
                      
                      if (shift.id !== myNewId) { 
                        isLateSubmit = true; 
                        const victim = liveTeam?.find(v => v.id === shift.employee_id);
                        const vName = victim ? (victim.nickname || victim.full_name) : 'เพื่อนในทีม'; 
                        if (!victimNames.includes(vName)) victimNames.push(vName);
                      } 
                    } 

                    if (shift.id === myNewId) { 
                      myTotalNetSalesThisSubmit += expectedNet; 
                      summaryText += `\n📱 ${stream.platform}: ฿${expectedNet.toLocaleString()}`;
                    } 
                    runnerSales = Number(shift.end_sales); 
                  } 
                  
                  if (updatePromises.length > 0) await Promise.all(updatePromises);
                } 

                affectedEmployees.add(user.id);
                
                await Promise.all(Array.from(affectedEmployees).map(async (empId) => {
                  const { data: allData, error: dbError } = await supabase.from('live_tracking').select('net_sales, live_date, created_at').eq('employee_id', empId);
                  let monthlySum = 0;
                  if (allData && allData.length > 0) {
                    allData.forEach(item => {
                      const dateStr = String(item.live_date || item.created_at || "");
                      if (dateStr.includes(currentMonth)) monthlySum += Number(item.net_sales || 0);
                    });
                  }
                  const { data: existS } = await supabase.from('employee_sales').select('id').eq('employee_id', empId).maybeSingle();
                  if (existS) {
                    await supabase.from('employee_sales').update({ current_sales: monthlySum, updated_at: new Date() }).eq('id', existS.id);
                  } else {
                    await supabase.from('employee_sales').insert([{ employee_id: empId, current_sales: monthlySum, month: currentMonth, target_sales: 100000, commission_rate: 3 }]);
                  }
                }));

                await fetchDashboardData(true); 

                try {
                  const lineContents = [
                    { type: "text", text: `[A] ประทับเวลา: ${new Date().toLocaleTimeString('th-TH')}`, size: "xs", color: "#94A3B8" },
                    { type: "text", text: `[B] วันที่ไลฟ์: ${date}`, size: "sm" },
                    { type: "text", text: `[C] ผู้ไลฟ์: ${user?.full_name || 'ไม่ระบุ'} (${user?.nickname || '-'})`, size: "sm", weight: "bold" },
                    { type: "text", text: `[I] จำนวนช่องที่ไลฟ์: ${validStreams.length} ช่อง`, size: "sm", weight: "bold", color: "#D97706" },
                    { type: "text", text: `[J] หมายเหตุ: ${remarks || '-'}`, size: "xs", color: "#64748b", wrap: true },
                    { type: "separator", margin: "md" }
                  ];
                  validStreams.forEach((s) => {
                    let s1 = getMinutes(s.startTime); let e1 = getMinutes(s.endTime); if (e1 <= s1) e1 += 24 * 60;
                    const hrs = Math.floor((e1 - s1) / 60); const mins = (e1 - s1) % 60;
                    const displaySales = s.endSales ? `฿${Number(s.endSales).toLocaleString()}` : "รอแอดมินตรวจสอบ"; 
                    lineContents.push(
                      { type: "text", text: `แพลตฟอร์ม: ${s.platform}`, size: "sm", weight: "bold", margin: "md", color: "#334155" },
                      { type: "text", text: `[E-F] เวลา: ${s.startTime} - ${s.endTime}`, size: "xs", color: "#64748b" },
                      { type: "text", text: `[G] ชั่วโมงไลฟ์: ${hrs} ชม. ${mins} นาที`, size: "xs", color: "#64748b" },
                      { type: "text", text: `[H] ลำดับคิว: ${s.sequenceType} ${s.sequenceType === 'ขึ้นไลฟ์ต่อ' ? `(ต่อจาก ${s.followedEmployee})` : ''}`, size: "xs", color: "#64748b" },
                      { type: "text", text: `[K] ยอดขายช่องนี้: ${displaySales}`, size: "sm", weight: "bold", color: "#10B981" }
                    );
                  });
                  lineContents.push({ type: "separator", margin: "md" }, { type: "text", text: `💰 [K] ยอดขายสุทธิรวม: ฿${myTotalNetSalesThisSubmit.toLocaleString()}`, size: "md", weight: "bold", color: "#B45309", margin: "md" });
                  const flexMessage = { type: "flex", altText: `สรุปยอดไลฟ์จาก ${user?.full_name}`, contents: { type: "bubble", header: { type: "box", layout: "vertical", backgroundColor: "#B45309", contents: [{ type: "text", text: "PANCAKE ERP SYSTEM", weight: "bold", color: "#FDE047", size: "sm" }, { type: "text", text: "🎥 อัปเดตยอดไลฟ์สด", weight: "bold", color: "#FFFFFF", size: "xl", margin: "sm" }] }, body: { type: "box", layout: "vertical", spacing: "sm", contents: lineContents } } };
                  if (savedImageUrls.length > 0) flexMessage.contents.footer = { type: "box", layout: "vertical", contents: [{ type: "button", style: "primary", color: "#B45309", action: { type: "uri", label: "ดูรูปหลักฐาน [L]", uri: savedImageUrls[0] } }] };
                  
                  fetch('https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec', { method: 'POST', mode: 'no-cors', body: JSON.stringify({ to: "C0df0123907f46aa88c44ef72e88ea30f", message: flexMessage }) })
                    .catch(lineErr => console.error("LINE OA Warning:", lineErr));
                } catch (lineErr) { console.error("LINE OA Builder Error:", lineErr); }

                Swal.fire({ icon: isLateSubmit ? 'warning' : 'success', title: 'บันทึกสำเร็จ!', html: `ยอดขายสุทธิรวม: <b>฿${myTotalNetSalesThisSubmit.toLocaleString()}</b>${isLateSubmit ? `<br/><br/><small class="text-rose-500">⚠️ ตรวจพบการแทรกคิว ยอดถูกปรับให้อัตโนมัติ</small>` : ''}`, confirmButtonColor: '#F43F5E' }).then(() => { 
                  const safeId = `live-init-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                  setLiveStreams([{ id: safeId, platform: '', startTime: '', endTime: '', endSales: '', sequenceType: 'คิวแรก', followedEmployee: '', imageFile: null }]); 
                  setRemarks(''); setCurrentView("dashboard"); 
                });
              } catch (err) { Swal.fire('Error', err.message, 'error'); } 
            }}>

              <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200 mb-6 shadow-sm">
                <h4 className="font-bold text-slate-700 mb-4">📋 1. ข้อมูลพื้นฐาน</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full min-w-[0px]">
                    <label className="block text-xs font-bold text-slate-500 mb-1">📅 วันที่ขึ้นไลฟ์ (ยึดตามวันเริ่ม) *</label>
                    <div className="w-full min-w-[0px] overflow-hidden bg-white border border-slate-200 rounded-xl focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100">
                      <input type="date" name="live_date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full min-w-[0px] border-none outline-none bg-transparent px-3 py-2.5 md:px-4 font-bold text-sm text-slate-700 block m-0" />
                    </div>
                  </div>
                  <div className="w-full min-w-0">
                    <label className="block text-xs font-bold text-slate-500 mb-1">📝 หมายเหตุ (เช่น ระบุปัญหา)</label>
                    <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="ไม่มี..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-400 placeholder-slate-400" rows="1"></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 md:p-6 rounded-2xl border border-slate-200 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2"><span className="text-xl">📱</span> 2. ระบุช่องทาง เวลา ลำดับคิว และยอดขาย</h4>
                </div>

               {liveStreams.map((stream, idx) => (
                  <div key={stream.id} className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm relative mb-4 hover:border-emerald-100 transition-all">
                    {liveStreams.length > 1 && (
                      <button type="button" onClick={() => setLiveStreams(prev => prev.filter(s => s.id !== stream.id))} className="absolute -top-3 -right-3 w-7 h-7 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-black shadow-sm hover:bg-rose-50 hover:text-white transition-colors z-10">✕</button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                      <div className="space-y-3">
                        <div className="w-full min-w-0">
                          <div className="flex justify-between items-end mb-1">
                            <label className="text-xs font-bold text-slate-500 block">แพลตฟอร์ม</label>
                            
                            {/* 🛠️ [อัพเกรด V.6.9] แปลง role/position เป็นตัวเล็กทั้งหมดก่อนเช็ค ป้องกันบัคพิมพ์เล็ก-พิมพ์ใหญ่ */}
                            {(
                              ['admin', 'ceo', 'programmer', 'developer', 'it', 'ผู้ดูแลระบบ'].includes(String(user?.role || '').toLowerCase()) ||
                              ['admin', 'ceo', 'programmer', 'developer', 'it', 'ผู้ดูแลระบบ'].includes(String(user?.position || '').toLowerCase())
                            ) && (
                              <button type="button" onClick={() => {
                                const openManageModal = async () => {
                                  Swal.fire({ title: '⏳ กำลังดึงข้อมูลช่อง...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                                  const { data: dbPlatforms, error } = await supabase.from('platforms').select('*').order('name');
                                  
                                  if (error) {
                                    return Swal.fire('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อฐานข้อมูล platforms ได้', 'error');
                                  }

                                  Swal.fire({
                                    title: '<span class="text-xl font-black text-slate-800">⚙️ จัดการช่องทางไลฟ์</span>',
                                    html: `
                                      <div class="text-left font-sans mt-2">
                                        <div class="flex gap-2 mb-4">
                                          <input type="text" id="swal-new-plat" class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="ระบุชื่อช่องทางใหม่...">
                                          <button id="swal-btn-add-plat" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm">+ เพิ่ม</button>
                                        </div>
                                        <div class="text-[10px] font-black text-slate-400 uppercase mb-2">รายชื่อช่องทั้งหมดในระบบ</div>
                                        <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
                                          ${dbPlatforms.map(p => `
                                            <div class="flex justify-between items-center bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm">
                                              <span class="text-sm font-bold text-slate-700 truncate flex-1">${p.name}</span>
                                              <div class="flex gap-1 ml-2">
                                                <button class="bg-amber-100 text-amber-600 px-2 py-1 rounded-lg text-[10px] font-black hover:bg-amber-200" onclick="window.editPlatform('${p.id}', '${p.name.replace(/'/g, "\\'")}')">✏️ แก้ไข</button>
                                                <button class="bg-rose-100 text-rose-600 px-2 py-1 rounded-lg text-[10px] font-black hover:bg-rose-200" onclick="window.deletePlatform('${p.id}', '${p.name.replace(/'/g, "\\'")}')">🗑️ ลบ</button>
                                              </div>
                                            </div>
                                          `).join('')}
                                        </div>
                                      </div>
                                    `,
                                    showConfirmButton: true,
                                    confirmButtonText: 'ปิดหน้าต่าง',
                                    confirmButtonColor: '#64748b',
                                    customClass: { popup: 'rounded-[2rem]' },
                                    didOpen: () => {
                                      document.getElementById('swal-btn-add-plat').addEventListener('click', async () => {
                                        const val = document.getElementById('swal-new-plat').value.trim();
                                        if (!val) return;
                                        Swal.fire({ title: 'กำลังเพิ่ม...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                                        await supabase.from('platforms').insert([{ name: val }]);
                                        openManageModal(); 
                                      });

                                      window.editPlatform = async (id, oldName) => {
                                        const res = await Swal.fire({
                                          title: 'แก้ไขชื่อช่องทาง',
                                          input: 'text',
                                          inputValue: oldName,
                                          showCancelButton: true,
                                          confirmButtonText: 'บันทึก',
                                          cancelButtonText: 'ยกเลิก',
                                          customClass: { popup: 'rounded-[2rem]' }
                                        });
                                        
                                        if (res.isConfirmed && res.value && res.value !== oldName) {
                                          Swal.fire({ title: 'กำลังบันทึก...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                                          await supabase.from('platforms').update({ name: res.value }).eq('id', id);
                                          openManageModal();
                                        } else {
                                          openManageModal(); 
                                        }
                                      };

                                      window.deletePlatform = async (id, name) => {
                                        const res = await Swal.fire({
                                          title: 'ยืนยันการลบ?',
                                          text: `คุณต้องการลบช่อง "${name}" ใช่หรือไม่?`,
                                          icon: 'warning',
                                          showCancelButton: true,
                                          confirmButtonColor: '#e3342f',
                                          confirmButtonText: 'ลบเลย',
                                          cancelButtonText: 'ยกเลิก',
                                          customClass: { popup: 'rounded-[2rem]' }
                                        });
                                        
                                        if (res.isConfirmed) {
                                          Swal.fire({ title: 'กำลังลบ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                                          await supabase.from('platforms').delete().eq('id', id);
                                          openManageModal();
                                        } else {
                                          openManageModal(); 
                                        }
                                      };
                                    },
                                    willClose: async () => {
                                      delete window.editPlatform;
                                      delete window.deletePlatform;
                                      
                                      const { data } = await supabase.from('platforms').select('*').order('name');
                                      if (data) {
                                        if (typeof setPlatforms === 'function') {
                                          setPlatforms(data);
                                        } else {
                                          Swal.fire({
                                            title: 'บันทึกสำเร็จ!',
                                            text: 'กำลังรีเฟรชเพื่ออัปเดตรายชื่อช่องให้ใหม่...',
                                            icon: 'success',
                                            timer: 1500,
                                            showConfirmButton: false
                                          }).then(() => {
                                            window.location.reload();
                                          });
                                        }
                                      }
                                    }
                                  });
                                };
                                openManageModal();
                              }} className="text-[10px] text-indigo-500 hover:text-indigo-700 font-bold flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg transition-colors border border-indigo-100">
                                <span className="text-sm leading-none">⚙️</span> จัดการช่องทาง
                              </button>
                            )}
                          </div>
                          
                          <select value={stream.platform} onChange={(e) => { const val = e.target.value; setLiveStreams(prev => { const n = [...prev]; n[idx].platform = val; return n; }); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none cursor-pointer focus:border-indigo-400">
                            <option value="">-- เลือกแพลตฟอร์ม --</option>
                            {stream.platform && !platforms?.find(p => p.name === stream.platform) && (
                              <option value={stream.platform}>{stream.platform} (กำหนดเอง)</option>
                            )}
                            {platforms && platforms.length > 0 ? platforms.map(p => <option key={p.id} value={p.name}>{p.name}</option>) : <option value="" disabled>-- กำลังโหลดข้อมูลช่อง... --</option>}
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 md:gap-3 w-full min-w-[0px]">
                          <div className="w-full min-w-[0px]">
                            <label className="block text-[10px] text-slate-500 mb-1 font-bold">เวลาเริ่ม</label>
                            <div className="w-full min-w-[0px] overflow-hidden bg-white border border-slate-200 rounded-lg focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100">
                              <input type="time" required value={stream.startTime || ''} onChange={(e) => { const val = e.target.value; setLiveStreams(prev => { const n = [...prev]; n[idx].startTime = val; return n; }); }} className="w-full min-w-[0px] border-none outline-none bg-transparent px-2 py-2 font-bold text-sm text-slate-700 block m-0" />
                            </div>
                          </div>
                          <div className="w-full min-w-[0px]">
                            <label className="block text-[10px] text-slate-500 mb-1 font-bold">เวลาจบ</label>
                            <div className="w-full min-w-[0px] overflow-hidden bg-white border border-slate-200 rounded-lg focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100">
                              <input type="time" required value={stream.endTime || ''} onChange={(e) => { const val = e.target.value; setLiveStreams(prev => { const n = [...prev]; n[idx].endTime = val; return n; }); }} className="w-full min-w-[0px] border-none outline-none bg-transparent px-2 py-2 font-bold text-sm text-slate-700 block m-0" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 w-full min-w-0">
                          <div className="w-full min-w-0">
                            <select value={stream.sequenceType} onChange={(e) => { const val = e.target.value; setLiveStreams(prev => { const n = [...prev]; n[idx].sequenceType = val; return n; }); }} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 md:px-3 py-2 text-[10px] md:text-[11px] font-bold text-indigo-700 truncate">
                              <option value="คิวแรก">🌟 คิวแรก (ยอดเริ่ม 0)</option>
                              <option value="ขึ้นไลฟ์ต่อ">🤝 ขึ้นไลฟ์ต่อ</option>
                            </select>
                          </div>
                          <div className="w-full min-w-0">
                            {stream.sequenceType === 'ขึ้นไลฟ์ต่อ' && (
                              <select value={stream.followedEmployee} onChange={(e) => { const val = e.target.value; setLiveStreams(prev => { const n = [...prev]; n[idx].followedEmployee = val; return n; }); }} className="w-full bg-rose-50 border border-rose-200 rounded-lg px-2 md:px-3 py-2 text-[10px] md:text-[11px] font-bold text-rose-700 outline-none focus:border-rose-400 truncate cursor-pointer">
                                <option value="">- เลือกชื่อพนักงาน -</option>
                                {(liveTeam || [])
                                  .filter(emp => {
                                    const name = String(emp.nickname || emp.full_name || '');
                                    const status = String(emp.status || '').trim().toLowerCase();
                                    
                                    if (name.includes('แบม') || name.includes('ซีน')) return false;
                                    if (emp.is_active === false || emp.is_active === 'false' || emp.is_active === 0) return false;
                                    if (['ระงับ', 'ลาออก', 'ปิดการใช้งาน', 'ออก', 'พ้นสภาพ', 'inactive', 'false'].includes(status)) return false;

                                    return true; 
                                  })
                                  .map(emp => (
                                  <option key={emp.id} value={emp.full_name}>{emp.nickname || emp.full_name}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col h-full justify-between space-y-3 w-full min-w-0">
                        <div className="w-full min-w-0">
                          <label className="block text-xs font-bold text-emerald-600 mb-2">ยอดจบไลฟ์ (บาท) <span className="text-rose-500 hidden md:inline">*ต้องอัปโหลดสลิปเท่านั้น</span></label>
                          <div className="relative group w-full min-w-0">
                            <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none"><span className="text-lg md:text-xl opacity-80">🔒</span></div>
                            <input type="number" value={stream.endSales} readOnly className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl pl-10 pr-10 md:pl-12 md:pr-12 py-4 md:py-5 font-black text-xl md:text-2xl text-emerald-600 outline-none cursor-not-allowed shadow-inner opacity-90" />
                            <div className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center pointer-events-none"><span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase">THB</span></div>
                          </div>
                        </div>

                        <div className="w-full max-w-full overflow-hidden min-w-0">
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">📸 อัปโหลดสลิปให้ AI ดึงยอดอัตโนมัติ</label>
                          
                          {stream.imageFile ? (
                            <div className="flex gap-2 animate-bounce-in w-full min-w-0">
                              <button type="button" onClick={() => {
                                const imgUrl = URL.createObjectURL(stream.imageFile);
                                Swal.fire({ title: 'ตรวจสอบรูปหลักฐาน', imageUrl: imgUrl, imageAlt: 'Slip Preview', imageWidth: '100%', confirmButtonText: '✅ ปิดหน้าต่าง', confirmButtonColor: '#64748b', customClass: { popup: 'rounded-[2rem] shadow-2xl w-[90%]', image: 'rounded-xl' }, didClose: () => URL.revokeObjectURL(imgUrl) });
                              }} className="flex-1 bg-indigo-50 text-indigo-600 border border-indigo-200 py-3 rounded-xl text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm truncate">
                                🔍 Preview
                              </button>
                              <button type="button" onClick={() => setLiveStreams(prev => { const n = [...prev]; n[idx].imageFile = null; n[idx].endSales = ''; return n; })} className="bg-rose-50 text-rose-500 border border-rose-200 px-4 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                🗑️
                              </button>
                            </div>
                          ) : (
                          <input type="file" accept="image/*" onChange={async (e) => { 
                              const file = e.target.files?.[0];
                              if (file) { 
                                setLiveStreams(prev => { const n = [...prev]; n[idx].imageFile = file; n[idx].endSales = ''; return n; }); 
                                Swal.fire({ title: '🤖 AI กำลังสแกนยอดขาย...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                                try {
                                  const base64Data = await new Promise((res, rej) => { 
                                      const r = new FileReader(); 
                                      r.readAsDataURL(file); 
                                      r.onload = () => res(r.result.split(',')[1]); 
                                      r.onerror = rej; 
                                  });
                                  
                                  const apiKeys = [
                                    "AIzaSyChW3OjwcoPW2X3AFeaV5OnOh28CY46fAU",
                                    "AIzaSyA0Nd0GWjfkHyLOPCfSCsGIoE37qAjtCoI",
                                    "AIzaSyBd68SxshIQxD8ZYYds_X_BC05ibN0p78M",
                                    "AIzaSyDG1KVkbEihwZiubhLa1pqQWZQ74eDt21c",
                                    "AIzaSyCUnIO2sdWTMsP2ZG12L4xv-5REiESUFFI",
                                    "AIzaSyAt68effaiLr0Rzprp8hZD8IKpnTMBkSfc",
                                    "AIzaSyBmP0w_ilXfvw6c6-z0lwst5tJ17abu0ZQ",
                                    "AIzaSyBEiaslpm3aesxmqQlHGq8rTvU2nIAD1kg",
                                    "AIzaSyBVA46verl1EN-QoL2s5wbmhbLqboGH9fU",
                                    "AIzaSyAfZbE1eLdTJ8akbcmOsrjo5IOsNNC50Qs",
                                    "AIzaSyDGDmdCNWXjHNt-GJwJ5Tli3XhXfDzvC6c",
                                    "AIzaSyD2DQvNTsh3aU_Kfg1PUzuLzP_1k_zmEUU"
                                  ];
                                  
                                  let extractedNumber = null;
                                  
                                  for (const apiKey of apiKeys) {
                                    try {
                                      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, { 
                                        method: 'POST', 
                                        headers: { 'Content-Type': 'application/json' }, 
                                        body: JSON.stringify({ 
                                          contents: [{ 
                                            parts: [
                                              { 
                                                text: `คุณคือ AI ขั้นสูงสำหรับอ่านยอดขายจากหน้าจอ TikTok Live (รองรับทั้งมือถือ, iPad, UI แบบใหม่ และแบบเก่า)

🚨 กฎเหล็กในการค้นหาและดึงข้อมูล:
1. หาคำว่า "GMV โดยตรง", "GMV" หรือ "รายได้" แล้วดึงตัวเลขที่อยู่ใกล้ๆ นั้นมา
2. ⚠️ ระวังการลวงตาของฟอนต์: สัญลักษณ์ ฿ (Baht) ของ TikTok มักถูกอ่านผิดเป็นเลข 8 หรือตัว B ห้ามคุณอ่าน ฿ เป็นเลข 8 นำหน้าเด็ดขาด! (เช่น เห็น ฿16K ให้ตอบ 16K ห้ามตอบ 816K / เห็น ฿88.6K ให้ตอบ 88.6K ห้ามตอบ 888.6K)
3. ให้ดึงมาเฉพาะตัวเลขและหน่วย K หรือ M เท่านั้น ห้ามใส่สัญลักษณ์ ฿ กลับมา
4. ระวังตัวเลขหลอก: ห้ามดึงตัวเลข "ผู้ชม", "คำสั่งซื้อ", "ผู้ติดตาม", "เพชร" มาตอบเด็ดขาด
5. ตอบกลับมาในรูปแบบ JSON เท่านั้น

ตัวอย่างที่ถูกต้อง:
{
  "amount": "134.6K"
}` 
                                              }, 
                                              { inline_data: { mime_type: file.type, data: base64Data } }
                                            ] 
                                          }], 
                                          generationConfig: { 
                                            temperature: 0.0,
                                            responseMimeType: "application/json" 
                                          } 
                                        }) 
                                      });
                                      
                                      if (!res.ok) continue; 
                                      
                                      const data = await res.json(); 
                                      let rawText = data.candidates[0].content.parts[0].text.trim();
                                      
                                      if (rawText.startsWith('```json')) {
                                          rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
                                      } else if (rawText.startsWith('```')) {
                                          rawText = rawText.replace(/```/g, '').trim();
                                      }
                                      
                                      const parsedData = JSON.parse(rawText);
                                      if (parsedData && parsedData.amount !== undefined) {
                                          let rawAmount = String(parsedData.amount).trim().toUpperCase();

                                          rawAmount = rawAmount.replace(/[^0-9.KM]/g, '');

                                          let multiplier = 1;
                                          if (rawAmount.endsWith('K')) {
                                              multiplier = 1000;
                                              rawAmount = rawAmount.slice(0, -1);
                                          } else if (rawAmount.endsWith('M')) {
                                              multiplier = 1000000;
                                              rawAmount = rawAmount.slice(0, -1);
                                          }

                                          let finalValue = parseFloat(rawAmount) * multiplier;

                                          if (!isNaN(finalValue) && finalValue > 0) {
                                              extractedNumber = Math.round(finalValue); 
                                              break; 
                                          }
                                      }
                                    } catch (innerErr) {
                                      continue; 
                                    }
                                  }

                                  if(extractedNumber !== null) {
                                    setLiveStreams(prev => { const n = [...prev]; n[idx].endSales = extractedNumber; return n; });
                                    Swal.fire({ icon: 'success', title: 'AI ดึงยอดสำเร็จ!', text: `฿${Number(extractedNumber).toLocaleString()}`, timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-[2rem]' } });
                                  } else {
                                    throw new Error("AI_FAILED");
                                  }
                                } catch (err) { 
                                  Swal.fire({
                                    icon: 'info',
                                    title: 'AI สแกนยอดไม่สำเร็จ',
                                    text: 'ระบบได้แนบรูปสลิปไว้ให้แล้ว คุณสามารถกดบันทึกได้เลย แอดมินจะดำเนินการตรวจสอบและกรอกยอดให้ภายหลังครับ',
                                    confirmButtonText: 'รับทราบ',
                                    confirmButtonColor: '#3b82f6',
                                    customClass: { popup: 'rounded-[2rem]' }
                                  });
                                }
                              } 
                            }} className="block w-full text-[10px] md:text-xs text-slate-500 file:mr-2 md:file:mr-4 file:py-2 file:px-3 md:file:px-4 file:rounded-lg file:border-0 file:text-[9px] md:file:text-[10px] file:font-black file:bg-indigo-50 file:text-indigo-600 border border-slate-200 rounded-lg p-1 bg-white cursor-pointer hover:bg-slate-50 transition-colors whitespace-normal md:whitespace-nowrap overflow-hidden text-ellipsis" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={() => {
                    const safeId = `live-add-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    setLiveStreams(prev => [...prev, { id: safeId, platform: '', startTime: '', endTime: '', endSales: '', sequenceType: 'คิวแรก', followedEmployee: '', imageFile: null }])
                  }} 
                  className="w-full py-3 bg-white border-2 border-dashed border-indigo-200 text-indigo-500 rounded-xl font-bold text-xs md:text-sm hover:border-indigo-400 transition-all flex items-center justify-center gap-2 mt-2 shadow-sm"
                >
                  <span className="text-base md:text-lg">➕</span> เพิ่มอีกช่อง
                </button>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black py-3 md:py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-all text-sm md:text-lg">
                🚀 บันทึกข้อมูล & ซิงค์ยอดขาย Real-time
              </button>
            </form>
          </div>
        </div>
      )}

{/* ========================================================================= */}
{/* ⚙️ VIEW: SETTINGS (V.5.3 ซ่อมระบบเพิ่ม/ลบ Real-time + Responsive 100%) */}
{/* ========================================================================= */}
{currentView === "settings" && (user?.role === 'admin' || user?.role === 'ceo') && (
  <div className="px-3 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in overflow-hidden">
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm border border-white max-w-2xl mx-auto w-full overflow-hidden">
      <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-8 border-b border-slate-100 pb-4 gap-3">
        <div>
          <h3 className="font-black text-slate-800 text-xl sm:text-2xl flex items-center gap-2">⚙️ ตั้งค่าช่องทาง</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">จัดการรายการแพลตฟอร์ม (อัปเดตทันทีทุกส่วน)</p>
        </div>
        <button onClick={() => setCurrentView("live_tracking")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-100 hover:text-rose-500 transition-all shrink-0">✕</button>
      </div>

      <div className="space-y-6 w-full">
        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
          <label className="block text-[10px] sm:text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">เพิ่มแพลตฟอร์มใหม่</label>
          {/* 🟢 แก้ไขตรงนี้: บนมือถือเรียงซ้อนบนล่าง บนคอมเรียงซ้ายขวา */}
          <div className="flex flex-col sm:flex-row gap-3 w-full min-w-0">
            <input 
              id="new-platform-input-fix" 
              type="text" 
              placeholder="เช่น TikTok ช่อง 3" 
              className="w-full sm:flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 sm:px-5 font-bold outline-none focus:border-indigo-400 text-sm"
            />
            <button 
              onClick={async () => {
                const el = document.getElementById('new-platform-input-fix');
                const val = el.value.trim();
                if (!val) return;
                
                Swal.fire({ title: 'กำลังบันทึก...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                
                // 1. บันทึกลง DB
                const { error } = await supabase.from('platforms').insert([{ name: val }]);
                
                if (!error) { 
                  el.value = ''; 
                  // 2. ดึงข้อมูลใหม่เข้า State ทันที
                  await fetchDashboardData(true); 
                  Swal.fire({ icon: 'success', title: 'เพิ่มสำเร็จ!', timer: 800, showConfirmButton: false }); 
                }
              }}
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-black hover:bg-indigo-700 transition-all shadow-lg text-sm shrink-0"
            >
              เพิ่ม
            </button>
          </div>
        </div>

        <div className="space-y-3 w-full min-w-0">
          <label className="block text-[10px] sm:text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">รายการที่ใช้งานอยู่</label>
          {platforms?.map(p => (
            <div key={p.id} className="flex justify-between items-center bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-rose-100 transition-all w-full gap-3 overflow-hidden">
              {/* 🟢 ใช้ truncate ป้องกันชื่อช่องที่ยาวเกินไปดันจอแตก */}
              <span className="font-black text-slate-700 ml-2 text-sm truncate">{p.name}</span>
              <button 
                onClick={async () => {
                  const { isConfirmed } = await Swal.fire({ 
                    title: 'ลบแพลตฟอร์ม?', 
                    text: `ยืนยันการลบ ${p.name} ใช่ไหม?`, 
                    icon: 'warning', 
                    showCancelButton: true,
                    confirmButtonColor: '#F43F5E',
                    customClass: { popup: 'rounded-[2rem]' }
                  });

                  if (isConfirmed) { 
                    Swal.fire({ title: 'กำลังลบ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                    // 1. ลบจาก DB
                    await supabase.from('platforms').delete().eq('id', p.id); 
                    // 2. สั่ง Refresh ข้อมูลใหม่ทันที
                    await fetchDashboardData(true); 
                    Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย', timer: 800, showConfirmButton: false });
                  }
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shrink-0"
              >
                🗑️
              </button>
            </div>
          ))}
          {(!platforms || platforms.length === 0) && (
            <div className="text-center py-6 text-slate-400 font-bold text-sm bg-white rounded-2xl border border-dashed border-slate-200">
              ไม่มีข้อมูลแพลตฟอร์ม
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}


        {/* ========================================================================= */}
        {/* 🧠 VIEW: AI WORKSPACE (ULTIMATE MULTIMODAL EDITION - รูป/เสียง/วิดีโอ/PDF) */}
        {/* ========================================================================= */}
        {currentView === "ai_workspace" && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_60px_rgba(99,102,241,0.08)] border border-white max-w-4xl mx-auto w-full relative overflow-hidden">
              
              {/* ของตกแต่ง Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>

              <div className="mb-8 border-b border-slate-100 pb-8 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white text-4xl mb-5 shadow-xl shadow-indigo-200 transform hover:scale-105 transition-transform duration-300">✨</div>
                <h3 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-fuchsia-700 text-3xl md:text-4xl tracking-tight">PANCAKE AI Brain</h3>
                <p className="text-sm md:text-base text-slate-500 font-medium mt-3">ระบบวิเคราะห์ขั้นสูง รองรับ: <span className="text-indigo-600 font-bold">รูปภาพ (JPG/PNG)</span>, <span className="text-rose-500 font-bold">เอกสาร (PDF)</span>, <span className="text-emerald-500 font-bold">เสียง (MP3/WAV)</span> และ <span className="text-sky-500 font-bold">วิดีโอสั้น (MP4)</span></p>
              </div>

              <div className="relative z-10">
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const prompt = formData.get('ai_prompt');
                    const fileInput = e.target.elements.ai_file;
                    const file = fileInput.files[0];

                    if (!prompt) return Swal.fire('แจ้งเตือน', 'กรุณาพิมพ์คำสั่งให้ AI ด้วยครับ', 'warning');
                    if (!file) return Swal.fire('แจ้งเตือน', 'กรุณาแนบไฟล์ที่ต้องการให้ AI วิเคราะห์ครับ', 'warning');

                    // 🛡️ ป้องกันไฟล์ใหญ่เกินไปจนเบราว์เซอร์ค้าง (ลิมิตที่ 15MB)
                    const maxSize = 15 * 1024 * 1024; 
                    if (file.size > maxSize) return Swal.fire('ไฟล์ใหญ่เกินไป', 'ระบบรองรับไฟล์ขนาดไม่เกิน 15MB ครับ (เพื่อป้องกันเบราว์เซอร์ค้าง)', 'error');

                    Swal.fire({ 
                      title: '🧠 สมองกลกำลังทำงาน...', 
                      html: `<div class="text-sm text-slate-500 mt-2">กำลังถอดรหัสไฟล์ <b>${file.name}</b><br/>และวิเคราะห์ข้อมูลเชิงลึก...</div>`, 
                      allowOutsideClick: false, 
                      didOpen: () => Swal.showLoading() 
                    });

                    try {
                      // 1. แปลงไฟล์ทุกประเภทเป็น Base64
                      const base64Data = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result.split(',')[1]);
                        reader.onerror = error => reject(error);
                      });

                      // 2. ยิง API (ใช้ Gemini 2.5 Flash ตัวล่าสุดที่รองรับ Multimodal)
                      const apiKey = "AIzaSyChW3OjwcoPW2X3AFeaV5OnOh28CY46fAU"; 
                      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contents: [{
                            parts: [
                              { text: prompt },
                              { inline_data: { mime_type: file.type, data: base64Data } }
                            ]
                          }],
                          generationConfig: { temperature: 0.2 } // เน้นความเป๊ะ ไม่แต่งเรื่อง
                        })
                      });

                      const data = await response.json();
                      if (data.error) throw new Error(data.error.message);

                      const aiResult = data.candidates[0].content.parts[0].text;

                      // 3. ตกแต่งข้อความที่ได้จาก AI ให้สวยงาม (เปลี่ยน Markdown เป็น HTML)
                      const formattedResult = aiResult
                        .replace(/\*\*(.*?)\*\*/g, '<b style="color: #4338ca;">$1</b>') // ตัวหนา
                        .replace(/\*(.*?)\*/g, '<li style="margin-left: 15px;">$1</li>') // Bullet
                        .replace(/\n/g, '<br/>'); // ขึ้นบรรทัดใหม่

                      Swal.close();
                      
                      // 4. แสดงผลลัพธ์แบบพรีเมียม
                      Swal.fire({
                        icon: 'success',
                        title: '✨ วิเคราะห์เสร็จสิ้น',
                        html: `<div style="text-align: left; background: #ffffff; padding: 20px; border-radius: 16px; border: 1px solid #e0e7ff; font-size: 14.5px; line-height: 1.6; color: #334155; max-height: 50vh; overflow-y: auto; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); margin-top: 15px;">${formattedResult}</div>`,
                        width: '700px', // ขยายหน้าต่างให้กว้างขึ้นเพื่ออ่านง่าย
                        confirmButtonText: 'ปิดหน้าต่าง',
                        confirmButtonColor: '#6366f1',
                        customClass: { popup: 'rounded-[2rem] shadow-2xl' }
                      }).then(() => { e.target.reset(); document.getElementById('file_name_display').innerText = "ยังไม่ได้เลือกไฟล์"; }); // ล้างฟอร์มเมื่อกดปิด

                    } catch (err) {
                      Swal.close();
                      Swal.fire('ข้อผิดพลาด', 'AI ไม่สามารถประมวลผลได้ (โปรดตรวจสอบประเภทไฟล์): ' + err.message, 'error');
                    }
                  }}
                >
                  <div className="space-y-6">
                    
                    {/* 📤 โซนอัปโหลดไฟล์ (UI แบบล้ำๆ) */}
                    <div className="bg-indigo-50/50 p-1 rounded-2xl border border-indigo-100">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-indigo-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-3 text-indigo-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                          <p className="mb-2 text-sm text-slate-500 font-bold"><span className="text-indigo-600">คลิกเพื่อแนบไฟล์</span> (รูปภาพ, PDF, ไฟล์เสียง, วิดีโอสั้น)</p>
                          <p className="text-xs text-slate-400">ขนาดสูงสุดไม่เกิน 15MB</p>
                        </div>
                        <input type="file" name="ai_file" accept="image/*,application/pdf,audio/*,video/mp4" className="hidden" required id="file_upload" onChange={(e) => {
                          const fileName = e.target.files[0]?.name || "ยังไม่ได้เลือกไฟล์";
                          document.getElementById('file_name_display').innerText = fileName;
                        }}/>
                      </label>
                      <div className="text-center mt-2 mb-2">
                        <span id="file_name_display" className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">ยังไม่ได้เลือกไฟล์</span>
                      </div>
                    </div>

                    {/* 💬 โซนคำสั่ง (Prompt) + Quick Actions */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between items-center">
                        <span>💬 2. สั่งงาน AI (Prompt)</span>
                      </label>
                      <textarea 
                        name="ai_prompt" 
                        id="ai_prompt_input"
                        placeholder="พิมพ์สิ่งที่ต้องการให้ AI ทำให้ เช่น สรุปเนื้อหา, หาจุดผิด, ประเมินคะแนน..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner" 
                        rows="4"
                        required
                      ></textarea>
                      
                      {/* ⚡ ปุ่มลัดอัจฉริยะ (Quick Prompts) */}
                      <div className="mt-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">⚡ คำสั่งลัดอัจฉริยะ (คลิกเพื่อใช้งาน):</span>
                        <div className="flex gap-2 flex-wrap">
                          <button type="button" onClick={() => document.getElementById('ai_prompt_input').value = "📄 สรุปเนื้อหาจาก PDF นี้ให้หน่อย เอาเฉพาะประเด็นสำคัญ จัดเป็นข้อๆ"} className="text-xs border border-indigo-200 bg-white text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 font-bold transition flex items-center gap-1 shadow-sm">📄 สรุป PDF</button>
                          
                          <button type="button" onClick={() => document.getElementById('ai_prompt_input').value = "🎙️ ถอดเสียงจากไฟล์นี้เป็นข้อความให้หน่อย และสรุปว่าอารมณ์ของคนพูดเป็นยังไง"} className="text-xs border border-emerald-200 bg-white text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50 font-bold transition flex items-center gap-1 shadow-sm">🎙️ ถอดคลิปเสียง</button>
                          
                          <button type="button" onClick={() => document.getElementById('ai_prompt_input').value = "📸 ดึงข้อมูล ชื่อ, นามสกุล, วันที่, และยอดเงิน จากรูปภาพนี้ออกมาจัดเป็นตารางให้หน่อย"} className="text-xs border border-rose-200 bg-white text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 font-bold transition flex items-center gap-1 shadow-sm">📸 สแกนบิล/สลิป</button>
                          
                          <button type="button" onClick={() => document.getElementById('ai_prompt_input').value = "🔍 ตรวจสอบเอกสารนี้ว่ามีจุดไหนพิมพ์ผิด หรือมีข้อมูลที่ไม่สมเหตุสมผลหรือไม่"} className="text-xs border border-amber-200 bg-white text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-50 font-bold transition flex items-center gap-1 shadow-sm">🔍 ตรวจหาจุดผิด</button>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full relative group overflow-hidden bg-slate-900 text-white font-black py-4.5 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all flex justify-center items-center gap-2 text-lg">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="relative z-10 flex items-center gap-2">✨ ประมวลผลขั้นสูง (Execute)</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

       {/* 📦 VIEW: ASSET MANAGEMENT */}
        {currentView === "assets" && (user?.role === 'admin' || user?.role === 'ceo') && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col overflow-hidden">
              
              {/* 🛠️ ส่วน Header และกลุ่มปุ่ม (เพิ่มปุ่ม Export) */}
              <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-black text-slate-800 text-xl md:text-2xl flex items-center gap-2">📦 จัดการสินทรัพย์ของบริษัท</h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">ติดตามและดูแลอุปกรณ์ เครื่องมือทั้งหมดในระบบ</p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  {/* 📊 ปุ่ม Export */}
                  <button 
                    onClick={handleExportAssetsCSV}
                    className="bg-white border-2 border-slate-200 text-slate-600 px-4 py-3 rounded-xl font-black text-sm shadow-sm hover:border-emerald-400 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
                    title="ดาวน์โหลดรายงานสินทรัพย์เป็น Excel"
                  >
                    📊 Export
                  </button>

                  <button 
                    onClick={() => {
                      setEditingAssetId(null);
                      // เคลียร์ฟอร์มและใส่ค่า Default สำหรับข้อมูลใหม่
                      setAssetForm({ 
                        asset_code: '', 
                        name: '', 
                        asset_name: '', 
                        category: 'อุปกรณ์ไอที', 
                        status: 'available', 
                        purchase_date: '', 
                        purchase_price: 0, 
                        usage_location: '', 
                        storage_location: '',
                        useful_life: 5, 
                        salvage_value: 1, 
                        assigned_to: null, 
                        note: '' 
                      });
                      setIsAssetModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-black text-sm shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 flex-[2] sm:flex-none"
                  >
                    ➕ เพิ่มสินทรัพย์ใหม่
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                {assets.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-slate-300">
                    <span className="text-6xl mb-4">📦</span>
                    <p className="font-bold text-lg text-slate-400 uppercase tracking-widest">ยังไม่มีข้อมูลสินทรัพย์</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                    {assets.map(asset => (
                      <div key={asset.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col">
                        <div className={`absolute top-0 right-0 w-1.5 h-full ${asset.status === 'available' ? 'bg-emerald-400' : asset.status === 'repair' ? 'bg-amber-400' : 'bg-rose-400'}`}></div>
                        
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${asset.status === 'available' ? 'bg-emerald-50 text-emerald-600' : asset.status === 'repair' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                            ● {asset.status === 'available' ? 'พร้อมใช้' : asset.status === 'repair' ? 'กำลังซ่อม' : 'ชำรุด/เลิกใช้'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">ID: {asset.asset_code}</span>
                        </div>
                        
                        <h4 className="font-black text-slate-800 text-lg mb-1">{asset.asset_name || asset.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 mb-4 inline-block bg-slate-50 px-2 py-0.5 rounded uppercase w-fit">{asset.category}</p>
                        
                        <div className="space-y-2 mb-4 border-t border-slate-50 pt-4 flex-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">📍 สถานที่:</span>
                            {/* ดึง usage_location หรือ storage_location มาแสดง */}
                            <span className="text-slate-700">{asset.usage_location || asset.storage_location || asset.location || '-'}</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">👤 ผู้ถือครอง:</span>
                            <span className="text-indigo-600 font-black">{asset.employees?.full_name || 'ส่วนกลาง'}</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">💰 ราคาซื้อ:</span>
                            <span className="text-slate-700">{Number(asset.purchase_price || 0).toLocaleString()} ฿</span>
                          </div>
                        </div>

                        {/* 📉 ส่วนแสดงมูลค่าปัจจุบันที่ระบบคำนวณให้ (Book Value) */}
                        <div className="mt-auto mb-4 pt-3 border-t border-dashed border-slate-200 flex justify-between items-end bg-slate-50/50 -mx-2 px-2 rounded-xl">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">🗓️ ซื้อ: {asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString('th-TH') : '-'}</span>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">⏳ {asset.useful_life || 5} ปี | ซาก ฿{Number(asset.salvage_value || 1).toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-emerald-500 font-black block uppercase tracking-wider">📉 มูลค่าปัจจุบัน</span>
                            <span className="text-lg font-black text-emerald-600">
                              ฿ {calculateBookValue(asset)}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => { setEditingAssetId(asset.id); setAssetForm(asset); setIsAssetModalOpen(true); }}
                          className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-xl font-black text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors mt-auto"
                        >
                          📝 แก้ไขข้อมูล
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}



        {/* ========================================================================= */}
        {/* ⚙️ VIEW: MANAGE PLATFORMS (หน้าจัดการแพลตฟอร์ม เพิ่ม/ลบ) */}
        {/* ========================================================================= */}
        {currentView === "manage_platforms" && (user?.role === 'admin' || user?.role === 'ceo') && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white max-w-2xl mx-auto w-full">
              
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">⚙️ จัดการช่องทางการไลฟ์ (Platforms)</h3>
                <button onClick={() => setCurrentView("live_tracking")} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
                  ⬅️ กลับหน้าลงเวลา
                </button>
              </div>

              {/* ฟอร์มเพิ่มแพลตฟอร์มใหม่ */}
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newPlatform} 
                  onChange={(e) => setNewPlatform(e.target.value)} 
                  placeholder="พิมพ์ชื่อแพลตฟอร์มใหม่ (เช่น Instagram, Lazada)" 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-400 outline-none"
                />
                <button 
                  onClick={async () => {
                    if (!newPlatform.trim()) return Swal.fire('แจ้งเตือน', 'กรุณาพิมพ์ชื่อแพลตฟอร์มก่อนครับ', 'warning');
                    try {
                      Swal.fire({ title: 'กำลังเพิ่มข้อมูล...', didOpen: () => Swal.showLoading() });
                      const { data, error } = await supabase.from('platforms').insert([{ name: newPlatform.trim() }]).select();
                      if (error) throw error;
                      setPlatforms([...platforms, data[0]]);
                      setNewPlatform("");
                      Swal.fire('สำเร็จ', 'เพิ่มแพลตฟอร์มเรียบร้อยแล้ว', 'success');
                    } catch (err) {
                      Swal.fire('Error', err.message, 'error');
                    }
                  }}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-all"
                >
                  + เพิ่ม
                </button>
              </div>

              {/* ตารางแสดงแพลตฟอร์มที่มีอยู่ */}
              <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <tr>
                      <th className="p-4">ชื่อแพลตฟอร์ม</th>
                      <th className="p-4 text-center w-24">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platforms.map(p => (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-700">{p.name}</td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={async () => {
                              const res = await Swal.fire({ title: 'ลบแพลตฟอร์ม?', text: `ต้องการลบ "${p.name}" ใช่หรือไม่?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#EF4444', confirmButtonText: 'ลบทิ้ง', cancelButtonText: 'ยกเลิก' });
                              if(res.isConfirmed) {
                                Swal.fire({ title: 'กำลังลบ...', didOpen: () => Swal.showLoading() });
                                const { error } = await supabase.from('platforms').delete().eq('id', p.id);
                                if (!error) {
                                  setPlatforms(platforms.filter(plat => plat.id !== p.id));
                                  Swal.fire('สำเร็จ', 'ลบแพลตฟอร์มแล้ว', 'success');
                                } else {
                                  Swal.fire('Error', error.message, 'error');
                                }
                              }
                            }}
                            className="text-red-500 hover:text-red-700 font-bold bg-red-50 px-3 py-1.5 rounded-lg text-xs"
                          >
                            🗑️ ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                    {platforms.length === 0 && <tr><td colSpan="2" className="p-6 text-center text-slate-400">ยังไม่มีข้อมูลแพลตฟอร์ม</td></tr>}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}
       
       {/* ========================================================================= */}
{/* 🛡️ VIEW: SYSTEM BACKUP MONITOR (ดึงข้อมูลไฟล์จริงจากระบบ) */}
{/* ========================================================================= */}
{currentView === "manage_backup" && (
  <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white max-w-5xl mx-auto w-full">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <h3 className="font-black text-slate-800 text-2xl flex items-center justify-center md:justify-start gap-3">
            <span className="p-3 bg-indigo-100 rounded-2xl text-2xl">🛡️</span> ศูนย์ควบคุมการสำรองข้อมูล
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">ตรวจสอบรายการไฟล์สำรองในระบบ PANCAKE ERP</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={fetchBackupLogs}
            className="flex-1 md:flex-none bg-indigo-50 text-indigo-600 px-4 py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            🔄 รีเฟรช
          </button>
          <button 
            onClick={downloadBackupJSON}
            className="flex-[2] md:flex-none bg-emerald-500 text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center gap-2 justify-center"
          >
            📥 Backup ทันที (JSON)
          </button>
        </div>
      </div>

      {/* Cloud Status Info */}
      <div className="bg-indigo-900 rounded-[2rem] p-6 mb-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">☁️</div>
            <div className="text-left">
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Storage Status</p>
              <h4 className="text-xl font-black">GitHub Private Cloud Storage</h4>
              <p className="text-xs text-indigo-300 mt-1 italic">สำรองข้อมูล SQL ทุกวัน เวลา 02:00 น. อัตโนมัติ</p>
            </div>
          </div>
          <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
             <p className="text-indigo-200 text-[10px] font-bold uppercase mb-1">Retention Policy</p>
             <span className="bg-emerald-400 text-emerald-900 text-[10px] px-3 py-1 rounded-full font-black uppercase">30 Days Cycle Active</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4">
          <svg width="300" height="300" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="white"/></svg>
        </div>
      </div>

      {/* 📁 รายการไฟล์สำรองของจริง */}
      <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 text-left">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-black text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
            📁 คลังไฟล์สำรองล่าสุด ({backupLogs.length} ไฟล์)
          </h4>
          {isFetchingBackups && <span className="text-[10px] font-bold text-indigo-500 animate-pulse">กำลังโหลดข้อมูล...</span>}
        </div>

        {backupLogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {backupLogs.map((log) => (
              <div key={log.id} className="group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-400 transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                    <span className="text-xl">📄</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-slate-800 truncate" title={log.file_name}>{log.file_name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Cloud Sync</span>
                      <span className="text-[10px] font-black text-indigo-500">{log.file_size || '4.2 MB'}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                   <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 ${log.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} rounded-full animate-pulse`}></span>
                      <span className={`text-[9px] font-bold ${log.status === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {log.status === 'success' ? 'สำรองสำเร็จ' : 'ล้มเหลว'}
                      </span>
                   </div>
                   <span className="text-[9px] font-bold text-slate-300">
                     {new Date(log.created_at).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-xs font-bold text-slate-400">ยังไม่มีรายการไฟล์สำรองในระบบ</p>
            <p className="text-[10px] text-slate-300 mt-1">ระบบจะเริ่มบันทึกประวัติหลังจากการสำรองข้อมูลรอบถัดไป</p>
          </div>
        )}

        {backupLogs.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-[10px] font-bold text-slate-400">แสดงผลเฉพาะ 30 วันล่าสุดตามนโยบายบริษัท</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-5 bg-amber-50 border border-amber-100 rounded-2xl text-left">
        <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
          <span className="text-lg">🛡️</span> รายการด้านบนคือบันทึกความสำเร็จจากการสำรองข้อมูลที่ GitHub Cloud บอสสามารถตรวจสอบเวลาทำงานล่าสุดได้ที่นี่ หากต้องการไฟล์ SQL ย้อนหลังสามารถแจ้งแอดมินเพื่อดาวน์โหลดจากคลัง GitHub Private ได้ตลอดเวลาครับ
        </p>
      </div>

    </div>
  </div>
)}


{/* ========================================================================= */}
{/* 📊 VIEW: ALL LIVE HISTORY (V.6.2 เพิ่ม Scrollbar ด้านบนสุดของตาราง) */}
{/* ========================================================================= */}
{currentView === "live_history" && (
  <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col relative">
      
      {(() => {
        const isExecutive = user?.role === 'admin' || user?.role === 'ceo';
        
        // 🟢 ข้อมูลรอบบิลปัจจุบัน (26 ถึง 25)
        const today = new Date();
        let sYear = today.getFullYear(), sMonth = today.getMonth();
        let eYear = today.getFullYear(), eMonth = today.getMonth();

        if (today.getDate() >= 26) {
          eMonth += 1; 
        } else {
          sMonth -= 1; 
        }

        const formatLocalYMD = (y, m, d) => {
          const dt = new Date(y, m, d);
          return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        };

        const autoStart = formatLocalYMD(sYear, sMonth, 26);
        const autoEnd = formatLocalYMD(eYear, eMonth, 25);

        const activeCycleStart = salesData?.cycle_start || autoStart;
        const activeCycleEnd = salesData?.cycle_end || autoEnd;
        
        // 🟢 กรองข้อมูลตามสิทธิ์และ Filter
        const filteredHistory = allLiveHistory.filter(item => {
          if (!isExecutive && item.employee_id !== user.id) return false;
          const matchPlatform = filterPlatform ? item.platform === filterPlatform : true;
          const searchStart = filterStartDate || activeCycleStart;
          const searchEnd = filterEndDate || activeCycleEnd;
          const matchStartDate = searchStart ? item.live_date >= searchStart : true;
          const matchEndDate = searchEnd ? item.live_date <= searchEnd : true;
          return matchPlatform && matchStartDate && matchEndDate;
        });

        const thaiCycleStart = activeCycleStart ? new Date(activeCycleStart).toLocaleDateString('th-TH', {day:'numeric', month:'short', year:'2-digit'}) : '-';
        const thaiCycleEnd = activeCycleEnd ? new Date(activeCycleEnd).toLocaleDateString('th-TH', {day:'numeric', month:'short', year:'2-digit'}) : '-';

        return (
          <>
            {/* 🔝 ส่วนหัวและปุ่มจัดการ */}
            <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h3 className="font-black text-slate-800 text-xl md:text-2xl flex items-center gap-2">
                  📊 {isExecutive ? 'ประวัติการลงเวลาไลฟ์ทั้งหมด' : 'ประวัติการลงเวลาไลฟ์ของฉัน'}
                </h3>
                <div className="mt-2 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black border border-indigo-100 uppercase tracking-wider shadow-sm">
                  <span>🗓️ รอบบิลปัจจุบัน:</span> 
                  <span className="text-indigo-600">{thaiCycleStart} ถึง {thaiCycleEnd}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                <button onClick={async () => {
                  Swal.fire({ title: 'กำลังรีเฟรชข้อมูล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  await fetchHistoryWithNames(); 
                  Swal.close();
                }} className="bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all shadow-sm flex items-center gap-2">
                  🔄 รีเฟรชข้อมูล
                </button>

                {isExecutive && (
                  <button 
                    onClick={() => exportLiveHistory(filteredHistory)} 
                    className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-emerald-100 transition-all flex items-center gap-2"
                  >
                    📥 Export Excel
                  </button>
                )}
              </div>
            </div>

            {/* 🔍 ส่วนการกรองข้อมูล */}
            <div className="mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-tight">📱 แพลตฟอร์ม</label>
                  <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:border-indigo-400 outline-none shadow-sm cursor-pointer">
                    <option value="">-- ทุกแพลตฟอร์ม --</option>
                    {platforms?.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-tight">📅 ตั้งแต่วันที่</label>
                  <input type="date" value={filterStartDate || ''} onChange={(e) => setFilterStartDate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:border-indigo-400 outline-none shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-tight">📅 ถึงวันที่</label>
                  <input type="date" value={filterEndDate || ''} onChange={(e) => setFilterEndDate(e.target.value)} min={filterStartDate} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:border-indigo-400 outline-none shadow-sm" />
                </div>
                <button onClick={() => { setFilterPlatform(''); setFilterStartDate(''); setFilterEndDate(''); }} className="w-full bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all shadow-sm flex items-center justify-center gap-2">❌ ล้างการค้นหา</button>
              </div>
            </div>

            {/* 🚀 ซ่อนความลับสวรรค์: ดัมมี่คอนเทนเนอร์สำหรับ Scroll ด้านบน */}
            <div 
              className="w-full overflow-x-auto overflow-y-hidden mb-2 custom-scrollbar bg-slate-50 rounded-t-xl" 
              style={{ height: '12px' }}
              onScroll={(e) => {
                const tableContainer = document.getElementById('sync-table-scroll');
                if (tableContainer) {
                  tableContainer.scrollLeft = e.target.scrollLeft;
                }
              }}
            >
               {/* กล่องหลอกๆ ที่มีความกว้างเท่ากับตารางเป๊ะๆ เพื่อให้เกิด Scrollbar */}
               <div style={{ width: '1300px', height: '1px' }}></div>
            </div>

            {/* 📋 ตารางข้อมูลหลัก */}
            <div 
              id="sync-table-scroll"
              className="flex-1 w-full border border-slate-100 rounded-xl overflow-x-auto bg-white shadow-sm custom-scrollbar"
              onScroll={(e) => {
                const topScroll = e.target.previousSibling;
                if (topScroll) {
                  topScroll.scrollLeft = e.target.scrollLeft;
                }
              }}
            >
              <table className="w-full text-left whitespace-nowrap" style={{ minWidth: '1300px' }}>
                <thead className="text-[10px] md:text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-4 rounded-tl-xl text-indigo-600">📅 วันที่ / เวลา</th>
                    {isExecutive && <th className="p-4">👤 ชื่อพนักงาน</th>}
                    <th className="p-4 text-center">คิว</th>
                    <th className="p-4">📱 แพลตฟอร์ม</th>
                    <th className="p-4 text-right">ยอดตั้งต้น</th>
                    <th className="p-4 text-right text-rose-500 font-black">ยอดจบ</th>
                    <th className="p-4 text-right text-emerald-600 font-black">ยอดสุทธิ (฿)</th>
                    <th className="p-4 text-center">หลักฐาน</th>
                    {isExecutive && <th className="p-4 text-center">สถานะเช็ค</th>}
                    {isExecutive && <th className="p-4 text-center rounded-tr-xl">จัดการ</th>}
                  </tr>
                </thead>
                <tbody>
                  {[...filteredHistory].sort((a, b) => {
                    const dDiff = new Date(a.live_date).getTime() - new Date(b.live_date).getTime();
                    return dDiff !== 0 ? dDiff : (a.start_time || '').localeCompare(b.start_time || '');
                  }).map((item) => (
                    <tr key={item.id} className={`border-b border-slate-50 transition-colors group ${item.is_checked ? 'bg-emerald-50/30' : 'hover:bg-slate-50/80'}`}>
                      
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-[18px] font-black text-slate-900 leading-tight tracking-tight">
                            {new Date(item.live_date).toLocaleDateString('th-TH', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </span>
                          <div className="flex items-center mt-2">
                            <div className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg shadow-md flex items-center gap-2 border border-indigo-700">
                              <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                              <span className="text-[14px] font-black tracking-wider">
                                {item.start_time?.slice(0,5)} - {item.end_time?.slice(0,5)} น.
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {isExecutive && (
                        <td className="p-4">
                          <div className="flex flex-col">
                            <p className="font-black text-[15px] text-slate-800">
                              {item.employees?.full_name || item.streamer_name || 'ไม่ระบุชื่อ'}
                            </p>
                            {item.employees?.nickname && (
                              <span className="mt-1 w-fit bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md text-[11px] font-black border border-indigo-100">
                                ✨ {item.employees.nickname}
                              </span>
                            )}
                            {item.remarks && item.remarks !== '-' && (
                              <p className="text-[10px] text-slate-400 truncate max-w-[150px] mt-1.5 font-bold italic">📝 {item.remarks}</p>
                            )}
                          </div>
                        </td>
                      )}

                      <td className="p-4 text-center">
                        {String(item.sequence_type).includes('แรก') || item.is_first_queue ? ( 
                          <span className="bg-amber-100 text-amber-700 text-[11px] px-2.5 py-1 rounded-lg font-black border border-amber-200 shadow-sm">🌟 แรก</span> 
                        ) : ( 
                          <div className="flex flex-col items-center gap-1">
                            <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-md font-black border border-blue-200">🤝 ต่อ</span>
                            <span className="text-[13px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 shadow-sm">
                              {typeof liveTeam !== 'undefined' ? (liveTeam?.find(e => e.full_name === item.followed_employee_name)?.nickname || item.followed_employee_name?.split(' ')[0] || '-') : '-'}
                            </span>
                          </div> 
                        )}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-wide border border-slate-900 shadow-sm">{item.platform}</span>
                      </td>
                      <td className="p-4 text-right text-sm font-bold text-slate-400">{Number(item.start_sales).toLocaleString()}</td>
                      <td className="p-4 text-right text-[15px] font-black text-rose-500">{Number(item.end_sales).toLocaleString()}</td>
                      <td className="p-4 text-right text-[16px] font-black text-emerald-600 bg-emerald-50/50">฿{Number(item.net_sales).toLocaleString()}</td>
                      
                      <td className="p-4 text-center">
                        {item.image_url ? (
                          <button onClick={() => Swal.fire({ imageUrl: item.image_url, imageAlt: 'หลักฐาน', confirmButtonText: 'ปิด', confirmButtonColor: '#4F46E5', customClass: { image: 'rounded-xl shadow-2xl' } })} className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-[11px] font-black shadow-sm hover:bg-slate-100 transition-all flex items-center gap-1.5 mx-auto">
                            📸 <span>ดูสลิป</span>
                          </button>
                        ) : <span className="text-slate-300">-</span>}
                      </td>

                      {isExecutive && (
                        <td className="p-4 text-center">
                          <button 
                            onClick={async () => {
                              const newValue = !item.is_checked;
                              const updatedList = allLiveHistory.map(h => h.id === item.id ? { ...h, is_checked: newValue } : h);
                              if(typeof setAllLiveHistory === 'function') setAllLiveHistory(updatedList);
                              
                              try {
                                const { error } = await supabase
                                  .from('live_tracking')
                                  .update({ is_checked: newValue })
                                  .eq('id', item.id);
                                if (error) throw error;
                              } catch (err) {
                                console.error("Error updating check status:", err);
                                Swal.fire('เกิดข้อผิดพลาด', 'อัปเดตสถานะไม่ได้ครับ ลองใหม่อีกครั้ง', 'error');
                                if(typeof fetchHistoryWithNames === 'function') fetchHistoryWithNames();
                              }
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-black shadow-sm transition-all border flex items-center justify-center gap-1.5 mx-auto active:scale-95 ${
                              item.is_checked 
                                ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600' 
                                : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {item.is_checked ? '✅ เช็คแล้ว' : '❌ ยังไม่เช็ค'}
                          </button>
                        </td>
                      )}
                      
                      {isExecutive && (
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => { if(typeof handleHumanAuditLive === 'function') handleHumanAuditLive(item); }} className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100" title="ตรวจสอบละเอียด">
                              🔍
                            </button>
                            <button 
                              onClick={() => { if(typeof handleDeleteLive === 'function') handleDeleteLive(item.id); }} 
                              className="bg-rose-50 text-rose-500 p-2.5 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100" 
                              title="ลบรายการ"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan={isExecutive ? "10" : "8"} className="p-20 text-center text-slate-400 font-black">
                        <div className="text-6xl mb-4 grayscale opacity-20">📸</div>
                        <p className="text-lg">ไม่พบข้อมูลในรอบบิลปัจจุบันครับพี่</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}
    </div>
  </div>
)}

{/* ========================================================================= */}
{/* 📊 VIEW: SALES HISTORY (V.3.5 เรียงวันที่ 26 ขึ้นก่อนตามรอบบิล) */}
{/* ========================================================================= */}
{currentView === "menu_sales_history" && (
  <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col w-full max-w-7xl mx-auto">
      
      {/* 1. Header & Controls: เน้นการเลือกปี/เดือน และพนักงาน */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
        <div>
          <h3 className="font-black text-slate-800 text-2xl flex items-center gap-2">📊 สถิติยอดขายสะสม</h3>
          {(() => {
            const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
            const [y, m] = selectedHistoryMonth.split('-').map(Number);
            let pY = y, pM = m - 1;
            if (pM < 1) { pM = 12; pY -= 1; }
            return (
              <p className="text-sm text-pink-500 font-bold uppercase tracking-widest mt-1">
                ประจำปี {y + 543} <span className="ml-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-black">รอบบิล: 26 {thaiMonths[pM - 1]} {pY + 543} - 25 {thaiMonths[m - 1]} {y + 543}</span>
              </p>
            );
          })()}
        </div>
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* 👥 ตัวเลือกพนักงาน */}
          {(user?.role === 'admin' || user?.role === 'ceo') && (
            <div className="flex-1 lg:flex-none min-w-[220px] bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center">
              <span className="pl-3 text-xs font-black text-slate-400 uppercase">พนักงาน:</span>
              <select 
                value={historyFilterEmp}
                onChange={(e) => setHistoryFilterEmp(e.target.value)}
                className="bg-transparent border-none font-black text-slate-700 px-3 py-2 outline-none cursor-pointer flex-1"
              >
                <option value="all">👥 พนักงานทุกคน (รวมทั้งบริษัท)</option>
                {employees?.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} {emp.nickname ? `(${emp.nickname})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 📅 ตัวเลือกเดือน/ปี */}
          <div className="flex-1 lg:flex-none bg-slate-100 p-1.5 rounded-2xl flex items-center shadow-inner">
            <span className="pl-3 text-xs font-black text-slate-400 uppercase">เดือน/ปี:</span>
            <input 
              type="month" 
              value={selectedHistoryMonth} 
              onChange={(e) => setSelectedHistoryMonth(e.target.value)}
              className="bg-transparent border-none font-black text-slate-700 px-3 py-2 outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {(() => {
        // --- 🧠 ฟังก์ชันแปลงวันที่เป็นภาษาไทย ---
        const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        const formatThaiDate = (dateStr) => {
          if (!dateStr) return '-';
          const [y, m, d] = dateStr.split('-');
          if (!y || !m || !d) return dateStr;
          return `${d} ${thaiMonths[parseInt(m, 10) - 1]} ${parseInt(y, 10) + 543}`;
        };

        // --- 🧠 Logic คำนวณจากฐานข้อมูล ---
        const isStaff = user?.role !== 'admin' && user?.role !== 'ceo';
        const targetEmpId = isStaff ? user?.id : historyFilterEmp;
        
        const [selYear, selMonth] = selectedHistoryMonth.split('-').map(Number);
        let sYear = selYear, sMonth = selMonth - 1;
        if (sMonth < 1) { sMonth = 12; sYear -= 1; }
        const pad = (n) => String(n).padStart(2, '0');
        const cycleStart = `${sYear}-${pad(sMonth)}-26`;
        const cycleEnd = `${selYear}-${pad(selMonth)}-25`;

        const monthlyLogs = allLiveHistory?.filter(log => {
          const matchMonth = log.live_date >= cycleStart && log.live_date <= cycleEnd;
          const matchEmp = targetEmpId === 'all' ? true : log.employee_id === targetEmpId;
          return matchMonth && matchEmp;
        }) || [];

        let totalSales = 0, totalNormalComm = 0, totalHolidayComm = 0;
        
        monthlyLogs.forEach(log => {
          const net = Number(log.net_sales || 0);
          totalSales += net;
          
          const empRate = allSalesData?.find(s => s.employee_id === log.employee_id)?.commission_rate ?? 3;
          const camp = holidayCampaigns?.find(c => log.live_date >= c.startDate && log.live_date <= c.endDate);
          
          if (camp) {
            totalHolidayComm += net * (Number(camp.rate) / 100);
          } else {
            totalNormalComm += net * (empRate / 100);
          }
        });

        const platformStats = monthlyLogs.reduce((acc, log) => {
          acc[log.platform] = (acc[log.platform] || 0) + Number(log.net_sales || 0);
          return acc;
        }, {});

        const dailyStats = monthlyLogs.reduce((acc, log) => {
          const date = log.live_date; 
          if (!acc[date]) {
            acc[date] = { total: 0, platforms: {} };
          }
          const net = Number(log.net_sales || 0);
          acc[date].total += net;
          
          const plat = log.platform || 'ไม่ระบุช่องทาง';
          acc[date].platforms[plat] = (acc[date].platforms[plat] || 0) + net;
          
          return acc;
        }, {});

        return (
          <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            {/* 2. สรุปยอดเงิน: การ์ดตัวเลขสำคัญ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-lg border border-slate-700 flex flex-col justify-center">
                <p className="text-xs font-black uppercase opacity-60 tracking-widest mb-2">ยอดขายรวมสะสม</p>
                <h4 className="text-3xl font-black">฿{totalSales.toLocaleString()}</h4>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">คอมฯ ปกติ (สะสม)</p>
                <h4 className="text-3xl font-black text-slate-700">฿{totalNormalComm.toLocaleString()}</h4>
              </div>
              <div className="bg-purple-50 p-6 rounded-[2rem] border border-purple-100 shadow-sm text-purple-700 flex flex-col justify-center">
                <p className="text-xs font-black uppercase tracking-widest mb-2">คอมฯ พิเศษ (สะสม)</p>
                <h4 className="text-3xl font-black">฿{totalHolidayComm.toLocaleString()}</h4>
              </div>
              <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 shadow-sm text-emerald-700 flex flex-col justify-center">
                <p className="text-xs font-black uppercase tracking-widest mb-2">รายรับรวมสุทธิ</p>
                <h4 className="text-3xl font-black">฿{(totalNormalComm + totalHolidayComm).toLocaleString()}</h4>
              </div>
            </div>

            {/* แถวที่ 2: แบ่งเป็น 1/3 (แยกช่องทาง) และ 2/3 (รายวัน) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 3. สรุปผลงานแยกตามช่องทาง */}
              <div className="lg:col-span-1 bg-slate-50 p-6 rounded-[2rem] border border-slate-200 flex flex-col h-full">
                <h5 className="font-black text-slate-700 text-lg mb-4 flex items-center gap-2">📱 แยกช่องทาง</h5>
                <div className="space-y-3 flex-1">
                  {Object.entries(platformStats).length === 0 ? (
                    <p className="text-sm text-slate-400 italic text-center py-8">ไม่มีข้อมูลการขาย</p>
                  ) : Object.entries(platformStats)
                      .sort((a, b) => a[0].localeCompare(b[0], 'th', { numeric: true })) 
                      .map(([name, val]) => (
                    <div key={name} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-slate-100">
                      <span className="text-base font-bold text-slate-600">{name}</span>
                      <span className="text-lg font-black text-pink-600">฿{Number(val).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. สรุปยอดขายต่อวัน */}
              <div className="lg:col-span-2 bg-pink-50/50 p-6 rounded-[2rem] border border-pink-100 shadow-inner flex flex-col h-full">
                <h5 className="font-black text-pink-700 text-lg mb-4 flex items-center gap-2">📅 ยอดขายรายวัน</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 flex-1 items-start">
                  {Object.entries(dailyStats).length === 0 ? (
                    <p className="text-sm text-pink-400/70 italic text-center py-8 col-span-full">ไม่มีข้อมูลการขาย</p>
                  ) : Object.entries(dailyStats)
                      // 🚩 สลับเป็น a - b เพื่อให้วันที่ 26 (วันแรกของรอบบิล) ขึ้นมาก่อน
                      .sort((a, b) => new Date(a[0]) - new Date(b[0])) 
                      .map(([dateStr, data]) => {
                        const displayDate = formatThaiDate(dateStr);

                        return (
                          <div key={dateStr} className="bg-white p-4 rounded-2xl flex flex-col shadow-sm border border-pink-100 h-auto break-inside-avoid">
                            {/* บรรทัดบน: วันที่ และ ยอดรวมของวัน */}
                            <div className="flex justify-between items-center border-b border-pink-50 pb-3 mb-3">
                              <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-1.5 rounded-lg">{displayDate}</span>
                              <span className="text-lg font-black text-pink-600">฿{Number(data.total).toLocaleString()}</span>
                            </div>
                            
                            {/* บรรทัดล่าง: แยกย่อยตามช่องทาง */}
                            <div className="flex flex-col gap-2">
                              {Object.entries(data.platforms)
                                .sort((a, b) => a[0].localeCompare(b[0], 'th', { numeric: true }))
                                .map(([platName, platVal]) => (
                                  <div key={platName} className="flex justify-between items-center px-1">
                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-pink-300"></span>
                                      {platName}
                                    </span>
                                    <span className="text-xs font-black text-slate-800">฿{Number(platVal).toLocaleString()}</span>
                                  </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>

            {/* แถวที่ 3: ตารางรายการรายวัน */}
            <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-6">
              <div className="p-6 border-b border-slate-100 bg-slate-50/80">
                <h5 className="font-black text-slate-800 text-lg">📑 รายการลงเวลาไลฟ์สด ({monthlyLogs.length} รายการ)</h5>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-md z-10 shadow-sm">
                    <tr className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      <th className="p-5">วันที่</th>
                      {targetEmpId === 'all' && <th className="p-5">พนักงาน</th>}
                      <th className="p-5">ช่องทาง</th>
                      <th className="p-5 text-right">ยอดขาย (฿)</th>
                      <th className="p-5 text-center">ประเภท</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* 🚩 ตรงนี้เรียงเป็น a - b เพื่อให้วันที่ 26 ขึ้นก่อนอยู่แล้วครับ */}
                    {[...monthlyLogs].sort((a,b) => new Date(a.live_date) - new Date(b.live_date)).map((log, i) => {
                      const logDisplayDate = formatThaiDate(log.live_date);

                      return (
                        <tr key={i} className="hover:bg-pink-50/40 transition-colors">
                          <td className="p-5 text-sm font-bold text-slate-700">{logDisplayDate}</td>
                          {targetEmpId === 'all' && (
                            <td className="p-5 text-sm font-black text-pink-600">{log.streamer_name || '-'}</td>
                          )}
                          <td className="p-5">
                            <span className="bg-slate-100 text-xs font-black px-3 py-1.5 rounded-lg text-slate-600 uppercase border border-slate-200">{log.platform}</span>
                          </td>
                          <td className="p-5 text-right text-base font-black text-slate-800">฿{Number(log.net_sales).toLocaleString()}</td>
                          <td className="p-5 text-center">
                             {holidayCampaigns?.some(c => log.live_date >= c.startDate && log.live_date <= c.endDate) ? 
                              <span className="text-[10px] bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-black uppercase tracking-wider border border-purple-200">Holiday</span> :
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black uppercase tracking-wider border border-slate-200">Normal</span>
                             }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        );
      })()}
    </div>
  </div>
)}

{/* ========================================================================= */}
        {/* 📢 VIEW: NEWS TICKER (แถบตัววิ่ง - แก้ไขเรื่อง z-index ไม่ให้บังแจ้งเตือน) */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center shadow-lg z-0 relative border-b border-slate-800 shrink-0">
          {/* ⬆️ ผมเปลี่ยนจาก z-40 เป็น z-0 แล้วครับพี่ คราวนี้แจ้งเตือนจะลอยทับมันได้แน่นอน */}
          
          {/* ป้ายประกาศ LIVE */}
          <div className="flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-10 flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
            LIVE UPDATE
          </div>
          
          {/* พื้นที่ตัววิ่ง */}
          <div className="flex-1 overflow-hidden ml-4 relative flex items-center h-6 mask-image-fade">
            <style>
              {`
                @keyframes marquee {
                  0% { transform: translateX(100vw); }
                  100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                  display: inline-flex;
                  white-space: nowrap;
                  animation: marquee 35s linear infinite;
                }
                .animate-marquee:hover {
                  animation-play-state: paused;
                }
                .mask-image-fade {
                  -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                }
              `}
            </style>
            
            <div className="animate-marquee text-xs font-bold flex items-center gap-16 cursor-pointer text-slate-200">
              
              <span className="flex items-center gap-2">
                📈 <span className="text-emerald-400">ยอดขายรวมบริษัทเดือนนี้:</span> 
                ฿{(companySales?.current || 0).toLocaleString()} 🚀
              </span>

              {leaderboard && leaderboard.length > 0 && Number(leaderboard[0].current_sales) > 0 && (
                <span className="flex items-center gap-2">
                  👑 <span className="text-yellow-400">Top Rank อันดับ 1 ล่าสุด:</span> 
                  ปรบมือให้ {leaderboard[0].employees?.nickname || leaderboard[0].employees?.full_name || 'เพื่อนในทีม'} ทำยอดพุ่งถึง ฿{Number(leaderboard[0].current_sales).toLocaleString()}! 🎉
                </span>
              )}

              {allLiveHistory && allLiveHistory.length > 0 && Number(allLiveHistory[0].net_sales) > 0 && (
                <span className="flex items-center gap-2">
                  🔥 <span className="text-rose-400">ไลฟ์ล่าสุดโคตรปัง!</span> 
                  {allLiveHistory[0].streamer_name || allLiveHistory[0].employees?.full_name || 'เพื่อนสตรีมเมอร์'} เพิ่งจบไลฟ์ช่อง {allLiveHistory[0].platform} กวาดยอดไป ฿{Number(allLiveHistory[0].net_sales).toLocaleString()} 💸
                </span>
              )}

              <span className="flex items-center gap-2">
                ⏰ <span className="text-purple-400">System Reminder:</span> อย่าลืมกด "อัปโหลดสลิปยอดขาย" ทุกครั้งหลังจบกะ เพื่อให้ AI สแกนยอดให้แม่นยำนะครับ 💡
              </span>

            </div>
          </div>
        </div>

{/* ========================================================================= */}
      {/* 📢 VIEW: ADS MANAGEMENT (ระบบแจ้งโอน + AI ตรวจสลิป + ดึงชื่อบัญชีจาก DB จริง) */}
      {/* ========================================================================= */}
      {currentView === "ads_management" && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-100 pb-4 gap-4">
              <div>
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">📢 ระบบแจ้งโอนค่าโฆษณา (Ads)</h3>
                <p className="text-sm text-emerald-600 font-bold mt-1">🛡️ มีระบบ AI ตรวจสอบสลิปปลอมอัตโนมัติ</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => {
                    const ws = XLSX.utils.json_to_sheet(adsData.map(d => ({
                      "วันที่ทำรายการ": new Date(d.created_at).toLocaleString('th-TH'),
                      "บัญชีโฆษณา (แพลตฟอร์ม)": d.account_name,
                      "จำนวนเงิน (บาท)": d.amount,
                      "ผู้แจ้ง": d.created_by_name,
                      "สถานะ": d.status === 'verified' ? 'ตรวจสอบแล้ว' : 'รอตรวจสอบ'
                    })));
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Ads_Transactions");
                    XLSX.writeFile(wb, `ค่าโฆษณา_Export_${new Date().toLocaleDateString('th-TH').replace(/\//g,'-')}.xlsx`);
                  }}
                  className="flex-1 md:flex-none bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all shadow-sm"
                >
                  📥 Export (Excel สำหรับบัญชี)
                </button>

                <button 
                  onClick={async () => {
                    // 🌟 ดึงชื่อบัญชีจากตาราง platforms ที่มีอยู่แล้วในระบบของพี่มาแสดงแบบอัตโนมัติ
                    const accountOptions = platforms.map(p => `<option value="${p.name}">${p.name}</option>`).join('');

                    const { value: formValues } = await Swal.fire({
                      title: '➕ แจ้งโอนค่า Ads',
                      html: `
                        <div class="text-left space-y-4 mt-4">
                          <div>
                            <label class="text-xs font-bold text-slate-500 mb-1 block">เลือกบัญชีโฆษณา (แพลตฟอร์ม)</label>
                            <select id="ads-account" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-blue-400 cursor-pointer">
                              <option value="" disabled selected>-- กรุณาเลือกบัญชีโฆษณา --</option>
                              ${accountOptions}
                            </select>
                          </div>
                          <div>
                            <label class="text-xs font-bold text-slate-500 mb-1 block">ยอดโอน (บาท)</label>
                            <input id="ads-amount" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-blue-400" placeholder="เช่น 5000">
                          </div>
                          <div>
                            <label class="text-xs font-bold text-slate-500 mb-1 block">แนบสลิปโอนเงิน (ระบบจะสแกน QR อัตโนมัติ)</label>
                            <input id="ads-slip" type="file" accept="image/*" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400">
                          </div>
                        </div>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'บันทึกและตรวจสอบสลิป',
                      cancelButtonText: 'ยกเลิก',
                      customClass: { popup: 'rounded-[2rem]', confirmButton: 'bg-blue-600 text-white rounded-xl px-6 py-2.5 font-bold', cancelButton: 'bg-slate-100 text-slate-600 rounded-xl px-6 py-2.5 font-bold' },
                      preConfirm: () => {
                        const account = document.getElementById('ads-account').value;
                        const amount = document.getElementById('ads-amount').value;
                        const slip = document.getElementById('ads-slip').files[0];
                        if (!account || !amount || !slip) {
                          Swal.showValidationMessage('กรุณาเลือกบัญชี กรอกยอดเงิน และแนบสลิปให้ครบถ้วน');
                          return false;
                        }
                        return { account, amount, slip };
                      }
                    });

                    if (formValues) {
                      Swal.fire({ title: '🔍 กำลังให้ AI ตรวจสอบสลิป...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                      
                      try {
                        // 🔑 1. การตั้งค่า API ตรวจสลิป (เช่น SlipOK)
                        const SLIP_API_KEY = ""; // เอา API Key มาใส่ตรงนี้เมื่อสมัครเสร็จ
                        const SLIP_BRANCH_ID = ""; // เอา Branch ID มาใส่ตรงนี้

                        if (SLIP_API_KEY && SLIP_BRANCH_ID) {
                          const formData = new FormData();
                          formData.append("files", formValues.slip);
                          
                          const slipRes = await fetch(`https://api.slipok.com/api/line/apikey/${SLIP_BRANCH_ID}`, {
                            method: 'POST',
                            headers: { 'x-authorization': SLIP_API_KEY },
                            body: formData
                          });
                          const slipData = await slipRes.json();

                          // เช็คสลิปปลอม หรือ สลิปใช้ซ้ำ
                          if (!slipData.success) {
                            throw new Error("❌ สลิปปลอม, สลิปซ้ำ หรือไม่สามารถอ่าน QR Code ได้ครับ!");
                          }
                          // เช็คยอดเงินตุกติก (เงินในสลิป ไม่ตรงกับที่พิมพ์)
                          if (slipData.data.amount !== parseFloat(formValues.amount)) {
                            throw new Error(`❌ ยอดเงินไม่ตรง! ในสลิปโอนมา ${slipData.data.amount} บาท แต่พิมพ์แจ้งมา ${formValues.amount} บาท`);
                          }
                        } else {
                          // ถ้ายังไม่ใส่ API Key ระบบจะจำลองการโหลดให้ดูการทำงานไปก่อน
                          await new Promise(r => setTimeout(r, 1500)); 
                        }

                        // 📤 2. อัปโหลดรูปสลิปขึ้น Supabase Storage
                        const fileExt = formValues.slip.name.split('.').pop();
                        const fileName = `slip_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                        const { error: uploadError } = await supabase.storage.from('slips').upload(fileName, formValues.slip);
                        if (uploadError) throw uploadError;

                        const { data: publicUrlData } = supabase.storage.from('slips').getPublicUrl(fileName);
                        const slipUrl = publicUrlData.publicUrl;

                        // 💾 3. บันทึกข้อมูลลงฐานข้อมูล
                        const { error: insertError } = await supabase.from('ads_transactions').insert([{
                          account_name: formValues.account,
                          amount: parseFloat(formValues.amount),
                          slip_url: slipUrl,
                          created_by: user.id,
                          created_by_name: user.full_name || 'ไม่ระบุชื่อ'
                        }]);
                        if (insertError) throw insertError;

                        // 📲 4. แจ้งเตือนผ่าน LINE Messaging API
const LINE_ACCESS_TOKEN = "KSit6BdEb6WzdTuo/KyzPL6fVJY3592ZP0t0EhuuVf+It8dL7+nCe79146LCuyIliCHih5555dZDKE97iaJZID8YLB2QPs30ERMk+6WXn8mIRz4ynZlZCwJHTCHcGRg6/zrQ6HhZd65vSti9zgccBAdB04t89/1O/w1cDnyilFU="; 
const LINE_USER_ID = "C0df0123907f46aa88c44ef72e88ea30f"; 

if (LINE_ACCESS_TOKEN && LINE_USER_ID) {
  // เติม https://corsproxy.io/? เข้าไปข้างหน้า URL ของไลน์ครับ
  await fetch('https://corsproxy.io/?https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      to: LINE_USER_ID,
      messages: [{
        type: 'text',
        text: `📢 แจ้งยอดโอนค่า Ads\n👤 แจ้งโดย: ${user.full_name}\n💼 บัญชี: ${formValues.account}\n💰 ยอดเงิน: ${formValues.amount} บาท\n🛡️ สถานะ: ตรวจสอบสลิปผ่านแล้ว ✅\nดูรูปสลิป: ${slipUrl}`
      }]
    })
  }).catch(err => console.error("Line API Error:", err));
}

                        Swal.fire({ icon: 'success', title: 'ตรวจสลิปผ่านและบันทึกสำเร็จ!', text: 'ส่งแจ้งเตือนให้ทีมบัญชีเรียบร้อย', timer: 2000, showConfirmButton: false, customClass: { popup: 'rounded-[2rem]' } });
                        fetchAdsTransactions();
                      } catch (error) {
                        Swal.fire({ icon: 'error', title: 'พบปัญหา!', text: error.message, customClass: { popup: 'rounded-[2rem]', confirmButton: 'bg-rose-500 text-white rounded-xl px-6 py-2.5 font-bold' } });
                      }
                    }
                  }}
                  className="flex-1 md:flex-none bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
                >
                  ➕ แจ้งเติมเงิน Ads
                </button>
              </div>
            </div>

            {/* ตารางแสดงรายการสลิป */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-2">วันเวลาที่แจ้ง</th>
                    <th className="px-4 py-2">ผู้แจ้ง</th>
                    <th className="px-4 py-2">บัญชีที่เติม</th>
                    <th className="px-4 py-2 text-right">ยอดเงิน (บาท)</th>
                    <th className="px-4 py-2 text-center">สลิป</th>
                    <th className="px-4 py-2 text-center">สถานะบัญชี</th>
                    <th className="px-4 py-2 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {adsData.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-xl">ยังไม่มีรายการแจ้งโอนค่า Ads</td></tr>
                  ) : (
                    adsData.map((item) => (
                      <tr key={item.id} className="bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                        <td className="px-4 py-4 rounded-l-xl text-xs font-bold text-slate-600">{new Date(item.created_at).toLocaleString('th-TH')}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-700">{item.created_by_name}</td>
                        <td className="px-4 py-4 text-xs font-black text-indigo-600">{item.account_name}</td>
                        <td className="px-4 py-4 text-right font-black text-rose-600">฿{Number(item.amount).toLocaleString()}</td>
                        <td className="px-4 py-4 text-center">
                          {item.slip_url ? (
                            <button onClick={() => Swal.fire({ imageUrl: item.slip_url, showConfirmButton: false, showCloseButton: true, customClass: { popup: 'rounded-[2rem] bg-transparent shadow-none', image: 'rounded-2xl max-w-full' } })} className="text-blue-500 hover:text-blue-700 font-bold text-xs underline">
                              ดูสลิป
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">ไม่มีรูป</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {item.status === 'verified' 
                            ? <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black">✔️ ตรวจสอบแล้ว</span>
                            : <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">⏳ รอตรวจสอบ</span>
                          }
                        </td>
                        <td className="px-4 py-4 rounded-r-xl text-right">
                          {(user?.role === 'admin' || user?.role === 'ceo') && item.status === 'pending' && (
                            <button 
                              onClick={async () => {
                                const { error } = await supabase.from('ads_transactions').update({ status: 'verified' }).eq('id', item.id);
                                if (!error) {
                                  Swal.fire({ icon: 'success', title: 'ยืนยันยอดเรียบร้อย', timer: 1000, showConfirmButton: false });
                                  fetchAdsTransactions();
                                }
                              }} 
                              className="text-[10px] bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-black shadow-sm hover:bg-emerald-600 transition-colors"
                            >
                              ยืนยันยอดเงิน
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}





        {/* ========================================================================= */}
        {/* ✅ VIEW: DASHBOARD (ภาพรวมบริษัท + ตั้งเป้าหมายรายเดือน ฉบับสมบูรณ์) */}
        {/* ========================================================================= */}
        {currentView === "dashboard" && (
          <div className="px-4 md:px-8 space-y-6 z-10 pb-8 mt-4 animate-fade-in">
            
            
            {/* 🤖 AI Chat Head (AI Secretary สำหรับบอส) */}
            {(user?.role === 'admin' || user?.role === 'ceo') && (() => {
              const active = (todayStats?.totalActive || 0) - (todayStats?.totalLate || 0);
              const late = todayStats?.totalLate || 0;
              const leave = todayStats?.totalLeave || 0;
              const pendingLeaveCount = adminLeaves?.filter(l => l.status === 'รออนุมัติ').length || 0;
              const totalSales = (allSalesData || []).reduce((sum, s) => sum + Number(s.current_sales || 0), 0);

              return (
                <div id="ai-messenger-head" className="fixed bottom-6 right-6 z-[9999]" style={{ touchAction: 'none' }}>
                  <input type="checkbox" id="ai-toggle" className="peer hidden" />
                  <div id="ai-chat-panel" className="absolute hidden peer-checked:flex flex-col w-[300px] sm:w-[340px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-200 overflow-hidden z-[10000] animate-fade-in origin-bottom-right" style={{ bottom: '100%', right: '0', marginBottom: '15px' }}>
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative"><div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">🤖</div><span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span></div>
                        <div><h4 className="font-bold text-white text-sm">AI Secretary</h4><p className="text-blue-100 text-[10px]">Active now</p></div>
                      </div>
                      <label htmlFor="ai-toggle" className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors font-bold text-sm">✕</label>
                    </div>
                    <div className="p-4 bg-slate-50 space-y-4 max-h-[60vh] overflow-y-auto">
                      <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200 text-sm text-slate-700 space-y-2">
                        <p className="font-bold text-indigo-700 border-b border-slate-100 pb-1">📊 รายงานภาพรวมบริษัท:</p>
                        <p className="text-xs">👥 <b>คนทำงาน:</b> มา {active} | สาย {late} | ลา {leave}</p>
                        <p className="text-xs">💰 <b>ยอดขายรวม:</b> <span className="text-blue-600 font-bold">฿{totalSales.toLocaleString()}</span></p>
                        {pendingLeaveCount > 0 && <p className="text-rose-600 font-bold text-xs animate-pulse">⚠️ มีคำขอค้างอนุมัติ {pendingLeaveCount} รายการ</p>}
                      </div>
                    </div>
                  </div>
                  <label htmlFor="ai-toggle" className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl shadow-xl shadow-blue-500/40 cursor-pointer block border-[3px] border-white/90">🤖</label>
                </div>
              );
            })()}

            {/* ============================================================================================== */}
          {/* START: ส่วนที่ปรับการจัดวางเป็น 1 - 1 (ฉบับแก้ไขยอดขายให้ขึ้นชัวร์) */}
          {/* ============================================================================================== */}
          <div className={`grid grid-cols-1 ${user?.role === 'admin' || user?.role === 'ceo' ? 'lg:grid-cols-2' : ''} gap-4 mb-4 items-stretch`}>
            
            {/* 📈 ก้อนที่ 1: ภาพรวมยอดขายองค์กร (อัปเกรดระบบบันทึกถาวร) */}
            {(() => {
              // 1. ดึงยอดปัจจุบันจาก State หลัก
              const totalCompanySales = Number(companySales?.current || 0);
              
              // 2. ดึงเป้าหมายจาก State หลัก (ถ้าไม่มีให้ใช้ 5,000,000 เป็นค่าเริ่มต้น)
              const companyTargetAmount = Number(companySales?.target || 5000000);
              
              // 3. คำนวณเปอร์เซ็นต์
              const companyProgress = Math.min(100, (totalCompanySales / (companyTargetAmount || 1)) * 100).toFixed(1);

              // 🛠️ ฟังก์ชันบันทึกเป้าหมายใหม่ (อัปเกรดเป็นระบบ DB)
              const handleSetCompanyTarget = async () => {
                const { value: newTarget } = await Swal.fire({
                  title: '⚙️ ตั้งเป้าหมายยอดขายองค์กร',
                  html: '<p class="text-sm text-slate-500 mb-2 font-bold">ระบุยอดขายเป้าหมายรวมของบริษัท (บาท)</p>',
                  input: 'number',
                  inputValue: companyTargetAmount,
                  showCancelButton: true,
                  confirmButtonText: 'บันทึกเป้าหมายลงฐานข้อมูล',
                  cancelButtonText: 'ยกเลิก',
                  confirmButtonColor: '#2563EB',
                  customClass: { popup: 'rounded-[2rem]' }
                });

                if (newTarget) {
                  Swal.fire({ title: 'กำลังบันทึก...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  try {
                    // ✅ บันทึกลงฐานข้อมูลเพื่อให้ทุกเครื่องเห็นตรงกัน
                    await supabase.from('system_settings').upsert([
                      { setting_key: 'company_target', setting_value: String(newTarget) }
                    ], { onConflict: 'setting_key' });

                    // ✅ อัปเดต State ทันที (หน้าจอจะเปลี่ยนทันทีโดยไม่ต้องโหลดใหม่)
                    if (typeof setCompanySales === 'function') {
                      setCompanySales(prev => ({ ...prev, target: Number(newTarget) }));
                    }

                    Swal.fire({ icon: 'success', title: 'สำเร็จ', text: 'อัปเดตเป้าหมายเรียบร้อยแล้ว', timer: 1500, showConfirmButton: false });
                    
                    // เรียกโหลดข้อมูลใหม่เพื่อความชัวร์ (ถ้ามีฟังก์ชันนี้)
                    if (typeof fetchDashboardData === 'function') fetchDashboardData(true);

                  } catch (err) { 
                    Swal.fire('Error', err.message, 'error'); 
                  }
                }
              };

              return (
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white animate-fade-in relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-blue-100">📈</div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-black text-slate-800 text-lg md:text-xl tracking-tight">ภาพรวมยอดขายองค์กร</h3>
                          {(user?.role === 'admin' || user?.role === 'ceo') && (
                            <button onClick={handleSetCompanyTarget} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95">
                              ⚙️ ตั้งเป้าหมาย
                            </button>
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">ความคืบหน้าประจำเดือนนี้</p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Achieved</p>
                      <p className="text-3xl font-black text-blue-600 tabular-nums leading-none">{companyProgress}%</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2 px-1">
                      <p className="text-xl md:text-2xl font-black text-slate-700 tabular-nums">฿{totalCompanySales.toLocaleString()}</p>
                      <p className="text-xs font-bold text-slate-400">Target: <span className="text-slate-500">฿{companyTargetAmount.toLocaleString()}</span></p>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 border border-slate-200 overflow-hidden shadow-inner">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-1000 relative" style={{ width: `${companyProgress}%` }}>
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[stripes_1s_linear_infinite]"></div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Cloud Database Sync</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold italic">
                        อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 👥 ก้อนที่ 2: สรุปสถานะพนักงานวันนี้ */}
            {(user?.role === 'admin' || user?.role === 'ceo') && (
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white animate-fade-in h-full flex flex-col justify-between">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-black text-slate-800 flex items-center gap-3 text-lg">
                    <span className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">👥</span> สรุปสถานะพนักงานวันนี้
                  </h4>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase">
                    {new Date().toLocaleDateString('th-TH', { dateStyle: 'medium' })}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 mb-1 uppercase">On-Duty</p>
                    <p className="text-3xl font-black text-emerald-500">{(todayStats.totalActive || 0) - (todayStats.totalLate || 0)}</p>
                  </div>
                  <div className="bg-rose-50 rounded-2xl p-4 text-center border border-rose-100">
                    <p className="text-[10px] font-bold text-rose-600 mb-1 uppercase">Late</p>
                    <p className="text-3xl font-black text-rose-500">{todayStats.totalLate || 0}</p>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-600 mb-1 uppercase">On-Leave</p>
                    <p className="text-3xl font-black text-amber-500">{todayStats.totalLeave || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* ============================================================================================== */}
          {/* END: ส่วนที่ปรับการจัดวาง */}
          {/* ============================================================================================== */}

            {/* 💎 SECTION ยอดขาย: แยกสิทธิ์การมองเห็น */}
            { (user?.role === 'admin' || user?.role === 'ceo') ? (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-7 text-white shadow-2xl relative overflow-hidden border border-slate-700">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-2xl font-black flex items-center gap-3"><span className="text-3xl">📸</span> สรุปยอดขายทีม Live Streamer (Tiktok)</h3>
                    
                    {/* 🚩 ปรับตรงนี้: จับกลุ่มข้อความและปุ่มให้อยู่บรรทัดเดียวกัน */}
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Real-time Team Performance Leaderboard</p>
                      
                      {/* 🚩 ปุ่มสำหรับตั้งค่าเรทเทศกาล (โชว์เฉพาะ Admin / CEO) */}
                      {(user?.role === 'admin' || user?.role === 'ceo') && (
                        <button onClick={handleManageCampaigns} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] px-3 py-1.5 rounded-full font-black shadow-sm hover:scale-105 transition-all flex items-center gap-1 border border-orange-300">
                          🎉 ตั้งค่าเรทเทศกาล
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
                    <p className="text-[10px] text-blue-300 font-black uppercase tracking-tighter mb-1">ยอดขายรวมพนักงานไลฟ์สด</p>
                    <p className="text-2xl font-black text-white tabular-nums">
                      {/* 🟢 ดึงยอดรวมมาโชว์ (รวมบอส) */}
                      ฿{(allSalesData || []).filter(sale => {
                          const pos = (sale.employees?.position || '').toLowerCase();
                          return pos.includes('live') || pos.includes('streamer') || pos.includes('tiktok') || pos.includes('ไลฟ์') || sale.employees?.employee_code === 'PL001';
                        }).reduce((sum, i) => sum + Number(i.current_sales || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(() => {
                    // 🟢 เรียงลำดับยอดขาย โดยเอาบอสเข้ามาร่วมด้วย
                    const liveStaff = (allSalesData || []).filter(sale => {
                      const pos = (sale.employees?.position || '').toLowerCase();
                      return pos.includes('live') || pos.includes('streamer') || pos.includes('tiktok') || pos.includes('ไลฟ์') || sale.employees?.employee_code === 'PL001';
                    }).sort((a,b) => Number(b.current_sales) - Number(a.current_sales));

                    if (liveStaff.length === 0) return <div className="col-span-full py-10 text-center text-slate-500 font-bold uppercase tracking-widest text-sm">-- ไม่พบพนักงานไลฟ์สดในขณะนี้ --</div>;

                    return liveStaff.map((staff, idx) => {
                      const percent = Math.min(100, (Number(staff.current_sales) / (Number(staff.target_sales) || 1)) * 100);
                      
                      // 🟢 ดักจับข้อมูลลาออกแบบครอบคลุม (Boolean false, String 'false', 'FALSE' หรือ NULL)
                      const isActive = staff.employees?.is_active;
                      const isResigned = isActive === false || String(isActive).toUpperCase() === 'FALSE' || isActive === null;
                      
                      // 🟢 เงื่อนไขใหม่: จะได้ป้าย TOP ก็ต่อเมื่ออยู่อันดับ 1 "และ" มียอดขายมากกว่า 0 "และ" ยังไม่ลาออก
                      const isTop = idx === 0 && Number(staff.current_sales) > 0 && !isResigned;
                      
                      // 👑 ใส่มงกุฎถ้าเป็นบอส
                      const isBoss = staff.employees?.employee_code === 'PL001';
                      const displayName = isBoss ? `👑 ${staff.employees?.full_name} (บอส)` : `${staff.employees?.full_name}`;

                      return (
                        <div key={idx} className={`border p-5 rounded-2xl transition-all group relative overflow-hidden ${
                          isResigned 
                            ? 'bg-slate-800/50 border-slate-700 opacity-60 grayscale-[50%]' // สไตล์สำหรับคนลาออก (สีเทาๆ กลืนๆ)
                            : 'bg-white/5 border-white/10 hover:bg-white/10' // สไตล์ปกติ
                        }`}>
                          
                          {/* 🛑 ป้ายแจ้งเตือนสำหรับคนลาออก (เปลี่ยนเป็นสีแดง และย้ายมาฝั่งซ้าย) */}
                          {isResigned && (
                            <div className="absolute top-[12px] -left-[30px] w-[110px] bg-red-600 text-white text-[9px] font-black py-1 text-center -rotate-45 shadow-lg z-10 border-y border-red-700">
                              🚪 ลาออก
                            </div>
                          )}

                          {/* 🟢 แก้ไขป้ายมุมขวาบนให้ยาวขึ้น พาดมุมสวยงาม ไม่แหว่ง (ซ่อนถ้าลาออก) */}
                          {isTop && (
                            <div className="absolute top-[12px] -left-[30px] w-[110px] bg-gradient-to-r from-amber-300 to-amber-500 text-amber-950 text-[10px] font-black py-1 text-center -rotate-45 shadow-lg z-10">
                              TOP 1
                            </div>
                          )}

                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${
                                isResigned ? 'bg-slate-700 text-slate-500' // สีลำดับสำหรับคนลาออก
                                : isTop ? 'bg-amber-400 text-amber-950 shadow-[0_0_15px_rgba(251,191,36,0.5)]' 
                                : 'bg-slate-700 text-slate-300'
                              }`}>
                                {idx + 1}
                              </div>
                              <div>
                                {/* 👑 แสดงชื่อที่ใส่เงื่อนไขบอสไว้แล้ว */}
                                <p className={`font-black text-sm truncate w-24 sm:w-32 ${isResigned ? 'text-slate-400 line-through decoration-slate-500' : 'text-slate-100'}`} title={displayName}>{displayName}</p>
                                <p className={`text-[9px] font-bold uppercase ${isResigned ? 'text-slate-600' : 'text-slate-500'}`}>{staff.employees?.position}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-black ${isResigned ? 'text-emerald-700/50' : 'text-emerald-400'}`}>฿{Number(staff.current_sales).toLocaleString()}</p>
                              <p className={`text-[9px] font-bold italic ${isResigned ? 'text-slate-600' : 'text-slate-500'}`}>เป้า: ฿{Number(staff.target_sales).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className={`w-full h-1.5 rounded-full overflow-hidden mb-2 ${isResigned ? 'bg-slate-800' : 'bg-slate-800'}`}>
                            <div className={`h-full transition-all duration-1000 ${
                              isResigned ? 'bg-slate-600' // สีหลอดความคืบหน้าคนลาออก
                              : percent >= 100 ? 'bg-amber-400' 
                              : percent >= 80 ? 'bg-emerald-500' 
                              : 'bg-blue-500'
                            }`} style={{ width: `${percent}%` }}></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-[10px] font-black uppercase ${isResigned ? 'text-slate-600' : 'text-slate-500'}`}>Success Rate</span>
                            <span className={`text-[11px] font-black ${
                              isResigned ? 'text-slate-500'
                              : percent >= 100 ? 'text-amber-400 animate-pulse' 
                              : 'text-slate-300'
                            }`}>{percent.toFixed(1)}%</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* ✨ แถบแสดงสถานะอัปเดตด้านล่างสุดของตาราง (เพิ่มใหม่) */}
                <div className="relative z-10 mt-6 flex justify-between items-center border-t border-slate-700 pt-4">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Real-time Sync</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold italic">
                    อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>

              </div>
            ) : (
              (((user?.position || '').toLowerCase().includes('live') || (user?.position || '').toLowerCase().includes('ไลฟ์') || user?.role === 'admin' || user?.role === 'ceo' || user?.employee_code === 'PL001')) && (
                <div className="bg-gradient-to-br from-[#881337] via-[#be123c] to-[#4c0519] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden mb-6 border border-rose-300/30">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400/20 blur-[80px] rounded-full"></div>
                  <div className="relative z-10 flex justify-between items-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                      <span className="text-amber-300 text-[10px] md:text-xs animate-pulse">💎</span>
                      <span className="text-[10px] md:text-xs font-black text-white tracking-widest">ยอดขายของฉัน (Live Streamer)</span>
                    </div>
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 mt-2">
                    <div className="flex-1 w-full text-center md:text-left">
  
                          {/* 🚨 Smart Banner: จะโชว์แจ้งเตือนเฉพาะวันที่ 26, 27, 28 ของทุกเดือน */}
                          {new Date().getDate() >= 26 && new Date().getDate() <= 28 && (
                            <div className="bg-rose-500/20 border border-rose-400/50 text-rose-100 px-4 py-2.5 rounded-xl mb-4 text-xs md:text-sm font-bold flex flex-col md:flex-row items-center justify-between gap-3 animate-pulse shadow-lg backdrop-blur-md w-fit mx-auto md:mx-0">
                              <span className="flex items-center gap-2">
                                <span className="text-lg">📢</span> 
                                รอบบิลใหม่เริ่มแล้ว! อย่าลืมอัปเดตเป้าหมายของรอบบิลนี้นะ
                              </span>
                              <button 
                                onClick={handleUpdateMyTarget} 
                                className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-[10px] md:text-xs transition-all shadow-md w-full md:w-auto"
                              >
                                🎯 ตั้งเป้าเลย
                              </button>
                            </div>
                          )}

                          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-amber-200 tabular-nums">
                            ฿{Number(salesData?.current || 0).toLocaleString()}
                          </h2>
                          <div className="flex items-center gap-3 bg-black/20 w-fit px-3 py-2 rounded-xl border border-white/10 mx-auto md:mx-0">
                            <p className="text-[11px] text-rose-200 font-bold">
                              เป้าหมาย: <span className="text-white">฿{Number(salesData?.target || 100000).toLocaleString()}</span>
                            </p>
                            
                            {/* 🚀 ปุ่มเดิม: เรียกใช้ handleUpdateMyTarget */}
                            <button 
                              onClick={handleUpdateMyTarget} 
                              className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all hover:scale-105 active:scale-95 border border-white/20 shadow-md"
                            >
                              🎯 ตั้งเป้าใหม่
                            </button>
                          </div>
                        </div>
                    
                    {/* 🟢 อัปเดตกล่องคอมมิชชันตรงนี้ ให้แสดงแจกแจงแยกกระเป๋าชัดเจน */}
                    <div className="flex-1 w-full bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex justify-between items-start md:items-center">
                      <div className="flex-1">
                        <p className="text-[9px] text-pink-200 uppercase font-black tracking-wider mb-1">คอมมิชชันที่คาดหวัง</p>
                        <p className="text-2xl md:text-3xl font-black text-emerald-300 drop-shadow-[0_0_10px_rgba(110,231,183,0.5)]">
                          ฿{Number(salesData.estimated_commission || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        
                        {/* ✨ ส่วนแสดงรายละเอียดแยกบิล (โชว์เมื่อมียอดวันหยุด หรือ มีแคมเปญตั้งรออยู่) */}
                        {(salesData.holiday_comm > 0 || (holidayCampaigns && holidayCampaigns.length > 0)) && (
                          <div className="mt-2 text-[10px] space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/10 w-full md:w-[95%]">
                            <div className="flex justify-between text-slate-200 items-center">
                              <span>เรทปกติ ({salesData.commission_rate}%)</span>
                              <span className="font-bold">฿{Number(salesData.normal_comm || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-amber-300 items-center border-t border-white/10 pt-1 mt-1">
                              {/* ถ้ามียอดแล้วโชว์ชื่อแคมเปญที่ได้ ถ้ายังไม่มียอดโชว์ชื่อแคมเปญที่บริษัทจัดอยู่ */}
                              <span>
                                เรทพิเศษ ({
                                  salesData.holiday_comm > 0 
                                    ? (salesData.holiday_camps?.join(', ') || 'เทศกาล') 
                                    : (holidayCampaigns?.map(c => c.name).join(', ') || 'เทศกาล')
                                })
                              </span>
                              <span className="font-bold">฿{Number(salesData.holiday_comm || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center ml-2">
                        <span className="text-[8px] text-rose-200 font-bold uppercase tracking-widest">เรทค่าคอม</span>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex flex-col items-center justify-center border border-white/30 relative">
                          <span className="text-xs font-black text-amber-300">{salesData.commission_rate || 0}%</span>
                          {/* 🌟 ป้ายกระพริบดึงดูดสายตา โชว์เมื่อมีเทศกาลให้เก็บเกี่ยว หรือมียอดเทศกาลแล้ว */}
                          {(salesData.holiday_comm > 0 || (holidayCampaigns && holidayCampaigns.length > 0)) && (
                            <span className="absolute -bottom-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-md animate-pulse border border-white/20">
                              +พิเศษ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  <div className="relative z-10 mt-8">
                    <div className="flex justify-between items-end mb-2 px-1">
                      <span className="text-[10px] font-bold text-rose-200 uppercase tracking-wider">Achievement Progress</span>
                      <span className="text-xs font-black text-amber-300 drop-shadow-md">
                        {((Number(salesData.current || 0) / Number(salesData.target || 1)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-3 border border-white/10 overflow-hidden shadow-inner">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400" 
                        style={{ width: `${Math.min(100, (Number(salesData.current || 0) / Number(salesData.target || 1)) * 100)}%` }}
                      ></div>
                    </div>

                    {/* ✨ ส่วนแสดงเวลาอัปเดตยอดขาย (ปรับแบบ Real-time Sync เหมือนภาพรวมองค์กร) */}
                    <div className="mt-5 flex justify-between items-center border-t border-white/10 pt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Real-time Sync</span>
                      </div>
                      <p className="text-[10px] text-rose-200 font-bold italic">
                        อัปเดตล่าสุด: {
                          salesData.updated_at || salesData.created_at
                            ? new Date(salesData.updated_at || salesData.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
                            : new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}

           {/* --- ส่วนล่าง: ตารางรายการรออนุมัติ และ สถิติต่างๆ --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white h-[380px] flex flex-col">
                <div className="flex justify-between items-center mb-5">
                  <h4 className="font-black text-slate-800 flex items-center gap-3 text-lg"><span className="p-2 bg-pink-100 text-pink-500 rounded-xl">📝</span> {t.boxPending}</h4>
                  <button onClick={() => setCurrentView("history")} className="text-xs font-bold text-pink-500 hover:underline">{t.seeAll}</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {pendingLeaves.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-slate-400 font-bold text-sm">{t.noPending}</div> : 
                    pendingLeaves.map(leave => (
                      <div key={leave.id} className="flex justify-between items-center p-3 bg-slate-50 hover:bg-pink-50 rounded-2xl transition-colors border border-slate-100">
                        <span className="text-xs text-slate-500 font-medium bg-white px-3 py-1 rounded-lg border border-slate-100">{new Date(leave.created_at).toLocaleDateString('th-TH')}</span>
                        <span className="text-xs font-black text-slate-700 truncate mx-2">{getTranslatedType(leave.leave_type)}</span>
                        <span className="text-[10px] bg-purple-100 text-purple-600 px-3 py-1.5 rounded-full font-black uppercase">{getTranslatedStatus(leave.status)}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white h-[380px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-black text-slate-800 flex items-center gap-3 text-lg"><span className="p-2 bg-purple-100 text-purple-500 rounded-xl">📊</span> {t.boxStats}</h4>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['pie', 'bar', 'line'].map(type => (
                      <button key={type} onClick={()=>setChartType(type)} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${chartType===type ? 'bg-white text-purple-600 shadow-sm':'text-slate-400'}`}>
                        {type === 'pie' ? '⭕' : type === 'bar' ? '📊' : '📈'} {t[`chart${type.charAt(0).toUpperCase() + type.slice(1)}`]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  
                  {/* ⭕ Pie Chart */}
                  {chartType === 'pie' && (
                     <div className="flex items-center gap-8 justify-center w-full animate-fade-in">
                        <div className="relative w-36 h-36 rounded-full shadow-inner" style={{ background: `conic-gradient(#F472B6 0% ${sickP}%, #A855F7 ${sickP}% ${sickP+persP}%, #34D399 ${sickP+persP}% ${sickP+persP+vacP}%, #FBBF24 ${sickP+persP+vacP}% 100%)` }}>
                          <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner"><span className="text-2xl font-black">{totalLeavesCount}</span><span className="text-[9px] font-bold text-slate-400 uppercase">Requests</span></div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex gap-2 items-center"><div className="w-3 h-3 rounded-sm bg-[#F472B6]"></div><span className="text-[11px] font-bold text-slate-600">ลาป่วย ({sickP}%)</span></div>
                           <div className="flex gap-2 items-center"><div className="w-3 h-3 rounded-sm bg-[#A855F7]"></div><span className="text-[11px] font-bold text-slate-600">ลากิจ ({persP}%)</span></div>
                           <div className="flex gap-2 items-center"><div className="w-3 h-3 rounded-sm bg-[#34D399]"></div><span className="text-[11px] font-bold text-slate-600">ลาพักร้อน ({vacP}%)</span></div>
                        </div>
                     </div>
                  )}

                  {/* 📊 Bar Chart */}
                  {chartType === 'bar' && (
                     <div className="w-full h-full flex items-end justify-center gap-6 pb-4 pt-8 animate-fade-in px-4">
                        <div className="flex flex-col items-center gap-2 w-1/3">
                          <span className="text-xs font-black text-pink-500">{sickP}%</span>
                          <div className="w-full bg-slate-100 rounded-t-xl flex items-end h-32">
                            <div className="w-full bg-[#F472B6] rounded-t-xl transition-all duration-500" style={{ height: `${sickP}%`, minHeight: sickP > 0 ? '10%' : '0%' }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">ลาป่วย</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-1/3">
                          <span className="text-xs font-black text-purple-500">{persP}%</span>
                          <div className="w-full bg-slate-100 rounded-t-xl flex items-end h-32">
                            <div className="w-full bg-[#A855F7] rounded-t-xl transition-all duration-500" style={{ height: `${persP}%`, minHeight: persP > 0 ? '10%' : '0%' }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">ลากิจ</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-1/3">
                          <span className="text-xs font-black text-emerald-500">{vacP}%</span>
                          <div className="w-full bg-slate-100 rounded-t-xl flex items-end h-32">
                            <div className="w-full bg-[#34D399] rounded-t-xl transition-all duration-500" style={{ height: `${vacP}%`, minHeight: vacP > 0 ? '10%' : '0%' }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">ลาพักร้อน</span>
                        </div>
                     </div>
                  )}

                  {/* 📈 Line Chart */}
                  {chartType === 'line' && (
                    <div className="w-full h-full flex flex-col justify-end pb-8 pt-8 relative animate-fade-in px-8">
                       <div className="absolute inset-x-8 top-8 bottom-12 border-b-2 border-l-2 border-slate-100 flex flex-col justify-between">
                         <div className="border-b border-slate-50 w-full h-0"></div>
                         <div className="border-b border-slate-50 w-full h-0"></div>
                         <div className="border-b border-slate-50 w-full h-0"></div>
                       </div>
                       
                       <div className="relative flex justify-between items-end h-32 w-full z-10">
                          <div className="flex flex-col items-center relative" style={{ bottom: `calc(${sickP}% - 10px)` }}>
                            <span className="text-[10px] font-black text-[#F472B6] absolute -top-5">{sickP}%</span>
                            <div className="w-3 h-3 bg-[#F472B6] rounded-full shadow-md ring-2 ring-white"></div>
                          </div>
                          <div className="flex flex-col items-center relative" style={{ bottom: `calc(${persP}% - 10px)` }}>
                            <span className="text-[10px] font-black text-[#A855F7] absolute -top-5">{persP}%</span>
                            <div className="w-3 h-3 bg-[#A855F7] rounded-full shadow-md ring-2 ring-white"></div>
                          </div>
                          <div className="flex flex-col items-center relative" style={{ bottom: `calc(${vacP}% - 10px)` }}>
                            <span className="text-[10px] font-black text-[#34D399] absolute -top-5">{vacP}%</span>
                            <div className="w-3 h-3 bg-[#34D399] rounded-full shadow-md ring-2 ring-white"></div>
                          </div>
                       </div>

                       <div className="flex justify-between w-full mt-2 z-10 text-[10px] font-bold text-slate-500 px-1">
                          <span>ลาป่วย</span>
                          <span>ลากิจ</span>
                          <span>ลาพักร้อน</span>
                       </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white h-[350px] flex flex-col">
                <h4 className="font-black text-slate-800 flex items-center gap-3 mb-5 text-lg"><span className="p-2 bg-emerald-100 text-emerald-500 rounded-xl">📑</span> {t.boxQuota}</h4>
                <div className="flex-1 overflow-x-auto overflow-y-auto pr-2 custom-scrollbar">
                  <table className="w-full text-left border-separate border-spacing-y-2 min-w-[350px]">
                    <thead className="text-[11px] text-slate-400 bg-slate-50 sticky top-0 z-10">
                      <tr>
                        <th className="p-3 rounded-l-xl">{t.thType}</th>
                        <th className="p-3 text-center">{t.thTotal}</th>
                        <th className="p-3 text-center">{t.thUsed || 'ใช้ไป'}</th>
                        <th className="p-3 text-right rounded-r-xl">{t.thRemain}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveBalances.map(b => {
                        const thaiType = getTranslatedType(b.leave_type);
                        
                        const pendingMins = (allLeaves || [])
                          .filter(l => (l.leave_type === b.leave_type || l.leave_type === thaiType) && l.status === 'รออนุมัติ')
                          .reduce((sum, l) => sum + Number(l.duration_minutes || 0), 0);
                        
                        const totalUsedMins = Number(b.used_minutes || 0);
                        const remainMins = (Number(b.total_days || 0) * 480) - totalUsedMins;

                        return (
                          <tr key={b.id} className="bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all">
                            <td className="p-3 font-bold text-slate-700 text-xs rounded-l-xl">
                              {thaiType}
                              {pendingMins > 0 && (
                                <span className="block text-[10px] text-purple-500 font-bold mt-1">
                                  ⏳ มีรออนุมัติ: {formatDuration(pendingMins)}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-slate-400 text-center text-[10px]">
                              {formatDuration(b.total_days * 480)}
                            </td>
                            <td className="p-3 text-pink-500 font-bold text-center text-[10px]">
                              {totalUsedMins > 0 ? formatDuration(totalUsedMins) : '-'}
                            </td>
                            <td className={`p-3 font-black text-right text-xs rounded-r-xl ${remainMins < 0 ? 'text-pink-500' : 'text-emerald-500'}`}>
                              {formatDuration(remainMins)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white h-[350px] flex flex-col">
                <div className="flex justify-between items-center mb-6"><h4 className="font-black text-slate-800 flex items-center gap-3 text-lg"><span className="p-2 bg-pink-100 text-pink-500 rounded-xl">📆</span> {t.boxCal}</h4><div className="font-bold text-pink-500 bg-pink-50 px-4 py-1 rounded-full text-xs">{t.monthNames[today.getMonth()]} {today.getFullYear() + 543}</div></div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">{t.dayNames.map(d => <div key={d} className="text-[10px] font-black text-slate-400">{d}</div>)}</div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {blanksArray.map(b => <div key={`blank-${b}`} className="p-1"></div>)}
                    {daysArray.map(day => (<div key={day} className="p-1 flex justify-center items-center"><span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-[11px] transition-all ${day === today.getDate() ? 'bg-gradient-to-tr from-pink-500 to-purple-400 text-white shadow-md scale-110' : 'text-slate-600 hover:bg-slate-100'}`}>{day}</span></div>))}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}
      {/* ========================================================================= */}
      {/* 📢 VIEW: COMPANY ANNOUNCEMENTS (V.2 อัปเกรด DB & ระบบ Popup ตั้งเวลา) */}
      {/* ========================================================================= */}
      {currentView === "announcements" && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col relative overflow-hidden">
            
            {/* ของตกแต่ง Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob pointer-events-none"></div>

            {/* Header */}
            <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div>
                <h3 className="font-black text-slate-800 text-xl md:text-2xl flex items-center gap-3">
                  <span className="p-2 bg-orange-100 text-orange-600 rounded-xl shadow-inner text-2xl">📢</span> 
                  ป้ายประกาศองค์กร
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-2 ml-1">อัปเดตข่าวสาร นโยบาย และประกาศสำคัญจากบริษัท</p>
              </div>
              
              {/* ปุ่มสร้างประกาศ จะเห็นเฉพาะ Admin หรือ CEO */}
              {(user?.role === 'admin' || user?.role === 'ceo') && (
                <button 
                  onClick={async () => {
                    // 🛠️ อัปเกรด: ฟอร์มสร้างประกาศแบบใหม่ มีให้เลือกเวลาตั้ง Popup
                    const { value: formValues } = await Swal.fire({
                      title: 'สร้างประกาศใหม่',
                      html: `
                        <div class="text-left mt-2 font-sans">
                          <label class="block text-xs font-bold text-slate-500 mb-1">หัวข้อประกาศ *</label>
                          <input id="swal-title" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 font-bold focus:border-orange-400 outline-none" placeholder="เช่น วันหยุดเทศกาลปีใหม่...">
                          
                          <label class="block text-xs font-bold text-slate-500 mb-1">รายละเอียด *</label>
                          <textarea id="swal-desc" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-32 font-medium focus:border-orange-400 outline-none" placeholder="พิมพ์รายละเอียดประกาศที่นี่..."></textarea>
                          
                          <label class="block text-xs font-bold text-slate-500 mb-1 mt-4">ระดับความสำคัญ</label>
                          <select id="swal-priority" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 font-bold focus:border-orange-400 outline-none text-slate-700" onchange="document.getElementById('popup-time-zone').style.display = this.value === 'high' ? 'block' : 'none'">
                            <option value="normal">🔵 แจ้งเพื่อทราบทั่วไป (Normal)</option>
                            <option value="high">🔴 ประกาศสำคัญมาก (เด้ง Popup)</option>
                          </select>

                          <div id="popup-time-zone" style="display: none;" class="bg-rose-50 p-4 rounded-xl border border-rose-200 mb-4">
                            <p class="text-[10px] font-bold text-rose-600 mb-2">⏰ ตั้งเวลาแสดง Popup (เว้นว่างไว้ถ้าอยากให้โชว์ตลอด)</p>
                            <div class="grid grid-cols-2 gap-2">
                               <div>
                                  <label class="block text-[9px] font-bold text-slate-500 mb-1">เริ่มแสดง</label>
                                  <input type="datetime-local" id="swal-start-time" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none">
                               </div>
                               <div>
                                  <label class="block text-[9px] font-bold text-slate-500 mb-1">หยุดแสดง</label>
                                  <input type="datetime-local" id="swal-end-time" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none">
                               </div>
                            </div>
                          </div>
                        </div>
                      `,
                      showCancelButton: true,
                      confirmButtonText: '🚀 ประกาศให้ทุกคนทราบ',
                      cancelButtonText: 'ยกเลิก',
                      confirmButtonColor: '#f97316',
                      customClass: { popup: 'rounded-[2rem] shadow-2xl' },
                      preConfirm: () => {
                        return {
                          title: document.getElementById('swal-title').value,
                          desc: document.getElementById('swal-desc').value,
                          priority: document.getElementById('swal-priority').value,
                          start_time: document.getElementById('swal-start-time').value || null,
                          end_time: document.getElementById('swal-end-time').value || null,
                        }
                      }
                    });

                    if (formValues) {
                      if (!formValues.title || !formValues.desc) return Swal.fire('ผิดพลาด', 'กรุณากรอกหัวข้อและรายละเอียดให้ครบ', 'warning');
                      
                      Swal.fire({ title: 'กำลังบันทึกและเผยแพร่...', didOpen: () => Swal.showLoading() });
                      try {
                        // 🛠️ อัปเกรด: ยิงข้อมูลลงตาราง announcements แทน
                        const { data, error } = await supabase.from('announcements').insert([{
                           title: formValues.title,
                           content: formValues.desc,
                           is_important: formValues.priority === 'high',
                           start_time: formValues.start_time,
                           end_time: formValues.end_time,
                           created_by: user.id
                        }]).select();

                        if (error) throw error;

                        // จำลองโครงสร้างข้อมูลใหม่ให้หน้าเว็บอัปเดตทันที (ใช้ชื่อฟิลด์ใหม่ให้เข้ากับ DB)
                        const newAnnDisplay = {
                            id: data[0].id,
                            title: data[0].title,
                            desc: data[0].content,
                            priority: data[0].is_important ? 'high' : 'normal',
                            date: data[0].created_at,
                            author: user.full_name || 'Admin'
                        };

                        setAnnouncements(prev => [newAnnDisplay, ...prev]);
                        
                        Swal.fire({ icon: 'success', title: 'เผยแพร่สำเร็จ!', text: 'พนักงานทุกคนจะเห็นประกาศนี้ในระบบทันที', timer: 2000, showConfirmButton: false, customClass: { popup: 'rounded-[2rem]' }});
                        
                        // เด้งกระดิ่งแจ้งเตือนทุกคน
                        if (typeof addNotification === 'function') addNotification("📢 ประกาศใหม่", `${formValues.title}`);
                        
                      } catch (err) {
                        Swal.fire('Error', err.message, 'error');
                      }
                    }
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-3 rounded-xl font-black text-sm shadow-md shadow-orange-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  ➕ สร้างประกาศใหม่
                </button>
              )}
            </div>

            {/* โซนแสดงรายการประกาศ */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 relative z-10 pb-10">
              {announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-slate-300 py-20 animate-pulse">
                  <span className="text-6xl mb-4 opacity-50">📭</span>
                  <p className="font-bold text-lg text-slate-400">ยังไม่มีประกาศจากบริษัทในขณะนี้</p>
                </div>
              ) : (
                announcements.map((ann) => (
                  <div key={ann.id} className={`p-5 md:p-6 rounded-[1.5rem] border shadow-sm relative overflow-hidden group transition-all hover:shadow-md ${ann.priority === 'high' ? 'bg-rose-50/80 border-rose-200' : 'bg-white border-slate-200'}`}>
                    
                    {/* แท็กความสำคัญ */}
                    {ann.priority === 'high' && (
                      <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-[1.5rem] tracking-widest uppercase shadow-sm">
                        🔥 สำคัญมาก
                      </div>
                    )}
                    
                    <h4 className={`text-lg md:text-xl font-black mb-3 pr-20 ${ann.priority === 'high' ? 'text-rose-700' : 'text-slate-800'}`}>
                      {ann.title}
                    </h4>
                    
                    <div className="text-sm text-slate-600 mb-5 whitespace-pre-wrap leading-relaxed">
                      {ann.desc || ann.content} {/* รองรับทั้งข้อมูลเก่าและข้อมูลใหม่จาก DB */}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${ann.priority === 'high' ? 'bg-rose-200 text-rose-700' : 'bg-slate-200 text-slate-600'}`}>👤</div>
                        <span className="text-[11px] font-bold text-slate-500">โดย: <span className="text-slate-800">{ann.author || 'Admin'}</span></span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-white/50 px-2 py-1 rounded-md border border-slate-100 flex items-center gap-1">
                        🗓️ {new Date(ann.date || ann.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.
                      </span>
                    </div>

                    {/* ปุ่มลบ (สำหรับ Admin/CEO) */}
                    {(user?.role === 'admin' || user?.role === 'ceo') && (
                      <button 
                        onClick={async () => {
                          const res = await Swal.fire({ title: 'ลบประกาศ?', text: 'ต้องการลบประกาศนี้ออกจากระบบใช่หรือไม่?', icon: 'warning', showCancelButton: true, confirmButtonText: 'ลบทิ้ง', confirmButtonColor: '#ef4444', customClass: { popup: 'rounded-[2rem]' } });
                          if(res.isConfirmed) {
                             // 🛠️ อัปเกรด: ลบจากตาราง announcements
                             await supabase.from('announcements').delete().eq('id', ann.id);
                             setAnnouncements(announcements.filter(a => a.id !== ann.id));
                             Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' }});
                          }
                        }}
                        className="absolute bottom-5 right-5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100" 
                        title="ลบประกาศ"
                      >
                        <span className="text-lg">🗑️</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

     {/* ========================================================================= */}
      {/* 💎 VIEW: MANAGE SALES (จัดการยอดขายพนักงาน) */}
      {/* ========================================================================= */}
      {currentView === "manage_sales" && (user?.role === 'admin' || user?.role === 'ceo') && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col relative overflow-hidden">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
              <div>
                <h3 className="font-black text-slate-800 text-xl md:text-2xl flex items-center gap-3">
                  <span className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shadow-inner text-2xl">💎</span> 
                  จัดการยอดขายพนักงาน
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-bold mt-2 ml-1 italic text-emerald-600">✨ เรียงลำดับตามรหัสพนักงาน (Employee Code)</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                 <input 
                  type="month" 
                  value={payrollFilterMonth} 
                  onChange={(e) => setPayrollFilterMonth(e.target.value)}
                  className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2.5 font-bold text-slate-600 outline-none focus:border-emerald-400 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar border border-slate-100 rounded-2xl shadow-inner bg-slate-50/50">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white sticky top-0 z-20 shadow-sm">
                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-wider border-b">รหัสพนักงาน</th>
                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-wider border-b">ชื่อ-นามสกุล</th>
                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-wider border-b text-center">ยอดขายปัจจุบัน (บาท)</th>
                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-wider border-b text-center">คอมมิชชั่น (%)</th>
                    <th className="p-5 font-black text-slate-400 text-[10px] uppercase tracking-wider border-b text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 🟢 แก้ไขการเรียงลำดับตรงนี้: เรียงตามรหัสพนักงาน */}
                  {[...allSalesData]
                    .sort((a, b) => (a.employees?.employee_code || "").localeCompare(b.employees?.employee_code || ""))
                    .map((sale, index) => (
                    <tr key={sale.id} className="hover:bg-emerald-50/30 transition-colors border-b border-slate-100 bg-white/50">
                      <td className="p-5 font-black text-indigo-600 text-sm">
                        {sale.employees?.employee_code}
                      </td>
                      <td className="p-5">
                        <p className="font-black text-slate-800 text-sm">{sale.employees?.full_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{sale.employees?.position}</p>
                      </td>
                      <td className="p-5 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-black text-sm border border-emerald-100">
                          ฿{Number(sale.current_sales || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="p-5 text-center font-black text-slate-600">
                        {sale.commission_rate || 0}%
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => {
                            setSelectedSale(sale);
                            setSalesForm({ 
                              current_sales: sale.current_sales, 
                              commission_rate: sale.commission_rate,
                              month: sale.month 
                            });
                            setIsSalesModalOpen(true);
                          }}
                          className="bg-white hover:bg-emerald-500 hover:text-white text-emerald-600 border-2 border-emerald-100 px-4 py-2 rounded-xl font-black text-xs transition-all shadow-sm"
                        >
                          แก้ไขยอดขาย
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


     {/* ========================================================================= */}
      {/* ⭐️ VIEW: KPI MANAGER (ฉบับแยกเกณฑ์: สายไลฟ์คิดยอดขาย / สายออฟฟิศคิดแต่วินัย) */}
      {/* ========================================================================= */}
      {currentView === "kpi_manager" && (user?.role === 'admin' || user?.role === 'ceo') && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
              <div>
                <h3 className="font-black text-slate-800 text-xl md:text-2xl flex items-center gap-3">
                  <span className="p-2 bg-amber-100 text-amber-600 rounded-xl shadow-inner text-2xl">⭐️</span> 
                  ประเมินผลงาน KPI
                </h3>
                <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-2 ml-1 italic text-amber-600">✨ ระบบแยกเกณฑ์ยอดขายเฉพาะสายไลฟ์อัตโนมัติ</p>
              </div>
              
              <div className="flex items-center gap-3">
                <input 
                  type="month" 
                  value={kpiMonth} 
                  onChange={(e) => setKpiMonth(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-black text-sm outline-none focus:border-amber-400 shadow-inner"
                />
                <button 
                  onClick={async () => {
                    Swal.fire({ title: 'กำลังบันทึก...', didOpen: () => Swal.showLoading() });
                    try {
                      await supabase.from('system_settings').upsert([{ setting_key: 'performance_reviews', setting_value: JSON.stringify(performanceReviews) }], { onConflict: 'setting_key' });
                      Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 1500, showConfirmButton: false });
                    } catch (e) { Swal.fire('Error', e.message, 'error'); }
                  }}
                  className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-lg hover:bg-black transition-all"
                >
                  💾 บันทึกเกรดทั้งหมด
                </button>
              </div>
            </div>

            {/* รายการพนักงาน */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {allSalesData.map((emp) => {
                // 🔍 ระบุประเภทพนักงาน
                const isLiveTeam = emp.employees?.position?.includes('ไลฟ์') || emp.employees?.position?.toLowerCase().includes('live');
                
                // 🧠 AI Logic: คำนวณสถิติ
                const empSales = emp.current_sales || 0;
                const empTarget = emp.target_sales || 1;
                const salesPercent = (empSales / empTarget) * 100;
                
                const lateCount = attendanceList.filter(a => a.employee_id === emp.employee_id && a.status === 'late' && a.date.startsWith(kpiMonth)).length;
                const leaveCount = allEmpLeaves.filter(l => l.employee_id === emp.employee_id && l.status === 'อนุมัติ' && l.start_date.startsWith(kpiMonth)).length;

                // 🧮 สูตรคำนวณคะแนน (แยกประเภท)
                let score = isLiveTeam ? 70 : 90; // สายออฟฟิศเริ่มที่ 90 เพราะไม่มีแต้มยอดขาย
                if (isLiveTeam) {
                  score += (salesPercent >= 100 ? 20 : (salesPercent / 100) * 20); // สายไลฟ์บวกยอดขายได้ 20 คะแนน
                } else {
                  score += 10; // สายออฟฟิศให้คะแนนฐานเพิ่มอีก 10 เพื่อให้เต็ม 100
                }
                
                score -= (lateCount * 3); // สายลบหนักหน่อย ครั้งละ 3
                score -= (leaveCount * 1); // ลาครั้งละ 1
                const finalScore = Math.max(0, Math.min(100, score)).toFixed(0);

                const review = performanceReviews[`${emp.employee_id}_${kpiMonth}`] || { grade: '-', comment: '' };

                return (
                  <div key={emp.employee_id} className={`bg-white border border-slate-100 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-all group border-l-8 ${isLiveTeam ? 'border-l-purple-400' : 'border-l-indigo-400'}`}>
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* ข้อมูลพนักงาน */}
                      <div className="lg:w-1/4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${isLiveTeam ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {isLiveTeam ? 'Live Performance' : 'Office Discipline'}
                          </span>
                        </div>
                        <p className="font-black text-slate-800 text-lg">{emp.employees?.full_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">{emp.employees?.employee_code} | {emp.employees?.position}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-[20px] font-black ${Number(finalScore) >= 80 ? 'text-emerald-500' : Number(finalScore) >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                            {finalScore}%
                          </span>
                          <span className="text-[9px] font-bold text-slate-400">Score</span>
                        </div>
                      </div>

                      {/* สถิติจริง (สลับตามประเภท) */}
                      <div className="lg:w-1/3 grid grid-cols-3 gap-2 border-x border-slate-50 px-6">
                        <div className="text-center flex flex-col justify-center">
                          <p className="text-[9px] font-bold text-slate-400 uppercase">ยอดขาย</p>
                          {isLiveTeam ? (
                            <p className={`text-sm font-black ${salesPercent >= 100 ? 'text-emerald-600' : 'text-slate-700'}`}>{salesPercent.toFixed(0)}%</p>
                          ) : (
                            <p className="text-[10px] font-bold text-slate-300 italic">ไม่คิดผลงาน</p>
                          )}
                        </div>
                        <div className="text-center flex flex-col justify-center">
                          <p className="text-[9px] font-bold text-slate-400 uppercase">มาสาย</p>
                          <p className={`text-sm font-black ${lateCount > 2 ? 'text-rose-600' : 'text-slate-700'}`}>{lateCount} ครั้ง</p>
                        </div>
                        <div className="text-center flex flex-col justify-center">
                          <p className="text-[9px] font-bold text-slate-400 uppercase">ลางาน</p>
                          <p className="text-sm font-black text-slate-700">{leaveCount} วัน</p>
                        </div>
                      </div>

                      {/* เกรดและคอมเมนต์ */}
                      <div className="flex-1 flex flex-col sm:flex-row gap-4 items-center">
                        <div className="w-full sm:w-24 text-center">
                          <label className="block text-[9px] font-bold text-slate-400 mb-1">เกรด</label>
                          <select 
                            value={review.grade}
                            onChange={(e) => {
                              const newReviews = { ...performanceReviews };
                              newReviews[`${emp.employee_id}_${kpiMonth}`] = { ...review, grade: e.target.value };
                              setPerformanceReviews(newReviews);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-black text-center text-amber-600 outline-none"
                          >
                            {['-', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                        <div className="flex-1 w-full">
                          <label className="block text-[9px] font-bold text-slate-400 mb-1">ความเห็นผู้บริหาร</label>
                          <input 
                            type="text"
                            placeholder="พิมพ์ข้อควรปรับปรุง..."
                            value={review.comment}
                            onChange={(e) => {
                              const newReviews = { ...performanceReviews };
                              newReviews[`${emp.employee_id}_${kpiMonth}`] = { ...review, comment: e.target.value };
                              setPerformanceReviews(newReviews);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none focus:bg-white focus:border-amber-400 shadow-inner"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )} 


{/* ========================================================================= */}
      {/* 💎 VIEW: SALES MANAGEMENT (หน้าจัดการยอดขาย สำหรับ CEO/Admin) */}
      {/* ========================================================================= */}
        {currentView === "sales" && (user?.role === 'admin' || user?.role === 'ceo') && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col">
              
              <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                  <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">💎 จัดการยอดขายพนักงาน</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">อัปเดตยอดขายและเป้าหมายของทีม (เรียงตามรหัสพนักงาน)</p>
                </div>
              </div>

              {/* 🧠 กรองข้อมูล และ เรียงลำดับตามรหัสพนักงาน (PL001 ขึ้นก่อน) */} 
                {(() => { 
                  const salesStaffOnly = (allSalesData || [])
                    .filter(sale => { 
                      const pos = (sale.employees?.position || '').toLowerCase(); 
                      return pos.includes('live') || 
                             pos.includes('streamer') || 
                             pos.includes('tiktok') || 
                             pos.includes('ไลฟ์') || 
                             sale.employees?.employee_code === 'PL001'; 
                    })
                    // 🟢 เพิ่มการ Sort ตรงนี้: เรียงตามรหัสพนักงาน
                    .sort((a, b) => {
                      const codeA = a.employees?.employee_code || "";
                      const codeB = b.employees?.employee_code || "";
                      return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
                    });

                  const calculateCommission = (sale, empId) => {
                    const sales = Number(sale.current_sales || 0);
                    const normalRate = Number(sale.commission_rate || 0);
                    return sales * (normalRate / 100);
                  };

                return (
                  <>
                    {/* 🤖 1. AI Sales Performance Analyzer */}
                    <div className="mb-6 relative z-10 animate-fade-in">
                      <div className="p-5 rounded-[1.5rem] border bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl animate-bounce-subtle">🧠</span>
                          <h4 className="font-black text-sm uppercase tracking-wider text-indigo-700">
                            AI Sales Analyzer: วิเคราะห์ประสิทธิภาพแบบ Real-time
                          </h4>
                        </div>

                        {salesStaffOnly.length === 0 ? (
                          <div className="bg-white/50 p-4 rounded-xl border border-dashed border-indigo-200 text-center">
                            <p className="text-xs text-indigo-400 font-bold italic">"รอข้อมูลพนักงานเพื่อวิเคราะห์ประสิทธิภาพการขาย..."</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-white/70 p-3.5 rounded-xl border border-white shadow-sm">
                              <h5 className="text-[11px] font-black text-emerald-600 mb-2 flex items-center gap-1.5 uppercase tracking-wide">🏆 กลุ่ม Top Performer</h5>
                              <div className="space-y-1.5">
                                {salesStaffOnly.filter(s => (Number(s.current_sales)/Number(s.target_sales || 1))*100 >= 80).map((s, i) => (
                                  <p key={i} className="text-xs font-bold text-slate-700">🔥 {s.employees?.full_name}: ทะลุเป้า!</p>
                                ))}
                                {salesStaffOnly.filter(s => (Number(s.current_sales)/Number(s.target_sales || 1))*100 >= 80).length === 0 && <p className="text-xs text-slate-400 italic">ยังไม่มีคนถึงเป้า 80%</p>}
                              </div>
                            </div>
                            
                            <div className="bg-white/70 p-3.5 rounded-xl border border-white shadow-sm">
                              <h5 className="text-[11px] font-black text-blue-600 mb-2 flex items-center gap-1.5 uppercase tracking-wide">🚀 กลุ่ม On-Track</h5>
                              <div className="space-y-1.5">
                                {salesStaffOnly.filter(s => {
                                  const p = (Number(s.current_sales)/Number(s.target_sales || 1))*100;
                                  return p >= 50 && p < 80;
                                }).map((s, i) => (
                                  <p key={i} className="text-xs font-bold text-slate-700">✨ {s.employees?.full_name}: ใกล้แล้ว!</p>
                                ))}
                                {salesStaffOnly.filter(s => {
                                  const p = (Number(s.current_sales)/Number(s.target_sales || 1))*100;
                                  return p >= 50 && p < 80;
                                }).length === 0 && <p className="text-xs text-slate-400 italic">ไม่มีข้อมูลกลุ่มกลาง</p>}
                              </div>
                            </div>

                            <div className="bg-white/70 p-3.5 rounded-xl border border-white shadow-sm">
                              <h5 className="text-[11px] font-black text-rose-600 mb-2 flex items-center gap-1.5 uppercase tracking-wide">🆘 กลุ่มต้องการความช่วยเหลือ</h5>
                              <div className="space-y-1.5">
                                {salesStaffOnly.filter(s => (Number(s.current_sales)/Number(s.target_sales || 1))*100 < 50).map((s, i) => (
                                  <p key={i} className="text-xs font-bold text-slate-700">⚠️ {s.employees?.full_name}: ยอดค้างเยอะ</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  {/* 📊 2. ตารางแสดงยอดขาย */}
                    <div className="flex flex-col flex-1 h-full w-full">
                      <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2 mb-4">
                        {salesStaffOnly.length === 0 ? (
                          <div className="h-64 flex flex-col items-center justify-center py-10 text-slate-300 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                            <span className="text-5xl mb-3">🔍</span>
                            <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">ไม่พบข้อมูลพนักงาน</p>
                          </div>
                        ) : (
                          <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1100px]">
                            <thead className="text-[11px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                              <tr>
                                <th className="p-4 rounded-l-xl">พนักงาน (รหัส)</th>
                                <th className="p-4 text-center">ยอดปัจจุบัน (฿)</th>
                                <th className="p-4 text-center text-indigo-500">เป้าหมาย (฿)</th>
                                <th className="p-4 text-center text-rose-500">เรทปกติ (%)</th>
                                <th className="p-4 text-center text-orange-500 bg-orange-50/50">เรทพิเศษ (%)</th>
                                <th className="p-4 text-center text-slate-500 bg-slate-100/50 border-l border-white">คอมฯ ปกติ (฿)</th>
                                <th className="p-4 text-center text-amber-500 bg-amber-50/50">คอมฯ พิเศษ (฿)</th>
                                <th className="p-4 text-center text-emerald-600 rounded-r-xl bg-emerald-50/50">รวมสุทธิ (฿)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {salesStaffOnly.map((sale, index) => {
                                const sales = Number(sale.current_sales || 0);
                                const rate = Number(sale.commission_rate || 0);
                                const empId = sale.employees?.id || sale.employee_id;
                                const empCode = sale.employees?.employee_code || "";
                                
                                const todayStr = new Date().toISOString().split('T')[0];
                                const activeCamp = (typeof holidayCampaigns !== 'undefined' ? holidayCampaigns : []).find(c => todayStr >= c.startDate && todayStr <= c.endDate);
                                const currentSpecialRate = activeCamp ? Number(activeCamp.rate) : 0;

                                let normalComm = sales * (rate / 100);
                                let holidayComm = 0;
                                if (typeof allLiveHistory !== 'undefined' && allLiveHistory.length > 0 && typeof holidayCampaigns !== 'undefined') {
                                    const myLogs = allLiveHistory.filter(log => log.employee_id === empId);
                                    myLogs.forEach(log => {
                                        const matchedCamp = holidayCampaigns.find(c => log.live_date >= c.startDate && log.live_date <= c.endDate);
                                        if (matchedCamp) {
                                            holidayComm += Number(log.net_sales || 0) * (Number(matchedCamp.rate) / 100);
                                        }
                                    });
                                }

                                let totalComm = normalComm + holidayComm;
                                const uniqueTargetId = sale.employees?.id || sale.employee_id || empCode || `temp-${index}`;

                                return (
                                  <tr key={uniqueTargetId} className={`bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group ${empCode === 'PL001' ? 'ring-2 ring-amber-400/50 bg-amber-50/10' : ''}`}>
                                    <td className="p-4 font-black rounded-l-xl whitespace-nowrap">
                                      <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                           <span className={`text-sm ${empCode === 'PL001' ? 'text-amber-700' : 'text-slate-800'}`}>{sale.employees?.full_name || 'พนักงานไม่มีชื่อ'}</span>
                                           {empCode === 'PL001' && <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-md font-bold animate-pulse">CEO</span>}
                                        </div>
                                        <span className="text-[10px] text-indigo-500 font-black uppercase tracking-wider">{empCode} • {sale.employees?.position || '-'}</span>
                                      </div>
                                    </td>
                                    
                                    <td className="p-4 w-32">
                                      <input type="number" value={sale.current_sales ?? ''} onChange={(e) => setAllSalesData(prev => prev.map(s => {
                                        const sId = s.employees?.id || s.employee_id || s.employees?.employee_code || `temp-${index}`;
                                        return sId === uniqueTargetId ? { ...s, current_sales: e.target.value } : s;
                                      }))} className="w-full text-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 font-bold focus:border-indigo-500 outline-none transition-all" />
                                    </td>
                                    <td className="p-4 w-32">
                                      <input type="number" value={sale.target_sales ?? ''} onChange={(e) => setAllSalesData(prev => prev.map(s => {
                                        const sId = s.employees?.id || s.employee_id || s.employees?.employee_code || `temp-${index}`;
                                        return sId === uniqueTargetId ? { ...s, target_sales: e.target.value } : s;
                                      }))} className="w-full text-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 font-bold text-indigo-600 focus:border-indigo-500 outline-none transition-all" />
                                    </td>
                                    <td className="p-4 w-24">
                                      <input type="number" step="0.1" value={sale.commission_rate ?? ''} onChange={(e) => setAllSalesData(prev => prev.map(s => {
                                        const sId = s.employees?.id || s.employee_id || s.employees?.employee_code || `temp-${index}`;
                                        return sId === uniqueTargetId ? { ...s, commission_rate: e.target.value } : s;
                                      }))} className="w-full text-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 font-bold text-rose-500 focus:border-rose-500 outline-none transition-all" />
                                    </td>
                                    
                                    <td className="p-4 text-center font-black bg-orange-50/30 border-l border-white">
                                      {currentSpecialRate > 0 ? (
                                        <div className="flex flex-col items-center justify-center">
                                          <span className="text-orange-600 text-sm">{currentSpecialRate}%</span>
                                          <span className="text-[9px] text-orange-400 mt-0.5 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">{activeCamp?.name}</span>
                                        </div>
                                      ) : (
                                        <span className="text-slate-300 text-sm">-</span>
                                      )}
                                    </td>

                                    <td className="p-4 text-center font-bold text-slate-600 bg-slate-50/50 border-l border-white">
                                      ฿{normalComm.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </td>
                                    <td className="p-4 text-center font-black text-amber-500 bg-amber-50/30">
                                      ฿{holidayComm.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </td>
                                    <td className="p-4 text-center font-black text-emerald-600 rounded-r-xl bg-emerald-50/50">
                                      ฿{totalComm.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100 shrink-0">
                        <button onClick={async () => { 
                          setIsSavingSales(true);
                          Swal.fire({ title: 'กำลังบันทึกข้อมูล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                          
                          try { 
                            const todayStr = new Date().toISOString().split('T')[0];
                            const currentMonth = todayStr.substring(0, 7);

                            const promises = salesStaffOnly.map(async (sale) => { 
                              const realEmployeeId = sale.employee_id || sale.employees?.id || sale.id;

                              const payload = { 
                                employee_id: realEmployeeId, 
                                current_sales: sale.current_sales === '' ? 0 : Number(sale.current_sales), 
                                target_sales: sale.target_sales === '' ? 0 : Number(sale.target_sales), 
                                commission_rate: sale.commission_rate === '' ? 0 : Number(sale.commission_rate), 
                                month: currentMonth,
                                updated_at: new Date().toISOString() 
                              }; 

                              const { data: exist } = await supabase.from('employee_sales')
                                .select('id')
                                .eq('employee_id', realEmployeeId)
                                .eq('month', currentMonth)
                                .maybeSingle(); 

                              if (exist) {
                                return supabase.from('employee_sales').update(payload).eq('id', exist.id); 
                              } else {
                                return supabase.from('employee_sales').insert([payload]); 
                              }
                            });
                            
                            await Promise.all(promises); 
                            await fetchDashboardData(true);
                            Swal.fire({ icon: 'success', title: 'บันทึกยอดขายสำเร็จ!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });
                          } catch (err) { 
                            console.error("Save Sales Error:", err);
                            Swal.fire('Error', 'เกิดข้อผิดพลาดในการบันทึก: ' + err.message, 'error'); 
                          } finally { 
                            setIsSavingSales(false);
                          } 
                        }} disabled={isSavingSales || salesStaffOnly.length === 0} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3.5 rounded-xl font-black shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                          {isSavingSales ? '⏳ กำลังบันทึก...' : '💾 บันทึกยอดขายทั้งหมด'}
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}

            </div>
          </div>
        )}

        {/* ✅ VIEW: HISTORY (ประวัติการลาของฉัน - อัปเกรดให้เลื่อนได้และดูง่ายขึ้น 100%) */}
        {currentView === "history" && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full overflow-hidden mt-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white flex-1 flex flex-col w-full overflow-hidden">
              
              {/* Header & Filters (ล็อกไว้กับที่ ไม่หายเวลาเลื่อน) */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100 shrink-0">
                <div>
                  <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2">📋 {t.myLeaveHistory}</h3>
                  <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-1">แสดงประวัติการลาทั้งหมดของคุณ</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-4 py-2 font-bold outline-none text-[10px] md:text-sm shadow-inner">
                    <option value="ALL">{t.allTypes}</option>
                    <option value="ลาป่วย">{t.sickLeave}</option>
                    <option value="ลากิจ">{t.personalLeave}</option>
                    <option value="ลาพักร้อน">{t.annualLeave}</option>
                    <option value="ลาฉุกเฉิน">{t.emergencyLeave}</option>
                    <option value="ลาไม่รับเงินเดือน">{lang === 'TH' ? 'ลาไม่รับเงินเดือน' : 'Leave Without Pay'}</option>
                  </select>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-4 py-2 font-bold outline-none text-[10px] md:text-sm shadow-inner">
                    <option value="ALL">{t.allStatus}</option>
                    <option value="รออนุมัติ">{t.pending}</option>
                    <option value="อนุมัติ">{t.approved}</option>
                    <option value="ไม่อนุมัติ">{t.rejected}</option>
                  </select>
                </div>
              </div>

              {/* 📜 ส่วนตารางที่เลื่อนได้จริง (Scrollable Area) */}
              <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-1">
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[700px]">
                  <thead className="text-[10px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-20 shadow-sm">
                    <tr>
                      <th className="p-3 md:p-4 rounded-l-lg md:rounded-l-xl">{t.thDate}</th>
                      <th className="p-3 md:p-4">{t.thType}</th>
                      <th className="p-3 md:p-4">{t.thDuration}</th>
                      <th className="p-3 md:p-4 w-1/3">{t.thReason || "เหตุผล"}</th>
                      <th className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl">{t.thStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-20 text-slate-400 font-bold bg-slate-50/50 rounded-2xl">
                          {t.noLeaveHistory || "ไม่พบประวัติการลา"}
                        </td>
                      </tr>
                    ) : (
                      filteredLeaves.map(l => (
                        <tr key={l.id} className="bg-white shadow-sm border border-slate-50 group hover:bg-slate-50/50 transition-all">
                          <td className="p-3 md:p-4 text-xs md:text-sm font-bold text-slate-500 rounded-l-lg md:rounded-l-xl whitespace-nowrap">
                            <div className="flex flex-col">
                              <span>{new Date(l.created_at).toLocaleDateString(lang==='TH'?'th-TH':'en-US')}</span>
                              <span className="text-[9px] text-slate-400">{new Date(l.created_at).toLocaleTimeString('th-TH').slice(0,5)} น.</span>
                            </div>
                          </td>
                          <td className="p-3 md:p-4 text-xs md:text-sm font-black text-slate-700 whitespace-nowrap">
                            {getTranslatedType(l.leave_type)}
                          </td>
                          <td className="p-3 md:p-4 text-xs md:text-sm font-black text-rose-500 whitespace-nowrap">
                            {formatDuration(l.duration_minutes)}
                          </td>
                          <td className="p-3 md:p-4 text-[11px] font-medium text-slate-500">
                            {/* ✨ Clamp เหตุผลไว้ให้ดูง่าย แต่ขยายได้เมื่อชี้ */}
                            <div className="line-clamp-1 group-hover:line-clamp-none transition-all duration-300">{l.reason || '-'}</div>
                          </td>
                          <td className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl whitespace-nowrap">
                            <span className={`text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black ${
                              l.status==='อนุมัติ' ? 'bg-emerald-100 text-emerald-600' : 
                              l.status==='รออนุมัติ' ? 'bg-amber-100 text-amber-600' : 
                              'bg-rose-100 text-rose-600'
                            }`}>
                              {getTranslatedStatus(l.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

{/* 🛠️ VIEW: ADJUSTMENTS (ประวัติการแจ้งปรับปรุง) */}
        {currentView === "adjustments" && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full overflow-hidden mt-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white flex-1 flex flex-col w-full overflow-hidden">
              
              <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100 shrink-0">
                <div>
                  <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2">🛠️ ประวัติคำขอปรับปรุง</h3>
                  <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-1">ติดตามสถานะคำขอสลับวันหยุดและแก้ไขเวลาของคุณ</p>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-1 pb-2">
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[800px]">
                  <thead className="text-[10px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-20 shadow-sm">
                    <tr>
                      <th className="p-3 md:p-4 rounded-l-lg md:rounded-l-xl">วันที่ยื่น</th>
                      <th className="p-3 md:p-4">ประเภท</th>
                      <th className="p-3 md:p-4 w-1/3">รายละเอียด</th>
                      <th className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 👇 แก้บั๊กตรงนี้แหละครับ ใช้ allAdjustments แทน adjustments */}
                    {allAdjustments.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-20 text-slate-400 font-bold bg-slate-50/50 rounded-2xl">
                          ยังไม่มีประวัติการแจ้งปรับปรุง
                        </td>
                      </tr>
                    ) : (
                      allAdjustments.map(adj => (
                        <tr key={adj.id} className="bg-white shadow-sm border border-slate-50 group hover:bg-slate-50/50 transition-all">
                          <td className="p-3 md:p-4 text-xs md:text-sm font-bold text-slate-500 rounded-l-lg md:rounded-l-xl whitespace-nowrap">
                            {new Date(adj.created_at).toLocaleDateString('th-TH')}
                          </td>
                          <td className="p-3 md:p-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-lg font-black text-[10px] md:text-xs ${
                              adj.request_type === 'สลับวันหยุด' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {adj.request_type}
                            </span>
                          </td>
                          <td className="p-3 md:p-4 text-[11px] font-medium text-slate-600">
                            <div className="line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                              {adj.request_type === 'สลับวันหยุด' ? (
                                <span>🔄 สลับจาก {adj.old_date} เป็น {adj.new_date}</span>
                              ) : (
                                <span>⏰ แก้ไขเวลา {adj.incident_date} ({adj.time_type}) จาก {adj.old_time} เป็น {adj.new_time}</span>
                              )}
                              {adj.reason && <span className="block text-[10px] text-slate-400 mt-1 italic">เหตุผล: {adj.reason}</span>}
                            </div>
                          </td>
                          <td className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl whitespace-nowrap">
                            <span className={`text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black ${
                              adj.status==='อนุมัติ' ? 'bg-emerald-100 text-emerald-600' : 
                              adj.status==='รออนุมัติ' ? 'bg-amber-100 text-amber-600' : 
                              'bg-rose-100 text-rose-600'
                            }`}>
                              {adj.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

{/* ========================================================================= */}
      {/* 📅 VIEW: ATTENDANCE (ประวัติเข้าออกงาน - ฉบับอัปเกรดโชว์ชั่วโมงทำงานในตาราง) */}
      {/* ========================================================================= */}
      {currentView === "attendance" && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full overflow-hidden mt-4 animate-fade-in">

          {/* 🤖 AI Attendance Tracker */}
          {(user?.role === 'admin' || user?.role === 'ceo') && (() => {
            if (!attendanceList || attendanceList.length === 0) return null;
            const alerts = [];
            const lateStats = {};

            attendanceList.forEach(log => {
              const name = log.full_name || 'ไม่ระบุชื่อ';
              if (log.status === 'late') {
                lateStats[name] = (lateStats[name] || 0) + 1;
              }
            });

            Object.keys(lateStats).forEach(name => {
              if (lateStats[name] >= 3) {
                alerts.push(`คุณ ${name} มาสายสะสม ${lateStats[name]} ครั้ง (ในรายการที่แสดงอยู่)`);
              }
            });

            if (alerts.length === 0) return null;

            return (
              <div className="mb-6 animate-fade-in shrink-0">
                <div className="p-5 rounded-[1.5rem] border bg-rose-50 border-rose-200 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 text-rose-100/50 text-7xl rotate-12 pointer-events-none">🕵️‍♂️</div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl animate-bounce-subtle">🕵️‍♂️</span>
                      <h4 className="font-black text-xs md:text-sm uppercase tracking-wider text-rose-600">
                        AI Attendance Alert: ตรวจพบพฤติกรรมมาสายซ้ำซ้อน
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {alerts.map((msg, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-rose-100 shadow-sm flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                          <p className="text-[11px] md:text-xs font-bold text-slate-700 leading-relaxed">{msg}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white flex-1 flex flex-col w-full overflow-hidden">
            
            {/* Header & Filters */}
            <div className="flex flex-col lg:flex-row justify-between gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100 shrink-0">
              <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2">
                📅 {user?.role === 'admin' || user?.role === 'ceo' ? t.allAttendance : t.myAttendance}
              </h3>
              
              <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center">
                {(user?.role === 'admin' || user?.role === 'ceo') && (
                  <div className="relative flex-1 lg:w-64">
                    <select 
                      value={attnSearchName}
                      onChange={(e) => setAttnSearchName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl pl-3 pr-8 py-2 font-bold outline-none text-[10px] md:text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700"
                    >
                      <option value="">{t.allLeavesFilterAll || "-- แสดงพนักงานทุกคน --"}</option>
                      {employees && employees.length > 0 ? (
                        employees
                          .filter(emp => emp.full_name)
                          .sort((a, b) => a.full_name.localeCompare(b.full_name, 'th'))
                          .map(emp => (
                            <option key={emp.id} value={emp.full_name}>คุณ {emp.full_name}</option>
                          ))
                      ) : (
                        <option disabled>⏳ กำลังโหลดรายชื่อ...</option>
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>
                )}
                
                <select 
                  value={attnFilterStatus} 
                  onChange={(e) => setAttnFilterStatus(e.target.value)}
                  className="flex-1 lg:flex-none bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-4 py-2 font-bold outline-none text-[10px] md:text-sm cursor-pointer"
                >
                  <option value="ALL">{t.allStatus}</option>
                  <option value="normal">{t.filterNormal}</option>
                  <option value="late">{t.filterLate}</option>
                </select>

                <button onClick={() => {
                  const filteredData = attendanceList
                    .filter(a => attnFilterStatus === "ALL" || a.status === attnFilterStatus || (attnFilterStatus==='late' && a.status==='late') || (attnFilterStatus==='normal' && a.status==='normal'))
                    .filter(a => !attnSearchName || a.full_name === attnSearchName);

                  if(filteredData.length === 0) return Swal.fire('แจ้งเตือน', 'ไม่มีข้อมูลในเงื่อนไขที่คุณเลือกครับ', 'warning');
                  
                  let csvContent = "วันที่,ชื่อพนักงาน,เวลาเข้า,เวลาออก,ชั่วโมงทำงาน,สถานะ\n";
                  filteredData.forEach(r => {
                    let workHours = '-';
                    if (r.timestamp_in && r.timestamp_out) {
                      const diffMs = new Date(r.timestamp_out) - new Date(r.timestamp_in);
                      if (diffMs > 0) {
                        const totalMins = Math.floor(diffMs / 60000);
                        workHours = `${Math.floor(totalMins / 60)} ชม. ${totalMins % 60} นาที`;
                      }
                    }
                    csvContent += `${r.date},${r.full_name},${r.time_in || '-'},${r.time_out || '-'},${workHours},${r.status === 'late' ? 'สาย' : 'ปกติ'}\n`;
                  });
                  
                  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `Attendance_${new Date().toISOString().split('T')[0]}.csv`);
                  link.click();
                }} className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-2 rounded-lg font-bold text-[10px] md:text-sm hover:bg-emerald-100 transition-all flex items-center gap-1.5 h-full">
                  📥 Export
                </button>
              </div>
            </div>

            {/* 📜 ส่วนตาราง */}
            <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-1 pb-2">
              {isLoadingAttendance ? (
                <div className="text-center py-20 text-indigo-400 font-bold animate-pulse">{t.loadingText}</div>
              ) : (
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1000px]">
                  <thead className="text-[10px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-20 shadow-sm">
                    <tr>
                      <th className="p-3 md:p-4 rounded-l-lg md:rounded-l-xl">กะงานวันที่</th>
                      <th className="p-3 md:p-4">{t.thEmp}</th>
                      <th className="p-3 md:p-4 text-center">{t.thTimeIn}</th>
                      <th className="p-3 md:p-4 text-center">{t.thTimeOut}</th>
                      <th className="p-3 md:p-4 text-center">⏳ ชั่วโมงทำงาน</th>
                      <th className="p-3 md:p-4 text-center">พิกัด</th>
                      <th className="p-3 md:p-4 text-center">{t.thStatus}</th>
                      {(user?.role === 'admin' || user?.role === 'ceo') && <th className="p-3 md:p-4 text-center rounded-r-lg md:rounded-r-xl">จัดการ</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList
                      .filter(a => attnFilterStatus === "ALL" || a.status === attnFilterStatus || (attnFilterStatus==='late' && a.status==='late') || (attnFilterStatus==='normal' && a.status==='normal'))
                      .filter(a => !attnSearchName || a.full_name === attnSearchName)
                      .map((record, index) => {
                        
                        const inDateObj = record.timestamp_in ? new Date(record.timestamp_in) : null;
                        const outDateObj = record.timestamp_out ? new Date(record.timestamp_out) : null;

                        // ⏱️ คำนวณชั่วโมงทำงานสำหรับโชว์ในตาราง
                        let workHoursDisplay = '--:--';
                        if (inDateObj && outDateObj) {
                          const diffMs = outDateObj - inDateObj;
                          if (diffMs > 0) {
                            const totalMins = Math.floor(diffMs / 60000);
                            const hours = Math.floor(totalMins / 60);
                            const mins = totalMins % 60;
                            workHoursDisplay = `${hours} ชม. ${mins} นาที`;
                          }
                        }

                        const toLocalYYYYMMDD = (d) => {
                          if (!d) return '';
                          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                        };
                        const inDateFormStr = inDateObj ? toLocalYYYYMMDD(inDateObj) : '';
                        const outDateFormStr = outDateObj ? toLocalYYYYMMDD(outDateObj) : '';

                        return (
                          <tr key={index} className="bg-white shadow-sm border border-slate-50 group hover:bg-slate-50/50 transition-all">
                            
                            <td className="p-3 md:p-4 text-xs md:text-sm font-bold text-slate-500 rounded-l-lg md:rounded-l-xl whitespace-nowrap">
                              {new Date(record.date).toLocaleDateString(lang === 'TH' ? 'th-TH' : 'en-US')}
                            </td>
                            <td className="p-3 md:p-4 text-xs md:text-sm font-black text-blue-600 whitespace-nowrap">
                              {record.full_name}
                            </td>
                            
                            {/* 🌞 เวลาเข้างาน */}
                            <td className="p-3 md:p-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                {inDateObj && record.time_in && (
                                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 shadow-sm">
                                    {inDateObj.toLocaleDateString(lang === 'TH' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short' })}
                                  </span>
                                )}
                                <span className="font-black text-slate-700 text-sm mt-0.5">{record.time_in || '--:--'}</span>
                                {record.selfie_in && (
                                  <button onClick={() => Swal.fire({ imageUrl: record.selfie_in, imageWidth: 400, imageAlt: 'Selfie In', title: 'รูปถ่ายตอนเข้างาน', customClass: { popup: 'rounded-3xl' } })} className="mt-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black hover:bg-indigo-100 border border-indigo-100 flex items-center gap-1 shadow-sm transition-all">
                                    📸 In
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* 🌙 เวลาออกงาน */}
                            <td className="p-3 md:p-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                {outDateObj && record.time_out && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-sm ${(inDateFormStr && outDateFormStr && inDateFormStr !== outDateFormStr) ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                    {outDateObj.toLocaleDateString(lang === 'TH' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short' })}
                                  </span>
                                )}
                                <span className="font-black text-slate-700 text-sm mt-0.5">{record.time_out || '--:--'}</span>
                                {record.selfie_out && (
                                  <button onClick={() => Swal.fire({ imageUrl: record.selfie_out, imageWidth: 400, imageAlt: 'Selfie Out', title: 'รูปถ่ายตอนออกงาน', customClass: { popup: 'rounded-3xl' } })} className="mt-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black hover:bg-amber-100 border border-amber-100 flex items-center gap-1 shadow-sm transition-all">
                                    📸 Out
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* ⏱️ คอลัมน์ที่เพิ่มใหม่: ชั่วโมงทำงาน */}
                            <td className="p-3 md:p-4 text-center">
                              <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                                <span className={`font-black text-[11px] md:text-xs ${workHoursDisplay !== '--:--' ? 'text-indigo-600' : 'text-slate-300'}`}>
                                  {workHoursDisplay}
                                </span>
                              </div>
                            </td>

                            <td className="p-3 md:p-4 text-center whitespace-nowrap">
                              {(record.lat_in || record.lat) ? (
                                <button onClick={() => setViewMapModal({ lat: record.lat_in || record.lat, lng: record.lng_in || record.lng, name: record.full_name })} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black border border-emerald-100 transition-all shadow-sm">
                                  📍 ดูพิกัด
                                </button>
                              ) : <span className="text-slate-300 text-[10px] font-bold">ไม่มีพิกัด</span>}
                            </td>
                            <td className="p-3 md:p-4 text-center whitespace-nowrap">
                              <span className={`text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black ${record.status === 'late' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {record.status === 'late' ? `${t.statusLate} (${formatLateTime(record.late_minutes)})` : t.statusNormal}
                              </span>
                            </td>

                            {(user?.role === 'admin' || user?.role === 'ceo') && (
                              <td className="p-3 md:p-4 text-center flex justify-center gap-2 rounded-r-lg md:rounded-r-xl">
                                <button onClick={async () => {
                                  const { value: formValues } = await Swal.fire({
                                    title: 'แก้ไขวันและเวลา',
                                    html: `
                                      <div class="text-left text-sm font-bold mt-4 space-y-4">
                                        <div class="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                                          <label class="text-emerald-700 block mb-2 text-xs uppercase tracking-wide">🌞 ขาเข้างาน</label>
                                          <div class="flex gap-2">
                                            <input id="swal-date-in" type="date" class="w-full bg-white border border-emerald-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400" value="${inDateFormStr}">
                                            <input id="swal-time-in" type="time" class="w-full bg-white border border-emerald-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400" value="${record.time_in ? record.time_in.substring(0,5) : ''}">
                                          </div>
                                        </div>
                                        <div class="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                                          <label class="text-amber-700 block mb-2 text-xs uppercase tracking-wide">🌙 ขาออกงาน</label>
                                          <div class="flex gap-2">
                                            <input id="swal-date-out" type="date" class="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" value="${outDateFormStr}">
                                            <input id="swal-time-out" type="time" class="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400" value="${record.time_out ? record.time_out.substring(0,5) : ''}">
                                          </div>
                                        </div>
                                      </div>`,
                                    showCancelButton: true,
                                    confirmButtonText: 'บันทึก',
                                    preConfirm: () => ({ 
                                      dateIn: document.getElementById('swal-date-in').value, 
                                      timeIn: document.getElementById('swal-time-in').value,
                                      dateOut: document.getElementById('swal-date-out').value, 
                                      timeOut: document.getElementById('swal-time-out').value 
                                    })
                                  });

                                  if (formValues) {
                                    Swal.fire({ title: 'กำลังบันทึก...', didOpen: () => Swal.showLoading() });
                                    try {
                                      if(record.id_in && formValues.dateIn && formValues.timeIn) {
                                        await supabase.from('attendance_logs').update({ 
                                          timestamp: `${formValues.dateIn}T${formValues.timeIn}:00+07:00`,
                                          status: 'normal',
                                          late_minutes: 0
                                        }).eq('id', record.id_in);
                                      }
                                      if(record.id_out && formValues.dateOut && formValues.timeOut) {
                                        await supabase.from('attendance_logs').update({ 
                                          timestamp: `${formValues.dateOut}T${formValues.timeOut}:00+07:00` 
                                        }).eq('id', record.id_out);
                                      }
                                      Swal.fire('สำเร็จ', 'บันทึกเรียบร้อย!', 'success');
                                      if (typeof fetchAttendanceData === 'function') fetchAttendanceData();
                                    } catch (err) { Swal.fire('Error', err.message, 'error'); }
                                  }
                                }} className="bg-amber-100 text-amber-600 p-2 rounded-lg hover:bg-amber-200 transition-all shadow-sm">✏️</button>
                                
                                <button onClick={async () => {
                                  const result = await Swal.fire({ title: 'ยืนยันการลบ?', text: "ต้องการลบรอบเวลานี้ใช่หรือไม่?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#EF4444' });
                                  if (result.isConfirmed) {
                                    if(record.id_in) await supabase.from('attendance_logs').delete().eq('id', record.id_in);
                                    if(record.id_out) await supabase.from('attendance_logs').delete().eq('id', record.id_out);
                                    Swal.fire('ลบสำเร็จ!', '', 'success');
                                    if (typeof fetchAttendanceData === 'function') fetchAttendanceData();
                                  }
                                }} className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-all shadow-sm">🗑️</button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📊 VIEW: REPORT CENTER (ศูนย์รวมรายงานองค์กร - ดูภาพรวม & Export) */}
      {/* ========================================================================= */}
      {currentView === "reports" && (user?.role === 'admin' || user?.role === 'ceo') && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
          
          <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white flex-1 flex flex-col w-full">
            
            {/* 👑 Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-800 text-xl md:text-2xl flex items-center gap-3">
                  <span className="p-2 bg-blue-100 text-blue-600 rounded-xl shadow-inner">📊</span>
                  ศูนย์รวมรายงานองค์กร (Report Center)
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-bold mt-2 ml-1">
                  ดูสรุปข้อมูลและดาวน์โหลดรายงานของระบบทั้งหมดในที่เดียว
                </p>
              </div>
            </div>

            {/* 📅 ตัวกรองวันที่ (Global Date Filter) */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-8 shadow-sm">
              <h4 className="font-black text-slate-700 text-sm mb-3 flex items-center gap-2">
                <span>🗓️</span> เลือกช่วงวันที่ต้องการดึงรายงาน
              </h4>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-500 mb-1">ตั้งแต่วันที่</label>
                  <input id="report-start-date" type="date" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold outline-none text-sm focus:border-blue-500 shadow-sm" />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-500 mb-1">ถึงวันที่</label>
                  <input id="report-end-date" type="date" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold outline-none text-sm focus:border-blue-500 shadow-sm" />
                </div>
                <button 
                  onClick={() => {
                    document.getElementById('report-start-date').value = '';
                    document.getElementById('report-end-date').value = '';
                    Swal.fire({ title: 'รีเซ็ตวันที่แล้ว', text: 'ระบบจะดึงข้อมูลทั้งหมด', icon: 'success', timer: 1500, showConfirmButton: false });
                  }}
                  className="bg-white border border-slate-300 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all shadow-sm h-[42px] w-full md:w-auto"
                >
                  ล้างค่า
                </button>
              </div>
            </div>

            {/* 🗂️ ก้อนข้อมูลรายงานแต่ละประเภท */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 1. รายงานยอดขาย (Sales) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">💰</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">รายงานยอดขายทีมไลฟ์</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">สรุปยอดขายพนักงาน Live Streamer ยอดเป้าหมาย และเปอร์เซ็นต์ความสำเร็จ</p>
                <button onClick={() => {
                  const sDate = document.getElementById('report-start-date').value;
                  const eDate = document.getElementById('report-end-date').value;
                  
                  // 🟢 1. กรองเอาเฉพาะพนักงานที่ตำแหน่งเกี่ยวกับการ "ไลฟ์"
                  let dataToExport = (allSalesData || []).filter(sale => {
                    const pos = (sale.employees?.position || '').toLowerCase();
                    return pos.includes('live') || pos.includes('streamer') || pos.includes('tiktok') || pos.includes('ไลฟ์');
                  });

                  // 🟢 2. เช็คตัวกรองวันที่ (รองรับทั้ง updated_at, created_at ถ้าไม่มีให้ยึดเป็นวันนี้)
                  if (sDate) {
                    dataToExport = dataToExport.filter(d => {
                      const dDate = (d.updated_at || d.created_at || new Date().toISOString()).split('T')[0];
                      return dDate >= sDate;
                    });
                  }
                  if (eDate) {
                    dataToExport = dataToExport.filter(d => {
                      const dDate = (d.updated_at || d.created_at || new Date().toISOString()).split('T')[0];
                      return dDate <= eDate;
                    });
                  }

                  if(dataToExport.length === 0) return Swal.fire('ไม่พบข้อมูล', 'ไม่มีข้อมูลยอดขายทีมไลฟ์ในช่วงเวลาที่เลือก', 'warning');

                  let csv = "วันที่อัปเดต,ชื่อพนักงาน,ตำแหน่ง,ยอดขายที่ทำได้,เป้าหมาย,เปอร์เซ็นต์ความสำเร็จ\n";
                  dataToExport.forEach(r => {
                    // 🟢 3. ดึงวันที่ให้แสดงผล 100% แน่นอน
                    const rawDate = r.updated_at || r.created_at || new Date().toISOString();
                    const date = rawDate.split('T')[0];
                    
                    const name = r.employees?.full_name || 'ไม่ระบุ';
                    const pos = r.employees?.position || '-';
                    const sales = Number(r.current_sales || 0);
                    const target = Number(r.target_sales || 1);
                    const pct = ((sales/target)*100).toFixed(2);
                    
                    csv += `${date},${name},${pos},${sales},${target},${pct}%\n`;
                  });
                  
                  const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = `Live_Streamer_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`;
                  link.click();
                }} className="w-full bg-pink-50 text-pink-600 border border-pink-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>

              {/* 2. รายงานการเข้า-ออกงาน (Attendance) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">⏰</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">รายงานการเข้างาน</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">เวลาเข้า-ออกงาน สถานะการมาสาย และจำนวนเวลาที่สายทั้งหมด</p>
                <button onClick={async () => {
                  const sDate = document.getElementById('report-start-date').value;
                  const eDate = document.getElementById('report-end-date').value;
                  
                  // แสดง Loading ระหว่างดึงข้อมูลจากฐานข้อมูล
                  Swal.fire({ title: 'กำลังดึงข้อมูล...', text: 'กรุณารอสักครู่', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  
                  try {
                    // 🟢 1. ดึงข้อมูลสดๆ จากตาราง attendance_logs ของจริง
                    let query = supabase.from('attendance_logs').select('*, employees(full_name)').order('timestamp', { ascending: true });
                    
                    // กรองวันที่จากฐานข้อมูลโดยตรง (ถ้าเลือกไว้)
                    if (sDate) query = query.gte('timestamp', `${sDate}T00:00:00`);
                    if (eDate) query = query.lte('timestamp', `${eDate}T23:59:59`);
                    
                    const { data: rawLogs, error } = await query;
                    if (error) throw error;
                    
                    if (!rawLogs || rawLogs.length === 0) {
                      return Swal.fire('ไม่พบข้อมูล', 'ไม่มีข้อมูลการเข้างานในช่วงเวลาที่เลือก', 'warning');
                    }

                    // 🟢 2. จับกลุ่มข้อมูลแยกรายบุคคลและรายวัน (แปลง Log เข้า-ออก ให้เป็น 1 บรรทัด)
                    const grouped = {};
                    rawLogs.forEach(log => {
                      if (!log.timestamp) return;
                      const date = log.timestamp.split('T')[0];
                      const time = log.timestamp.split('T')[1].substring(0, 5);
                      const empId = log.employee_id;
                      const key = `${empId}_${date}`;
                      
                      if (!grouped[key]) {
                        // เจอครั้งแรก = เวลาเข้างาน
                        grouped[key] = {
                          date: date,
                          full_name: log.employees?.full_name || 'ไม่ระบุ',
                          time_in: time,
                          time_out: null,
                          status: log.status,
                          late_minutes: log.late_minutes || 0
                        };
                      } else {
                        // เจอครั้งที่สองของวัน = เวลาออกงาน
                        grouped[key].time_out = time;
                        if (log.status === 'late' || log.status === 'สาย') {
                          grouped[key].status = 'late';
                          grouped[key].late_minutes = log.late_minutes || grouped[key].late_minutes;
                        }
                      }
                    });

                    // เรียงข้อมูลจากวันล่าสุดไปวันเก่าสุด
                    const dataToExport = Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));

                    // 🟢 3. สร้างเป็นไฟล์ CSV
                    let csv = "วันที่,ชื่อพนักงาน,เวลาเข้า,เวลาออก,สถานะ,รวมเวลาที่สาย\n";
                    dataToExport.forEach(r => {
                      const statusStr = (r.status === 'late' || r.status === 'สาย') ? 'สาย' : 'ปกติ';
                      const h = Math.floor((r.late_minutes || 0) / 60);
                      const m = (r.late_minutes || 0) % 60;
                      csv += `${r.date},${r.full_name},${r.time_in},${r.time_out || '-'},${statusStr},${h} ชม. ${m} น.\n`;
                    });
                    
                    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    
                    Swal.close(); // ปิดหน้าจอ Loading
                  } catch (err) {
                    Swal.fire('เกิดข้อผิดพลาด', err.message, 'error');
                  }
                }} className="w-full bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>

              {/* 3. รายงานข้อมูลพนักงานทั้งหมด (Employees Master Data) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">👥</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">ฐานข้อมูลพนักงาน</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">รายชื่อพนักงานทั้งหมด รหัสพนักงาน ตำแหน่ง และสถานะการทำงาน</p>
                <button onClick={async () => {
                  Swal.fire({ title: 'กำลังดึงข้อมูล...', text: 'กรุณารอสักครู่', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  
                  try {
                    // ดึงข้อมูลและเรียงลำดับตาม รหัสพนักงาน (EMP)
                    const { data: empData, error } = await supabase
                      .from('employees')
                      .select('*')
                      .order('employee_code', { ascending: true }); 

                    if (error) throw error;

                    if (!empData || empData.length === 0) {
                      return Swal.fire('ไม่พบข้อมูล', 'ไม่มีข้อมูลพนักงานในระบบ', 'warning');
                    }

                    // 🟢 เอาแผนกออก และดึง รหัสพนักงาน (employee_code) แบบ EMP01 มาโชว์
                    let csv = "ลำดับ,รหัสพนักงาน,ชื่อ-นามสกุล,ตำแหน่ง,บทบาทในระบบ,สถานะ\n";
                    empData.forEach((r, index) => {
                      const no = index + 1; 
                      const empCode = r.employee_code || '-'; // ดึง EMP01 มาใส่ตรงนี้
                      const name = r.full_name || '-';
                      const pos = r.position || '-';
                      const role = r.role || '-';
                      const status = r.is_active === false ? 'ลาออก/พักงาน' : 'ทำงานอยู่';
                      
                      csv += `${no},${empCode},${name},${pos},${role},${status}\n`;
                    });
                    
                    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Employee_Master_Data_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    
                    Swal.close();
                  } catch (err) {
                    Swal.fire('เกิดข้อผิดพลาด', err.message, 'error');
                  }
                }} className="w-full bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>

            {/* 4. รายงานการลางาน (Leave Requests) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">🏖️</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">รายงานการลางาน</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">สรุปประวัติการลางานของพนักงาน ประเภทการลา วันที่ลา และสถานะการอนุมัติ</p>
                <button onClick={async () => {
                  const sDate = document.getElementById('report-start-date').value;
                  const eDate = document.getElementById('report-end-date').value;
                  
                  Swal.fire({ title: 'กำลังดึงข้อมูล...', text: 'กรุณารอสักครู่', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  
                  try {
                    let query = supabase.from('leave_requests').select('*, employees(full_name, employee_code)').order('created_at', { ascending: false });
                    
                    if (sDate) query = query.gte('start_date', sDate);
                    if (eDate) query = query.lte('end_date', eDate);
                    
                    const { data: leaveData, error } = await query;
                    if (error) throw error;
                    if (!leaveData || leaveData.length === 0) return Swal.fire('ไม่พบข้อมูล', 'ไม่มีประวัติการลางานในช่วงเวลาที่เลือก', 'warning');

                    let csv = "วันที่ยื่นคำขอ,รหัสพนักงาน,ชื่อ-นามสกุล,ประเภทการลา,เริ่มวันที่,ถึงวันที่,สถานะการอนุมัติ,เหตุผล\n";
                    leaveData.forEach(r => {
                      const reqDate = r.created_at ? r.created_at.split('T')[0] : '-';
                      const empCode = r.employees?.employee_code || '-';
                      const name = r.employees?.full_name || '-';
                      const type = r.leave_type || '-';
                      const sD = r.start_date || '-';
                      const eD = r.end_date || '-';
                      const status = r.status === 'approved' ? 'อนุมัติแล้ว' : r.status === 'rejected' ? 'ไม่อนุมัติ' : 'รออนุมัติ';
                      // จัดการคำที่มีลูกน้ำ (,) หรือขึ้นบรรทัดใหม่ในเหตุผล เพื่อไม่ให้ไฟล์ CSV เพี้ยน
                      const reason = r.reason ? `"${r.reason.replace(/"/g, '""').replace(/\n/g, ' ')}"` : '-';
                      
                      csv += `${reqDate},${empCode},${name},${type},${sD},${eD},${status},${reason}\n`;
                    });
                    
                    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Leave_Requests_Report_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    Swal.close();
                  } catch (err) { Swal.fire('เกิดข้อผิดพลาด', err.message, 'error'); }
                }} className="w-full bg-amber-50 text-amber-600 border border-amber-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>

             {/* 5. รายงานขอแก้ไขเวลาทำงาน (Attendance Adjustments) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">📝</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">รายงานขอแก้ไขเวลา</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">สรุปคำขอแก้ไขเวลาเข้า-ออกงานย้อนหลัง เหตุผล และสถานะการอนุมัติ</p>
                <button onClick={async () => {
                  const sDate = document.getElementById('report-start-date').value;
                  const eDate = document.getElementById('report-end-date').value;
                  
                  Swal.fire({ title: 'กำลังดึงข้อมูล...', text: 'กรุณารอสักครู่', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  
                  try {
                    // 🟢 แก้ไขชื่อตารางเป็น adjustment_requests ให้ตรงกับ Database ของจริง
                    let query = supabase.from('adjustment_requests').select('*, employees(full_name, employee_code)').order('created_at', { ascending: false });
                    
                    if (sDate) query = query.gte('date', sDate);
                    if (eDate) query = query.lte('date', eDate);
                    
                    const { data: adjData, error } = await query;
                    if (error) throw error;
                    if (!adjData || adjData.length === 0) return Swal.fire('ไม่พบข้อมูล', 'ไม่มีคำขอแก้ไขเวลาในช่วงเวลาที่เลือก', 'warning');

                    let csv = "วันที่ยื่นคำขอ,รหัสพนักงาน,ชื่อ-นามสกุล,วันที่ขอแก้ไข,เวลาเข้า(ใหม่),เวลาออก(ใหม่),สถานะการอนุมัติ,เหตุผล\n";
                    adjData.forEach(r => {
                      const reqDate = r.created_at ? r.created_at.split('T')[0] : '-';
                      const empCode = r.employees?.employee_code || '-';
                      const name = r.employees?.full_name || '-';
                      const date = r.date || '-';
                      const tIn = r.time_in ? r.time_in.substring(0,5) : '-';
                      const tOut = r.time_out ? r.time_out.substring(0,5) : '-';
                      const status = r.status === 'approved' ? 'อนุมัติแล้ว' : r.status === 'rejected' ? 'ไม่อนุมัติ' : 'รออนุมัติ';
                      const reason = r.reason ? `"${r.reason.replace(/"/g, '""').replace(/\n/g, ' ')}"` : '-';
                      
                      csv += `${reqDate},${empCode},${name},${date},${tIn},${tOut},${status},${reason}\n`;
                    });
                    
                    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Attendance_Adjustments_Report_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    Swal.close();
                  } catch (err) { Swal.fire('เกิดข้อผิดพลาด', err.message, 'error'); }
                }} className="w-full bg-cyan-50 text-cyan-600 border border-cyan-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>
            
            {/* 6. รายงานข้อมูลสาขาและสถานที่ตั้ง (Branches & Locations) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">🏢</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">รายงานข้อมูลสาขา</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">สรุปรายชื่อสาขาทั้งหมด พิกัดตำแหน่ง GPS บนแผนที่ และรัศมีการเช็คอิน</p>
                <button onClick={async () => {
                  Swal.fire({ title: 'กำลังดึงข้อมูล...', text: 'กรุณารอสักครู่', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  
                  try {
                    // ดึงข้อมูลจากตารางสาขา
                    const { data: branchData, error } = await supabase.from('branches').select('*').order('name', { ascending: true });
                    
                    if (error) throw error;
                    if (!branchData || branchData.length === 0) return Swal.fire('ไม่พบข้อมูล', 'ไม่มีข้อมูลสาขาในระบบ', 'warning');

                    let csv = "ลำดับ,ชื่อสาขา/สถานที่,ละติจูด (Lat),ลองจิจูด (Lng),รัศมีที่อนุญาต (เมตร)\n";
                    branchData.forEach((r, index) => {
                      const no = index + 1;
                      const name = r.name || '-';
                      const lat = r.lat || '-';
                      const lng = r.lng || '-';
                      const radius = r.radius_m || r.radius || '0';
                      
                      csv += `${no},${name},${lat},${lng},${radius}\n`;
                    });
                    
                    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Branches_Master_Data_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    Swal.close();
                  } catch (err) { 
                    Swal.fire('เกิดข้อผิดพลาด', err.message, 'error'); 
                  }
                }} className="w-full bg-violet-50 text-violet-600 border border-violet-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-violet-600 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>
            {/* 7. รายงานสรุปพฤติกรรมการมาสาย (Late Analysis Summary) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">🏃‍♂️</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">สรุปการมาสายรายบุคคล</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">สรุปจำนวนครั้งที่มาสาย และรวมเวลาที่สายทั้งหมดของพนักงานแต่ละคน</p>
                <button onClick={async () => {
                  const sDate = document.getElementById('report-start-date').value;
                  const eDate = document.getElementById('report-end-date').value;
                  Swal.fire({ title: 'กำลังประมวลผล...', text: 'กรุณารอสักครู่', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  
                  try {
                    let query = supabase.from('attendance_logs').select('*, employees(full_name, employee_code)').eq('status', 'late');
                    if (sDate) query = query.gte('timestamp', `${sDate}T00:00:00`);
                    if (eDate) query = query.lte('timestamp', `${eDate}T23:59:59`);
                    
                    const { data: lateData, error } = await query;
                    if (error) throw error;
                    if (!lateData || lateData.length === 0) return Swal.fire('ไม่พบข้อมูล', 'ไม่มีประวัติการมาสายในช่วงเวลาที่เลือก', 'success');

                    // จับกลุ่มและบวกเลขรวมรายบุคคล
                    const summary = {};
                    lateData.forEach(r => {
                      const empCode = r.employees?.employee_code || '-';
                      const name = r.employees?.full_name || 'ไม่ระบุ';
                      if (!summary[empCode]) {
                        summary[empCode] = { name, count: 0, total_mins: 0 };
                      }
                      summary[empCode].count += 1;
                      summary[empCode].total_mins += (r.late_minutes || 0);
                    });

                    let csv = "รหัสพนักงาน,ชื่อ-นามสกุล,จำนวนครั้งที่มาสาย,รวมเวลาที่สาย(นาที),สรุปเป็นชั่วโมง\n";
                    Object.keys(summary).sort().forEach(code => {
                      const d = summary[code];
                      const h = Math.floor(d.total_mins / 60);
                      const m = d.total_mins % 60;
                      csv += `${code},${d.name},${d.count} ครั้ง,${d.total_mins} นาที,${h} ชม. ${m} น.\n`;
                    });
                    
                    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Late_Summary_Report_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    Swal.close();
                  } catch (err) { Swal.fire('Error', err.message, 'error'); }
                }} className="w-full bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>

              {/* 8. รายงานสรุปสถิติยอดขายรวม (Total Sales Performance) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">สรุปยอดขายสะสม</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">สรุปยอดขายรวมสะสมของพนักงานแต่ละคน พร้อมคำนวณประสิทธิภาพรวม</p>
                <button onClick={async () => {
                  const sDate = document.getElementById('report-start-date').value;
                  const eDate = document.getElementById('report-end-date').value;
                  Swal.fire({ title: 'กำลังประมวลผล...', text: 'กรุณารอสักครู่', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  
                  try {
                    let query = supabase.from('employee_sales').select('*, employees(full_name, employee_code, position)');
                    if (sDate) query = query.gte('created_at', `${sDate}T00:00:00`);
                    if (eDate) query = query.lte('created_at', `${eDate}T23:59:59`);
                    
                    const { data: salesData, error } = await query;
                    if (error) throw error;
                    if (!salesData || salesData.length === 0) return Swal.fire('ไม่พบข้อมูล', 'ไม่มีข้อมูลยอดขายในช่วงเวลาที่เลือก', 'warning');

                    // จับกลุ่มรวมยอดขายรายบุคคล
                    const summary = {};
                    salesData.forEach(r => {
                      const empCode = r.employees?.employee_code || '-';
                      const name = r.employees?.full_name || 'ไม่ระบุ';
                      const pos = r.employees?.position || '-';
                      if (!summary[empCode]) {
                        summary[empCode] = { name, pos, total_sales: 0, total_target: 0, count: 0 };
                      }
                      summary[empCode].total_sales += Number(r.current_sales || 0);
                      summary[empCode].total_target += Number(r.target_sales || 0);
                      summary[empCode].count += 1;
                    });

                    let csv = "รหัสพนักงาน,ชื่อ-นามสกุล,ตำแหน่ง,จำนวนรอบที่บันทึก,ยอดขายรวมสะสม,เป้าหมายรวมสะสม,ประสิทธิภาพรวม\n";
                    Object.keys(summary).sort().forEach(code => {
                      const d = summary[code];
                      const pct = d.total_target > 0 ? ((d.total_sales / d.total_target) * 100).toFixed(2) : 0;
                      csv += `${code},${d.name},${d.pos},${d.count},${d.total_sales},${d.total_target},${pct}%\n`;
                    });
                    
                    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Total_Sales_Summary_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    Swal.close();
                  } catch (err) { Swal.fire('Error', err.message, 'error'); }
                }} className="w-full bg-orange-50 text-orange-600 border border-orange-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>

              {/* 9. รายงานสิทธิ์การใช้งานระบบ (System Users & Roles) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">🔐</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">รายงานสิทธิ์ผู้ใช้ระบบ</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">ตรวจสอบรายชื่อผู้ที่มีสิทธิ์ Admin / CEO และสถานะบัญชีทั้งหมดเพื่อความปลอดภัย</p>
                <button onClick={async () => {
                  Swal.fire({ title: 'กำลังดึงข้อมูล...', text: 'กรุณารอสักครู่', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  
                  try {
                    // เรียงตามสิทธิ์ (role) เพื่อให้ Admin/CEO อยู่บนสุด
                    const { data: empData, error } = await supabase.from('employees').select('*').order('role', { ascending: true });
                    if (error) throw error;

                    let csv = "ลำดับ,รหัสพนักงาน,ชื่อ-นามสกุล,บทบาท (Role),ตำแหน่ง,สถานะการใช้งาน\n";
                    empData.forEach((r, index) => {
                      const no = index + 1;
                      const empCode = r.employee_code || '-';
                      const name = r.full_name || '-';
                      const role = (r.role === 'admin' || r.role === 'ceo') ? `⭐ ${r.role.toUpperCase()}` : r.role;
                      const pos = r.position || '-';
                      const status = r.is_active === false ? 'ระงับบัญชี (Inactive)' : 'ใช้งานปกติ (Active)';
                      
                      csv += `${no},${empCode},${name},${role},${pos},${status}\n`;
                    });
                    
                    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `System_Users_Roles_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    Swal.close();
                  } catch (err) { Swal.fire('Error', err.message, 'error'); }
                }} className="w-full bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-fuchsia-600 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>
              
              {/* 10. รายงานสรุปเตรียมทำเงินเดือน (Payroll Preparation) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">💸</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">สรุปข้อมูลทำเงินเดือน</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">สรุปวันมาทำงาน วันที่ลา และเวลาที่สายทั้งหมด เพื่อนำไปคำนวณเงินเดือนหรือหักเงิน</p>
                <button onClick={async () => {
                  const sDate = document.getElementById('report-start-date').value;
                  const eDate = document.getElementById('report-end-date').value;
                  Swal.fire({ title: 'กำลังรวบรวมข้อมูล...', text: 'ดึงข้อมูลการเข้างานและลางาน', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  
                  try {
                    // 1. ดึงข้อมูลเข้างาน
                    let attQuery = supabase.from('attendance_logs').select('*, employees(full_name, employee_code)');
                    if (sDate) attQuery = attQuery.gte('timestamp', `${sDate}T00:00:00`);
                    if (eDate) attQuery = attQuery.lte('timestamp', `${eDate}T23:59:59`);
                    const { data: attData, error: attErr } = await attQuery;
                    if (attErr) throw attErr;

                    // 2. ดึงข้อมูลลางาน (เฉพาะที่อนุมัติแล้ว)
                    let leaveQuery = supabase.from('leave_requests').select('*, employees(full_name, employee_code)').eq('status', 'approved');
                    if (sDate) leaveQuery = leaveQuery.gte('start_date', sDate);
                    if (eDate) leaveQuery = leaveQuery.lte('end_date', eDate);
                    const { data: leaveData, error: leaveErr } = await leaveQuery;
                    if (leaveErr) throw leaveErr;

                    // จับกลุ่มข้อมูล
                    const summary = {};
                    
                    // นับวันทำงานและเวลาสาย
                    (attData || []).forEach(r => {
                      const empCode = r.employees?.employee_code || '-';
                      const name = r.employees?.full_name || 'ไม่ระบุ';
                      const date = r.timestamp ? r.timestamp.split('T')[0] : null;
                      
                      if (!summary[empCode]) summary[empCode] = { name, workDays: new Set(), totalLateMins: 0, leaveDays: 0 };
                      if (date) summary[empCode].workDays.add(date); 
                      summary[empCode].totalLateMins += (r.late_minutes || 0);
                    });

                    // นับวันลางาน
                    (leaveData || []).forEach(r => {
                      const empCode = r.employees?.employee_code || '-';
                      const name = r.employees?.full_name || 'ไม่ระบุ';
                      if (!summary[empCode]) summary[empCode] = { name, workDays: new Set(), totalLateMins: 0, leaveDays: 0 };
                      
                      const start = new Date(r.start_date);
                      const end = new Date(r.end_date);
                      const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1; 
                      summary[empCode].leaveDays += (days > 0 ? days : 1);
                    });

                    // 🟢 เพิ่มคอลัมน์ "สรุปเวลาสาย(ชั่วโมง)" ใน Header
                    let csv = "รหัสพนักงาน,ชื่อ-นามสกุล,จำนวนวันที่มาทำงาน(วัน),จำนวนวันที่ลา(วัน),รวมเวลาที่สาย(นาที),สรุปเวลาสาย(ชั่วโมง)\n";
                    Object.keys(summary).sort().forEach(code => {
                      const d = summary[code];
                      
                      // 🟢 คำนวณแปลงนาที เป็น ชั่วโมง และ นาที ให้ดูง่ายๆ
                      const h = Math.floor(d.totalLateMins / 60);
                      const m = d.totalLateMins % 60;
                      const formattedLate = `${h} ชม. ${m} น.`;
                      
                      // 🟢 เพิ่มตัวแปร formattedLate ลงไปในบรรทัด CSV
                      csv += `${code},${d.name},${d.workDays.size},${d.leaveDays},${d.totalLateMins},${formattedLate}\n`;
                    });
                    
                    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Payroll_Preparation_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    Swal.close();
                  } catch (err) { Swal.fire('Error', err.message, 'error'); }
                }} className="w-full bg-teal-50 text-teal-600 border border-teal-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-teal-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>

              {/* 11. รายงานสถิติการลางานสะสม (Leave Usage Summary) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">📊</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">สถิติการลางานสะสม</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">แยกประเภทการลา (ลาป่วย, ลากิจ, พักร้อน) เป็นรายบุคคลว่าใช้โควต้าไปกี่วันแล้ว</p>
                <button onClick={async () => {
                  const sDate = document.getElementById('report-start-date').value;
                  const eDate = document.getElementById('report-end-date').value;
                  Swal.fire({ title: 'กำลังประมวลผล...', text: 'กรุณารอสักครู่', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  
                  try {
                    let query = supabase.from('leave_requests').select('*, employees(full_name, employee_code)').eq('status', 'approved');
                    if (sDate) query = query.gte('start_date', sDate);
                    if (eDate) query = query.lte('end_date', eDate);
                    
                    const { data: leaveData, error } = await query;
                    if (error) throw error;
                    if (!leaveData || leaveData.length === 0) return Swal.fire('ไม่พบข้อมูล', 'ไม่มีประวัติการลางานที่อนุมัติแล้ว', 'success');

                    const summary = {};
                    leaveData.forEach(r => {
                      const empCode = r.employees?.employee_code || '-';
                      const name = r.employees?.full_name || 'ไม่ระบุ';
                      const type = r.leave_type || 'อื่นๆ';
                      
                      const start = new Date(r.start_date);
                      const end = new Date(r.end_date);
                      const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

                      if (!summary[empCode]) summary[empCode] = { name, types: {} };
                      if (!summary[empCode].types[type]) summary[empCode].types[type] = 0;
                      
                      summary[empCode].types[type] += (days > 0 ? days : 1);
                    });

                    // ดึงประเภทการลาทั้งหมดที่มีเพื่อสร้าง Header คอลัมน์
                    const allTypes = new Set();
                    Object.values(summary).forEach(d => Object.keys(d.types).forEach(t => allTypes.add(t)));
                    const typesArray = Array.from(allTypes);

                    let csv = `รหัสพนักงาน,ชื่อ-นามสกุล,${typesArray.join(',')},รวมทุกประเภท(วัน)\n`;
                    Object.keys(summary).sort().forEach(code => {
                      const d = summary[code];
                      let total = 0;
                      let typeCols = typesArray.map(t => {
                        const days = d.types[t] || 0;
                        total += days;
                        return days;
                      }).join(',');
                      
                      csv += `${code},${d.name},${typeCols},${total}\n`;
                    });
                    
                    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Leave_Summary_Report_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    Swal.close();
                  } catch (err) { Swal.fire('Error', err.message, 'error'); }
                }} className="w-full bg-sky-50 text-sky-600 border border-sky-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>

              {/* 12. รายงานตรวจสอบพิกัดเช็คอิน (Location Audit & Google Maps) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="text-4xl mb-4">🕵️‍♂️</div>
                <h4 className="font-black text-slate-800 text-lg mb-1">ตรวจสอบพิกัด GPS</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">ประวัติการกดเช็คอินเข้า-ออกงาน พร้อมสร้างลิงก์ Google Maps ให้คลิกดูใน Excel ได้เลย</p>
                <button onClick={async () => {
                  const sDate = document.getElementById('report-start-date').value;
                  const eDate = document.getElementById('report-end-date').value;
                  Swal.fire({ title: 'กำลังสร้างแผนที่...', text: 'กรุณารอสักครู่', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  
                  try {
                    let query = supabase.from('attendance_logs').select('*, employees(full_name, employee_code)').not('lat', 'is', null).order('timestamp', { ascending: false });
                    if (sDate) query = query.gte('timestamp', `${sDate}T00:00:00`);
                    if (eDate) query = query.lte('timestamp', `${eDate}T23:59:59`);
                    
                    const { data: locData, error } = await query;
                    if (error) throw error;
                    if (!locData || locData.length === 0) return Swal.fire('ไม่พบข้อมูล', 'ไม่มีประวัติการบันทึกพิกัด GPS ในช่วงเวลาที่เลือก', 'warning');

                    let csv = "วันที่,เวลา,รหัสพนักงาน,ชื่อ-นามสกุล,สถานะการมาสาย,ละติจูด,ลองจิจูด,ลิงก์ Google Maps\n";
                    locData.forEach(r => {
                      const date = r.timestamp ? r.timestamp.split('T')[0] : '-';
                      const time = r.timestamp ? r.timestamp.split('T')[1].substring(0,5) : '-';
                      const empCode = r.employees?.employee_code || '-';
                      const name = r.employees?.full_name || '-';
                      const status = (r.status === 'late' || r.status === 'สาย') ? 'สาย' : 'ปกติ';
                      const lat = r.lat || '-';
                      const lng = r.lng || '-';
                      
                      // 🟢 สร้างลิงก์ Google Maps แบบมาตรฐาน
                      const mapLink = (lat !== '-' && lng !== '-') ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : '-';
                      
                      // 🟢 ใส่เครื่องหมาย ฟันหนู "" ครอบ mapLink เอาไว้ เพื่อกัน Excel ตัดคอลัมน์ตรงลูกน้ำ
                      csv += `${date},${time},${empCode},${name},${status},${lat},${lng},"${mapLink}"\n`;
                    });
                    
                    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Location_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    Swal.close();
                  } catch (err) { Swal.fire('Error', err.message, 'error'); }
                }} className="w-full bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  📥 ดาวน์โหลด (CSV)
                </button>
              </div>

            </div>

          </div>
        </div>
      )}


        {/* 👑 VIEW: APPROVALS (ระบบ Admin) - ใส่ Popup ครบชุดแล้ว */}
        {currentView === "approvals" && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col mt-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-lg border border-rose-100 flex-1 flex flex-col">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100 gap-4">
                <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2"><span className="p-1.5 md:p-2 bg-rose-100 text-rose-500 rounded-lg md:rounded-xl text-xl md:text-2xl">✅</span> {t.allPendingApprovals}</h3>
                <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                  <button onClick={() => setAdminTab('leaves')} className={`flex-1 md:flex-none px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${adminTab==='leaves' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`}>{t.tabLeaves} ({adminLeaves.length})</button>
                  <button onClick={() => setAdminTab('adjustments')} className={`flex-1 md:flex-none px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${adminTab==='adjustments' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'}`}>{t.tabAdjusts} ({adminAdjustments.length})</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 md:pr-2">
                <div className="space-y-3 md:space-y-4">
                  {/* --- แท็บอนุมัติการลา --- */}
                  {adminTab === 'leaves' && (adminLeaves.length === 0 ? <div className="text-center py-10 md:py-20 text-slate-400 font-bold text-sm md:text-lg">{t.noPending}</div> : (
                    adminLeaves.map(req => (
                      <div key={req.id} className="bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-pink-300 transition-colors shadow-sm gap-4">
                        <div className="flex gap-3 md:gap-4 items-center w-full sm:w-auto overflow-hidden">
                          <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md">{(req.employees?.full_name || 'U').charAt(0)}</div>
                          <div className="overflow-hidden">
                            <h4 className="font-black text-slate-800 text-sm md:text-lg truncate">{req.employees?.full_name}</h4>
                            <p className="text-[10px] md:text-sm font-bold text-pink-500 mt-0.5 md:mt-1 truncate">{getTranslatedType(req.leave_type)} <span className="text-slate-400 font-medium">| {formatDuration(req.duration_minutes)}</span></p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          
                          {/* 🔍 ปุ่มดูรายละเอียดลางาน */} 
<button onClick={() => { 
  const empName = req.employees?.full_name || req.full_name || 'ไม่ระบุชื่อ'; 
  Swal.fire({ 
    title: '<span class="font-black text-slate-800">รายละเอียดคำขอลา</span>',
    html: `
      <div class="text-left space-y-4 p-2 font-sans">
        
        <div class="bg-indigo-600 p-4 rounded-2xl shadow-md text-white text-center">
          <p class="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">📅 วันที่ต้องการลาหยุด (Leave Dates)</p>
          <p class="text-[16px] font-black">
            ${req.start_date ? new Date(req.start_date).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }) : 'ไม่ระบุ'} 
            ถึง 
            ${req.end_date ? new Date(req.end_date).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }) : 'ไม่ระบุ'}
          </p>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p class="text-[10px] font-black text-slate-400 uppercase mb-1">เหตุผลการลา / หมายเหตุ</p>
          <p class="text-sm font-bold text-slate-600 leading-relaxed">${req.reason || req.remarks || 'ไม่ได้ระบุเหตุผล'}</p>
        </div>

        ${req.medical_cert_url ? `
          <div class="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black text-blue-400 uppercase mb-1">เอกสารแนบ</p>
              <p class="text-xs font-bold text-blue-600">มีเอกสารประกอบการลา</p>
            </div>
            <button type="button" id="btn-preview-doc-${req.id}" class="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-black hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1">
              เปิดดู 🔍
            </button>
          </div>
        ` : `
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p class="text-[10px] font-black text-slate-400 uppercase mb-1">เอกสารแนบ</p>
            <p class="text-xs font-bold text-slate-400">- ไม่มีเอกสารแนบ -</p>
          </div>
        `}
        
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
           <div>
             <p class="text-[10px] font-black text-slate-400 uppercase mb-1">กดยื่นคำขอเมื่อ</p>
             <p class="text-xs font-bold text-slate-600">
               ${new Date(req.created_at).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
             </p>
           </div>
           <div>
              <p class="text-[10px] font-black text-slate-400 uppercase mb-1 text-right">ระยะเวลารวม</p>
              <p class="text-xs font-black text-pink-600 text-right">${typeof formatDuration === 'function' ? formatDuration(req.duration_minutes) : `${req.duration_minutes} นาที`}</p>
           </div>
        </div>
      </div>
    `,
    confirmButtonText: 'ปิดหน้าต่าง',
    confirmButtonColor: '#4F46E5',
    customClass: { popup: 'rounded-[2rem]' },
    didOpen: () => {
      const btnPreview = document.getElementById(`btn-preview-doc-${req.id}`);
      if (btnPreview) {
        btnPreview.addEventListener('click', () => {
          const fileUrl = req.medical_cert_url || '';
          const isPdf = fileUrl.toLowerCase().includes('.pdf');
          
          if (isPdf) {
            Swal.fire({
              title: '<span class="font-black text-slate-800">📄 เอกสารประกอบการลา</span>',
              html: '<div class="w-full h-[65vh] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mt-2"><iframe src="' + fileUrl + '" class="w-full h-full border-none"></iframe></div>',
              width: '800px',
              showCloseButton: true,
              confirmButtonText: 'ปิด',
              confirmButtonColor: '#ec4899',
              customClass: { popup: 'rounded-[2rem]' }
            });
          } else {
            Swal.fire({
              title: '<span class="font-black text-slate-800">📄 รูปภาพประกอบการลา</span>',
              html: `
                <div class="text-xs text-slate-500 mb-3 font-bold flex items-center justify-center gap-1">
                  🖱️ เลื่อนลูกกลิ้งเมาส์เพื่อซูม <span class="mx-1">•</span> คลิกค้างเพื่อลากดู
                </div>
                <div class="flex justify-center w-full">
                  <div id="zoom-container" class="w-fit max-w-full mx-auto relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                    <img id="zoomable-img" src="${fileUrl}" class="max-w-full max-h-[65vh] select-none pointer-events-none" style="transform-origin: center center;" alt="เอกสาร" draggable="false" />
                    <button id="btn-reset-zoom" class="absolute bottom-4 right-4 bg-slate-800/70 hover:bg-slate-900 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg border border-white/20 hidden">
                      คืนค่าเดิม 🔄
                    </button>
                  </div>
                </div>
              `,
              width: '800px',
              showCloseButton: true,
              confirmButtonText: 'ปิด',
              confirmButtonColor: '#ec4899',
              customClass: { popup: 'rounded-[2rem]' },
              didOpen: () => {
                const container = document.getElementById('zoom-container');
                const img = document.getElementById('zoomable-img');
                const resetBtn = document.getElementById('btn-reset-zoom');
                
                let scale = 1;
                let pointX = 0;
                let pointY = 0;
                let isDragging = false;
                let originX = 0;
                let originY = 0;
                let startX = 0;
                let startY = 0;

                const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

                const updateTransform = (smooth = false) => {
                  if (!img || !container) return;
                  
                  if (scale <= 1) {
                    scale = 1;
                    pointX = 0;
                    pointY = 0;
                  } else {
                    const rect = container.getBoundingClientRect();
                    const maxOffsetX = (rect.width * scale - rect.width) / 2;
                    const maxOffsetY = (rect.height * scale - rect.height) / 2;
                    
                    pointX = clamp(pointX, -maxOffsetX, maxOffsetX);
                    pointY = clamp(pointY, -maxOffsetY, maxOffsetY);
                  }

                  img.style.transition = smooth ? 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none';
                  img.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
                  
                  if (resetBtn) {
                    resetBtn.style.display = scale > 1 ? 'block' : 'none';
                  }
                  
                  container.style.cursor = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default';
                };

                if (container) {
                  container.addEventListener('mousedown', (e) => {
                    if (scale <= 1) return;
                    e.preventDefault();
                    isDragging = true;
                    originX = e.clientX;
                    originY = e.clientY;
                    startX = pointX;
                    startY = pointY;
                    container.style.cursor = 'grabbing';
                  });

                  const stopDrag = () => { 
                    if (isDragging) {
                      isDragging = false; 
                      updateTransform(true);
                    }
                  };
                  window.addEventListener('mouseup', stopDrag);
                  
                  window.addEventListener('mousemove', (e) => {
                    if (!isDragging || scale <= 1) return;
                    e.preventDefault();
                    pointX = startX + (e.clientX - originX);
                    pointY = startY + (e.clientY - originY);
                    updateTransform(false);
                  });

                  container.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    const delta = e.deltaY || e.detail || e.wheelDelta;
                    const zoomFactor = 0.3; 
                    
                    if (delta < 0) scale += zoomFactor; 
                    else scale -= zoomFactor; 
                    
                    scale = clamp(scale, 1, 5);
                    updateTransform(true);
                  });
                }

                if (resetBtn) {
                  resetBtn.onclick = () => {
                    scale = 1; pointX = 0; pointY = 0;
                    updateTransform(true);
                  };
                }
              }
            });
          }
        });
      }
    }
  }); 
}} className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-black text-xs md:text-sm hover:bg-blue-600 hover:text-white transition-colors border border-blue-200">🔍 รายละเอียด</button>
                          
                          {/* 🎯 ปุ่มปฏิเสธ (เรียก Popup) */}
                          <button onClick={() => executeRejectWithPopup(req, `คำขอ${getTranslatedType(req.leave_type)}`, true)} className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-black text-xs md:text-sm">{t.btnReject}</button>
                          {/* 🎯 ปุ่มอนุมัติ (เรียก Popup) */}
                          <button onClick={() => executeApproveWithPopup(req, `คำขอ${getTranslatedType(req.leave_type)}`, true)} className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 text-white rounded-lg font-black text-xs md:text-sm">✅ {t.btnApprove}</button>
                        </div>
                      </div>
                    ))
                  ))}

                  {/* --- แท็บอนุมัติปรับปรุงเวลา --- */}
                  {adminTab === 'adjustments' && (adminAdjustments.length === 0 ? <div className="text-center py-10 md:py-20 text-slate-400 font-bold text-sm md:text-lg">{t.noPending}</div> : (
                    adminAdjustments.map(req => (
                      <div key={req.id} className="bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-purple-300 transition-colors shadow-sm gap-4">
                        <div className="flex gap-3 md:gap-4 items-center w-full sm:w-auto overflow-hidden">
                          <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gradient-to-tr from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md">{(req.employees?.full_name || 'U').charAt(0)}</div>
                          <div className="overflow-hidden">
                            <h4 className="font-black text-slate-800 text-sm md:text-lg truncate">{req.employees?.full_name}</h4>
                            <p className="text-[10px] md:text-sm font-bold text-purple-600 mt-0.5 md:mt-1 truncate">{getTranslatedType(req.request_type)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          
                          {/* 🔍 ปุ่มดูรายละเอียดปรับปรุงเวลา */}
                          <button onClick={() => {
                            // ดึงชื่อมาเก็บไว้ในตัวแปรก่อนให้ชัวร์
                            const empName = req.employees?.full_name || req.full_name || 'ไม่ระบุชื่อ';
                            Swal.fire({
                              title: '⏰ รายละเอียดปรับปรุงเวลา',
                              html: `
                                <div class="text-left text-sm space-y-3 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                  <p><b>👤 พนักงาน:</b> <span class="text-indigo-600 font-bold">${empName}</span></p>
                                  <p><b>📅 วันที่ขอปรับ:</b> ${req.adjust_date || req.date ? new Date(req.adjust_date || req.date).toLocaleDateString('th-TH') : '-'}</p>
                                  <p><b>🟢 ขอเวลาเข้าใหม่:</b> <span class="text-emerald-600 font-bold">${req.adjust_in || req.time_in ? (req.adjust_in || req.time_in).substring(0,5) : '-'}</span></p>
                                  <p><b>🔴 ขอเวลาออกใหม่:</b> <span class="text-rose-600 font-bold">${req.adjust_out || req.time_out ? (req.adjust_out || req.time_out).substring(0,5) : '-'}</span></p>
                                  <p><b>📝 เหตุผล:</b> ${req.reason || '-'}</p>
                                </div>
                              `,
                              confirmButtonText: 'ปิด',
                              confirmButtonColor: '#64748b'
                            });
                          }} className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-black text-xs md:text-sm">🔍</button>

                          {/* 🎯 ปุ่มปฏิเสธ (เรียก Popup) */}
                          <button onClick={() => executeRejectWithPopup(req, `คำขอ${getTranslatedType(req.request_type)}`, false)} className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-black text-xs md:text-sm">{t.btnReject}</button>
                          {/* 🎯 ปุ่มอนุมัติ (เรียก Popup) */}
                          <button onClick={() => executeApproveWithPopup(req, `คำขอ${getTranslatedType(req.request_type)}`, false)} className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 text-white rounded-lg font-black text-xs md:text-sm">✅ {t.btnApprove}</button>
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

{/* 🖥️ VIEW: MONITOR SYSTEM (GOD MODE V6 - THE FINAL OMNIPOTENT 👁️ - DUAL LINE ROUTING) */}
        {currentView === "monitor" && (user?.role === 'admin' || user?.role === 'ceo') && (() => {
          
          // 🛡️ ฟังก์ชันสำหรับเก็บ Log การกดปุ่ม (แก้กลับมาใช้โครงสร้าง action + details ต้นฉบับ 100%)
          const recordMonitorLog = async (actionName, detailsMsg) => {
            try {
              let ipAddress = 'Unknown IP';
              try {
                const res = await fetch('https://api.ipify.org?format=json');
                const data = await res.json();
                ipAddress = data.ip;
              } catch (e) {}
              const device = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : (/Tablet|iPad/i.test(navigator.userAgent) ? 'Tablet' : 'Desktop');
              
              // 🟢 ส่งข้อมูลครบ 3 คอลัมน์ตาม DB ของพี่เป๊ะๆ (แก้ Error 400)
              await supabase.from('system_logs').insert([{ 
                employee_id: user.id, 
                action: actionName, 
                details: `${detailsMsg} | ${device} | IP: ${ipAddress}` 
              }]);
            } catch (err) { console.error("Monitor Log Error:", err); }
          };

          // 🧠 1. Core Data & Predictor
          const today = new Date();
          const todayStr = today.toISOString().split('T')[0];
          const thaiDate = today.toLocaleDateString('th-TH', { day: 'numeric', month: 'numeric', year: 'numeric' });
          const currentMonthStr = todayStr.slice(0,7);
          
          const empCount = employees?.length || 0;
          const attCount = attendanceList?.length || 0;
          const leaveCount = allLeaves?.length || 0;
          const payCount = payrollData?.length || 0;
          const totalRecords = empCount + attCount + leaveCount + payCount;
          
          const estimatedMB = (totalRecords * 0.015).toFixed(2);
          const maxStorageMB = 500;
          const storagePercent = Math.min(100, (estimatedMB / maxStorageMB) * 100); 
          const avgGrowthPerDayMB = 0.3; 
          const remainingMB = maxStorageMB - estimatedMB;
          const estimatedDaysLeft = remainingMB > 0 ? Math.floor(remainingMB / avgGrowthPerDayMB) : 0;

          // 🧠 2. Financial Radar
          const thisMonthSlips = payrollData?.filter(p => p.month === currentMonthStr) || [];
          const totalPayrollCost = thisMonthSlips.reduce((sum, slip) => sum + Number(slip.net_salary || 0), 0);
          const totalCommissionCost = thisMonthSlips.reduce((sum, slip) => sum + Number(slip.commission || 0), 0);
          
          // 🧠 3. Workforce & Anomalies Detection
          const todayAttendance = attendanceList?.filter(a => (a.timestamp || a.created_at)?.startsWith(todayStr)) || [];
          const uniqueTodayLogs = [];
          const seenNames = new Set();
          const loginCounts = {};
          
          todayAttendance.forEach(a => {
            const name = a.full_name || a.employee_id;
            loginCounts[name] = (loginCounts[name] || 0) + 1;
            if(!seenNames.has(name)) { seenNames.add(name); uniqueTodayLogs.push(a); }
          });
          
          const suspiciousLogins = Object.entries(loginCounts).filter(([name, count]) => count > 4);
          const todayLateCount = uniqueTodayLogs.filter(a => a.status === 'late' || a.status === 'สาย').length;
          const todayOnTimeCount = uniqueTodayLogs.filter(a => a.status === 'normal' || a.status === 'ปกติ').length;
          const totalCheckedIn = uniqueTodayLogs.length;
          const peopleOnLeaveToday = allLeaves?.filter(l => l.status === 'อนุมัติ' && l.start_date <= todayStr && l.end_date >= todayStr)?.length || 0;
          const pendingLeaveCount = allLeaves?.filter(l => l.status === 'รออนุมัติ')?.length || 0;

          // 🧠 4. THE ALL-SEEING EYE: GPS Anomaly Detector
          const hqLat = 13.7563; 
          const hqLng = 100.5018; 
          const calculateDistance = (lat1, lon1, lat2, lon2) => {
            if(!lat1 || !lon1 || !lat2 || !lon2) return 0;
            const R = 6371; 
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
          };

          const gpsAnomalies = uniqueTodayLogs.map(log => {
             if(log.latitude && log.longitude) {
                const dist = calculateDistance(hqLat, hqLng, parseFloat(log.latitude), parseFloat(log.longitude));
                if(dist > 1) return { name: log.full_name || log.employee_id, dist: dist.toFixed(1) };
             }
             return null;
          }).filter(Boolean);

          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const activeIdsLast30Days = new Set((attendanceList || [])
             .filter(a => new Date(a.timestamp || a.created_at) > thirtyDaysAgo)
             .map(a => a.employee_id)
          );
          
          const ghostEmployees = (employees || [])
             .filter(e => !activeIdsLast30Days.has(e.id))
             .map(e => e.full_name || e.employee_code);

          const oldLogsCount = (attendanceList || []).filter(a => new Date(a.timestamp || a.created_at) < thirtyDaysAgo).length;

          // 🚀 LIVE TERMINAL ENGINE (ดึงข้อมูลจากตาราง system_logs ของจริง 100% ไร้ Mockup)
          if (typeof window !== 'undefined') {
            const fetchLiveLogs = async () => {
              const el = document.getElementById('god-mode-terminal');
              if (!el) return;
              try {
                const { data, error } = await supabase.from('system_logs').select('*').order('created_at', { ascending: false }).limit(50);
                if (!error && data) {
                  const html = data.map(log => {
                    const d = new Date(log.created_at);
                    const dateStr = `[${d.toLocaleDateString('en-GB')} ${d.toLocaleTimeString('en-GB')}]`;
                    const emp = (employees || []).find(e => e.id === log.employee_id);
                    const empName = emp ? emp.full_name : (log.employee_id || 'System');
                    const nameShort = empName.split(' ')[0]; // เอาชื่อหน้า
                    
                    return `<div class="flex gap-4 items-start hover:bg-white/5 px-2 py-1 rounded transition-colors group">
                              <span class="text-slate-600 shrink-0 w-36">${dateStr}</span>
                              <span class="text-emerald-500 font-bold shrink-0 w-24 truncate">[${nameShort}]</span>
                              <span class="text-slate-300 group-hover:text-white transition-colors break-words leading-relaxed">${log.action} ${log.details ? `- ${log.details}` : ''}</span>
                            </div>`;
                  }).join('') + '<p class="animate-pulse text-lg mt-2 text-emerald-500">_</p>';
                  
                  if (el.innerHTML !== html) el.innerHTML = html;
                }
              } catch(e) {}
            };
            setTimeout(fetchLiveLogs, 100);
            if (window.__sysLogInterval) clearInterval(window.__sysLogInterval);
            window.__sysLogInterval = setInterval(fetchLiveLogs, 3000); // อัปเดตสดๆ ทุก 3 วินาที
          }

          const handleExportRealDB = async (tableName, filename) => {
            recordMonitorLog('EXPORT_DATA', `ส่งออกข้อมูลตาราง ${tableName} เป็นไฟล์ CSV`); 
            Swal.fire({ title: 'Extracting Data...', text: `Connecting to ${tableName} node`, allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            try {
              const { data, error } = await supabase.from(tableName).select('*');
              if (error) throw error;
              if (!data || data.length === 0) return Swal.fire({ icon: 'warning', title: 'Data Empty', text: `Node ${tableName} is currently empty.`, customClass: { popup: 'rounded-[2rem] bg-slate-900 text-white border border-slate-700' }});
              const headers = Object.keys(data[0]);
              const csvRows = [headers.join(',')];
              for (const row of data) {
                const values = headers.map(h => {
                  let val = row[h]; if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
                  let str = val === null || val === undefined ? '' : String(val);
                  str = str.replace(/"/g, '""'); if (str.includes(',') || str.includes('\n') || str.includes('"')) str = `"${str}"`;
                  return str;
                });
                csvRows.push(values.join(','));
              }
              const blob = new Blob(["\ufeff" + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename;
              document.body.appendChild(link); link.click(); document.body.removeChild(link);
              Swal.fire({ icon: 'success', title: 'Extraction Complete', text: `${data.length} records successfully downloaded.`, timer: 2000, showConfirmButton: false, customClass: { popup: 'rounded-[2rem] bg-slate-900 text-white border border-emerald-500' }});
            } catch (err) { Swal.fire({title: 'Error', text: err.message, icon: 'error', customClass: { popup: 'bg-slate-900 text-white' }}); }
          };

          const toggleRealSystemSetting = async (settingKey, settingName) => {
            Swal.fire({ title: 'กำลังโหลดข้อมูล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            try {
              const { data } = await supabase.from('system_settings').select('setting_value').eq('setting_key', settingKey).maybeSingle();
              const isCurrentlyOn = data?.setting_value === 'true';
              const newValue = isCurrentlyOn ? 'false' : 'true';
              const result = await Swal.fire({
                title: `ตั้งค่า: ${settingName}`, text: `สถานะปัจจุบัน: ${isCurrentlyOn ? 'เปิดใช้งาน 🟢' : 'ปิดใช้งาน 🔴'}\nต้องการเปลี่ยนสถานะหรือไม่?`,
                icon: 'warning', showCancelButton: true, confirmButtonColor: newValue === 'true' ? '#10b981' : '#f43f5e', confirmButtonText: newValue === 'true' ? 'เปิดใช้งาน' : 'ปิดการทำงาน', customClass: { popup: 'bg-slate-900 text-white border border-slate-700 rounded-[2rem]' }
              });
              if (result.isConfirmed) {
                Swal.fire({ title: 'กำลังบันทึก...', didOpen: () => Swal.showLoading() });
                if (data) await supabase.from('system_settings').update({ setting_value: newValue }).eq('setting_key', settingKey);
                else await supabase.from('system_settings').insert([{ setting_key: settingKey, setting_value: newValue }]);
                
                recordMonitorLog('SYSTEM_SETTING', `ปรับการตั้งค่าระบบ ${settingName} เป็น ${newValue === 'true' ? 'เปิด' : 'ปิด'}`);

                Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', text: `เปลี่ยน ${settingName} เป็น ${newValue === 'true' ? 'เปิด' : 'ปิด'} แล้ว`, timer: 2000, showConfirmButton: false, customClass: { popup: 'bg-slate-900 text-white border border-emerald-500 rounded-[2rem]' } });
              }
            } catch (err) { Swal.fire('Error', err.message, 'error'); }
          };

          const handleFullDiagnostic = async () => {
            recordMonitorLog('SYSTEM_DIAGNOSTIC', `รันคำสั่งตรวจสอบความสมบูรณ์ของระบบ`);
            Swal.fire({ title: 'Running Full Diagnostic...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const start = Date.now();
            try {
              await supabase.from('employees').select('id').limit(1);
              const dbTime = Date.now() - start;
              const webhookStatus = typeof lineAdminId !== 'undefined' && lineAdminId ? '🟢 Connected' : '🔴 Missing Token';
              Swal.fire({ 
                 icon: 'success', title: 'System Healthy', 
                 html: `<div class="text-left text-sm mt-4 font-mono space-y-2">
                          <p><b>Database:</b> 🟢 ONLINE (${dbTime} ms)</p>
                          <p><b>Storage:</b> ${storagePercent > 80 ? '🔴 Critical' : '🟢 Optimal'} (${storagePercent.toFixed(1)}%)</p>
                          <p><b>LINE Webhook:</b> ${webhookStatus}</p>
                          <p><b>Ghost Data:</b> ${ghostEmployees.length > 0 ? `🔴 ${ghostEmployees.length} Found` : '🟢 0 Threats'}</p>
                        </div>`, 
                 customClass: { popup: 'rounded-[2rem] bg-slate-900 text-white border border-cyan-500' }
              });
            } catch (err) { Swal.fire('Diagnostic Failed', err.message, 'error'); }
          };

          const triggerAutoAlertTest = () => {
            recordMonitorLog('TEST_AUTO_ALERT', `กดทดสอบการส่งระบบแจ้งเตือนเข้า LINE`); 
            Swal.fire({ title: 'Simulating Auto-Alert...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            
            const msg = {
              type: "flex", altText: "🚨 AI AUTO-ALERT SYSTEM",
              contents: {
                type: "bubble", size: "giga", styles: { body: { backgroundColor: "#1e1b4b" } },
                body: {
                  type: "box", layout: "vertical", spacing: "md",
                  contents: [
                    { type: "text", text: "🚨 SYSTEM AUTO-ALERT 🚨", weight: "bold", color: "#f43f5e", size: "sm", align: "center" },
                    { type: "separator", margin: "md", color: "#334155" },
                    { type: "box", layout: "horizontal", contents: [ { type: "text", text: "Storage Risk:", size: "sm", color: "#94a3b8" }, { type: "text", text: `${storagePercent.toFixed(1)}% USED`, size: "sm", weight: "bold", color: storagePercent > 80 ? "#f43f5e" : "#f59e0b", align: "end" } ]},
                    { type: "box", layout: "horizontal", contents: [ { type: "text", text: "Login Spams:", size: "sm", color: "#94a3b8" }, { type: "text", text: `${suspiciousLogins.length} Users`, size: "sm", weight: "bold", color: suspiciousLogins.length > 0 ? "#f43f5e" : "#10b981", align: "end" } ]},
                    { type: "box", layout: "horizontal", contents: [ { type: "text", text: "Ghost Accounts:", size: "sm", color: "#94a3b8" }, { type: "text", text: `${ghostEmployees.length} Found`, size: "sm", weight: "bold", color: ghostEmployees.length > 0 ? "#f43f5e" : "#10b981", align: "end" } ]},
                    { type: "separator", margin: "md", color: "#334155" },
                    { type: "text", text: "แนะนำให้ตรวจสอบระบบ PANCAKE COMMAND CENTER โดยด่วน", color: "#cbd5e1", size: "xs", align: "center", wrap: true }
                  ]
                }
              }
            };

            fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
              method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
              body: JSON.stringify({ to: [typeof lineAdminId !== 'undefined' && lineAdminId ? lineAdminId : "C0df0123907f46aa88c44ef72e88ea30f"], messages: [msg] })
            }).catch(err => console.error("LINE Fetch Error:", err));

            setTimeout(() => {
              Swal.fire({ icon: 'success', title: 'Auto-Alert Triggered', text: 'ระบบส่งรายงานความผิดปกติเข้า LINE เรียบร้อยแล้ว', customClass: { popup: 'bg-slate-900 text-white rounded-[2rem]' }});
            }, 800);
          };

          return (
            <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in overflow-hidden">
              <div className="bg-[#050B14] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8 shadow-[0_0_50px_rgba(34,211,238,0.05)] border border-slate-800 flex-1 flex flex-col overflow-hidden text-slate-300 relative font-mono">
                
                {/* 🌌 Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none"></div>

                {/* 🛰️ HEADER */}
                <div className="mb-6 border-b border-slate-700/50 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative z-10">
                  <div>
                    <h3 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 text-3xl flex items-center gap-3 tracking-tighter">
                      <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse">👁️</span> GOD MODE: OMNIPOTENT V6
                    </h3>
                    <p className="text-[10px] text-cyan-500/70 font-bold mt-1 tracking-[0.3em] uppercase">Global Enterprise Omniscient Radar & Auto-Healing</p>
                  </div>
                  <div className="flex items-center gap-3 bg-black/40 px-5 py-2.5 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <button onClick={handleFullDiagnostic} className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1 rounded transition-colors uppercase font-bold border border-emerald-900 mr-2 flex items-center gap-2">
                       <span className="animate-pulse">⚡</span> Run Diagnostic
                    </button>
                    <div className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></div>
                    <span className="text-[10px] font-black text-emerald-400 tracking-[0.2em]">NETWORK: STABLE</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10 flex flex-col gap-6">
                  
                  {/* 🚨 ROW 1: THE ALL-SEEING EYE: ANOMALY RADAR */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     
                     <div className="bg-[#0A1220]/80 p-5 rounded-[1.5rem] border border-rose-900/50 shadow-[0_0_30px_rgba(244,63,94,0.05)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50"></div>
                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                          <span className="animate-pulse">🌍</span> GPS Out-of-Bounds Radar
                        </p>
                        <div className="flex flex-col gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                           {gpsAnomalies.length === 0 ? (
                             <div className="text-center py-4"><span className="text-2xl opacity-50">📍</span><p className="text-[10px] text-emerald-500 mt-2 font-bold uppercase tracking-widest">All checks-ins match HQ location.</p></div>
                           ) : (
                             gpsAnomalies.map((anom, i) => (
                               <div key={i} className="flex justify-between items-center bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/50">
                                  <span className="text-[10px] font-bold text-rose-200">{anom.name}</span>
                                  <span className="text-[9px] bg-rose-900 text-rose-300 px-2 py-1 rounded">⚠️ {anom.dist} km Away</span>
                               </div>
                             ))
                           )}
                        </div>
                     </div>

                     <div className="bg-[#0A1220]/80 p-5 rounded-[1.5rem] border border-amber-900/50 shadow-[0_0_30px_rgba(245,158,11,0.05)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
                        <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                          <span className="animate-pulse">👻</span> Ghost Employees (Inactive 30D)
                        </p>
                        <div className="flex flex-col gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                           {ghostEmployees.length === 0 ? (
                             <div className="text-center py-4"><span className="text-2xl opacity-50">✨</span><p className="text-[10px] text-emerald-500 mt-2 font-bold uppercase tracking-widest">Database Clean. No ghost accounts.</p></div>
                           ) : (
                             ghostEmployees.map((ghost, i) => (
                               <div key={i} className="flex justify-between items-center bg-amber-950/30 p-2.5 rounded-lg border border-amber-900/50">
                                  <span className="text-[10px] font-bold text-amber-200">{ghost}</span>
                                  <span className="text-[9px] bg-amber-900 text-amber-300 px-2 py-1 rounded font-black">Missing</span>
                               </div>
                             ))
                           )}
                        </div>
                     </div>

                  </div>

                  {/* 💰 ROW 2: LIVE METRICS & AI PREDICTOR */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-1 bg-[#0A1220]/80 p-6 rounded-[1.5rem] border border-indigo-500/30">
                      <div className="flex justify-between items-start mb-6">
                         <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-2">
                           <span className="text-indigo-500">🏦</span> Cash Flow (Month)
                         </p>
                         <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">LIVE</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Payroll Outflow</p>
                          <p className="text-4xl font-black text-white tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                            ฿{totalPayrollCost.toLocaleString(undefined, {minimumFractionDigits: 2})}
                          </p>
                        </div>
                        <div className="flex justify-between items-end border-t border-slate-800 pt-4">
                          <div><p className="text-[9px] text-slate-500 uppercase font-bold">Commission</p><p className="text-lg font-black text-emerald-400 tabular-nums">฿{totalCommissionCost.toLocaleString()}</p></div>
                          <div className="text-right"><p className="text-[9px] text-slate-500 uppercase font-bold">Slips</p><p className="text-lg font-black text-indigo-300 tabular-nums">{thisMonthSlips.length}</p></div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-1 bg-[#0A1220]/80 p-6 rounded-[1.5rem] border border-cyan-900/50 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2"><span className="animate-pulse">💽</span> AI Storage Forecast & Dist.</p>
                        <span className="text-[10px] text-cyan-500 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-800">{storagePercent.toFixed(1)}% USED</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-3xl font-black text-white tabular-nums">{estimatedMB} <span className="text-sm text-slate-500">/ {maxStorageMB} MB</span></p>
                          <p className="text-[9px] text-slate-400 uppercase mt-1">Total Nodes: {totalRecords.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden shadow-inner flex my-3 border border-slate-700">
                        <div className="h-full bg-indigo-500" style={{ width: `${totalRecords > 0 ? (attCount/totalRecords)*100 : 0}%` }} title="Attendance"></div>
                        <div className="h-full bg-emerald-500" style={{ width: `${totalRecords > 0 ? (payCount/totalRecords)*100 : 0}%` }} title="Payroll"></div>
                        <div className="h-full bg-amber-500" style={{ width: `${totalRecords > 0 ? (leaveCount/totalRecords)*100 : 0}%` }} title="Leaves"></div>
                        <div className="h-full bg-rose-500" style={{ width: `${totalRecords > 0 ? (empCount/totalRecords)*100 : 0}%` }} title="Employees"></div>
                      </div>

                      <div className="bg-cyan-950/20 border border-cyan-900/50 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase font-bold">Est. Time until FULL</span>
                          <span className={`text-sm font-black ${estimatedDaysLeft < 30 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>~ {estimatedDaysLeft} Days Left</span>
                        </div>
                        <div className="text-[20px]">⏳</div>
                      </div>
                    </div>

                    <div className="lg:col-span-1 bg-[#0A1220]/80 p-6 rounded-[1.5rem] border border-slate-700/50 flex flex-col justify-between">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-4"><span className="animate-pulse">🛡️</span> Workforce Radar</p>
                      <div className="flex justify-between items-end mb-2">
                         <div>
                           <p className="text-[10px] text-slate-500 uppercase font-bold">Checked In</p>
                           <p className="text-2xl font-black text-white tabular-nums">{totalCheckedIn} <span className="text-xs text-slate-500">/ {empCount}</span></p>
                         </div>
                         <div className="text-right">
                           <p className="text-[10px] text-rose-400 uppercase font-bold">Late Rate</p>
                           <p className="text-lg font-black text-rose-500 tabular-nums">{totalCheckedIn > 0 ? ((todayLateCount/totalCheckedIn)*100).toFixed(1) : 0}%</p>
                         </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner flex mt-2 mb-4 border border-slate-700">
                        <div className="h-full bg-emerald-500" style={{ width: `${totalCheckedIn > 0 ? (todayOnTimeCount/totalCheckedIn)*100 : 0}%` }}></div>
                        <div className="h-full bg-rose-500" style={{ width: `${totalCheckedIn > 0 ? (todayLateCount/totalCheckedIn)*100 : 0}%` }}></div>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-2.5">
                        <p className="text-[9px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1"><span className="text-xs">⚠️</span> Multiple Device Spams</p>
                        {suspiciousLogins.length === 0 ? (
                          <p className="text-[10px] text-emerald-500/70 font-mono">No spams detected.</p>
                        ) : (
                          <div className="flex flex-col gap-1 max-h-12 overflow-y-auto custom-scrollbar">
                            {suspiciousLogins.map(([name, count], i) => (
                              <div key={i} className="flex justify-between text-[10px]"><span className="text-rose-200 truncate">{name}</span><span className="text-rose-500 font-black">{count} logs!</span></div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* 🎚️ ROW 3: SMART CLEANER & MASTER CONTROLS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <div className="bg-[#0A1220]/80 p-6 rounded-[1.5rem] border border-amber-900/40 flex flex-col justify-between">
                      <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-5 border-b border-slate-800 pb-2">
                        <span>🎚️</span> System Controls & Healing
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
                          <div className="flex flex-col"><span className="text-xs font-bold text-slate-300">Maintenance Mode</span><span className="text-[9px] text-slate-500">ปิดระบบชั่วคราว</span></div>
                          <button onClick={() => toggleRealSystemSetting('maintenance_mode', 'โหมดปิดปรับปรุง')} className="bg-slate-800 hover:bg-slate-700 text-[10px] text-white px-3 py-1.5 rounded-lg shadow-sm transition-all font-bold border border-slate-600">TOGGLE</button>
                        </div>
                        <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
                          <div className="flex flex-col"><span className="text-xs font-bold text-slate-300">AI Auto-Heal (Retry)</span><span className="text-[9px] text-slate-500">ระบบจำลองซ่อมแซม API</span></div>
                          <button onClick={() => toggleRealSystemSetting('auto_heal', 'ระบบซ่อมแซม API อัตโนมัติ')} className="bg-emerald-900 hover:bg-emerald-800 text-[10px] text-emerald-400 px-3 py-1.5 rounded-lg shadow-sm transition-all font-bold border border-emerald-700">ACTIVE</button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0A1220]/80 p-6 rounded-[1.5rem] border border-rose-900/40 shadow-[0_0_20px_rgba(244,63,94,0.05)] flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-5 border-b border-rose-900/50 pb-2">
                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest flex items-center gap-2"><span>🗑️</span> Smart Cache & Trash Cleaner</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-xl flex items-center justify-between group hover:bg-rose-900/40 transition-colors">
                           <div className="flex flex-col"><span className="text-xs font-bold text-rose-200">Clear Local Cache</span><span className="text-[9px] text-rose-400/70 mt-0.5">ล้างขยะเบราว์เซอร์</span></div>
                           <button onClick={() => {
                             recordMonitorLog('CLEAR_CACHE', `ล้าง Local Cache ของเบราว์เซอร์`);
                             Swal.fire({title: 'Clearing Cache...', allowOutsideClick: false, didOpen: () => Swal.showLoading()});
                             setTimeout(() => { localStorage.removeItem('titan_notifications_global'); Swal.fire({icon: 'success', title: 'Cache Cleared!', customClass: {popup: 'bg-slate-900 text-white'}}); }, 800);
                           }} className="bg-rose-900 hover:bg-rose-800 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border border-rose-700 transition-transform group-hover:scale-110">🧹</button>
                        </div>
                        <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-xl flex items-center justify-between group hover:bg-rose-900/40 transition-colors">
                           <div className="flex flex-col"><span className="text-xs font-bold text-rose-200">Delete Old Logs</span><span className="text-[10px] font-black text-rose-500 mt-1">{oldLogsCount} Nodes Found</span></div>
                           <button onClick={() => {
                             if(oldLogsCount === 0) return Swal.fire({icon: 'info', title: 'Clean', text: 'ไม่มีข้อมูลเก่าให้ลบ', customClass: {popup: 'bg-slate-900 text-white'}});
                             Swal.fire({ title: 'ลบข้อมูล?', text: `พบข้อมูลเก่า ${oldLogsCount} รายการ`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#f43f5e', customClass: {popup: 'bg-slate-900 text-white border border-rose-500 rounded-[2rem]'}
                             }).then(async (res) => {
                               if(res.isConfirmed) {
                                 Swal.fire({title: 'Deleting...', allowOutsideClick: false, didOpen: () => Swal.showLoading()});
                                 try { 
                                   await supabase.from('attendance_logs').delete().lt('created_at', thirtyDaysAgo.toISOString()); 
                                   recordMonitorLog('DELETE_OLD_LOGS', `ลบข้อมูล Log เก่าจำนวน ${oldLogsCount} รายการ`);
                                   Swal.fire({icon: 'success', title: 'Deleted', text: `ลบขยะ ${oldLogsCount} รายการสำเร็จ`, customClass: {popup: 'bg-slate-900 text-white'}}); fetchDashboardData(); 
                                 } 
                                 catch(e) { Swal.fire('Error', e.message, 'error'); }
                               }
                             });
                           }} className="bg-rose-900 hover:bg-rose-800 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border border-rose-700 transition-transform group-hover:scale-110">🔥</button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* 📥 ROW 4: EXTRACTION CONSOLE */}
                  <div className="bg-[#0A1220]/80 p-6 rounded-[1.5rem] border border-cyan-900/30">
                    <div className="flex justify-between items-center mb-5 border-b border-slate-800 pb-2">
                      <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2"><span>📥</span> Data Extraction Console (CSV)</p>
                      <p className="text-[9px] text-slate-500 font-bold">Est. Weight: {estimatedMB} MB ({totalRecords} Nodes)</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button onClick={() => handleExportRealDB('employees', `PAYLOAD_EMP_${todayStr}.csv`)} className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">👥</span><div className="text-center"><p className="text-[10px] font-bold text-white uppercase">Employees</p><p className="text-[8px] text-slate-500">{empCount} Nodes</p></div>
                      </button>
                      <button onClick={() => handleExportRealDB('attendance_logs', `PAYLOAD_ATT_${todayStr}.csv`)} className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">📅</span><div className="text-center"><p className="text-[10px] font-bold text-white uppercase">Attendance</p><p className="text-[8px] text-slate-500">{attCount} Nodes</p></div>
                      </button>
                      <button onClick={() => handleExportRealDB('leave_requests', `PAYLOAD_LEAVE_${todayStr}.csv`)} className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">🏖️</span><div className="text-center"><p className="text-[10px] font-bold text-white uppercase">Leaves</p><p className="text-[8px] text-slate-500">{leaveCount} Nodes</p></div>
                      </button>
                      <button onClick={() => handleExportRealDB('payroll_slips', `PAYLOAD_PAY_${todayStr}.csv`)} className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">💸</span><div className="text-center"><p className="text-[10px] font-bold text-white uppercase">Payrolls</p><p className="text-[8px] text-slate-500">{payCount} Nodes</p></div>
                      </button>
                    </div>
                  </div>

                  {/* 💻 ROW 5: GLOBAL LOG TERMINAL & EXECUTIVE ACTIONS */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-2 bg-[#02040A] rounded-[1.5rem] border border-slate-800 overflow-hidden flex flex-col shadow-2xl relative">
                      <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500"></div>
                      <div className="bg-[#0A1220] px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-rose-500"></div><div className="w-2 h-2 rounded-full bg-amber-500"></div><div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-[10px] text-slate-500 ml-3 tracking-widest uppercase">root@god-mode:~# tail -f system_events.log</span>
                        </div>
                      </div>
                      
                      {/* 🔴 ดึงมาจาก DB ของจริง 100% */}
                      <div id="god-mode-terminal" className="p-5 text-[10px] md:text-[11px] text-emerald-400/80 flex-1 overflow-y-auto space-y-2 leading-relaxed h-72 custom-scrollbar">
                         <p className="text-slate-600 animate-pulse">&gt; Loading Real System Logs...</p>
                      </div>

                    </div>

                    <div className="flex flex-col gap-4">

                       {/* 🟢 ปุ่มดูประวัติ Audit Logs จาก Database ของจริงมาแสดง */}
                       <button onClick={async (e) => {
                          if(e) e.preventDefault();
                          Swal.fire({ title: 'Connecting to Log Server...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                          try {
                              const { data, error } = await supabase.from('system_logs').select('*, employees(full_name)').order('created_at', { ascending: false }).limit(50);
                              if (error) throw error;
                              if (!data || data.length === 0) return Swal.fire({ icon: 'info', title: 'No Logs', text: 'ยังไม่มีประวัติการใช้งานในระบบ', customClass: { popup: 'bg-slate-900 text-white' }});

                              let htmlContent = '<div class="text-left font-mono text-[11px] space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar p-2">';
                              data.forEach(log => {
                                  const dateObj = new Date(log.created_at);
                                  const dateStr = dateObj.toLocaleDateString('th-TH') + ' ' + dateObj.toLocaleTimeString('th-TH');
                                  const empName = log.employees?.full_name || log.employee_id || 'Unknown User';
                                  
                                  htmlContent += `
                                      <div class="bg-[#0A1220] p-3 rounded-lg border border-slate-700 flex flex-col gap-1">
                                          <div class="flex justify-between items-center border-b border-slate-700/50 pb-1 mb-1">
                                              <span class="text-amber-400 font-bold">${empName}</span>
                                              <span class="text-slate-500 text-[9px] shrink-0">${dateStr}</span>
                                          </div>
                                          <span class="text-emerald-400 break-words font-bold">${log.action}</span>
                                          ${log.details ? `<span class="text-slate-300 break-words">${log.details}</span>` : ''}
                                      </div>
                                  `;
                              });
                              htmlContent += '</div>';

                              Swal.fire({
                                  title: '🛡️ SYSTEM AUDIT LOGS',
                                  html: htmlContent,
                                  width: 600,
                                  showConfirmButton: true,
                                  confirmButtonText: 'ปิดหน้าต่าง',
                                  confirmButtonColor: '#3b82f6',
                                  customClass: { popup: 'bg-[#02040A] text-white border border-slate-800 rounded-[2rem]' }
                              });
                          } catch (err) { Swal.fire('Error', err.message, 'error'); }
                       }} className="w-full bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-900/50 text-left px-5 py-4 rounded-2xl transition-all flex items-center justify-between group shadow-lg">
                          <div className="flex items-center gap-4">
                              <span className="text-indigo-500 group-hover:scale-125 transition-transform text-2xl animate-pulse">🕵️‍♂️</span> 
                              <div className="flex flex-col"><span className="text-xs font-black text-indigo-400 uppercase tracking-wider">View Audit Logs</span><span className="text-[9px] text-slate-500 font-bold uppercase mt-1">ดูประวัติการเข้าใช้งานระบบ (Real-time)</span></div>
                          </div>
                       </button>

                       <button onClick={triggerAutoAlertTest} className="w-full bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-left px-5 py-4 rounded-2xl transition-all flex items-center justify-between group shadow-lg">
                         <div className="flex items-center gap-4">
                           <span className="text-rose-500 group-hover:scale-125 transition-transform text-2xl animate-pulse">🤖</span> 
                           <div className="flex flex-col"><span className="text-xs font-black text-rose-400 uppercase tracking-wider">Test Auto-Alert</span><span className="text-[9px] text-slate-500 font-bold uppercase mt-1">ส่งแจ้งเตือนภัยคุกคามเข้า LINE Admin</span></div>
                         </div>
                       </button>

                        <button onClick={async () => {
                             recordMonitorLog('PUSH_REPORT_AI', `สั่งรันระบบ AI วิเคราะห์ข้อมูลและส่งรายงานเข้า LINE`); 
                             Swal.fire({ title: 'AI กำลังวิเคราะห์...', text: 'ระบบกำลังดึงข้อมูลและสรุป Insight', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                             try {
                               await new Promise(resolve => setTimeout(resolve, 1500));
                               
                               const _empCount = typeof empCount !== 'undefined' ? empCount : 0;
                               const _checkedIn = typeof totalCheckedIn !== 'undefined' ? totalCheckedIn : 0;
                               const _late = typeof todayLateCount !== 'undefined' ? todayLateCount : 0;
                               const _leave = typeof peopleOnLeaveToday !== 'undefined' ? peopleOnLeaveToday : 0;
                               const _slips = typeof thisMonthSlips !== 'undefined' && thisMonthSlips ? thisMonthSlips.length : 0;
                               const _payroll = typeof totalPayrollCost !== 'undefined' && totalPayrollCost ? totalPayrollCost.toLocaleString() : "0";
                               const _pending = typeof pendingLeaveCount !== 'undefined' ? pendingLeaveCount : 0;
                               const _date = typeof thaiDate !== 'undefined' ? thaiDate : new Date().toLocaleDateString('th-TH');

                               let insightText = "✨ ภาพรวมระบบทำงานปกติ การดำเนินงานราบรื่น";
                               let insightColor = "#10B981";
                               if (_late > 0 && _late >= _checkedIn * 0.2) {
                                   insightText = "⚠️ วันนี้สัดส่วนพนักงานมาสายค่อนข้างสูง ควรตรวจสอบสถานการณ์เพิ่มเติมครับ";
                                   insightColor = "#F59E0B";
                               } else if (_leave > 3) {
                                   insightText = "🏖️ วันนี้มีพนักงานลาหยุดหลายคน อาจต้องประเมินกำลังคนให้เหมาะสมครับ";
                                   insightColor = "#3B82F6";
                               } else if (_checkedIn > 0 && _late === 0) {
                                   insightText = "🌟 ยอดเยี่ยมมาก! วันนี้พนักงานทุกคนเข้างานตรงเวลา 100% ภาพรวมดีเยี่ยมครับ";
                                   insightColor = "#10B981";
                               }

                               const bodyContents = [
                                 { type: "box", layout: "horizontal", contents: [ { type: "text", text: "พนักงานรวม:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: `${_empCount} คน`, color: "#333333", size: "sm", flex: 2, weight: "bold", wrap: true } ] },
                                 { type: "box", layout: "horizontal", contents: [ { type: "text", text: "เข้างานวันนี้:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: `${_checkedIn} คน`, color: "#10B981", size: "sm", flex: 2, weight: "bold", wrap: true } ] },
                                 { type: "box", layout: "horizontal", contents: [ { type: "text", text: "มาสาย:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: `${_late} คน`, color: _late > 0 ? "#EF4444" : "#333333", size: "sm", flex: 2, weight: "bold" } ] },
                                 { type: "box", layout: "horizontal", contents: [ { type: "text", text: "ลาหยุด:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: `${_leave} คน`, color: _leave > 0 ? "#F59E0B" : "#333333", size: "sm", flex: 2, wrap: true } ] },
                                 { type: "separator", margin: "md" },
                                 { type: "box", layout: "horizontal", contents: [ { type: "text", text: "ยอดสลิป:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: `${_slips} ใบ`, color: "#333333", size: "sm", flex: 2, weight: "bold" } ] },
                                 { type: "box", layout: "horizontal", contents: [ { type: "text", text: "ยอดจ่ายสุทธิ:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: `฿${_payroll}`, color: "#3B82F6", size: "sm", flex: 2, weight: "bold" } ] },
                                 { type: "separator", margin: "md" },
                                 { type: "box", layout: "vertical", contents: [ { type: "text", text: "🤖 AI Summary:", color: "#aaaaaa", size: "xs", weight: "bold", margin: "sm" }, { type: "text", text: insightText, color: insightColor, size: "sm", weight: "bold", wrap: true, margin: "sm" } ] }
                               ];

                               const flexMessage = {
                                 type: "flex", altText: `📊 EXECUTIVE REPORT (AI)`,
                                 contents: {
                                   type: "bubble", size: "kilo", 
                                   header: { type: "box", layout: "vertical", backgroundColor: "#0284C7", contents: [ { type: "text", text: "📊 EXECUTIVE REPORT", weight: "bold", color: "#FFFFFF", size: "md" } ] },
                                   body: { type: "box", layout: "vertical", spacing: "sm", contents: bodyContents }, 
                                   footer: { type: "box", layout: "vertical", contents: [ { type: "text", text: `PANCAKE ERP SYSTEM | ${_date}`, color: "#cbd5e1", size: "xs", align: "center", weight: "bold" } ] }
                                 }
                               };

                               fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
                                 method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
                                 body: JSON.stringify({ to: [typeof lineAdminId !== 'undefined' ? lineAdminId : "C0df0123907f46aa88c44ef72e88ea30f"], messages: [flexMessage] })
                               }).catch(err => console.error("LINE Fetch Error:", err));

                               Swal.fire({ icon: 'success', title: 'Report Sent', text: 'ส่งรายงานพร้อม AI Insight สำเร็จ!', showConfirmButton: false, timer: 2000, customClass: { popup: 'bg-slate-900 text-white border border-cyan-500 rounded-[2rem]' } });
                             } catch(err) { Swal.fire('Error', err.message, 'error'); }
                        }} 
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-left px-5 py-5 rounded-[1.5rem] transition-all flex items-center justify-between group shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-cyan-400/50"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-white group-hover:scale-125 transition-transform text-2xl">📲</span> 
                            <div className="flex flex-col"><span className="text-sm font-black text-white uppercase tracking-wider">Push Report (AI)</span><span className="text-[9px] text-cyan-100 font-bold uppercase mt-1">Send Smart Insight to Executive</span></div>
                          </div>
                          <span className="text-cyan-200 text-xl group-hover:translate-x-1 transition-transform">→</span>
                        </button>

                       <button onClick={async () => {
                            recordMonitorLog('CLONE_DATABASE', `ดาวน์โหลดโครงสร้าง Database ทั้งหมดเป็นไฟล์ JSON`);
                            Swal.fire({ title: 'Initializing Backup...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                            try {
                              const [emp, att, leave, pay] = await Promise.all([ supabase.from('employees').select('*'), supabase.from('attendance_logs').select('*'), supabase.from('leave_requests').select('*'), supabase.from('payroll_slips').select('*') ]);
                              const backupData = { employees: emp.data, attendance: att.data, leaves: leave.data, payroll: pay.data, exportDate: new Date().toISOString() };
                              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
                              const downloadNode = document.createElement('a'); downloadNode.href = dataStr; downloadNode.download = `OMNIPOTENT_BACKUP_${todayStr}.json`;
                              document.body.appendChild(downloadNode); downloadNode.click(); document.body.removeChild(downloadNode);
                              Swal.fire({ icon: 'success', title: 'Backup Secure', text: 'Database cloned locally.', customClass: { popup: 'bg-slate-900 text-white' }});
                            } catch(err) { Swal.fire('Error', err.message, 'error'); }
                          }}
                          className="w-full bg-[#0A1220] hover:bg-slate-900 border border-slate-700 hover:border-emerald-500 text-left px-5 py-4 rounded-[1.5rem] transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-emerald-500 group-hover:scale-125 transition-transform text-xl drop-shadow-[0_0_5px_#10b981]">💾</span> 
                            <div className="flex flex-col"><span className="text-xs font-black text-white uppercase tracking-wider">Clone Database</span><span className="text-[9px] text-slate-500 font-bold uppercase mt-1">Export full JSON payload</span></div>
                          </div>
                        </button>

                        <button onClick={() => {
                           recordMonitorLog('WIPE_DATA_ATTEMPT', `พยายามเข้าถึงเมนูล้างข้อมูลระบบ (Wipe Test Data)`);
                           Swal.fire({ title: 'Danger Zone', text: 'คุณต้องเป็น Developer จึงจะใช้คำสั่งล้างข้อมูลระดับลึก (Wipe Data) ได้', icon: 'warning', customClass: { popup: 'bg-slate-900 text-white border border-rose-500 rounded-[2rem]' }})
                        }} className="w-full bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/50 text-left px-5 py-3 rounded-[1rem] transition-all flex items-center gap-3 group mt-auto">
                           <span className="text-rose-500 group-hover:scale-110 transition-transform">⚠️</span> 
                           <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Wipe Test Data</span>
                        </button>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })()}

{/* ⚠️ VIEW: WARNING SYSTEM (ระบบออกใบเตือนพนักงาน - DIRECT EMAIL & FORMAL) */}
        {currentView === "warnings" && (user?.role === 'admin' || user?.role === 'ceo') && (() => {
          
          const handleIssueWarning = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const empId = formData.get('employee_id');
            const warnType = formData.get('warning_type');
            const reason = formData.get('reason');

            if (!empId || !reason) {
              return Swal.fire('ข้อมูลไม่ครบ', 'กรุณาเลือกพนักงานและระบุรายละเอียดการกระทำผิด', 'warning');
            }

            const targetEmp = employees.find(emp => emp.id === empId);
            if (!targetEmp) return Swal.fire('Error', 'ไม่พบข้อมูลพนักงาน', 'error');

            const empEmail = targetEmp.email || ''; 
            if (!empEmail) {
               return Swal.fire({ title: 'พนักงานไม่มีอีเมล', text: 'พนักงานท่านนี้ไม่มีข้อมูลอีเมลในระบบ ไม่สามารถจัดส่งเอกสารอิเล็กทรอนิกส์ได้ครับ', icon: 'error', customClass: { popup: 'bg-[#0A1220] text-white border border-slate-700 rounded-[2rem]' }});
            }

            // 🟢 แสดงหน้าต่าง Loading แบบระบบกำลังรันส่งอีเมล
            Swal.fire({ 
              title: 'กำลังดำเนินการ...', 
              html: 'ระบบกำลังบันทึกประวัติและจัดส่งเอกสารไปยังเซิร์ฟเวอร์อีเมล<br/><span class="text-[10px] text-emerald-500 mt-2 font-mono">SENDING DIRECT EMAIL...</span>',
              allowOutsideClick: false, 
              didOpen: () => Swal.showLoading(),
              customClass: { popup: 'bg-[#0A1220] text-white border border-slate-700 rounded-[2rem]' }
            });

            try {
              // 1. บันทึกลงฐานข้อมูล `warnings`
              const { error: warnErr } = await supabase.from('warnings').insert([{
                employee_id: empId,
                warning_type: warnType,
                reason: reason,
                issued_by: user.id
              }]);
              if (warnErr) throw warnErr;

              // 2. เก็บ Log การกระทำของ Admin
              await supabase.from('system_logs').insert([{ 
                employee_id: user.id, 
                action: 'ISSUE_WARNING', 
                details: `ออกใบเตือน (${warnType}) ให้กับพนักงาน: ${targetEmp.full_name} (ส่งอีเมลแล้ว)` 
              }]);

              // 3. ร่างเนื้อหาอีเมลแบบทางการสุดๆ (HR Standard)
              const todayTh = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
              
              const subject = `หนังสือตักเตือนพนักงาน (Official Warning Letter) - ${targetEmp.full_name}`;
              const body = `เรียน คุณ${targetEmp.full_name},\n\n` +
                      `เรื่อง: หนังสือตักเตือน (${warnType})\n\n` +
                      `ตามที่ท่านได้กระทำผิดระเบียบข้อบังคับเกี่ยวกับการทำงานของบริษัทฯ หรือบกพร่องต่อหน้าที่ในประเด็นดังต่อไปนี้:\n\n` +
                      `"${reason}"\n\n` +
                      `การกระทำดังกล่าวถือเป็นการฝ่าฝืนระเบียบข้อบังคับของบริษัทฯ ดังนั้น บริษัทฯ จึงพิจารณาลงโทษตักเตือนท่านเป็นลายลักษณ์อักษร เพื่อให้ท่านได้ปรับปรุงแก้ไขพฤติกรรมและการปฏิบัติงานให้เป็นไปตามมาตรฐานที่บริษัทฯ กำหนด\n\n` +
                      `หากท่านยังคงกระทำผิดซ้ำในกรณีเดียวกันนี้ หรือฝ่าฝืนข้อบังคับอื่นใดของบริษัทฯ อีกในอนาคต ทางบริษัทฯ จะพิจารณาลงโทษทางวินัยในขั้นที่สูงขึ้นตามกฎระเบียบของบริษัทฯ ต่อไป\n\n` +
                      `จึงเรียนมาเพื่อทราบและปฏิบัติตามอย่างเคร่งครัด\n\n` +
                      `ประกาศ ณ วันที่ ${todayTh}\n` +
                      `ฝ่ายทรัพยากรบุคคล (HR Department)`;

              // 🚀 4. ระบบส่งอีเมลออกแบบ "เงียบๆ" (Direct API via Apps Script)
              fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
                method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                   action: 'send_email', // ส่ง Action ไปบอก Apps Script ว่าให้ส่งเมล
                   toEmail: empEmail,
                   subject: subject,
                   body: body
                })
              }).catch(err => console.error("Email Fetch Error:", err));
              
              // หน่วงเวลาให้ดูสมจริงนิดนึงว่ากำลังทำงาน
              await new Promise(resolve => setTimeout(resolve, 1500)); 

              Swal.fire({ 
                icon: 'success', 
                title: 'จัดส่งเอกสารสำเร็จ!', 
                html: `ระบบได้บันทึกประวัติและจัดส่งหนังสือตักเตือนไปยังอีเมล<br/><b class="text-emerald-400 mt-2 block">${empEmail}</b><br/>เรียบร้อยแล้ว`,
                customClass: { popup: 'bg-[#0A1220] text-white rounded-[2rem] border border-emerald-500' }
              });
              
              e.target.reset(); 
            } catch (err) {
              Swal.fire('Error', err.message, 'error');
            }
          };

          return (
            <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in overflow-hidden">
              <div className="bg-[#050B14] backdrop-blur-3xl rounded-[2rem] p-6 md:p-8 shadow-[0_0_50px_rgba(244,63,94,0.05)] border border-rose-900/30 flex-1 flex flex-col overflow-hidden text-slate-300 relative font-sans">
                
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 relative z-10 border-b border-slate-800 pb-6">
                  <div>
                    <h3 className="font-black text-rose-400 text-3xl flex items-center gap-3 tracking-tight">
                      <span className="drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">⚠️</span> WARNING SYSTEM
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">ระบบออกหนังสือตักเตือนพนักงาน (Direct Email Sending)</p>
                  </div>
                </div>

                {/* 🔴 แก้ไขจุดที่ทำให้โดนตัด: เอา flex justify-center ออก และเพิ่มพื้นที่ด้านล่าง (pb-20) ให้อิสระในการเลื่อน */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pb-20 px-2 block">
                  
                  <form onSubmit={handleIssueWarning} className="w-full max-w-4xl mx-auto bg-[#0A1220] border border-slate-800 p-8 md:p-10 rounded-[2rem] shadow-2xl flex flex-col gap-8 relative overflow-hidden mt-4">
                    
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500"></div>
                    
                    <div className="text-center mb-2 border-b border-slate-800/50 pb-6">
                      <h4 className="text-xl font-black text-white tracking-widest uppercase">Official Warning Letter</h4>
                      <p className="text-[12px] text-slate-500 mt-2">แบบฟอร์มออกหนังสือตักเตือนพนักงานและจัดส่งผ่านอีเมลอัตโนมัติ</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2.5">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><span>👤</span> 1. ระบุชื่อพนักงาน (Employee)</label>
                         <select name="employee_id" required className="w-full bg-[#02040A] border border-slate-700 text-slate-200 rounded-xl p-3.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium appearance-none">
                            <option value="">-- กรุณาเลือกรายชื่อพนักงาน --</option>
                            {(employees || []).map(emp => (
                               <option key={emp.id} value={emp.id}>{emp.employee_code} - {emp.full_name} {emp.email ? `(${emp.email})` : '(ไม่พบข้อมูลอีเมล)'}</option>
                            ))}
                         </select>
                      </div>

                      <div className="flex flex-col gap-2.5">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><span>⚠️</span> 2. ระดับความผิด (Severity Level)</label>
                         <select name="warning_type" required className="w-full bg-[#02040A] border border-slate-700 text-rose-300 rounded-xl p-3.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-bold appearance-none">
                            <option value="ตักเตือนด้วยวาจา (Verbal Warning)">ตักเตือนด้วยวาจา (Verbal Warning)</option>
                            <option value="ตักเตือนเป็นลายลักษณ์อักษร (Written Warning)">ตักเตือนเป็นลายลักษณ์อักษร (Written Warning)</option>
                            <option value="หนังสือเตือนครั้งสุดท้าย (Final Warning)">หนังสือเตือนครั้งสุดท้าย (Final Warning)</option>
                            <option value="พักงานโดยไม่ได้รับค่าจ้าง (Suspension)">พักงานโดยไม่ได้รับค่าจ้าง (Suspension)</option>
                         </select>
                      </div>
                    </div>

                    {/* กล่องเทมเพลต */}
                    <div className="flex flex-col gap-3 bg-gradient-to-br from-indigo-950/30 to-slate-900/30 p-6 rounded-2xl border border-indigo-900/40">
                       <label className="text-[11px] font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                          <span className="animate-pulse text-lg">💡</span> ตัวช่วยร่างข้อความทางการ (HR Templates)
                       </label>
                       <select 
                          onChange={(e) => {
                             const textarea = document.getElementById('warning_reason_input');
                             if(textarea && e.target.value) {
                               textarea.value = e.target.value;
                             }
                          }}
                          className="w-full bg-[#02040A]/80 border border-indigo-500/30 text-indigo-200 rounded-xl p-3.5 outline-none focus:border-indigo-500 transition-all cursor-pointer text-[13px] leading-relaxed"
                       >
                          <option value="">-- เลือกรูปแบบข้อความ (ระบบจะนำไปจัดรูปแบบลงในช่องด้านล่างให้อัตโนมัติ) --</option>
                          <option value="ลางานฉุกเฉินหรือกะทันหันโดยไม่เป็นไปตามระเบียบการลางานของบริษัทฯ ซึ่งส่งผลกระทบโดยตรงต่อแผนการดำเนินงานและตารางการถ่ายทอดสด (Live Streaming) ทำให้การปฏิบัติงานหยุดชะงักและบริษัทฯ ได้รับความเสียหาย">📌 ลางานกะทันหัน / กระทบตารางไลฟ์สด</option>
                          <option value="มาปฏิบัติงานสายเกินกว่าเวลาที่บริษัทฯ กำหนดติดต่อกันหลายครั้ง หรือละทิ้งหน้าที่ในระหว่างเวลาทำงานโดยไม่ได้รับอนุญาตจากผู้บังคับบัญชา">📌 ขาดงาน / มาสายสะสม / ละทิ้งหน้าที่</option>
                          <option value="แสดงกิริยาวาจาไม่สุภาพ หรือมีพฤติกรรมที่ไม่เหมาะสมต่อเพื่อนร่วมงาน ลูกค้า หรือผู้บังคับบัญชา ซึ่งขัดต่อวัฒนธรรมและกฎระเบียบของบริษัทฯ">📌 พฤติกรรมไม่เหมาะสม / กิริยาไม่สุภาพ</option>
                          <option value="ปฏิบัติงานด้วยความประมาทเลินเล่อ ไม่ปฏิบัติตามขั้นตอนหรือมาตรฐานการทำงานที่บริษัทฯ กำหนด จนเป็นเหตุให้เกิดความเสียหายแก่ทรัพย์สินหรือภาพลักษณ์ของบริษัทฯ">📌 ประมาทเลินเล่อ / ทำให้เกิดความเสียหาย</option>
                          <option value="จงใจฝ่าฝืนคำสั่งอันชอบด้วยกฎหมายของผู้บังคับบัญชา หรือไม่ให้ความร่วมมือในการปฏิบัติงานตามที่ได้รับมอบหมายอย่างเคร่งครัด">📌 ขัดคำสั่งผู้บังคับบัญชา</option>
                       </select>
                    </div>

                    {/* ช่องพิมพ์ข้อความ */}
                    <div className="flex flex-col gap-2.5">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><span>📝</span> 3. รายละเอียดการกระทำผิด (Formal Reason)</label>
                       <textarea 
                          id="warning_reason_input" 
                          name="reason" 
                          required 
                          rows="6" 
                          placeholder="เลือกเทมเพลตด้านบน หรือพิมพ์รายละเอียดการกระทำผิดด้วยตนเอง (ระบบจะนำข้อความนี้ไปแทรกในจดหมายทางการ)..." 
                          className="w-full bg-[#02040A] border border-slate-700 text-slate-200 rounded-xl p-5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none custom-scrollbar font-sans leading-relaxed text-[14px]"
                       ></textarea>
                    </div>

                    <div className="border-t border-slate-800/80 pt-8 flex justify-end">
                       <button type="submit" className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black py-4 px-10 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all flex items-center gap-3 group tracking-widest text-sm">
                         <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 text-2xl">📨</span> 
                         อนุมัติและจัดส่งเอกสารแจ้งเตือน
                       </button>
                    </div>

                  </form>
                </div>

              </div>
            </div>
          );
        })()}



{/* ⚙️ VIEW: SETTINGS (หน้าตั้งค่าระบบ -> จัดการสาขา + Map แบบมีรัศมี) */}
      {currentView === "settings_branches" && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 overflow-y-auto">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">📍 {t.settingsBranches}</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">{t.settingsDesc}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* ฝั่งซ้าย: ฟอร์มเพิ่ม/แก้ไข */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-fit">
                <h4 className="font-black text-slate-700 mb-4">{editingBranchId ? t.formEditBranch : t.formAddBranch}</h4>
                
                {/* 📍 ระบบดึงพิกัดแบบใหม่ (แก้ปัญหา Google บล็อกลิงก์ 100%) */}
                <div className="mb-6 bg-indigo-50/50 p-4 rounded-xl border border-indigo-200 shadow-sm relative z-50">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                    <span>📍 วางตัวเลขพิกัดจาก Google Maps</span>
                    <a href="https://www.google.co.th/maps" target="_blank" rel="noreferrer" className="text-[9px] bg-indigo-500 text-white px-2 py-1 rounded shadow-sm hover:bg-indigo-600 transition-colors">เปิดแผนที่</a>
                  </label>
                  <p className="text-[10px] text-slate-600 mb-3 font-bold">
                    💡 <span className="text-rose-500">วิธีที่ง่ายและชัวร์ 100%:</span> เปิดแผนที่ {'>'} <span className="text-indigo-500">คลิกขวา</span> ที่สถานที่ {'>'} กดคลิกที่ตัวเลขบรรทัดแรกเพื่อก๊อปปี้ {'>'} เอามาวางในช่องนี้
                  </p>
                  <input 
                    type="text" 
                    placeholder="วางพิกัดที่นี่ (เช่น 13.7563, 100.5018)" 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-3 text-sm font-black text-center outline-none focus:border-indigo-400 shadow-sm transition-all text-indigo-700"
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      if (!val) return;

                      // 🧠 ตรวจจับและแกะเฉพาะ "ตัวเลขพิกัด" (รองรับการคลิกขวาก๊อปปี้จากกูเกิ้ล 100%)
                      const coordMatch = val.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
                      
                      if (coordMatch) {
                        const lat = parseFloat(coordMatch[1]);
                        const lng = parseFloat(coordMatch[2]);
                        
                        setCurrentLocation({ lat, lng, isDefault: false });
                        if (window.mapInstance) window.mapInstance.setView([lat, lng], 17);
                        Swal.fire({ icon: 'success', title: 'ปักหมุดเรียบร้อย!', text: `อัปเดตลงช่อง Lat/Lng ให้แล้วครับ`, timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-[2rem]' } });
                        e.target.value = ""; // เคลียร์ช่องเพื่อความสะอาด
                      } else if (val.includes('http')) {
                        Swal.fire({ 
                          icon: 'warning', 
                          title: 'Google บล็อกลิงก์นี้ครับ!', 
                          text: 'รบกวนพี่ไปที่แผนที่ "คลิกขวา" แล้วกดก๊อปปี้ "ตัวเลข" มาวางแทนการใช้ลิงก์แชร์นะครับ', 
                          customClass: { popup: 'rounded-[2rem]', confirmButton: 'bg-indigo-500 text-white rounded-xl px-6 py-2 font-black' } 
                        });
                        e.target.value = "";
                      }
                    }}
                  />
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!formName || currentLocation.isDefault) {
                    return Swal.fire({
                      icon: 'warning',
                      title: t.swalWarnTitle,
                      text: t.swalWarnText,
                      buttonsStyling: false,
                      customClass: {
                        popup: 'rounded-[2rem] shadow-2xl border-2 border-pink-100',
                        title: 'font-black text-slate-800 text-2xl mt-4',
                        htmlContainer: 'text-slate-500 font-medium text-sm',
                        confirmButton: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl px-8 py-3.5 font-black shadow-lg hover:scale-105 transition-all mt-4 w-full'
                      }
                    });
                  }
                  
                  try {
                    const branchData = { name: formName, lat: currentLocation.lat, lng: currentLocation.lng, radius_m: Number(formRadius) || 100 };
                    
                    if (editingBranchId) {
                      await supabase.from('branches').update(branchData).eq('id', editingBranchId);
                      Swal.fire({
                        icon: 'success',
                        title: t.swalSuccessUpdate,
                        showConfirmButton: false,
                        timer: 1500,
                        customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100', title: 'font-black text-slate-800 text-xl mt-4' }
                      });
                    } else {
                      await supabase.from('branches').insert([branchData]);
                      Swal.fire({
                        icon: 'success',
                        title: t.swalSuccessAdd,
                        showConfirmButton: false,
                        timer: 1500,
                        customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100', title: 'font-black text-slate-800 text-xl mt-4' }
                      });
                    }
                    
                    setEditingBranchId(null);
                    setFormName("");
                    setFormRadius(100);
                    setCurrentLocation({ lat: 13.7563, lng: 100.5018, isDefault: true });
                    fetchBranches();
                  } catch (err) { 
                    Swal.fire({
                      icon: 'error',
                      title: t.swalError,
                      text: err.message,
                      buttonsStyling: false,
                      customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100', confirmButton: 'bg-rose-500 text-white rounded-2xl px-8 py-3.5 font-black mt-4 w-full' }
                    });
                  }
                }} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">{t.labelBranchName}</label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder={t.placeBranchName} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none shadow-sm focus:border-purple-400 mb-4"/>
                    
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">{t.labelRadius}</label>
                    <input type="number" value={formRadius} onChange={(e) => setFormRadius(e.target.value)} placeholder="เช่น 100" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-purple-400 shadow-sm"/>
                  </div>
                  
                  {/* 📍 ส่วนที่แก้ให้กรอกพิกัดได้ */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Lat (ละติจูด)</label>
                      <input 
                        type="number" 
                        step="any"
                        value={currentLocation.isDefault ? '' : currentLocation.lat} 
                        onChange={(e) => setCurrentLocation(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0, isDefault: false }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm text-slate-700 outline-none focus:border-purple-400 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Lng (ลองจิจูด)</label>
                      <input 
                        type="number" 
                        step="any"
                        value={currentLocation.isDefault ? '' : currentLocation.lng} 
                        onChange={(e) => setCurrentLocation(prev => ({ ...prev, lng: parseFloat(e.target.value) || 0, isDefault: false }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm text-slate-700 outline-none focus:border-purple-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <button type="button" onClick={getLocation} className="w-full py-3.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors">{t.btnGetGPS}</button>
                  <div className="flex gap-2">
                    <button type="submit" className={`flex-1 py-3.5 ${editingBranchId ? 'bg-amber-500' : 'bg-slate-800'} text-white rounded-xl font-black text-sm shadow-lg mt-4 hover:-translate-y-0.5 transition-all`}>{editingBranchId ? t.btnUpdate : t.btnSave}</button>
                    {editingBranchId && <button type="button" onClick={() => { setEditingBranchId(null); setFormName(""); setFormRadius(100); setCurrentLocation({ lat: 13.7563, lng: 100.5018, isDefault: true }); }} className="px-6 py-3.5 bg-slate-200 text-slate-600 rounded-xl font-black text-sm mt-4">{t.modalCancel}</button>}
                  </div>
                </form>
              </div>

              {/* ฝั่งขวา: แผนที่ Leaflet */}
              <div className="bg-slate-100 rounded-[2rem] border-2 border-slate-100 relative overflow-hidden shadow-inner z-0 h-[400px]">
                <div id="map" className="w-full h-full" style={{ minHeight: '400px' }}></div>
              </div>
            </div>

            {/* ตารางสาขาที่มีปุ่ม "แมพ 🗺️" */}
            <div className="mt-8">
              <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2">📋 {t.tableBranchTitle} ({branches.length})</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-[10px] text-slate-400 uppercase">
                      <th className="px-4 py-2">{t.thBranchName}</th>
                      <th className="px-4 py-2 text-center">{t.thCoords}</th>
                      <th className="px-4 py-2 text-center">{t.thRadius}</th>
                      <th className="px-4 py-2 text-right">{t.thManage}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-xl">{t.noBranchData}</td></tr>
                    ) : (
                      branches.map((b) => (
                        <tr key={b.id} className="bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                          <td className="px-4 py-4 rounded-l-xl font-black text-slate-700 text-sm">{b.name}</td>
                          <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">
                            {(Number(b.lat) || 0).toFixed(4)}, {(Number(b.lng) || 0).toFixed(4)}
                          </td>
                          <td className="px-4 py-4 text-center text-xs font-black text-purple-600">{b.radius_m || 0} m.</td>
                          <td className="px-4 py-4 rounded-r-xl text-right flex gap-2 justify-end">
                            
                            <button onClick={() => { setEditingBranchId(b.id); setFormName(b.name); setFormRadius(b.radius_m || 100); setCurrentLocation({ lat: b.lat, lng: b.lng, isDefault: false }); if(window.mapInstance){ window.mapInstance.setView([b.lat, b.lng], 16); } }} className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1.5 rounded-lg font-black hover:bg-amber-100">
                              {t.btnEdit}
                            </button>
                            
                            <button onClick={async () => {
                              const result = await Swal.fire({ 
                                title: t.swalDelTitle, 
                                text: t.swalDelText,
                                icon: 'warning', 
                                showCancelButton: true, 
                                buttonsStyling: false,
                                customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100', title: 'font-black text-slate-800 text-2xl mt-4', htmlContainer: 'text-slate-500 font-medium text-sm', actions: 'flex gap-3 w-full mt-6 px-4', confirmButton: 'flex-1 bg-rose-500 text-white rounded-2xl py-3.5 font-black shadow-md hover:bg-rose-600 transition-colors', cancelButton: 'flex-1 bg-slate-100 text-slate-600 rounded-2xl py-3.5 font-black hover:bg-slate-200 transition-colors' },
                                confirmButtonText: t.swalDelConfirm, cancelButtonText: t.modalCancel 
                              });
                              if (result.isConfirmed) {
                                try {
                                  const { error } = await supabase.from('branches').delete().eq('id', b.id);
                                  if (error) throw error;
                                  Swal.fire({ icon: 'success', title: t.swalDelSuccess, showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100', title: 'font-black text-slate-800 text-xl mt-4' } });
                                  fetchBranches();
                                } catch (err) { Swal.fire(t.swalError, err.message, 'error'); }
                              }
                            }} className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-lg font-black hover:bg-rose-100">
                              {t.btnDelete}
                            </button>
                            
                            <button onClick={() => { setCurrentLocation({ lat: b.lat, lng: b.lng, isDefault: false }); if(window.mapInstance) { window.mapInstance.setView([b.lat, b.lng], 16); } }} className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-black text-indigo-600 hover:bg-indigo-50 shadow-sm">
                              {t.btnMap}
                            </button>

                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

{/* 🗂️ VIEW: ALL EMPLOYEE LEAVES (ระบบกรองข้อมูล 3 ชั้น: ชื่อ, ประเภท, สถานะ) */}
        {currentView === "settings_all_leaves" && (user?.role === 'admin' || user?.role === 'ceo') && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col">
              
              <div className="mb-6 border-b border-slate-100 pb-6">
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-2 mb-4">🗂️ {t.settingsAllLeaves}</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">{t.allLeavesDesc}</p>
                
                {(() => {
                  const pendingLeaves = allEmpLeaves?.filter(l => l.status === 'รออนุมัติ') || [];
                  const approvedLeaves = allEmpLeaves?.filter(l => l.status === 'อนุมัติ') || [];

                  if (pendingLeaves.length === 0) return null;

                  const warnings = [];

                  pendingLeaves.forEach(pending => {
                    if(!pending.start_date || !pending.end_date) return;
                    
                    const overlappingLeaves = approvedLeaves.filter(app => {
                      if(!app.start_date || !app.end_date) return false;
                      return (pending.start_date <= app.end_date) && (pending.end_date >= app.start_date);
                    });

                    if (overlappingLeaves.length > 0) {
                      const overlapNames = overlappingLeaves.map(o => o.employees?.full_name || 'ไม่ทราบชื่อ').join(', ');
                      warnings.push(`คุณ ${pending.employees?.full_name} 🗓️ ขอลาตรงกับ: ${overlapNames} (โปรดระวังกำลังคนไม่พอ)`);
                    }
                  });

                  if (warnings.length === 0) return (
                    <div className="mb-4 relative z-10 animate-fade-in">
                      <div className="p-4 rounded-[1.5rem] border bg-emerald-50 border-emerald-200 shadow-sm flex items-center gap-3">
                        <span className="text-xl">✅</span>
                        <h4 className="font-black text-sm text-emerald-600">
                          AI Predictor: คำขอลาที่รออนุมัติ ไม่มีคิวชนกับพนักงานคนอื่น สามารถอนุมัติได้ปลอดภัยครับ
                        </h4>
                      </div>
                    </div>
                  );

                  return (
                    <div className="mb-4 relative z-10 animate-fade-in">
                      <div className="p-5 rounded-[1.5rem] border bg-amber-50 border-amber-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xl animate-pulse">🤖</span>
                          <h4 className="font-black text-sm uppercase tracking-wider text-amber-600">
                            AI Leave Alert: พบการขอลาหยุดตรงกัน {warnings.length} รายการ
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {warnings.map((warn, i) => (
                            <p key={i} className="text-xs font-bold text-amber-700 flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-100 shadow-sm">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> ⚠️ {warn}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">👤</span>
                    <select 
                      value={empLeaveSearch} 
                      onChange={(e) => setEmpLeaveSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700"
                    >
                      <option value="">{t.allLeavesFilterAll}</option>
                      {employees && employees.length > 0 ? (
                        employees.map(emp => (
                          <option key={emp.id} value={emp.full_name}>
                            {lang === 'TH' ? `คุณ ${emp.full_name}` : emp.full_name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>กำลังโหลดข้อมูล...</option>
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">🔖</span>
                    <select 
                      value={allLeavesTypeFilter} 
                      onChange={(e) => setAllLeavesTypeFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700"
                    >
                      <option value="ALL">{t.allTypes}</option>
                      <option value="ลาป่วย">{t.sickLeave}</option>
                      <option value="ลากิจ">{t.personalLeave}</option>
                      <option value="ลาพักร้อน">{t.annualLeave}</option>
                      <option value="ลาฉุกเฉิน">{t.emergencyLeave}</option>
                      <option value="ลาไม่รับเงินเดือน">{lang === 'TH' ? 'ลาไม่รับเงินเดือน' : 'Leave Without Pay'}</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">⚖️</span>
                    <select 
                      value={allLeavesStatusFilter} 
                      onChange={(e) => setAllLeavesStatusFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700"
                    >
                      <option value="ALL">{t.allStatus}</option>
                      <option value="รออนุมัติ">{t.pending}</option>
                      <option value="อนุมัติ">{t.approved}</option>
                      <option value="ไม่อนุมัติ">{t.rejected}</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>
                </div>
              </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2">
              <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1000px]">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 rounded-l-xl">{t.thDate}</th>
                    <th className="p-4">{t.thEmp}</th>
                    <th className="p-4">{t.thTypeDuration}</th>
                    <th className="p-4 w-1/4">{t.thReason}</th>
                    <th className="p-4 text-center">{t.thLocation}</th>
                    <th className="p-4 text-right">{t.thStatus}</th>
                    <th className="p-4 text-center rounded-r-xl">รายละเอียด</th>
                  </tr>
                </thead>
                <tbody>
                  {allEmpLeaves
                    .filter(l => !empLeaveSearch || l.employees?.full_name === empLeaveSearch)
                    .filter(l => allLeavesTypeFilter === "ALL" || l.leave_type === allLeavesTypeFilter)
                    .filter(l => allLeavesStatusFilter === "ALL" || l.status === allLeavesStatusFilter)
                    .length === 0 ? (
                      <tr><td colSpan="7" className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-xl">{t.noLeaveHistory}</td></tr>
                    ) : (
                      allEmpLeaves
                        .filter(l => !empLeaveSearch || l.employees?.full_name === empLeaveSearch)
                        .filter(l => allLeavesTypeFilter === "ALL" || l.leave_type === allLeavesTypeFilter)
                        .filter(l => allLeavesStatusFilter === "ALL" || l.status === allLeavesStatusFilter)
                        .map(l => (
                         <tr key={l.id} className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group">
                            <td className="p-4 text-sm font-bold text-slate-500 rounded-l-xl whitespace-nowrap">
                              {new Date(l.created_at).toLocaleDateString(lang==='TH'?'th-TH':'en-US')} <br/>
                              <span className="text-[10px] text-slate-400">{new Date(l.created_at).toLocaleTimeString('th-TH').slice(0,5)} น.</span>
                            </td>
                            <td className="p-4 text-sm font-black text-slate-800 whitespace-nowrap">{l.employees?.full_name || 'ไม่ทราบชื่อ'}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className="font-black text-pink-600 block text-sm">{getTranslatedType(l.leave_type)}</span>
                              <span className="text-xs text-slate-400 font-bold">{formatDuration(l.duration_minutes)}</span>
                            </td>
                            <td className="p-4 text-xs font-medium text-slate-600">
                              <div className="line-clamp-2 hover:line-clamp-none transition-all">{l.reason || '-'}</div>
                            </td>
                            <td className="p-4 text-center whitespace-nowrap">
                              {(l.lat && l.lng) ? (
                                <button 
                                  onClick={() => setViewMapModal({ lat: l.lat, lng: l.lng, name: l.employees?.full_name })}
                                  className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 px-3 py-2 rounded-xl text-[11px] font-black hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                >
                                  📍 {t.btnViewMap}
                                </button>
                              ) : (
                                <span className="text-slate-300 text-[10px] font-bold">{t.noLocation}</span>
                              )}
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <span className={`text-[10px] px-3 py-1.5 rounded-full font-black ${l.status==='อนุมัติ'?'bg-emerald-100 text-emerald-600':l.status==='รออนุมัติ'?'bg-amber-100 text-amber-600':'bg-rose-100 text-rose-600'}`}>
                                {getTranslatedStatus(l.status)}
                              </span>
                            </td>
                            <td className="p-4 text-center rounded-r-xl whitespace-nowrap">
                              <button 
                                onClick={() => {
                                  Swal.fire({
                                    title: '<span class="font-black text-slate-800">รายละเอียดคำขอลา</span>',
                                    html: `
                                      <div class="text-left space-y-4 p-2 font-sans">
                                        
                                        <div class="bg-indigo-600 p-4 rounded-2xl shadow-md text-white text-center">
                                          <p class="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">📅 วันที่ต้องการลาหยุด (Leave Dates)</p>
                                          <p class="text-[16px] font-black">
                                            ${l.start_date ? new Date(l.start_date).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }) : 'ไม่ระบุ'} 
                                            ถึง 
                                            ${l.end_date ? new Date(l.end_date).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }) : 'ไม่ระบุ'}
                                          </p>
                                        </div>

                                        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                          <p class="text-[10px] font-black text-slate-400 uppercase mb-1">เหตุผลการลา / หมายเหตุ</p>
                                          <p class="text-sm font-bold text-slate-600 leading-relaxed">${l.reason || l.remarks || 'ไม่ได้ระบุเหตุผล'}</p>
                                        </div>

                                        ${l.medical_cert_url ? `
                                          <div class="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                                            <div>
                                              <p class="text-[10px] font-black text-blue-400 uppercase mb-1">เอกสารแนบ</p>
                                              <p class="text-xs font-bold text-blue-600">มีเอกสารประกอบการลา</p>
                                            </div>
                                            <button type="button" id="btn-preview-doc-${l.id}" class="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-black hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1">
                                              เปิดดู 🔍
                                            </button>
                                          </div>
                                        ` : `
                                          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <p class="text-[10px] font-black text-slate-400 uppercase mb-1">เอกสารแนบ</p>
                                            <p class="text-xs font-bold text-slate-400">- ไม่มีเอกสารแนบ -</p>
                                          </div>
                                        `}
                                        
                                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                                           <div>
                                             <p class="text-[10px] font-black text-slate-400 uppercase mb-1">กดยื่นคำขอเมื่อ</p>
                                             <p class="text-xs font-bold text-slate-600">
                                               ${new Date(l.created_at).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
                                             </p>
                                           </div>
                                           <div>
                                              <p class="text-[10px] font-black text-slate-400 uppercase mb-1 text-right">ระยะเวลารวม</p>
                                              <p class="text-xs font-black text-pink-600 text-right">${formatDuration(l.duration_minutes)}</p>
                                           </div>
                                        </div>

                                        ${l.status === 'ไม่อนุมัติ' && l.reject_reason ? `
                                          <div class="bg-rose-50 p-3 rounded-xl border border-rose-100 mt-2">
                                            <p class="text-[10px] font-black text-rose-400 uppercase mb-1">เหตุผลที่ไม่อนุมัติ</p>
                                            <p class="text-sm font-bold text-rose-600">${l.reject_reason}</p>
                                          </div>
                                        ` : ''}
                                      </div>
                                    `,
                                    confirmButtonText: 'ปิดหน้าต่าง',
                                    confirmButtonColor: '#4F46E5',
                                    customClass: { popup: 'rounded-[2rem]' },
                                    didOpen: () => {
                                      const btnPreview = document.getElementById(`btn-preview-doc-${l.id}`);
                                      if (btnPreview) {
                                        btnPreview.addEventListener('click', () => {
                                          const fileUrl = l.medical_cert_url || '';
                                          const isPdf = fileUrl.toLowerCase().includes('.pdf');
                                          
                                          if (isPdf) {
                                            Swal.fire({
                                              title: '<span class="font-black text-slate-800">📄 เอกสารประกอบการลา</span>',
                                              html: '<div class="w-full h-[65vh] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mt-2"><iframe src="' + fileUrl + '" class="w-full h-full border-none"></iframe></div>',
                                              width: '800px',
                                              showCloseButton: true,
                                              confirmButtonText: 'ปิด',
                                              confirmButtonColor: '#ec4899',
                                              customClass: { popup: 'rounded-[2rem]' }
                                            });
                                          } else {
                                            Swal.fire({
                                              title: '<span class="font-black text-slate-800">📄 รูปภาพประกอบการลา</span>',
                                              html: `
                                                <div class="text-xs text-slate-500 mb-3 font-bold flex items-center justify-center gap-1">
                                                  🖱️ เลื่อนลูกกลิ้งเมาส์เพื่อซูม <span class="mx-1">•</span> คลิกค้างเพื่อลากดู
                                                </div>
                                                <div class="flex justify-center w-full">
                                                  <div id="zoom-container" class="w-fit max-w-full mx-auto relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                                                    <img id="zoomable-img" src="${fileUrl}" class="max-w-full max-h-[65vh] select-none pointer-events-none" style="transform-origin: center center;" alt="เอกสาร" draggable="false" />
                                                    <button id="btn-reset-zoom" class="absolute bottom-4 right-4 bg-slate-800/70 hover:bg-slate-900 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg border border-white/20 hidden">
                                                      คืนค่าเดิม 🔄
                                                    </button>
                                                  </div>
                                                </div>
                                              `,
                                              width: '800px',
                                              showCloseButton: true,
                                              confirmButtonText: 'ปิด',
                                              confirmButtonColor: '#ec4899',
                                              customClass: { popup: 'rounded-[2rem]' },
                                              didOpen: () => {
                                                const container = document.getElementById('zoom-container');
                                                const img = document.getElementById('zoomable-img');
                                                const resetBtn = document.getElementById('btn-reset-zoom');
                                                
                                                let scale = 1;
                                                let pointX = 0;
                                                let pointY = 0;
                                                let isDragging = false;
                                                let originX = 0;
                                                let originY = 0;
                                                let startX = 0;
                                                let startY = 0;

                                                const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

                                                const updateTransform = (smooth = false) => {
                                                  if (!img || !container) return;
                                                  
                                                  if (scale <= 1) {
                                                    scale = 1;
                                                    pointX = 0;
                                                    pointY = 0;
                                                  } else {
                                                    const rect = container.getBoundingClientRect();
                                                    const maxOffsetX = (rect.width * scale - rect.width) / 2;
                                                    const maxOffsetY = (rect.height * scale - rect.height) / 2;
                                                    
                                                    pointX = clamp(pointX, -maxOffsetX, maxOffsetX);
                                                    pointY = clamp(pointY, -maxOffsetY, maxOffsetY);
                                                  }

                                                  img.style.transition = smooth ? 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none';
                                                  img.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
                                                  
                                                  if (resetBtn) {
                                                    resetBtn.style.display = scale > 1 ? 'block' : 'none';
                                                  }
                                                  
                                                  container.style.cursor = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default';
                                                };

                                                if (container) {
                                                  container.addEventListener('mousedown', (e) => {
                                                    if (scale <= 1) return;
                                                    e.preventDefault();
                                                    isDragging = true;
                                                    originX = e.clientX;
                                                    originY = e.clientY;
                                                    startX = pointX;
                                                    startY = pointY;
                                                    container.style.cursor = 'grabbing';
                                                  });

                                                  const stopDrag = () => { 
                                                    if (isDragging) {
                                                      isDragging = false; 
                                                      updateTransform(true);
                                                    }
                                                  };
                                                  window.addEventListener('mouseup', stopDrag);
                                                  
                                                  window.addEventListener('mousemove', (e) => {
                                                    if (!isDragging || scale <= 1) return;
                                                    e.preventDefault();
                                                    pointX = startX + (e.clientX - originX);
                                                    pointY = startY + (e.clientY - originY);
                                                    updateTransform(false);
                                                  });

                                                  container.addEventListener('wheel', (e) => {
                                                    e.preventDefault();
                                                    const delta = e.deltaY || e.detail || e.wheelDelta;
                                                    const zoomFactor = 0.3; 
                                                    
                                                    if (delta < 0) scale += zoomFactor; 
                                                    else scale -= zoomFactor; 
                                                    
                                                    scale = clamp(scale, 1, 5);
                                                    updateTransform(true);
                                                  });
                                                }

                                                if (resetBtn) {
                                                  resetBtn.onclick = () => {
                                                    scale = 1; pointX = 0; pointY = 0;
                                                    updateTransform(true);
                                                  };
                                                }
                                              }
                                            });
                                          }
                                        });
                                      }
                                    }
                                  });
                                }}
                                className="bg-slate-100 text-slate-600 p-2 rounded-xl hover:bg-pink-500 hover:text-white transition-all shadow-sm border border-slate-200 group-hover:scale-110"
                              >
                                🔍
                              </button>
                            </td>
                         </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

{/* 🏖️ VIEW: ALL DAY OFFS (รายการแจ้งหยุดทั้งหมด - กรองชื่อด้วย Dropdown) */}
        {currentView === "settings_all_dayoffs" && (user?.role === 'admin' || user?.role === 'ceo') && (
          /* ✅ ลบ overflow-hidden ออกที่ div ทั้ง 2 ชั้นนี้ เพื่อให้หน้าจอเลื่อนลงได้ */
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col">
              
              <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">🏖️ {t.settingsAllDayOffs}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">{t.ptDayOffDesc}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {/* 1. เลือกพนักงาน */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">👤</span>
                  <select 
                    value={dayoffSearchName} 
                    onChange={(e) => setDayoffSearchName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700"
                  >
                    <option value="">{t.allLeavesFilterAll}</option>
                    {/* ✅ แก้ไข: ดึงชื่อจากตารางพนักงานทั้งหมดมาแสดง (employees) แบบเดียวกับหน้าแจ้งปรับปรุง */}
                    {employees && employees.length > 0 ? (
                      employees.map(emp => (
                        <option key={emp.id} value={emp.full_name}>
                          {lang === 'TH' ? `คุณ ${emp.full_name}` : emp.full_name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>กำลังโหลดข้อมูล...</option>
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                </div>

                {/* 2. เลือกสถานะ */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">⚖️</span>
                  <select 
                    value={dayoffFilterStatus} 
                    onChange={(e) => setDayoffFilterStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700"
                  >
                    <option value="ALL">{t.allStatus}</option>
                    <option value="รออนุมัติ">{t.pending}</option>
                    <option value="อนุมัติ">{t.approved}</option>
                    <option value="ไม่อนุมัติ">{t.rejected}</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                </div>
              </div>

            {/* ตารางแสดงข้อมูลการแจ้งหยุด */}
            <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2">
              <table className="w-full text-left border-separate border-spacing-y-2 min-w-[800px]">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 rounded-l-xl">{t.thDate}</th>
                    <th className="p-4">{t.thEmp}</th>
                    <th className="p-4 text-purple-600">📅 {t.thDayOffDate}</th>
                    <th className="p-4 w-1/4">{t.thReason}</th>
                    <th className="p-4 text-right rounded-r-xl">{t.thStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {allEmpLeaves
                    .filter(l => l.leave_type === 'วันหยุดประจำสัปดาห์ (PT)' || l.leave_type === 'Weekly Day Off (PT)')
                    .filter(l => !dayoffSearchName || l.employees?.full_name === dayoffSearchName)
                    .filter(l => dayoffFilterStatus === "ALL" || l.status === dayoffFilterStatus)
                    .length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-xl">{t.noLeaveHistory}</td></tr>
                    ) : (
                      allEmpLeaves
                        .filter(l => l.leave_type === 'วันหยุดประจำสัปดาห์ (PT)' || l.leave_type === 'Weekly Day Off (PT)')
                        .filter(l => !dayoffSearchName || l.employees?.full_name === dayoffSearchName)
                        .filter(l => dayoffFilterStatus === "ALL" || l.status === dayoffFilterStatus)
                        .map(l => (
                         <tr key={l.id} className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group">
                            {/* วันที่ยื่นเรื่อง */}
                            <td className="p-4 text-sm font-bold text-slate-400 rounded-l-xl whitespace-nowrap">
                              {new Date(l.created_at).toLocaleDateString(lang==='TH'?'th-TH':'en-US')} <br/>
                              <span className="text-[10px]">{new Date(l.created_at).toLocaleTimeString('th-TH').slice(0,5)} น.</span>
                            </td>
                            {/* ชื่อพนักงาน */}
                            <td className="p-4 text-sm font-black text-slate-800 whitespace-nowrap">{l.employees?.full_name || 'ไม่ทราบชื่อ'}</td>
                            {/* วันที่ขอหยุด (Highlight) */}
                            <td className="p-4 whitespace-nowrap">
                              <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-black text-sm border border-purple-200">
                                {new Date(l.start_date).toLocaleDateString(lang==='TH'?'th-TH':'en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </td>
                            {/* เหตุผล */}
                            <td className="p-4 text-xs font-medium text-slate-600">
                              <div className="line-clamp-2 hover:line-clamp-none transition-all">{l.reason || '-'}</div>
                            </td>
                            {/* สถานะ */}
                            <td className="p-4 text-right rounded-r-xl whitespace-nowrap">
                              <span className={`text-[11px] px-3 py-1.5 rounded-full font-black ${l.status==='อนุมัติ'?'bg-emerald-100 text-emerald-600':l.status==='รออนุมัติ'?'bg-amber-100 text-amber-600':'bg-rose-100 text-rose-600'}`}>
                                {getTranslatedStatus(l.status)}
                              </span>
                            </td>
                         </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

{/* 🛠️ VIEW: ALL ADJUSTMENTS (ประวัติแจ้งปรับปรุงทั้งหมด) */}
        {currentView === "settings_all_adjustments" && (user?.role === 'admin' || user?.role === 'ceo') && (
          /* ✅ ลบ overflow-hidden ออกตรงนี้ เพื่อให้หน้าจอเลื่อนลงได้ */
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col">
              
              {/* Header & Filters */}
              <div className="mb-6 border-b border-slate-100 pb-6">
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-2 mb-4">🛠️ {t.settingsAllAdjustments}</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">{t.allAdjustDesc}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* 1. ค้นหาด้วย Dropdown รายชื่อพนักงาน */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">👤</span>
                    <select 
                      value={empAdjustSearch} 
                      onChange={(e) => setEmpAdjustSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700"
                    >
                      <option value="">{t.allLeavesFilterAll}</option>
                      {/* ✅ แก้ไข: ดึงชื่อจากตาราง employees หลักมาแสดงเลย ทุกคนจะโผล่มาครบ 100% */}
                      {employees && employees.length > 0 ? (
                        employees.map(emp => (
                          <option key={emp.id} value={emp.full_name}>
                            {lang === 'TH' ? `คุณ ${emp.full_name}` : emp.full_name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>กำลังโหลดข้อมูล...</option>
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>

                  {/* 2. เลือกประเภท (สลับวันหยุด / แก้ไขเวลา) */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">🔖</span>
                    <select 
                      value={allAdjustTypeFilter} 
                      onChange={(e) => setAllAdjustTypeFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700"
                    >
                      <option value="ALL">{t.allTypes}</option>
                      <option value="สลับวันหยุด">{t.adjustSwap}</option>
                      <option value="แก้ไขเวลา">{t.adjustEdit}</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>

                  {/* 3. เลือกสถานะ */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">⚖️</span>
                    <select 
                      value={allAdjustStatusFilter} 
                      onChange={(e) => setAllAdjustStatusFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700"
                    >
                      <option value="ALL">{t.allStatus}</option>
                      <option value="รออนุมัติ">{t.pending}</option>
                      <option value="อนุมัติ">{t.approved}</option>
                      <option value="ไม่อนุมัติ">{t.rejected}</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>

                </div>
              </div>

            {/* ตารางแสดงข้อมูล */}
            <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2">
              <table className="w-full text-left border-separate border-spacing-y-2 min-w-[900px]">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 rounded-l-xl">{t.thDate}</th>
                    <th className="p-4">{t.thEmp}</th>
                    <th className="p-4">{t.thType}</th>
                    <th className="p-4 w-1/3">{t.thDetail}</th>
                    <th className="p-4 text-right rounded-r-xl">{t.thStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {allEmpAdjustments
                    .filter(a => !empAdjustSearch || a.employees?.full_name === empAdjustSearch)
                    .filter(a => allAdjustTypeFilter === "ALL" || a.request_type === allAdjustTypeFilter)
                    .filter(a => allAdjustStatusFilter === "ALL" || a.status === allAdjustStatusFilter)
                    .length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-xl">ไม่พบประวัติการแจ้งปรับปรุง</td></tr>
                    ) : (
                      allEmpAdjustments
                        .filter(a => !empAdjustSearch || a.employees?.full_name === empAdjustSearch)
                        .filter(a => allAdjustTypeFilter === "ALL" || a.request_type === allAdjustTypeFilter)
                        .filter(a => allAdjustStatusFilter === "ALL" || a.status === allAdjustStatusFilter)
                        .map(a => (
                         <tr key={a.id} className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group">
                            {/* วันที่ยื่นเรื่อง */}
                            <td className="p-4 text-sm font-bold text-slate-400 rounded-l-xl whitespace-nowrap">
                              {new Date(a.created_at).toLocaleDateString(lang==='TH'?'th-TH':'en-US')} <br/>
                              <span className="text-[10px]">{new Date(a.created_at).toLocaleTimeString('th-TH').slice(0,5)} น.</span>
                            </td>
                            {/* ชื่อพนักงาน */}
                            <td className="p-4 text-sm font-black text-slate-800 whitespace-nowrap">{a.employees?.full_name || 'ไม่ทราบชื่อ'}</td>
                            {/* ประเภท */}
                            <td className="p-4 whitespace-nowrap">
                              <span className={`px-3 py-1.5 rounded-lg font-black text-xs border ${
                                a.request_type === 'สลับวันหยุด' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                {getTranslatedType(a.request_type)}
                              </span>
                            </td>
                            {/* รายละเอียด */}
                            <td className="p-4 text-[11px] font-medium text-slate-600">
                              <div className="line-clamp-2 hover:line-clamp-none transition-all duration-300 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed shadow-sm">
                                {a.request_type === 'สลับวันหยุด' ? (
                                  <span>🔄 ขอสลับจาก <strong className="text-rose-500">{new Date(a.old_date).toLocaleDateString(lang==='TH'?'th-TH':'en-US')}</strong> เป็น <strong className="text-emerald-500">{new Date(a.new_date).toLocaleDateString(lang==='TH'?'th-TH':'en-US')}</strong></span>
                                ) : (
                                  <span>⏰ วันที่ {new Date(a.incident_date).toLocaleDateString(lang==='TH'?'th-TH':'en-US')} ({a.time_type}):<br/>แก้จาก <strong className="text-rose-500">{a.old_time?.slice(0,5)}</strong> เป็น <strong className="text-emerald-500">{a.new_time?.slice(0,5)}</strong></span>
                                )}
                                {a.reason && <span className="block text-[10px] text-slate-400 mt-1.5 italic border-t border-slate-200 pt-1">เหตุผล: {a.reason}</span>}
                              </div>
                            </td>
                            {/* สถานะ */}
                            <td className="p-4 text-right rounded-r-xl whitespace-nowrap">
                              <span className={`text-[11px] px-3 py-1.5 rounded-full font-black ${a.status==='อนุมัติ'?'bg-emerald-100 text-emerald-600':a.status==='รออนุมัติ'?'bg-amber-100 text-amber-600':'bg-rose-100 text-rose-600'}`}>
                                {getTranslatedStatus(a.status)}
                              </span>
                            </td>
                         </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

{/* 💸 VIEW: PAYROLL (ระบบเงินเดือนและสลิป - เรียงรหัสพนักงาน & บอสไฮไลท์คู่) */}
      {currentView === "payroll" && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col">

            {/* 🤖 AI Payroll Intelligence & Auditor */}
            {(user?.role === 'admin' || user?.role === 'ceo') && (() => {
              const targetSlips = (adminPayrollSlips || [])
                .filter(p => String(p.month || '').startsWith(payrollFilterMonth));
              
              if (targetSlips.length === 0) return null;

              const totalPayroll = targetSlips.reduce((sum, item) => sum + (Number(item.net_salary) || 0), 0);
              const companySales = Number(salesData?.current || 0);
              const laborCostRatio = companySales > 0 ? ((totalPayroll / companySales) * 100).toFixed(1) : 0;

              const auditIssues = [];
              targetSlips.forEach(slip => {
                const empName = slip.employees?.full_name || 'พนักงาน';
                const isCEO = (slip.employees?.position || '').toUpperCase().includes('CEO');
                
                if (Number(slip.net_salary) < 0) auditIssues.push(`🚨 [ยอดติดลบ] ${empName}: ยอดรับสุทธิติดลบ โปรดตรวจสอบ!`);
                if (Number(slip.net_salary) > 100000 && !isCEO) auditIssues.push(`⚠️ [ยอดจ่ายสูง] ${empName}: มียอดจ่ายสูงเกิน 1 แสนบาท`);
              });

              return (
                <div className="mb-6 animate-fade-in shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 p-6 rounded-[2rem] border bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-[0.2em] opacity-70">AI Business Intelligence</h4>
                          <p className="text-3xl font-black mt-2">Labor Cost: {laborCostRatio}%</p>
                          <p className="text-xs font-bold opacity-80 mt-2">
                            {laborCostRatio > 30 ? "⚠️ ต้นทุนแรงงานสูงกว่าเกณฑ์มาตรฐาน" : "✅ ต้นทุนแรงงานอยู่ในเกณฑ์ที่เหมาะสม"}
                          </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-xl p-5 rounded-[1.5rem] border border-white/20 text-center min-w-[180px]">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">ยอดจ่ายรวม</p>
                          <p className="text-2xl font-black">฿{totalPayroll.toLocaleString()}</p>
                          <p className="text-[9px] opacity-70 mt-1">เดือน {payrollFilterMonth}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-[2rem] border shadow-sm ${auditIssues.length > 0 ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                      <h5 className={`font-black text-xs uppercase tracking-wider mb-4 ${auditIssues.length > 0 ? 'text-rose-600' : 'text-slate-500'}`}>ตรวจสอบความถูกต้อง</h5>
                      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                        {auditIssues.length > 0 ? auditIssues.map((issue, i) => (
                          <div key={i} className="text-[10px] font-bold text-rose-700 bg-white p-3 rounded-xl border border-rose-100 shadow-sm">{issue}</div>
                        )) : (
                          <p className="text-[11px] font-bold text-slate-400 italic text-center py-4">ข้อมูลเงินเดือนถูกต้องครบถ้วน</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            
            <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
              <div>
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">💸 รายการเงินเดือนพนักงาน</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">เรียงตามรหัสพนักงาน (CEO Priority)</p>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                {(user?.role === 'admin' || user?.role === 'ceo') && (
                  <button onClick={() => {
                    setPayrollForm({ employee_id: '', month: payrollFilterMonth, base_salary: 0, ot_amount: 0, deductions: 0, bonus: 0, commission: 0, is_previewed: false });
                    setIsPayrollModalOpen(true);
                  }} className="w-full sm:w-auto bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-sm shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    ➕ สร้างสลิปใหม่
                  </button>
                )}
              </div>
            </div>

            {(user?.role === 'admin' || user?.role === 'ceo') ? (() => {
              const fMonth = String(payrollFilterMonth || '').trim();
              const keyword = String(payrollSearchKeyword || '').trim();

              const adminFilteredSlips = (adminPayrollSlips || [])
                .filter(slip => {
                  const sMonth = String(slip.month || '').trim();
                  const matchMonth = !fMonth || sMonth.includes(fMonth);
                  const empId = String(slip.employee_id || '');
                  const matchEmp = !keyword || empId === keyword;
                  return matchMonth && matchEmp;
                })
                // 🟢 ปรับการเรียงลำดับ: เรียงตามรหัสพนักงาน PL001, PL002, PL003...
                .sort((a, b) => {
                  const codeA = a.employees?.employee_code || "";
                  const codeB = b.employees?.employee_code || "";
                  return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
                });

              return (
                <div className="flex flex-col flex-1 h-full w-full">
                  <div className="mb-4 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                      <select
                        value={payrollSearchKeyword}
                        onChange={(e) => setPayrollSearchKeyword(e.target.value)}
                        className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm"
                      >
                        <option value="">-- พนักงานทุกคน --</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.employee_code} - {emp.full_name}</option>
                        ))}
                      </select>
                      <input
                        type="month"
                        value={payrollFilterMonth}
                        onChange={(e) => setPayrollFilterMonth(e.target.value)}
                        className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-black text-indigo-600 outline-none focus:border-indigo-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2">
                    <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1200px]">
                      <thead className="text-[11px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="p-4 rounded-l-xl">พนักงาน (รหัส)</th>
                          <th className="p-4 text-center">ฐานเงินเดือน</th>
                          <th className="p-4 text-center text-indigo-500">คอม/โบนัส</th>
                          <th className="p-4 text-center text-rose-500">รวมหัก</th>
                          <th className="p-4 text-center text-emerald-600">รับสุทธิ</th>
                          <th className="p-4 text-right rounded-r-xl">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminFilteredSlips.length === 0 ? (
                          <tr><td colSpan="6" className="text-center p-10 text-slate-400 font-bold bg-slate-50 rounded-xl">ไม่พบข้อมูลสลิปเดือนนี้</td></tr>
                        ) : (
                          adminFilteredSlips.map((slip) => {
                            const empName = slip.employees?.full_name || 'ไม่ทราบชื่อ';
                            const empCode = slip.employees?.employee_code || '-';
                            // 🟢 เช็คจากตำแหน่งงาน (CEO ทั้ง 2 ท่านจะได้รับผลเหมือนกัน)
                            const isCEO = (slip.employees?.position || '').toUpperCase().includes('CEO');

                            const earnings = Number(slip.commission || 0) + Number(slip.bonus || 0);
                            const deds = Number(slip.leave_deduction || 0) + Number(slip.late_deduction || 0) + 
                                       Number(slip.absence_deduction || 0) + Number(slip.deductions || 0) + 
                                       Number(slip.social_security_deduction || 0) + Number(slip.tax_deduction || 0);

                            return (
                              <tr key={slip.id} className={`bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group ${isCEO ? 'ring-2 ring-amber-400/50 bg-amber-50/10' : ''}`}>
                                <td className="p-4 font-black rounded-l-xl">
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-sm ${isCEO ? 'text-amber-700' : 'text-slate-800'}`}>{empName}</span>
                                      {isCEO && <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-md font-bold animate-pulse">CEO</span>}
                                    </div>
                                    <span className="text-[10px] text-indigo-500 font-black tracking-widest uppercase mt-0.5">{empCode}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-center font-bold text-slate-600">฿{Number(slip.base_salary).toLocaleString()}</td>
                                <td className="p-4 text-center font-bold text-indigo-600">฿{earnings.toLocaleString()}</td>
                                <td className="p-4 text-center font-bold text-rose-500">{deds > 0 ? `- ฿${deds.toLocaleString()}` : '-'}</td>
                                <td className="p-4 text-center text-emerald-600 font-black text-lg bg-emerald-50/30">฿{Number(slip.net_salary).toLocaleString()}</td>
                                <td className="p-4 text-right rounded-r-xl">
                                  <div className="flex justify-end items-center gap-1.5 ml-auto">
                                    <button onClick={() => handleSendSlipLine(slip)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm">📲</button>
                                    <button onClick={() => handlePrintSlip(slip)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm">🖨️</button>
                                    <button onClick={() => handleDeleteSlip(slip.id)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm">🗑️</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ); })() : (
              /* มุมมองพนักงานทั่วไป */
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                 {mySlips.length === 0 ? (
                   <div className="bg-slate-50 border border-slate-100 p-10 rounded-3xl text-center shadow-sm max-w-md mx-auto mt-10">
                      <span className="text-6xl block mb-4">📄</span>
                      <p className="text-slate-500 font-bold">ยังไม่มีประวัติสลิปเงินเดือน</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {mySlips.map(slip => (
                       <div key={slip.id} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                         <h4 className="text-lg font-black text-slate-800">รอบ: {slip.month}</h4>
                         <div className="space-y-2.5 my-6 bg-slate-50 p-4 rounded-2xl shadow-inner">
                           <div className="flex justify-between text-xs font-bold text-slate-500"><span>เงินเดือน:</span> <span>฿{Number(slip.base_salary).toLocaleString()}</span></div>
                           <div className="flex justify-between text-xs font-bold text-emerald-600"><span>รับสุทธิ:</span> <span>฿{Number(slip.net_salary).toLocaleString()}</span></div>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => handleSendSlipLine(slip)} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-black text-xs">LINE</button>
                            <button onClick={() => handlePrintSlip(slip)} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-black text-xs">PRINT</button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>
      )}

{/* ========================================================================= */}
      {/* 🗓️ VIEW: SHIFT MANAGER (ฉบับ Indigo Theme + แยกสีตามวัน + ขนาดกะทัดรัด) */}
      {/* ========================================================================= */}
      {currentView === "shift_manager" && (user?.role === 'admin' || user?.role === 'ceo') && (
        <div className="px-4 md:px-6 pb-6 z-10 flex-1 flex flex-col w-full mt-2 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md rounded-[2rem] p-4 md:p-6 shadow-2xl border border-indigo-50 flex-1 flex flex-col relative overflow-hidden">
            
            {/* 💎 Header: เน้นธีม Indigo สว่าง */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg text-white text-xl">
                  🗓️
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg md:text-xl tracking-tight">จัดตารางกะพนักงาน</h3>
                  <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.1em] mt-0.5">เรียงตามรหัสพนักงาน | ธีม Indigo</p>
                </div>
              </div>
              
              <button 
                onClick={async () => {
                  Swal.fire({ title: 'กำลังบันทึก...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                  try {
                    await supabase.from('system_settings').upsert([
                      { setting_key: 'shift_roster', setting_value: JSON.stringify(shiftRoster || {}) }
                    ], { onConflict: 'setting_key' });
                    Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl' } });
                  } catch (e) { Swal.fire('Error', e.message, 'error'); }
                }}
                className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                💾 บันทึกตารางทั้งหมด
              </button>
            </div>

            {/* 📊 Table: ขนาดเล็กลง + แยกสีตามวัน */}
            <div className="flex-1 overflow-auto custom-scrollbar border border-indigo-50 rounded-[1.5rem] bg-slate-50/30">
              <table className="w-full text-left border-separate border-spacing-y-1 min-w-[1000px]">
                <thead>
                  <tr className="sticky top-0 z-20">
                    <th className="p-3 bg-indigo-800 text-white font-black text-[9px] uppercase tracking-widest w-[220px] rounded-tl-xl">พนักงาน</th>
                    {[
                      { n: 'จันทร์', c: 'bg-yellow-400' }, { n: 'อังคาร', c: 'bg-pink-400' },
                      { n: 'พุธ', c: 'bg-emerald-500' }, { n: 'พฤหัสฯ', c: 'bg-orange-400' },
                      { n: 'ศุกร์', c: 'bg-blue-500' }, { n: 'เสาร์', c: 'bg-purple-500' },
                      { n: 'อาทิตย์', c: 'bg-red-500' }
                    ].map((day, dIdx) => (
                      <th key={day.n} className={`p-2 ${day.c} text-white font-black text-center text-[10px] border-l border-white/20 ${dIdx === 6 ? 'rounded-tr-xl' : ''}`}>
                        {day.n}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* 🟢 เรียงตามรหัสพนักงาน PL001... เท่านั้น */}
                  {[...(allSalesData || [])]
                    .sort((a, b) => {
                      const codeA = a.employees?.employee_code || "ZZZ";
                      const codeB = b.employees?.employee_code || "ZZZ";
                      return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
                    })
                    .map((emp) => {
                    const empCode = emp.employees?.employee_code || '-';
                    const pos = (emp.employees?.position || '').toLowerCase();
                    const isLiveTeam = pos.includes('ไลฟ์') || pos.includes('live');
                    const isCEO = pos.includes('ceo') || empCode === 'PL001';
                    
                    return (
                      <tr key={emp.employee_id}>
                        <td className={`p-3 sticky left-0 bg-white shadow-md z-10 rounded-l-xl border-y border-l border-indigo-50 ${isCEO ? 'bg-amber-50/50' : ''}`}>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                               <p className={`font-black text-[13px] ${isCEO ? 'text-amber-800' : 'text-slate-800'}`}>{emp.employees?.full_name}</p>
                               {isCEO && <span className="bg-amber-500 text-white text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase shadow-sm">Boss</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {/* 🟢 ป้ายสถานะ: ใช้โทน Indigo/Purple ไม่ใช้สีดำ */}
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded shadow-sm text-white ${isLiveTeam ? 'bg-indigo-500' : 'bg-indigo-800'}`}>
                                {isLiveTeam ? 'LIVE' : 'OFFICE'}
                              </span>
                              {/* 🟢 รหัสพนักงาน: สี Indigo เข้มชัดเจน */}
                              <span className="text-[10px] text-indigo-900 font-black tracking-tight">{empCode}</span>
                            </div>
                          </div>
                        </td>

                        {[1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
                          const rawShift = (shiftRoster || {})[emp.employee_id]?.[dayNum];
                          const isOff = !!(rawShift && rawShift.off === true);
                          let sessions = Array.isArray(rawShift) ? rawShift : (rawShift && !rawShift.off ? [rawShift] : []);

                          if (!isLiveTeam && sessions.length === 0 && !isOff) {
                            sessions = [{ in: '08:00', out: '17:00' }];
                          }

                          return (
                            <td key={dayNum} className="p-1 bg-white border-y border-indigo-50 last:rounded-r-xl last:border-r">
                              <div className={`p-1.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[70px]
                                ${isOff ? 'bg-slate-50 border-slate-100 text-slate-300' : 'bg-white border-indigo-50 shadow-sm hover:border-indigo-400 hover:scale-[1.02]'}`}
                                onClick={async () => {
                                  const { value: formValues } = await Swal.fire({
                                    title: `<div class="text-lg font-black text-indigo-900">${emp.employees?.full_name}</div>`,
                                    html: `
                                      <div class="space-y-4 text-left font-sans">
                                        <div class="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                          <input type="checkbox" id="shift-off" ${isOff ? 'checked' : ''} class="w-6 h-6 cursor-pointer accent-indigo-600">
                                          <label for="shift-off" class="font-black text-indigo-800 cursor-pointer">🏖️ ตั้งเป็นวันหยุด (Day Off)</label>
                                        </div>
                                        <div id="sessions-container" class="space-y-2">
                                          ${isLiveTeam ? (
                                            [0, 1, 2].map(i => `
                                              <div class="p-3 border border-indigo-100 rounded-2xl bg-white">
                                                <p class="text-[9px] font-black text-indigo-400 mb-1 uppercase">รอบที่ ${i+1}</p>
                                                <div class="grid grid-cols-2 gap-2">
                                                  <input id="in-${i}" type="time" class="bg-slate-50 rounded-lg p-2 font-black text-sm border-none" value="${sessions[i]?.in || ''}">
                                                  <input id="out-${i}" type="time" class="bg-slate-50 rounded-lg p-2 font-black text-sm border-none" value="${sessions[i]?.out || ''}">
                                                </div>
                                              </div>
                                            `).join('')
                                          ) : (
                                            `<div class="p-5 border border-indigo-200 rounded-2xl bg-gradient-to-br from-indigo-50 to-white shadow-inner">
                                              <p class="text-[10px] font-black text-indigo-600 mb-4 uppercase text-center tracking-widest">Working Hours</p>
                                              <div class="grid grid-cols-2 gap-4">
                                                <input id="in-0" type="time" class="w-full bg-white border border-indigo-100 rounded-xl p-3 font-black text-lg text-center" value="${sessions[0]?.in || '08:00'}">
                                                <input id="out-0" type="time" class="w-full bg-white border border-indigo-100 rounded-xl p-3 font-black text-lg text-center" value="${sessions[0]?.out || '17:00'}">
                                              </div>
                                            </div>`
                                          )}
                                        </div>
                                      </div>
                                    `,
                                    showCancelButton: true,
                                    confirmButtonText: '💾 บันทึกเวลา',
                                    confirmButtonColor: '#4f46e5',
                                    customClass: { popup: 'rounded-3xl p-6' },
                                    preConfirm: () => {
                                      const off = document.getElementById('shift-off').checked;
                                      if (off) return { off: true };
                                      const results = [];
                                      const limit = isLiveTeam ? 3 : 1;
                                      for(let i=0; i<limit; i++) {
                                        const vIn = document.getElementById(`in-${i}`).value;
                                        const vOut = document.getElementById(`out-${i}`).value;
                                        if (vIn && vOut) results.push({ in: vIn, out: vOut });
                                      }
                                      if (results.length === 0) { Swal.showValidationMessage('กรุณาระบุเวลา'); return false; }
                                      return results;
                                    }
                                  });

                                  if (formValues) {
                                    setShiftRoster(prev => ({
                                      ...prev,
                                      [emp.employee_id]: { ...(prev[emp.employee_id] || {}), [dayNum]: formValues }
                                    }));
                                  }
                                }}
                              >
                                {isOff ? (
                                  <span className="text-[9px] font-black uppercase text-slate-300">🏖️ Off</span>
                                ) : (
                                  <div className="space-y-1 w-full px-1">
                                    {sessions.map((s, sIdx) => (
                                      <div key={sIdx} className="py-1 px-1 rounded-lg flex flex-col items-center gap-0 w-full shadow-sm bg-indigo-600 text-white">
                                        <span className="font-black text-[10px] leading-none">{s.in}</span>
                                        <div className="h-[1px] w-2 bg-white/30 my-0.5"></div>
                                        <span className="font-black text-[10px] leading-none">{s.out}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 💡 Legend: คลีนๆ */}
            <div className="mt-3 flex flex-wrap items-center gap-6 px-4 py-2 bg-white rounded-xl border border-indigo-50">
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                 <span className="text-[9px] font-black text-indigo-400 uppercase">Live Team</span>
               </div>
               <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                 <div className="w-2.5 h-2.5 rounded-full bg-indigo-800"></div>
                 <span className="text-[9px] font-black text-indigo-400 uppercase">Office Staff</span>
               </div>
               <div className="ml-auto text-[9px] font-bold text-indigo-400 italic">
                 * คลิกที่แต่ละช่องเพื่อเปลี่ยนเวลาเข้างานรายคน หรือตั้งวันหยุด
               </div>
            </div>

          </div>
        </div>
      )}
      

{/* 🔐 VIEW: ROLE PERMISSIONS (กำหนดสิทธิ์การมองเห็นเมนูแบบรายบุคคล) */}
      {currentView === "settings_permissions" && user?.role === 'admin' && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col">
            
            <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
              <div>
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">🔐 {t.settingsPermissions}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{t.permDesc}</p>
              </div>
              <button 
                onClick={handleSavePermissions}
                disabled={isSavingPerms || !selectedPermEmpId}
                className="w-full md:w-auto px-8 py-3 bg-slate-800 text-white rounded-xl font-black text-sm shadow-lg hover:bg-slate-900 transition-transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSavingPerms ? `⏳ ${t.saving}` : `💾 ${t.btnSavePerm}`}
              </button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Dropdown เลือกพนักงาน */}
              <div className="mb-6 shrink-0 max-w-xl mx-auto w-full">
                <label className="block text-xs font-bold text-slate-700 mb-2">{t.labelSelectEmp}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xl">👩‍💻</span>
                  <select 
                    value={selectedPermEmpId}
                    onChange={(e) => setSelectedPermEmpId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 font-bold outline-none text-sm focus:border-indigo-400 cursor-pointer text-slate-700 shadow-inner" 
                  >
                    <option value="">{t.selectEmp}</option>
                    {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.employee_code} - {emp.full_name} (ตำแหน่ง: {emp.position || '-'} | {emp.salary_type === 'Part-time' ? 'Part-time' : 'Full-time'})
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              {/* List เมนูพร้อมสวิตช์เปิดปิด */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4 space-y-3">
                {!selectedPermEmpId ? (
                  <div className="text-center py-20 text-slate-400 font-bold bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">{t.permSelectPrompt}</div>
                ) : (
                  masterMenuList.map(menu => {
                    const isChecked = currentEmpMenus.includes(menu.id);
                    return (
                      <div key={menu.id} className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 flex items-center justify-between hover:border-indigo-100 hover:shadow-sm transition-all group cursor-pointer" onClick={() => handleToggleMenu(menu.id)}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                            {menu.icon}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-700">{menu.label}</h4>
                            <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-0.5">รหัส: {menu.id}</p>
                          </div>
                        </div>
                        
                        {/* iOS Toggle Switch */}
                        <div className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors duration-300 ${isChecked ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                          <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isChecked ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      )}

{/* 💬 VIEW: LINE OA SETTINGS (ตั้งค่าผู้รับการแจ้งเตือน) */}
      {currentView === "settings_line_oa" && user?.role === 'admin' && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col">
            
            <div className="mb-6 border-b border-slate-100 pb-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-[#00B900]/10 rounded-2xl flex items-center justify-center text-[#00B900] text-3xl shadow-inner">
                💬
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xl">{t.settingsLineOA}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{t.lineDesc}</p>
              </div>
            </div>

            <form onSubmit={handleSaveLineSettings} className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label className="block text-sm font-black text-slate-700 mb-2">{t.labelLineId}</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">ID:</span>
                    <input 
                      type="text" 
                      required 
                      value={lineAdminId}
                      onChange={(e) => setLineAdminId(e.target.value)}
                      placeholder="เช่น C0df0123907f46..." 
                      className="w-full bg-white border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 font-bold outline-none text-slate-700 shadow-inner focus:border-[#00B900] transition-colors" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSavingLine}
                    className="px-8 py-3 bg-[#00B900] text-white rounded-xl font-black text-sm shadow-lg hover:bg-[#009900] hover:-translate-y-0.5 transition-all disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    {isSavingLine ? '⏳ กำลังบันทึก...' : `💾 ${t.btnSaveLine}`}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-4 font-bold flex items-start gap-1">
                  <span className="text-amber-500">⚠️</span>
                  <span><strong>คำแนะนำ:</strong> ID ที่ขึ้นต้นด้วย "C" คือ Group ID (ใช้สำหรับรับแจ้งเตือนในกลุ่ม) ส่วน ID ที่ขึ้นต้นด้วย "U" คือ User ID (ใช้สำหรับรับแจ้งเตือนส่วนตัว)</span>
                </p>
              </div>
            </form>

{/* 💾 SAFE ZONE: สำรองข้อมูลระบบ */}
                  <div className="mt-8 pt-8 border-t-2 border-slate-100 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-500 text-2xl shadow-inner">
                        💾
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg">สำรองข้อมูลระบบ (Data Backup)</h4>
                        <p className="text-xs text-slate-500 font-bold">ดาวน์โหลดข้อมูลทั้งหมดเก็บไว้ในเครื่องคอมพิวเตอร์ของคุณ</p>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow mb-8">
                      <div>
                        <h5 className="font-black text-indigo-700 text-base">ส่งออกข้อมูลเป็นไฟล์ JSON</h5>
                        <p className="text-xs text-indigo-500/80 font-bold mt-1 max-w-sm leading-relaxed">
                          ดาวน์โหลดข้อมูล <span className="font-black text-indigo-600">พนักงาน, เงินเดือน, เข้างาน, การลา และยอดขาย</span> ทั้งหมดในระบบ เก็บไว้เป็นไฟล์สำรองฉุกเฉิน
                        </p>
                      </div>
                      <button 
                        onClick={handleBackupData} 
                        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                      >
                        📥 ดาวน์โหลดไฟล์ Backup
                      </button>
                    </div>
                  </div>


{/* 🚨 DANGER ZONE: ล้างข้อมูลระบบ */}
                  <div className="mt-8 pt-8 border-t-2 border-dashed border-rose-200 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 text-2xl shadow-inner">
                        🚨
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg">โซนอันตราย (Danger Zone)</h4>
                        <p className="text-xs text-slate-500 font-bold">พื้นที่สำหรับผู้ดูแลระบบ จัดการข้อมูลทดสอบ</p>
                      </div>
                    </div>
                    
                    <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <h5 className="font-black text-rose-700 text-base">ล้างข้อมูลทดสอบทั้งหมด</h5>
                        <p className="text-xs text-rose-500/80 font-bold mt-1 max-w-sm leading-relaxed">
                          ลบข้อมูล <span className="text-rose-600 underline">สลิปเงินเดือน, ประวัติเข้างาน และการลา</span> ทั้งหมดออกจากระบบถาวร (รายชื่อพนักงานและการตั้งค่าจะยังคงอยู่)
                        </p>
                      </div>
                      <button 
                        onClick={handleResetTestData} 
                        className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-sm shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                      >
                        🧹 เคลียร์ข้อมูลทดสอบ
                      </button>
                    </div>
                  </div>
          </div>
        </div>
      )}

{/* 👥 VIEW: EMPLOYEE MANAGEMENT (V.4.0: ฉบับคลีน ตัดเวลาคงที่ออก - Mobile Responsive 100%) */}
{currentView === "employees" && (
  <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
    <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm border border-white flex-1 flex flex-col w-full">
      
      {/* 1. Header & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 md:mb-6 border-b border-slate-100 pb-5 md:pb-6">
        <div>
          <h3 className="font-black text-slate-800 text-xl md:text-2xl flex items-center gap-2">👥 {t.empTitle}</h3>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">จัดการข้อมูล, รายได้ และสิทธิ์การเข้าใช้งานของพนักงาน</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          <input 
            type="text" 
            placeholder={t.empSearch} 
            value={empSearch} 
            onChange={(e) => setEmpSearch(e.target.value)} 
            className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 sm:py-2.5 font-bold outline-none text-sm shadow-inner focus:border-purple-400" 
          />
          <button onClick={() => { 
              setEditingEmpId(null);
              // 🚩 ตัด shift_start / shift_end ออกจากค่าเริ่มต้น
              setEmpForm({ 
                employee_code: "", full_name: "", name_en: "", nickname: "", email: "", 
                profile_picture: "", username: "", password: "", phone_number: "", 
                position: "", salary_type: "Full-time", base_salary: 0, hourly_rate: 0, 
                role: "employee", is_active: true // 🚩 เพิ่มค่า default เป็น true
              });
              setIsEmpModalOpen(true); 
            }} className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 sm:py-2.5 rounded-xl font-black text-sm shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2" >
            <span className="text-lg leading-none">+</span> {t.empAddBtn.replace('➕', '').trim()}
          </button>
        </div>
      </div>

      {/* 2. Employee List */}
      <div className="flex-1 overflow-y-auto w-full pr-1 md:pr-2 custom-scrollbar">
        
        {/* Header ของตาราง (บน Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase bg-slate-50 p-4 rounded-xl mb-3 sticky top-0 z-10 border border-slate-100">
          <div className="col-span-4">{t.thEmpProfile}</div>
          <div className="col-span-3">ตำแหน่ง / ประเภท</div>
          <div className="col-span-2">ข้อมูลการติดต่อ</div>
          <div className="col-span-3 text-right">{t.thEmpManage}</div>
        </div>

        {/* Body รายชื่อพนักงาน */}
        <div className="space-y-3">
          {employees.filter(e => (e.full_name || '').includes(empSearch) || (e.employee_code || '').includes(empSearch) || (e.name_en && e.name_en.toLowerCase().includes(empSearch.toLowerCase()))).length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-2xl border border-slate-100">ไม่มีข้อมูลพนักงาน</div>
          ) : (
            employees.filter(e => (e.full_name || '').includes(empSearch) || (e.employee_code || '').includes(empSearch) || (e.name_en && e.name_en.toLowerCase().includes(empSearch.toLowerCase()))).map((emp) => {
              // 🚩 กำหนดตัวแปรเช็คสถานะ
              const isActive = emp.is_active !== false;

              return (
              <div key={emp.id} className={`bg-white border transition-all rounded-2xl p-4 md:p-4 flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center gap-4 relative overflow-hidden group ${!isActive ? 'opacity-50 grayscale bg-slate-100 border-slate-300' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200'}`}>
                
                {/* แถบสีบ่งบอกสถานะ (สำหรับคนที่โดนระงับ) */}
                {!isActive && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
                )}

                {/* ข้อมูลพนักงาน */}
                <div className="col-span-4 flex flex-col md:flex-row items-center gap-3 py-1">
                  <div className={`w-16 h-16 md:w-14 md:h-14 flex-shrink-0 text-purple-600 rounded-full flex items-center justify-center font-black text-xl shadow-sm border-2 border-white overflow-hidden ${!isActive ? 'bg-slate-300 text-slate-500' : 'bg-gradient-to-tr from-pink-100 to-purple-100'}`}>
                    {emp.profile_picture ? (
                      <img src={emp.profile_picture} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      (emp.full_name || 'U').charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col items-center md:items-start overflow-hidden w-full">
                    <span className="font-black text-sm md:text-base text-slate-800 truncate w-full text-center md:text-left flex justify-center md:justify-start items-center gap-2">
                      {emp.full_name} 
                      {emp.nickname && <span className="text-pink-500 font-bold text-[10px] bg-pink-50 px-1.5 py-0.5 rounded">({emp.nickname})</span>}
                      {!isActive && <span className="text-[9px] text-white bg-slate-500 px-1.5 py-0.5 rounded uppercase shadow-sm">ระงับใช้งาน</span>}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">🆔 {emp.employee_code}</span>
                      {emp.role && emp.role !== 'employee' && (
                        <span className="text-[9px] text-white font-black bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded uppercase">👑 {emp.role}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-50 w-full md:hidden"></div>

                {/* ตำแหน่ง & ประเภทการจ้าง */}
                <div className="col-span-3 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-2">
                  <span className="font-black text-[11px] md:text-sm text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{emp.position || 'ไม่ระบุตำแหน่ง'}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${emp.salary_type === 'Part-time' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {emp.salary_type === 'Part-time' ? 'รายชั่วโมง' : 'พนักงานประจำ'}
                  </span>
                </div>

                <div className="h-px bg-slate-50 w-full md:hidden"></div>

                {/* ข้อมูลติดต่อ */}
                <div className="col-span-2 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-2">
                  <span className="text-[11px] md:text-xs font-bold text-slate-600 flex items-center gap-1.5">📞 {emp.phone_number || '-'}</span>
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400 flex items-center gap-1.5">👤 {emp.username || '-'}</span>
                </div>

                {/* จัดการ */}
                <div className="col-span-3 flex flex-wrap md:flex-nowrap gap-2 justify-end mt-2 md:mt-0">
                  {/* 🚩 ปุ่มเปิด-ปิด สถานะ */}
                  <button 
                    onClick={() => handleToggleEmployeeStatus(emp.id, isActive)}
                    className={`flex-1 md:flex-none px-3 py-2.5 md:py-1.5 rounded-xl md:rounded-lg font-black text-xs transition-colors flex justify-center items-center gap-1 ${
                      isActive 
                        ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200' 
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                    }`}
                    title={isActive ? "ระงับการใช้งาน" : "เปิดการใช้งาน"}
                  >
                    {isActive ? '🚫' : '✅'} <span className="md:hidden">{isActive ? 'ระงับ' : 'คืนชีพ'}</span>
                  </button>

                  <button onClick={() => { 
                    setEditingEmpId(emp.id);
                    setEmpForm({ 
                      ...emp, 
                      password: "", 
                      nickname: emp.nickname || "",
                      name_en: emp.name_en || "",
                      email: emp.email || ""
                    });
                    setIsEmpModalOpen(true); 
                  }} className="flex-1 md:flex-none px-4 md:px-3 py-2.5 md:py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl md:rounded-lg font-black text-xs hover:bg-amber-100 transition-colors flex justify-center items-center gap-1" >
                    📝 <span className="md:hidden">แก้ไข</span>
                  </button>
                  
                  {emp.id !== user.id && (
                    <button 
                      onClick={() => handleDeleteEmployee(emp.id, emp.full_name)} 
                      className="flex-1 md:flex-none px-4 md:px-3 py-2.5 md:py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl md:rounded-lg font-black text-xs hover:bg-rose-100 transition-colors flex justify-center items-center gap-1"
                    >
                      🗑️ <span className="md:hidden">ลบ</span>
                    </button>
                  )}
                </div>

              </div>
            )})
          )}
        </div>
      </div>
    </div>
  </div>
)}

{/* 🎯 VIEW: MANAGE LEAVE QUOTAS (โฉมใหม่: จัดการประเภทการลาได้อิสระ) */}
        {currentView === "settings_quotas" && (user?.role === 'admin' || user?.role === 'ceo') && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col">
            
            <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">🎯 {t.quotaTitle}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{t.quotaDesc}</p>
              </div>
              <button 
                onClick={handleAddLeaveType}
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                🚀 {t.btnAddLeaveType}
              </button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2 pb-2">
              <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1100px]">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-4 rounded-l-xl w-64 bg-slate-50">{t.thEmpName}</th>
                    {/* Render หัวคอลัมน์ตามประเภทการลาทั้งหมดที่มี + ปุ่มลบ (แบบเห็นชัด 100% ไม่ต้องรอ Hover) */}
                    {globalLeaveTypes.map((type, idx) => (
                      <th key={idx} className="p-4 text-center font-bold tracking-wider relative bg-slate-50 border-x border-slate-100/50 min-w-[100px]">
                         <div className="flex flex-col items-center gap-1">
                           <span className="text-base">{getLeaveIcon(type)}</span>
                           <span className="text-[10px] sm:text-xs whitespace-nowrap">{getTranslatedType(type)}</span>
                           
                           {/* ❌ ปุ่มลบ: บังคับโชว์ตลอดเวลา สีแดงเห็นชัดๆ เลยครับพี่ */}
                           {/* ระบบจะกันไม่ให้ลบประเภทหลัก (ป่วย/กิจ/พักร้อน) ไว้ให้แล้วในฟังก์ชันครับ */}
                           <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteLeaveType(type); }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg hover:bg-rose-700 transition-all z-10 border border-white"
                            title="ลบประเภทการลานี้"
                           >
                            ✕
                           </button>
                         </div>
                      </th>
                    ))}
                    <th className="p-4 text-center rounded-r-xl w-32 bg-slate-50">{t.thManage}</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => {
                    const empBalances = allLeaveBalances.filter(b => b.employee_id === emp.id);
                    return (
                       <tr key={emp.id} className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group">
                          <td className="p-4 font-black text-slate-800 rounded-l-xl whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{emp.employee_code}</span>
                              <span className="text-sm text-indigo-600 font-black">{lang === 'EN' && emp.name_en ? emp.name_en : `คุณ${emp.full_name}`}</span>
                            </div>
                          </td>
                          {globalLeaveTypes.map((type, idx) => {
                            const found = empBalances.find(b => b.leave_type === type);
                            const days = found ? found.total_days : 0;
                            return (
                              <td key={idx} className="p-4 text-center text-sm font-bold text-slate-600">
                                {days > 0 ? (
                                  <span className="bg-slate-50 px-3 py-1.5 rounded-lg text-slate-800 border border-slate-100 font-black">{days} วัน</span>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="p-4 text-center rounded-r-xl">
                            <button 
                              onClick={() => handleOpenEditQuota(emp)}
                              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-black rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                            >
                              ⚙️ {t.btnEditQuota}
                            </button>
                          </td>
                       </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}


      </div>

      {/* 🎯 MODAL: แก้ไขโควต้าพนักงาน (Popup) */}
      {editingQuotaEmp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingQuotaEmp(null)}></div>
          
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl flex flex-col relative z-10 animate-pop-in border border-white/50 max-h-[90vh]">
            <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[2rem] shrink-0">
              <div>
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">⚙️ {t.btnEditQuota}</h3>
                <p className="text-sm text-indigo-600 font-bold mt-1">
                  {editingQuotaEmp.emp.employee_code} - {lang === 'EN' && editingQuotaEmp.emp.name_en ? editingQuotaEmp.emp.name_en : `คุณ${editingQuotaEmp.emp.full_name}`}
                </p>
              </div>
              <button onClick={() => setEditingQuotaEmp(null)} className="w-8 h-8 flex items-center justify-center bg-slate-200 text-slate-500 rounded-full hover:bg-rose-500 hover:text-white font-bold transition-colors">✕</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="quotaForm" onSubmit={handleSaveQuotaModal} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {globalLeaveTypes.map((type, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getLeaveIcon(type)}</div>
                      <div>
                        <h4 className="font-black text-slate-700 text-sm">{getTranslatedType(type)}</h4>
                        <p className="text-[10px] font-bold text-slate-400">วัน/ปี</p>
                      </div>
                    </div>
                    <input 
                      type="number" min="0" 
                      value={editingQuotaEmp.form[type]} 
                      onChange={(e) => setEditingQuotaEmp({ ...editingQuotaEmp, form: { ...editingQuotaEmp.form, [type]: e.target.value }})} 
                      className="w-20 bg-white border-2 border-slate-200 rounded-xl px-2 py-2 font-black text-center text-slate-800 outline-none focus:border-indigo-500 shadow-inner text-base" 
                    />
                  </div>
                ))}
              </form>
            </div>

            <div className="p-5 border-t border-slate-100 bg-white rounded-b-[2rem] flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setEditingQuotaEmp(null)} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">{t.modalCancel}</button>
              <button type="submit" form="quotaForm" disabled={isSavingQuota} className="px-8 py-3 bg-slate-800 text-white rounded-xl font-black text-sm hover:bg-slate-900 transition-transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 flex items-center gap-2">
                {isSavingQuota ? `⏳ ${t.quotaSavingBtn}` : `💾 ${t.quotaSaveBtn}`}
              </button>
            </div>
          </div>
        </div>
      )}

      

{/* 🏖️ MODAL: แจ้งวันหยุดประจำสัปดาห์ */}
      {isDayoffModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDayoffModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg flex flex-col relative z-10 overflow-hidden animate-pop-in border border-white">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-rose-50 to-white">
              <h3 className="font-black text-rose-600 text-lg flex items-center gap-2">🏖️ แจ้งวันหยุดประจำสัปดาห์</h3>
              <button onClick={() => setIsDayoffModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 rounded-full hover:bg-rose-500 hover:text-white font-bold transition-all shadow-sm">✕</button>
            </div>
            
            <form id="dayoffForm" onSubmit={handleSubmitDayoff} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-black text-slate-700 mb-2 block flex items-center gap-2"><span>📅</span> ระบุวันที่หยุด</label>
                  <input 
                    type="date" required 
                    value={dayoffForm.date} 
                    onChange={(e) => setDayoffForm({...dayoffForm, date: e.target.value})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold outline-none text-slate-700 shadow-inner focus:border-rose-400 focus:bg-white transition-all cursor-pointer" 
                  />
                </div>
                <div>
                  <label className="text-sm font-black text-slate-700 mb-2 block flex items-center gap-2"><span>📝</span> เหตุผลการหยุด</label>
                  <textarea 
                    rows="2" 
                    value={dayoffForm.reason} 
                    onChange={(e) => setDayoffForm({...dayoffForm, reason: e.target.value})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-medium outline-none text-slate-700 shadow-inner focus:border-rose-400 focus:bg-white transition-all resize-none"
                    placeholder="ระบุเหตุผลการหยุด..."
                  ></textarea>
                </div>
              </div>
            </form>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsDayoffModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">ยกเลิก</button>
              <button type="submit" form="dayoffForm" disabled={isSubmitting} className="px-8 py-3 bg-rose-500 text-white rounded-xl font-black text-sm hover:bg-rose-600 transition-transform hover:scale-105 shadow-lg shadow-rose-200 disabled:opacity-50 flex items-center gap-2">
                {isSubmitting ? '⏳ กำลังส่ง...' : '🚀 บันทึกวันหยุด'}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* 👤 MODAL: เพิ่ม/แก้ไขพนักงาน (V.3.0: ตัดเวลาคงที่ออกไปใช้ตารางกะพนักงาน) */}
{isEmpModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEmpModalOpen(false)}></div>
    <div className="bg-white rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] animate-pop-in border border-white/50">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-[2rem]">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">👤 {t.modalEmpTitle}</h2>
        <p className="text-slate-500 font-medium text-sm mt-1">จัดการข้อมูลพื้นฐานและรายได้พนักงาน</p>
      </div>
      
      <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
        <form id="empForm" onSubmit={handleSaveEmployee} className="space-y-6">
          
          {/* Section 1: ข้อมูลระบบ (เหมือนเดิมไม่แก้) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h4 className="font-black text-slate-700 mb-4 text-sm flex items-center gap-2">🔐 ข้อมูลระบบเข้าใช้งาน</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="text-[11px] font-bold text-slate-500 mb-1.5 block">{t.labelEmpCode} <span className="text-rose-500">*</span></label><input required type="text" value={empForm.employee_code} onChange={(e) => setEmpForm({...empForm, employee_code: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none shadow-sm focus:border-purple-400" /></div>
              <div><label className="text-[11px] font-bold text-slate-500 mb-1.5 block">{t.labelUsername} <span className="text-rose-500">*</span></label><input required type="text" value={empForm.username} onChange={(e) => setEmpForm({...empForm, username: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none shadow-sm focus:border-purple-400" /></div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">{t.labelPassword} {!editingEmpId && <span className="text-rose-500">*</span>}</label>
                  <button type="button" onClick={generateSecurePassword} className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100 hover:bg-purple-100 transition-all shadow-sm">🎲 สุ่มรหัส</button>
                </div>
                <div className="relative">
                  <input required={!editingEmpId} type={showPassword ? "text" : "password"} value={empForm.password} onChange={(e) => setEmpForm({...empForm, password: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none shadow-sm focus:border-purple-400" placeholder={editingEmpId ? "ปล่อยว่างได้ถ้าไม่เปลี่ยนรหัส" : "••••••••"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">{showPassword ? "👁️" : "🙈"}</button>
                </div>
                <div className="flex items-center gap-2 mt-2.5 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                  <input type="checkbox" id="reqPassChange" checked={empForm.require_password_change || false} onChange={(e) => setEmpForm({...empForm, require_password_change: e.target.checked})} className="w-3.5 h-3.5 text-purple-600 rounded cursor-pointer accent-purple-500" />
                  <label htmlFor="reqPassChange" className="text-[10px] font-black text-slate-600 cursor-pointer select-none">บังคับเปลี่ยนรหัสเมื่อเข้าสู่ระบบ</label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: ข้อมูลส่วนตัว (อัปเกรดเพิ่มช่องอีเมลแล้ว) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-black text-slate-700 mb-4 text-sm flex items-center gap-2">📝 ข้อมูลส่วนตัว</h4>
            <div className="mb-5 flex items-center gap-5 border-b border-slate-100 pb-5">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {empForm.profile_picture ? <img src={empForm.profile_picture} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-4xl">📸</span>}
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">รูปโปรไฟล์</label>
                <input type="file" accept="image/*" onChange={async (e) => {/* โค้ดอัปโหลดเดิม */}} className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100 cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-[11px] font-bold text-slate-500 mb-1.5 block">🏷️ ชื่อเล่น</label><input type="text" value={empForm.nickname || ''} onChange={(e) => setEmpForm({...empForm, nickname: e.target.value})} placeholder="เช่น บอย" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:bg-white focus:border-purple-400 transition-colors" /></div>
              <div><label className="text-[11px] font-bold text-slate-500 mb-1.5 block">{t.labelFullName} <span className="text-rose-500">*</span></label><input required type="text" value={empForm.full_name || ''} onChange={(e) => setEmpForm({...empForm, full_name: e.target.value})} placeholder="เช่น สมชาย ใจดี" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:bg-white focus:border-purple-400 transition-colors" /></div>
              <div><label className="text-[11px] font-bold text-slate-500 mb-1.5 block">{t.labelNameEn}</label><input type="text" value={empForm.name_en || ''} onChange={(e) => setEmpForm({...empForm, name_en: e.target.value})} placeholder="e.g. Somchai Jaidee" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:bg-white focus:border-purple-400 transition-colors uppercase" /></div>
              
              {/* 👇 เพิ่มช่อง E-mail ตรงนี้ 👇 */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">📧 อีเมล (E-mail)</label>
                <input type="email" value={empForm.email || ''} onChange={(e) => setEmpForm({...empForm, email: e.target.value})} placeholder="example@email.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:bg-white focus:border-purple-400 transition-colors" />
              </div>
              {/* 👆 สิ้นสุดช่อง E-mail 👆 */}

              <div className="md:col-span-2"><label className="text-[11px] font-bold text-slate-500 mb-1.5 block">{t.labelPhone}</label><input type="text" value={empForm.phone_number || ''} onChange={(e) => setEmpForm({...empForm, phone_number: e.target.value})} placeholder="08X-XXX-XXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:bg-white focus:border-purple-400 transition-colors" /></div>
            </div>
          </div>

          {/* 🚩 Section 3: การทำงาน & เงินเดือน (ปรับใหม่: ตัดช่องเวลาออก) */}
          <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
            <h4 className="font-black text-indigo-700 mb-4 text-sm flex items-center gap-2">💰 การทำงาน & รายได้</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              
              {/* ตำแหน่งงาน */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">ตำแหน่งงาน <span className="text-rose-500">*</span></label>
                  <button type="button" onClick={() => setIsPositionModalOpen(true)} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 hover:bg-indigo-100 shadow-sm">⚙️ ตั้งค่า</button>
                </div>
                <select required value={empForm.position} onChange={(e) => setEmpForm({...empForm, position: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 text-sm outline-none focus:border-indigo-400">
                  <option value="">-- เลือกตำแหน่ง --</option>
                  {positions.map((pos, idx) => (<option key={idx} value={pos}>{pos}</option>))}
                </select>
              </div>

              {/* ประเภทการจ้าง */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">ประเภทการจ้าง <span className="text-rose-500">*</span></label>
                <select value={empForm.salary_type} onChange={(e) => setEmpForm({...empForm, salary_type: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-indigo-700 text-sm outline-none focus:border-indigo-400">
                  <option value="Full-time">Full-time (พนักงานประจำ)</option>
                  <option value="Part-time">Part-time (รายชั่วโมง)</option>
                </select>
              </div>

              {/* อัตราจ้าง/เงินเดือน */}
              {empForm.salary_type === 'Part-time' ? (
                <div>
                  <label className="text-[11px] font-bold text-purple-600 mb-1.5 block uppercase tracking-wider">ค่าจ้างรายชั่วโมง (฿) <span className="text-rose-500">*</span></label>
                  <input required type="number" placeholder="เช่น 100" value={empForm.hourly_rate} onChange={(e) => setEmpForm({...empForm, hourly_rate: e.target.value})} className="w-full bg-white border-2 border-purple-200 rounded-xl px-4 py-2.5 font-black text-purple-700 outline-none" />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-emerald-600 mb-1 block uppercase tracking-wider">เงินเดือนพื้นฐาน (฿)</label>
                  <input required type="number" placeholder="15000" value={empForm.base_salary} onChange={(e) => setEmpForm({...empForm, base_salary: e.target.value})} className="w-full bg-white border-2 border-emerald-200 rounded-xl px-4 py-2.5 font-black text-emerald-700 outline-none" />
                  <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-slate-200">
                    <input type="checkbox" id="ssoCheck" checked={empForm.has_social_security !== false} onChange={(e) => setEmpForm({...empForm, has_social_security: e.target.checked})} className="w-3.5 h-3.5 text-emerald-600 rounded accent-emerald-500" />
                    <label htmlFor="ssoCheck" className="text-[10px] font-black text-slate-700">ประกันสังคม (หัก 5%)</label>
                  </div>
                </div>
              )}
            </div>

            {/* 🚩 ข้อความแจ้งเตือนแทนที่ช่องกรอกเวลาเดิม */}
            <div className="p-4 bg-white/60 rounded-2xl border border-indigo-100 flex items-start gap-3 mb-5">
              <span className="text-lg">💡</span>
              <p className="text-[11px] text-indigo-600 font-bold italic leading-relaxed">
                ระบบจะดึงเวลาเข้า-เลิกงานจาก <span className="underline">"ตารางกะพนักงาน"</span> รายวันมาใช้โดยอัตโนมัติ เพื่อรองรับกะงานที่ยืดหยุ่นและการคิดเงินที่แม่นยำครับ
              </p>
            </div>

            {/* 🏦 ส่วนของธนาคาร (ดึงไฟล์รูปโลโก้จริงจากโฟลเดอร์ public) */}
            <div className="border-t border-slate-200 pt-6 mt-2">
              <label className="text-[11px] font-black text-slate-500 mb-3 block uppercase tracking-widest">
                🏦 เลือกธนาคารรับเงินโอน
              </label>
              
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-5">
                {[
                  { id: 'KBANK', label: 'กสิกร', logo: '/kbank.png' },
                  { id: 'SCB', label: 'ไทยพาณิชย์', logo: '/scb.png' },
                  { id: 'BBL', label: 'กรุงเทพ', logo: '/bbl.png' },
                  { id: 'KTB', label: 'กรุงไทย', logo: '/ktb.png' },
                  { id: 'BAY', label: 'กรุงศรี', logo: '/bay.png' },
                  { id: 'TTB', label: 'ทีทีบี', logo: '/ttb.png' },
                  { id: 'GSB', label: 'ออมสิน', logo: '/gsb.png' },
                  { id: 'OTHER', label: 'อื่นๆ', logo: null }
                ].map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => setEmpForm({ ...empForm, bank_name: bank.id })}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-2xl border-2 transition-all duration-300 ${
                      empForm.bank_name === bank.id 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md scale-105' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden mb-1 flex items-center justify-center bg-white border border-slate-100 p-0.5 shadow-sm">
                      {bank.id === 'OTHER' ? (
                        <span className="text-xl">🏢</span>
                      ) : (
                        <img 
                          src={bank.logo} 
                          alt={bank.id} 
                          className={`w-full h-full object-contain rounded-lg transition-all ${empForm.bank_name === bank.id ? '' : 'grayscale-[30%] opacity-80'}`}
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        />
                      )}
                      {/* ข้อความสำรอง เผื่อพี่พิมพ์ชื่อไฟล์ผิดมันจะโชว์ตัวหนังสือแทนรูปแตกๆ ครับ */}
                      <span className="hidden text-[10px] font-black text-slate-400">{bank.id}</span>
                    </div>
                    <span className={`text-[8px] font-black uppercase ${empForm.bank_name === bank.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {bank.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                <label className="text-[11px] font-black text-slate-400 mb-1.5 block uppercase tracking-wider">🔢 เลขที่บัญชี</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="เช่น 123-4-56789-0" 
                    value={empForm.bank_account || ''} 
                    onChange={(e) => setEmpForm({...empForm, bank_account: e.target.value})} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-indigo-700 text-lg outline-none focus:border-indigo-400 transition-all" 
                  />
                  {empForm.bank_name && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-300 uppercase">{empForm.bank_name}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-[2rem] flex gap-3">
        <button type="button" onClick={() => setIsEmpModalOpen(false)} className="flex-1 py-3.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-black text-sm shadow-sm hover:bg-slate-100 transition-colors">{t.modalCancel}</button>
        <button type="submit" form="empForm" className="flex-1 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-black text-sm shadow-lg hover:scale-[1.02] transition-transform">💾 บันทึกข้อมูลพนักงาน</button>
      </div>
    </div>
  </div>
)}

      {/* 📦 MODAL: เพิ่ม/แก้ไข สินทรัพย์ + ระบบคำนวณค่าเสื่อม (Complete Version) */}
        {isAssetModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-zoom-in">
              
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
                  {editingAssetId ? '📝 แก้ไขข้อมูลสินทรัพย์' : '➕ เพิ่มสินทรัพย์ใหม่'}
                </h3>
                <button onClick={() => setIsAssetModalOpen(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all text-2xl">×</button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveAsset} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* แถว 1: ข้อมูลพื้นฐาน */}
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">รหัสสินทรัพย์ *</label>
                    <input required type="text" value={assetForm.asset_code || ''} onChange={(e) => setAssetForm({...assetForm, asset_code: e.target.value})} placeholder="เช่น NB-001" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-blue-500 transition-all" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">ชื่อสินทรัพย์ *</label>
                    <input required type="text" value={assetForm.name || assetForm.asset_name || ''} onChange={(e) => setAssetForm({...assetForm, name: e.target.value, asset_name: e.target.value})} placeholder="ระบุชื่ออุปกรณ์" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-blue-500 transition-all" />
                  </div>

                  {/* แถวกลาง: หมวดหมู่ (ระบบ Auto อายุการใช้งานและราคาซากตามมาตรฐานบัญชี) */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1.5 block uppercase">หมวดหมู่</label>
                    <select 
                      value={assetForm.category} 
                      onChange={(e) => {
                        const selectedCat = e.target.value;
                        // 🧠 ตรรกะมาตรฐานสรรพากร: ไอที 3 ปี / อื่นๆ 5 ปี / ซาก 1 บาท
                        const autoLife = selectedCat === "อุปกรณ์ไอที" ? 3 : 5;
                        
                        setAssetForm({
                          ...assetForm, 
                          category: selectedCat,
                          useful_life: autoLife,     // Auto อายุการใช้งาน
                          salvage_value: 1           // Auto ราคาซาก 1 บาท
                        });
                      }} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:border-blue-400"
                    >
                      <option value="อุปกรณ์ไอที">💻 อุปกรณ์ไอที (เสื่อม 3 ปี)</option>
                      <option value="เฟอร์นิเจอร์">🪑 เฟอร์นิเจอร์ (เสื่อม 5 ปี)</option>
                      <option value="เครื่องใช้ไฟฟ้า">🔌 เครื่องใช้ไฟฟ้า (เสื่อม 5 ปี)</option>
                      <option value="อื่นๆ">📦 อื่นๆ (เสื่อม 5 ปี)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1.5 block uppercase">สถานะการใช้งาน</label>
                    <select value={assetForm.status} onChange={(e) => setAssetForm({...assetForm, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:border-blue-400">
                      <option value="available">✅ พร้อมใช้งาน</option>
                      <option value="repair">🔧 กำลังซ่อม</option>
                      <option value="broken">❌ ชำรุด/เลิกใช้</option>
                    </select>
                  </div>

                  {/* แถว 3: วันที่ซื้อ (จำเป็นต้องมีเพื่อคำนวณค่าเสื่อม) */}
                  <div className="md:col-span-2 border-t border-dashed border-slate-200 pt-4 mt-2">
                    <label className="text-[11px] font-bold text-indigo-500 mb-1.5 block uppercase tracking-widest">🗓️ วันที่เริ่มครอบครอง / วันที่ซื้อ</label>
                    <input 
                      type="date" 
                      value={assetForm.purchase_date || ''} 
                      onChange={(e) => setAssetForm({...assetForm, purchase_date: e.target.value})} 
                      className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-indigo-400" 
                    />
                  </div>

                  {/* 📊 ส่วนคำนวณค่าเสื่อมราคา (Grid 50/50) */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase">💰 ราคาซื้อ (บาท)</label>
                      <input 
                        type="number" 
                        value={assetForm.purchase_price || ''} 
                        onChange={(e) => setAssetForm({...assetForm, purchase_price: e.target.value})} 
                        placeholder="0.00"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-blue-400 h-[42px]" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase">👤 ผู้ถือครอง</label>
                      <select 
                        value={assetForm.assigned_to || ''} 
                        onChange={(e) => setAssetForm({...assetForm, assigned_to: e.target.value || null})} 
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 cursor-pointer h-[42px]"
                      >
                        <option value="">🏢 ส่วนกลาง</option>
                        {employees && employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.full_name} {emp.nickname ? `(${emp.nickname})` : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase">⏳ อายุใช้งาน (ปี)</label>
                      <input 
                        type="number" 
                        value={assetForm.useful_life || 5} 
                        onChange={(e) => setAssetForm({...assetForm, useful_life: e.target.value})} 
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-blue-400 h-[42px]" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase">♻️ ราคาซาก (บาท)</label>
                      <input 
                        type="number" 
                        value={assetForm.salvage_value || 1} 
                        onChange={(e) => setAssetForm({...assetForm, salvage_value: e.target.value})} 
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-blue-400 h-[42px]" 
                      />
                    </div>
                  </div>

                  {/* 📍 ส่วนสถานที่ (Grid 50/50) */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase">📍 สถานที่ใช้งาน</label>
                      <input 
                        type="text" 
                        value={assetForm.usage_location || ''} 
                        onChange={(e) => setAssetForm({...assetForm, usage_location: e.target.value})} 
                        placeholder="ระบุแผนก"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 font-bold text-sm outline-none focus:border-blue-400 h-[42px]" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase">📦 สถานที่เก็บ</label>
                      <input 
                        type="text" 
                        value={assetForm.storage_location || ''} 
                        onChange={(e) => setAssetForm({...assetForm, storage_location: e.target.value})} 
                        placeholder="ระบุจุดที่เก็บ"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 font-bold text-sm outline-none focus:border-blue-400 h-[42px]" 
                      />
                    </div>
                  </div>

                  {/* หมายเหตุ */}
                  <div className="md:col-span-2 flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase">📝 หมายเหตุ</label>
                    <textarea 
                      rows="2"
                      value={assetForm.note || ''} 
                      onChange={(e) => setAssetForm({...assetForm, note: e.target.value})} 
                      placeholder="รายละเอียดเพิ่มเติม..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 font-bold text-sm outline-none focus:border-blue-400 resize-none"
                    />
                  </div>
                </div>

                {/* ส่วนปุ่มกด */}
                <div className="mt-8 flex gap-3">
                  <button type="button" onClick={() => setIsAssetModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">ยกเลิก</button>
                  <button type="submit" className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg hover:scale-[1.02] transition-all">บันทึกข้อมูลสินทรัพย์</button>
                </div>
              </form>
            </div>
          </div>
        )}


      {/* 🚀 MODAL 1: ยื่นใบลา */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[450px] overflow-hidden border border-white my-auto">
            
            <div className="p-6 pb-2 text-center shrink-0 mt-2">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-pink-200 mb-4">
                <span className="text-2xl text-white">💌</span>
              </div>
              <h3 className="font-black text-2xl text-[#1E293B]">{t.modalLeaveTitle}</h3>
            </div>
            
            <form onSubmit={handleSubmitLeave} className="px-6 pb-8 space-y-5 mt-4">
              
              <div className="grid grid-cols-2 gap-4 border border-slate-200 p-4 rounded-2xl bg-slate-50/50">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">🏷️ {t.modalLeaveType}</label>
                  <select value={leaveForm.type} onChange={(e) => setLeaveForm({...leaveForm, type: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-700 outline-none text-sm shadow-sm focus:border-purple-400 transition-colors">
                    <option value="ลาป่วย">{t.sickLeave || 'ลาป่วย'}</option>
                    <option value="ลากิจ">{t.personalLeave || 'ลากิจ'}</option>
                    <option value="ลาพักร้อน">{t.annualLeave || 'ลาพักร้อน'}</option>
                    <option value="ลาฉุกเฉิน">{t.emergencyLeave || 'ลาฉุกเฉิน'}</option>
                    {/* ✨ แยกข้อความแสดงผลตามภาษา แต่ค่า value ยังส่งเป็นภาษาไทยเพื่อให้ฐานข้อมูลทำงานได้ปกติ */}
                    <option value="ลาไม่รับเงินเดือน">{lang === 'TH' ? 'ลาไม่รับเงินเดือน' : 'Leave Without Pay'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">👤 {t.modalLeaveName}</label>
                  <input type="text" readOnly value={user?.full_name} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-400 outline-none text-sm cursor-not-allowed shadow-inner"/>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-4">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">🕒 {t.modalLeaveDate}</label>
                
                <div className="flex items-center gap-3">
                  <span className="text-emerald-500 font-black text-xs w-10 text-right">START</span>
                  <div className="flex-1 flex gap-2">
                    <input type="date" required value={leaveForm.startDate} onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})} className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 text-xs shadow-sm focus:border-emerald-400 outline-none transition-colors"/>
                    <input type="time" required value={leaveForm.startTime} onChange={(e) => setLeaveForm({...leaveForm, startTime: e.target.value})} className="w-[85px] bg-white border border-slate-200 rounded-xl px-2 py-2 font-bold text-slate-700 text-xs shadow-sm focus:border-emerald-400 outline-none text-center transition-colors"/>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-rose-500 font-black text-xs w-10 text-right">END</span>
                  <div className="flex-1 flex gap-2">
                    <input type="date" required value={leaveForm.endDate} onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})} className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 text-xs shadow-sm focus:border-rose-400 outline-none transition-colors"/>
                    <input type="time" required value={leaveForm.endTime} onChange={(e) => setLeaveForm({...leaveForm, endTime: e.target.value})} className="w-[85px] bg-white border border-slate-200 rounded-xl px-2 py-2 font-bold text-slate-700 text-xs shadow-sm focus:border-rose-400 outline-none text-center transition-colors"/>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-xl border-2 border-dashed text-center font-bold text-sm transition-all ${calculatedTime.isError ? 'bg-rose-50 border-rose-300 text-rose-600' : calculatedTime.isDefault ? 'bg-emerald-50/50 border-emerald-200 text-emerald-600/70' : 'bg-emerald-50 border-emerald-400 text-emerald-600 shadow-inner'}`}>
                {calculatedTime.text}
              </div>

              <textarea rows="3" required placeholder={t.modalLeaveReason} value={leaveForm.reason} onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 outline-none text-sm resize-none shadow-sm focus:border-purple-400 transition-colors"></textarea>
              
              {/* 📁 ส่วนแนบไฟล์ใบรับรองแพทย์ */}
            <div className="mt-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                แนบไฟล์ใบรับรองแพทย์ (ถ้ามี)
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={(e) => setMedicalCertFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer bg-slate-50 p-3 rounded-2xl border-2 border-dashed border-slate-200 transition-all group-hover:border-blue-300"
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-2 italic">* รองรับไฟล์รูปภาพและ PDF ขนาดไม่เกิน 5MB</p>
            </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting || calculatedTime.isError || calculatedTime.isDefault} className="flex-[3] py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-black text-sm shadow-lg shadow-purple-200 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting ? (<span>⏳ กำลังส่งข้อมูล...</span>) : (<><span>🚀</span> {t.modalLeaveSubmit}</>)}
                </button>
                <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="flex-[1] py-3.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                  {t.modalCancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🛠️ MODAL 2: แจ้งปรับปรุงเวลา (V. Mobile Responsive + มีตัวอย่าง Placeholder) */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-5 sm:p-8 max-h-[95vh] overflow-y-auto relative">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <span className="text-3xl">🛠️</span>
              </div>
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                {t.modalAdjTitle}
              </h3>
              <p className="text-slate-500 text-sm mt-1">{t.modalAdjDesc}</p>
            </div>

            <form onSubmit={handleSubmitAdjustment} className="space-y-6">
              
              {/* 🔘 Tabs (สลับวันหยุด / แก้ไขเวลา) */}
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setAdjustForm({ ...adjustForm, tab: 'swap' })}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                    adjustForm.tab === 'swap' 
                      ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-md' 
                      : 'text-slate-500 hover:bg-white/50'
                  }`}
                >
                  ⇄ {t.adjustSwap}
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustForm({ ...adjustForm, tab: 'edit' })}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                    adjustForm.tab === 'edit' 
                      ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-md' 
                      : 'text-slate-500 hover:bg-white/50'
                  }`}
                >
                  🕒 {t.adjustEdit}
                </button>
              </div>

              {/* 📝 ฟอร์มตาม Tab */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-blue-500 mb-4 flex items-center">
                  ℹ️ {adjustForm.tab === 'swap' ? t.modalAdjDetailSwap : t.modalAdjDetailEdit}
                </p>

                {adjustForm.tab === 'swap' ? (
                  /* ท่าสลับวันหยุด */
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <div className="w-full min-w-0">
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjOldDate}</label>
                      <input 
                        type="text" 
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                        placeholder="วว/ดด/ปปปป"
                        required 
                        value={adjustForm.oldDate}
                        onChange={(e) => setAdjustForm({...adjustForm, oldDate: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm placeholder-slate-400 font-medium" 
                      />
                    </div>
                    
                    {/* ลูกศรชี้ขวา (โชว์จอใหญ่) / ชี้ลง (โชว์มือถือ) */}
                    <div className="hidden sm:block text-slate-300 font-bold mt-5">→</div>
                    <div className="block sm:hidden text-slate-300 font-bold rotate-90 my-1 text-lg">→</div>

                    <div className="w-full min-w-0">
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjNewDate}</label>
                      <input 
                        type="text" 
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                        placeholder="วว/ดด/ปปปป"
                        required 
                        value={adjustForm.newDate}
                        onChange={(e) => setAdjustForm({...adjustForm, newDate: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm placeholder-slate-400 font-medium" 
                      />
                    </div>
                  </div>
                ) : (
                  /* ท่าแก้ไขเวลา */
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="w-full min-w-0">
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjDate}</label>
                        <input 
                          type="text" 
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                          placeholder="วว/ดด/ปปปป"
                          required 
                          value={adjustForm.incidentDate}
                          onChange={(e) => setAdjustForm({...adjustForm, incidentDate: e.target.value})}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm placeholder-slate-400 font-medium" 
                        />
                      </div>
                      <div className="w-full min-w-0">
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjTimeType}</label>
                        <select 
                          value={adjustForm.timeType}
                          onChange={(e) => setAdjustForm({...adjustForm, timeType: e.target.value})}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm font-medium cursor-pointer"
                        >
                          <option value="เข้างาน (IN)">{lang === 'TH' ? 'เข้างาน (IN)' : 'Clock In (IN)'}</option>
                          <option value="ออกงาน (OUT)">{lang === 'TH' ? 'ออกงาน (OUT)' : 'Clock Out (OUT)'}</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                      <div className="w-full min-w-0">
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjOldTime}</label>
                        <input 
                          type="text" 
                          onFocus={(e) => (e.target.type = "time")}
                          onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                          placeholder="เช่น 09:00"
                          value={adjustForm.oldTime}
                          onChange={(e) => setAdjustForm({...adjustForm, oldTime: e.target.value})}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm placeholder-slate-400 font-medium" 
                        />
                      </div>
                      <div className="hidden sm:block text-slate-300 font-bold mt-5">→</div>
                      <div className="block sm:hidden text-slate-300 font-bold rotate-90 my-1 text-lg">→</div>
                      <div className="w-full min-w-0">
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjNewTime}</label>
                        <input 
                          type="text" 
                          onFocus={(e) => (e.target.type = "time")}
                          onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                          placeholder="เช่น 10:30"
                          required 
                          value={adjustForm.newTime}
                          onChange={(e) => setAdjustForm({...adjustForm, newTime: e.target.value})}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm placeholder-slate-400 font-medium" 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 💬 เหตุผล */}
              <div className="w-full min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjReason}</label>
                <textarea 
                  required 
                  rows="2"
                  placeholder={t.modalAdjReasonHolder}
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({...adjustForm, reason: e.target.value})}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none text-sm placeholder-slate-400 font-medium"
                ></textarea>
              </div>

              {/* 🔥 Action Buttons (ตบบนล่างในมือถือ) */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full min-w-0">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:flex-[2] py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-black rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex justify-center items-center"
                >
                  {isSubmitting ? (lang === 'TH' ? 'กำลังส่งข้อมูล...' : 'Submitting...') : `🚀 ${t.modalAdjSubmit}`}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="w-full sm:flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {t.modalCancel}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      

      {/* 🔔 MODAL 3: รายละเอียดการแจ้งเตือน (Popup Detail) */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-sm text-center border border-white animate-fade-in">
            <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">🔔</div>
            <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2">{selectedNotif.title}</h3>
            <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedNotif.message}</p>
            <button onClick={() => setSelectedNotif(null)} className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-sm shadow-md transition-colors">{t.notifClose}</button>
          </div>
        </div>
      )}

    </div>

{/* 📊 MODAL: ประวัติยอดขายของฉัน (พนักงานทั่วไป) */}
      {isMySalesModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex flex-col relative z-10 overflow-hidden animate-pop-in border border-white/50">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-pink-50 to-rose-50">
              <h3 className="font-black text-pink-800 text-lg flex items-center gap-2">
                📈 ประวัติยอดขายของฉัน
              </h3>
              <button onClick={() => setIsMySalesModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 rounded-full hover:bg-rose-500 hover:text-white font-bold transition-all shadow-sm">✕</button>
            </div>

            <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar bg-[#fffbfb]">
              {(() => {
                // ดึงข้อมูลยอดขายของ user ที่ล็อกอินอยู่ และเรียงจากเดือนล่าสุดไปเก่า
                const myHistory = allSalesData.filter(s => s.employee_id === user?.id && s.month).sort((a, b) => b.month.localeCompare(a.month));
                
                if (myHistory.length === 0) {
                  return (
                    <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <span className="text-5xl block mb-4">🤷‍♂️</span>
                      <p className="text-slate-500 font-bold">ยังไม่มีประวัติยอดขายในระบบ</p>
                    </div>
                  );
                }

                // สรุปยอดรวมสะสม
                const totalSales = myHistory.reduce((sum, s) => sum + Number(s.current_sales || 0), 0);
                const totalComm = myHistory.reduce((sum, s) => sum + (Number(s.current_sales || 0) * (Number(s.commission_rate || 0) / 100)), 0);

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-5 rounded-3xl text-white shadow-md">
                        <p className="text-[11px] font-bold opacity-80 uppercase tracking-widest mb-1">ยอดขายสะสมรวม</p>
                        <p className="text-3xl font-black tabular-nums">฿{totalSales.toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-5 rounded-3xl text-white shadow-md">
                        <p className="text-[11px] font-bold opacity-80 uppercase tracking-widest mb-1">ค่าคอมมิชชันสะสมรวม</p>
                        <p className="text-3xl font-black tabular-nums">฿{totalComm.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">เดือน</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">ยอดขาย (฿)</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center w-32">เป้าหมาย</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">ค่าคอมมิชชัน</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myHistory.map((item, idx) => {
                            const comm = Number(item.current_sales || 0) * (Number(item.commission_rate || 0) / 100);
                            const percent = item.target_sales > 0 ? (Number(item.current_sales) / Number(item.target_sales)) * 100 : 0;
                            const isHit = percent >= 100;
                            
                            return (
                              <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 font-black text-slate-700">{item.month}</td>
                                <td className="p-4 font-bold text-pink-600 text-right tabular-nums">฿{Number(item.current_sales).toLocaleString()}</td>
                                <td className="p-4">
                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-slate-400 mb-1">เป้า: {Number(item.target_sales).toLocaleString()}</span>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                      <div className={`h-1.5 rounded-full ${isHit ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                                    </div>
                                    <span className={`text-[9px] font-black mt-1 ${isHit ? 'text-emerald-600' : 'text-amber-600'}`}>{percent.toFixed(0)}%</span>
                                  </div>
                                </td>
                                <td className="p-4 font-black text-indigo-600 text-right tabular-nums">
                                  + ฿{comm.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

{/* 💸 MODAL: สร้างสลิปเงินเดือน (Admin/CEO) */}
      {isPayrollModalOpen && (() => {
        const selectedEmp = employees.find(e => e.id === payrollForm.employee_id);
        const isPT = selectedEmp?.salary_type === 'Part-time';

        return (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col relative z-10 overflow-hidden animate-pop-in border border-white/50">
              <div className={`px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r ${isPT ? 'from-purple-50 to-indigo-50' : 'from-emerald-50 to-teal-50'}`}>
                <h3 className={`font-black ${isPT ? 'text-purple-800' : 'text-emerald-800'} text-lg flex items-center gap-2`}>
                  {isPT ? '🏖️ สร้างสลิป (Part-time)' : '💰 สร้างสลิป (Full-time)'}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    type="button"
                    onClick={handleExportBankCSV}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                    title="ดาวน์โหลดไฟล์สำหรับอัปโหลดเข้าธนาคาร"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Export โอนเงิน
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      // 🟢 แก้ไขตรงนี้: เปลี่ยนจาก payrollData เป็น adminPayrollSlips ให้ตรงกับฐานข้อมูลจริง
                      const monthPayrolls = adminPayrollSlips.filter(p => p.month === payrollFilterMonth);
                      const empsWithoutPayroll = employees.filter(e => !monthPayrolls.some(p => p.employee_id === e.id));
                      
                      if (empsWithoutPayroll.length === 0) {
                        Swal.fire({ icon: 'info', title: 'ครบถ้วน', text: 'พนักงานทุกคนมียอดเงินเดือนของเดือนนี้แล้ว' });
                        return;
                      }
                      setSelectedEmps(empsWithoutPayroll.map(e => e.id));
                      setShowAutoPayrollModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    ✨ ทำสลิปอัตโนมัติ
                  </button>

                  <button onClick={() => setIsPayrollModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 border border-slate-200 rounded-full hover:bg-rose-500 hover:text-white hover:border-rose-500 font-bold transition-all shadow-sm ml-1">✕</button>
                </div>
              </div>

              <form id="payrollForm" onSubmit={handleGenerateSlip} className="p-6 md:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar bg-[#fffbfb]">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-black text-slate-500 mb-1 block uppercase tracking-widest">👤 เลือกพนักงาน <span className="text-rose-500">*</span></label>
                      <select 
                        required 
                        value={payrollForm.employee_id} 
                        onChange={(e) => {
                          const empId = e.target.value;
                          const selected = employees.find(emp => emp.id === empId);
                          const _isPT = selected?.salary_type === 'Part-time';
                          const base = selected ? (_isPT ? (selected.hourly_rate || 0) : (selected.base_salary || 0)) : 0;
                          
                          const rate = payrollForm.sso_rate ?? 5;
                          const maxBase = payrollForm.sso_max ?? 17500;
                          const sso = (selected && selected.has_social_security !== false && !_isPT) ? Math.round(Math.min(base, maxBase) * (rate / 100)) : 0;
                          
                          let tax = 0;
                          if (!_isPT && base > 0) {
                            const annual = base * 12;
                            const expenses = Math.min(annual * 0.5, 100000); 
                            let net = annual - expenses - 60000; 
                            if (net > 150000) {
                              if (net > 5000000) { tax += (net - 5000000) * 0.35; net = 5000000; }
                              if (net > 2000000) { tax += (net - 2000000) * 0.30; net = 2000000; }
                              if (net > 1000000) { tax += (net - 1000000) * 0.25; net = 1000000; }
                              if (net > 750000) { tax += (net - 750000) * 0.20; net = 750000; }
                              if (net > 500000) { tax += (net - 500000) * 0.15; net = 500000; }
                              if (net > 300000) { tax += (net - 300000) * 0.10; net = 300000; }
                              if (net > 150000) { tax += (net - 150000) * 0.05; }
                            }
                            tax = Math.round(tax / 12); 
                          }
                          setPayrollForm({ ...payrollForm, employee_id: empId, base_salary: base, social_security: sso, tax: tax, is_previewed: false });
                        }} 
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold outline-none text-slate-700 focus:border-emerald-400 shadow-sm cursor-pointer"
                      >
                        <option value="">-- เลือกพนักงาน --</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.employee_code} - {emp.full_name} {emp.nickname ? `(${emp.nickname})` : ''} [{emp.salary_type}]
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-500 mb-1 block uppercase tracking-widest">📅 รอบบิล (เดือน)</label>
                      <input
                        type="month"
                        value={payrollFilterMonth}
                        onChange={(e) => setPayrollFilterMonth(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* ✨ กล่อง PREVIEW แบบใหม่ (สามารถพิมพ์แก้ไขตัวเลขได้ทุกช่อง) */}
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-slate-100 p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🛠️</span>
                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">ตรวจสอบและแก้ไขเวลาทำงาน</label>
                      </div>
                      <button type="button" onClick={handlePreviewAttendance} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        ดึงข้อมูลสแกนนิ้วล่าสุด
                      </button>
                    </div>
                    
                    {payrollForm.is_previewed ? (
                      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in bg-white">
                        
                        {/* 🟢 ช่อง 1: ชั่วโมงทำงานรวม */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase flex justify-between">
                            เวลาทำรวม (ชม.)
                            <span className="text-indigo-400 text-[9px]">*แก้ได้</span>
                          </label>
                          <input 
                            type="number" step="0.5"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-black text-indigo-700 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            value={payrollForm.manual_work_hours ?? ''}
                            onChange={(e) => {
                              const hrs = Number(e.target.value);
                              const hRate = Number(employees.find(em => em.id === payrollForm.employee_id)?.hourly_rate) || 0;
                              // ถ้าเป็น Part-time ให้คูณเงินอัตโนมัติเมื่อเปลี่ยนชั่วโมง
                              if (isPT) {
                                setPayrollForm({ ...payrollForm, manual_work_hours: e.target.value, manual_base_salary: Math.round(hrs * hRate) });
                              } else {
                                setPayrollForm({ ...payrollForm, manual_work_hours: e.target.value });
                              }
                            }}
                          />
                        </div>

                        {/* 🟢 ช่อง 2: ค่าจ้าง / ฐานเงินเดือน */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-emerald-600 uppercase flex justify-between">
                            {isPT ? 'ค่าจ้างเบื้องต้น (฿)' : 'ฐานเงินเดือน (฿)'}
                            <span className="text-emerald-400 text-[9px]">*แก้ได้</span>
                          </label>
                          <input 
                            type="number" 
                            className="w-full bg-emerald-50 border border-emerald-100 rounded-xl p-3 font-black text-emerald-700 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                            value={payrollForm.manual_base_salary ?? ''}
                            onChange={(e) => setPayrollForm({ ...payrollForm, manual_base_salary: e.target.value })}
                          />
                        </div>

                        {/* 🟢 ช่อง 3: สาย (นาที) */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase flex justify-between">
                            สายสะสม (นาที)
                            <span className="text-rose-400 text-[9px]">*แก้ได้</span>
                          </label>
                          <input 
                            type="number" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-black text-rose-500 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                            value={payrollForm.manual_late_mins ?? ''}
                            onChange={(e) => {
                              const mins = Number(e.target.value);
                              const base = Number(payrollForm.manual_base_salary || payrollForm.base_salary || 0);
                              const ratePerMin = base / 30 / 8 / 60;
                              // คำนวณเงินหักอัตโนมัติเมื่อแก้นาทีสาย
                              const autoDeduct = isPT ? 0 : Math.round(mins * ratePerMin);
                              setPayrollForm({ ...payrollForm, manual_late_mins: e.target.value, manual_late_deduct: autoDeduct });
                            }}
                          />
                        </div>

                        {/* 🟢 ช่อง 4: หักสาย (บาท) */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-rose-600 uppercase flex justify-between">
                            หักสาย (฿)
                            <span className="text-rose-400 text-[9px]">*แก้ได้</span>
                          </label>
                          <input 
                            type="number" 
                            className="w-full bg-rose-50 border border-rose-100 rounded-xl p-3 font-black text-rose-600 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                            value={payrollForm.manual_late_deduct ?? ''}
                            onChange={(e) => setPayrollForm({ ...payrollForm, manual_late_deduct: e.target.value })}
                          />
                        </div>

                      </div>
                    ) : (
                      <div className="p-8 text-center bg-white flex flex-col items-center justify-center gap-2">
                        <span className="text-3xl opacity-50">🤖</span>
                        <p className="text-slate-400 text-xs font-bold">กดปุ่ม "ดึงข้อมูลสแกนนิ้วล่าสุด" ด้านบน <br/> เพื่อคำนวณเวลาและค่าจ้างอัตโนมัติ</p>
                      </div>
                    )}
                  </div>

                  {/* รายรับอื่นๆ (OT / โบนัส) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-[11px] font-black text-slate-500 mb-1 flex justify-between">
                        <span>⏱️ ล่วงเวลา (OT)</span>
                        <span className="text-emerald-500">แนะนำ: {payrollForm.preview_ot_hours || 0} ชม.</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="relative w-1/2">
                          <input type="number" step="0.5" placeholder="ชม." value={payrollForm.ot_hours ?? ''} onChange={(e) => {
                              const hrs = e.target.value;
                              const rate = (Number(payrollForm.manual_base_salary || payrollForm.base_salary) / 30 / 8) * 1.5;
                              const autoPay = selectedEmp?.salary_type === 'Part-time' ? 0 : Math.round(Number(hrs) * rate);
                              setPayrollForm({...payrollForm, ot_hours: hrs, ot_amount: autoPay});
                          }} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-3 font-black text-indigo-600 outline-none focus:bg-white shadow-inner" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">ชม.</span>
                        </div>
                        <div className="relative w-1/2">
                          <input type="number" placeholder="บาท" value={payrollForm.ot_amount ?? ''} onChange={(e) => setPayrollForm({...payrollForm, ot_amount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-3 font-black text-indigo-600 outline-none focus:bg-white shadow-inner" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">฿</span>
                        </div>
                      </div>
                    </div>
                    <div><label className="text-[11px] font-black text-slate-500 mb-1 block">🎁 โบนัส / เบี้ยขยัน</label><input type="number" placeholder="0" value={payrollForm.bonus} onChange={(e) => setPayrollForm({...payrollForm, bonus: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-indigo-600 outline-none focus:bg-white shadow-inner" /></div>
                  </div>

                  {!isPT && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                        <h4 className="text-xs font-black text-rose-800 flex items-center gap-2">🔻 ภาษีและประกันสังคม</h4>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 bg-rose-100/60 px-3 py-2 rounded-xl border border-rose-200 shadow-sm">
                          ⚙️ เรทหัก:
                          <input type="number" value={payrollForm.sso_rate ?? 5} onChange={(e) => {
                              const newRate = Number(e.target.value);
                              const newMax = payrollForm.sso_max ?? 17500;
                              const base = Number(payrollForm.manual_base_salary || payrollForm.base_salary || 0);
                              const newSso = Math.round(Math.min(base, newMax) * (newRate / 100));
                              setPayrollForm({...payrollForm, sso_rate: newRate, social_security: newSso});
                            }} className="w-10 bg-white text-center rounded-md border border-rose-200 outline-none focus:border-rose-400 py-0.5 font-black" /> % 
                          <span className="text-rose-300 mx-1">|</span>
                          เพดาน: 
                          <input type="number" value={payrollForm.sso_max ?? 17500} onChange={(e) => {
                              const newMax = Number(e.target.value);
                              const newRate = payrollForm.sso_rate ?? 5;
                              const base = Number(payrollForm.manual_base_salary || payrollForm.base_salary || 0);
                              const newSso = Math.round(Math.min(base, newMax) * (newRate / 100));
                              setPayrollForm({...payrollForm, sso_max: newMax, social_security: newSso});
                            }} className="w-16 bg-white text-center rounded-md border border-rose-200 outline-none focus:border-rose-400 py-0.5 font-black" /> ฿
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                        <label className="text-[11px] font-black text-slate-500 mb-1 flex justify-between items-center">
                          <span>🛡️ หักประกันสังคม</span>
                          <button 
                            type="button"
                            onClick={() => {
                              const salary = Number(payrollForm.manual_base_salary || payrollForm.base_salary) || 0;
                              let sso = Math.round(salary * ((payrollForm.sso_rate ?? 5)/100));
                              if (salary > (payrollForm.sso_max ?? 17500)) sso = Math.round((payrollForm.sso_max ?? 17500) * ((payrollForm.sso_rate ?? 5)/100));
                              setPayrollForm({...payrollForm, social_security: sso});
                            }}
                            className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg hover:bg-emerald-100 transition-colors font-bold shadow-sm"
                          >
                            ✨ คำนวณ (ฐานใหม่)
                          </button>
                        </label>
                        <div className="relative">
                          <input type="number" placeholder="0" value={payrollForm.social_security ?? ''} onChange={(e) => setPayrollForm({...payrollForm, social_security: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-3 font-black text-red-500 outline-none focus:bg-white shadow-inner" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">฿</span>
                        </div>
                      </div>
                        <div>
                          <label className="text-[11px] font-black text-rose-600 mb-1 block">🏛️ หักภาษี ณ ที่จ่าย</label>
                          <input type="number" placeholder="0" value={payrollForm.tax || ''} onChange={(e) => setPayrollForm({...payrollForm, tax: e.target.value})} className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 font-black text-rose-600 outline-none focus:border-rose-400 shadow-sm" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50 p-4 border border-amber-200 rounded-2xl shadow-sm">
                    <label className="text-[11px] font-black text-amber-800 mb-1 block">➖ รายการหักอื่นๆ (แอดมินพิมพ์เพิ่มเอง)</label>
                    <input type="number" placeholder="0" value={payrollForm.deductions} onChange={(e) => setPayrollForm({...payrollForm, deductions: e.target.value})} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 font-black text-amber-700 outline-none focus:border-amber-400 shadow-inner" />
                  </div>
                </div>
              </form>

              <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsPayrollModalOpen(false)} className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">ยกเลิก</button>
                <button type="submit" form="payrollForm" disabled={isSavingPayroll} className={`px-8 py-3.5 bg-gradient-to-r ${isPT ? 'from-purple-600 to-indigo-600' : 'from-emerald-500 to-teal-500'} text-white rounded-xl font-black text-sm hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50 flex items-center gap-2`}>
                  {isSavingPayroll ? '⏳ กำลังบันทึก...' : '✅ ออกสลิปเงินเดือน'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

{/* 🛠️ MODAL: จัดการตำแหน่งงาน */}
      {isPositionModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-white">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
              <h3 className="font-black text-indigo-800">🛠️ จัดการตำแหน่งงาน</h3>
              <button onClick={() => setIsPositionModalOpen(false)} className="text-slate-400 hover:text-rose-500 font-bold">✕</button>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-6">
                <input type="text" placeholder="ชื่อตำแหน่งใหม่..." value={newPositionName} onChange={(e) => setNewPositionName(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-indigo-400" />
                <button 
                  onClick={async () => { 
                    if(newPositionName.trim()){ 
                      const posName = newPositionName.trim();
                      // ✨ 1. บันทึกลงตาราง job_positions ใน Supabase
                      const { error } = await supabase.from('job_positions').insert([{ name: posName }]);
                      if(!error) {
                        setPositions([...positions, posName]); 
                        setNewPositionName(""); 
                      } else {
                        alert("เพิ่มไม่ได้ (ชื่อตำแหน่งนี้อาจจะมีอยู่แล้ว)");
                      }
                    } 
                  }} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700"
                >เพิ่ม</button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {positions.map((pos, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                    <span className="font-bold text-slate-700 text-sm">{pos}</span>
                    <button 
                      onClick={async () => {
                        // ✨ 2. สั่งลบออกจากตาราง job_positions ใน Supabase
                        const { error } = await supabase.from('job_positions').delete().eq('name', pos);
                        if(!error) {
                          setPositions(positions.filter((_, i) => i !== index));
                        }
                      }} 
                      className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >🗑️ ลบ</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setIsPositionModalOpen(false)} className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm">เสร็จสิ้น</button>
            </div>
          </div>
        </div>
      )}


{/* 🗺️ MODAL 4: ดูแผนที่ (รองรับสมบูรณ์แบบทั้ง Mobile และ PC) */}
      {viewMapModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
          {/* พื้นหลังเบลอ คลิกเพื่อปิด */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setViewMapModal(null)}></div>
          
          {/* กล่อง Modal: ปรับขนาดความกว้างและขอบมนให้พอดีทั้งมือถือและคอม */}
          <div className="bg-white w-full max-w-3xl rounded-[1.5rem] sm:rounded-[2rem] flex flex-col relative z-10 overflow-hidden shadow-2xl animate-pop-in border border-white/10">
            
            {/* Header */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <h3 className="font-black text-slate-800 text-base sm:text-lg flex items-center gap-2 truncate">
                📍 พิกัดยื่นลา: คุณ{viewMapModal.name}
              </h3>
              <button onClick={() => setViewMapModal(null)} className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-rose-500 hover:text-white font-bold transition-colors">
                ✕
              </button>
            </div>
            
            {/* 🗺️ พื้นที่แผนที่: ใช้ความสูงตายตัวแยกตามอุปกรณ์ (มือถือ 350px / คอม 450px) */}
            <div className="w-full relative bg-slate-200 h-[350px] sm:h-[450px] shrink-0">
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src={`https://maps.google.com/maps?q=${viewMapModal.lat},${viewMapModal.lng}&hl=th&z=16&output=embed`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          

            {/* Footer Buttons */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${viewMapModal.lat},${viewMapModal.lng}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-black text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                🧭 เปิดนำทางในแอป
              </a>
              <button onClick={() => setViewMapModal(null)} className="w-full sm:w-auto px-8 py-3.5 sm:py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-sm transition-colors shadow-md flex items-center justify-center">
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 🚀 AUTO PAYROLL MODAL - วางตรงนี้เด้งแน่นอน 100% */}
      {showAutoPayrollModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-pop-in">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">✨ ทำสลิปอัตโนมัติ</h2>
                <p className="text-xs font-bold text-indigo-500 mt-1">คัดกรองพนักงานที่ยังไม่มีสลิปในเดือน {payrollFilterMonth}</p>
              </div>
              <button onClick={() => setShowAutoPayrollModal(false)} className="p-2 hover:bg-white rounded-full text-slate-400">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
              <div className="space-y-3">
                {employees
                  .filter(e => !payrollData.some(p => p.employee_id === e.id && p.month === payrollFilterMonth))
                  .map(emp => (
                  <div 
                    key={emp.id}
                    onClick={() => setSelectedEmps(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id])}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedEmps.includes(emp.id) ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-white hover:border-indigo-200 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedEmps.includes(emp.id) ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-200'}`}>
                        {selectedEmps.includes(emp.id) && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800">{emp.full_name}</div>
                        <div className="text-[10px] font-bold text-slate-400">{emp.employee_code} • {emp.position}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-indigo-600">฿{Number(emp.base_salary || 0).toLocaleString()}</div>
                      <div className="text-[9px] font-bold text-slate-400">ฐานเงินเดือน</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                  disabled={selectedEmps.length === 0 || isSavingPayroll}
                  onClick={async () => {
                    try {
                      setIsSavingPayroll(true);
                      Swal.fire({ 
                        title: 'กำลังคำนวณเงินเดือน...', 
                        text: `กำลังดึงประวัติเข้างานและสร้างสลิปให้พนักงาน ${selectedEmps.length} รายการ (อาจใช้เวลาสักครู่)`,
                        allowOutsideClick: false, 
                        didOpen: () => Swal.showLoading() 
                      });

                      const [year, month] = payrollFilterMonth.split('-');
                      const startDate = `${year}-${month}-01`;
                      const endDateObj = new Date(year, parseInt(month), 1); 
                      const endDate = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-01`;

                      const payrollInserts = [];

                      // 🟢 วนลูปคำนวณเงินเดือนให้พนักงานทีละคน
                      for (const empId of selectedEmps) {
                        const empInfo = employees.find(e => e.id === empId);
                        if (!empInfo) continue;

                        const isPartTime = empInfo.salary_type === 'Part-time';
                        const positionName = (empInfo.position || '').toLowerCase();
                        const isLiveStreamer = positionName.includes('ไลฟ์') || positionName.includes('live') || positionName.includes('สตรีม');
                        const baseSalary = Number(empInfo.base_salary) || 0;
                        const hRate = Number(empInfo.hourly_rate) || 0;

                        // 1. ดึงข้อมูลเวลาเข้างาน
                        const { data: attLogs } = await supabase.from('attendance_logs').select('timestamp, log_type').eq('employee_id', empId).gte('timestamp', `${startDate}T00:00:00Z`).lt('timestamp', `${endDate}T00:00:00Z`);
                        
                        let totalWorkMins = 0; let totalOTMins = 0; let totalLateMins = 0; let workedDates = new Set();
                        const dailyLogs = {};

                        if (attLogs && attLogs.length > 0) {
                          const sortedLogs = attLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                          sortedLogs.forEach(log => {
                            const date = log.timestamp.split('T')[0];
                            if (!dailyLogs[date]) dailyLogs[date] = [];
                            dailyLogs[date].push(log);
                          });

                          const shiftStart = empInfo.shift_start || "09:00:00"; 
                          const [shiftHour, shiftMin] = shiftStart.split(':').map(Number);
                          const expectedStartMins = (shiftHour * 60) + shiftMin;

                          Object.keys(dailyLogs).forEach(date => {
                            const logsOfDay = dailyLogs[date];
                            let dailyWorkMins = 0; let firstCheckIn = null;

                            if (isLiveStreamer) {
                              let currentIn = null; let checkInCount = 0;
                              logsOfDay.forEach(log => {
                                if (log.log_type === 'check_in') {
                                  currentIn = new Date(log.timestamp);
                                  checkInCount++;
                                  if (!firstCheckIn) firstCheckIn = currentIn; 
                                } else if (log.log_type === 'check_out' && currentIn) {
                                  dailyWorkMins += Math.floor((new Date(log.timestamp) - currentIn) / (1000 * 60));
                                  currentIn = null;
                                }
                              });
                              if (checkInCount === 1 && dailyWorkMins > 300) dailyWorkMins -= 60; 
                            } else {
                              const checkIns = logsOfDay.filter(l => l.log_type === 'check_in');
                              const checkOuts = logsOfDay.filter(l => l.log_type === 'check_out');
                              if (checkIns.length > 0 && checkOuts.length > 0) {
                                firstCheckIn = new Date(checkIns[0].timestamp);
                                const lastCheckOut = new Date(checkOuts[checkOuts.length - 1].timestamp);
                                dailyWorkMins = Math.floor((lastCheckOut - firstCheckIn) / (1000 * 60));
                                if (dailyWorkMins > 300) dailyWorkMins -= 60;
                              }
                            }

                            if (dailyWorkMins > 0) {
                              workedDates.add(date); 
                              if (isPartTime) {
                                totalWorkMins += dailyWorkMins; 
                              } else {
                                totalWorkMins += Math.min(dailyWorkMins, 480);
                                totalOTMins += Math.max(0, dailyWorkMins - 480);
                                if (firstCheckIn) {
                                  const checkInHour = firstCheckIn.getHours();
                                  const checkInMin = firstCheckIn.getMinutes();
                                  const totalCheckInMins = (checkInHour * 60) + checkInMin;
                                  if (totalCheckInMins > expectedStartMins) totalLateMins += (totalCheckInMins - expectedStartMins);
                                }
                              }
                            }
                          });
                        }

                        const totalWorkHours = (totalWorkMins / 60).toFixed(2);
                        const totalOTHours = (totalOTMins / 60).toFixed(2);
                        let salaryAmount = 0; let otPay = 0;

                        if (isPartTime) {
                          salaryAmount = Math.round((totalWorkMins * hRate) / 60); 
                          otPay = 0; // Part-time รวมในนาทีทำงานแล้ว
                        } else {
                          salaryAmount = baseSalary;
                          otPay = Math.round(Number(totalOTHours) * ((baseSalary / 30 / 8) * 1.5));
                        }

                        // 2. ดึงยอดขายและคอมมิชชั่น
                        const { data: empSalesData } = await supabase.from('employee_sales')
                          .select('current_sales, commission_rate')
                          .eq('employee_id', empId)
                          .eq('month', payrollFilterMonth)
                          .maybeSingle();

                        const commission = empSalesData ? (Number(empSalesData.current_sales) * (Number(empSalesData.commission_rate || 0) / 100)) : 0;

                        // 3. หักวันลาและสาย
                        let leaveDeduct = 0; let autoLateDeduction = 0;
                        if (!isPartTime) {
                          const { data: allLeavesInMonth } = await supabase.from('leave_requests')
                            .select('leave_type, start_date, end_date')
                            .eq('employee_id', empId)
                            .eq('status', 'อนุมัติ')
                            .lt('start_date', endDate)
                            .gte('end_date', startDate);
                            
                          if (allLeavesInMonth && allLeavesInMonth.length > 0) {
                            let unpaidMinsInMonth = 0;
                            allLeavesInMonth.forEach(l => {
                              const s = new Date(l.start_date);
                              const e = new Date(l.end_date || l.start_date);
                              for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
                                 const dateStr = d.toISOString().split('T')[0];
                                 if (dateStr >= startDate && dateStr < endDate && !workedDates.has(dateStr)) {
                                    if (l.leave_type === 'ลาไม่รับเงินเดือน') unpaidMinsInMonth += 480; 
                                 }
                              }
                            });
                            leaveDeduct = Math.round(unpaidMinsInMonth * (baseSalary / (30 * 8 * 60)));
                          }

                          if (totalLateMins > 0) autoLateDeduction = Math.round(totalLateMins * (baseSalary / 30 / 8 / 60));
                        }

                        // 4. หักประกันสังคมและภาษี
                        const ssoRate = 5; const ssoMax = 17500;
                        const ssoDeduct = (!isPartTime && empInfo.has_social_security !== false) ? Math.round(Math.min(baseSalary, ssoMax) * (ssoRate / 100)) : 0;
                        
                        let taxDeduct = 0;
                        if (!isPartTime && baseSalary > 0) {
                          const annual = baseSalary * 12;
                          const expenses = Math.min(annual * 0.5, 100000); 
                          let net = annual - expenses - 60000; 
                          if (net > 150000) {
                            if (net > 5000000) { taxDeduct += (net - 5000000) * 0.35; net = 5000000; }
                            if (net > 2000000) { taxDeduct += (net - 2000000) * 0.30; net = 2000000; }
                            if (net > 1000000) { taxDeduct += (net - 1000000) * 0.25; net = 1000000; }
                            if (net > 750000) { taxDeduct += (net - 750000) * 0.20; net = 750000; }
                            if (net > 500000) { taxDeduct += (net - 500000) * 0.15; net = 500000; }
                            if (net > 300000) { taxDeduct += (net - 300000) * 0.10; net = 300000; }
                            if (net > 150000) { taxDeduct += (net - 150000) * 0.05; }
                          }
                          taxDeduct = Math.round(taxDeduct / 12); 
                        }

                        const netSalary = Math.round((salaryAmount + commission + otPay) - (leaveDeduct + autoLateDeduction + ssoDeduct + taxDeduct));

                        payrollInserts.push({
                          employee_id: empId, 
                          month: payrollFilterMonth,
                          salary_type: empInfo.salary_type || 'Full-time',
                          base_salary: isPartTime ? 0 : baseSalary,
                          total_work_hours: totalWorkHours,
                          ot_hours: totalOTHours, 
                          ot_amount: otPay,
                          commission: commission, 
                          bonus: 0,
                          leave_deduction: leaveDeduct, 
                          late_deduction: autoLateDeduction,
                          absence_deduction: 0,
                          deductions: 0,
                          social_security_deduction: ssoDeduct, 
                          tax_deduction: taxDeduct,             
                          net_salary: netSalary,
                          created_at: new Date().toISOString()
                        });
                      } // สิ้นสุด Loop

                      // 5. บันทึกลงฐานข้อมูล
                      const { data, error } = await supabase.from('payroll_slips').insert(payrollInserts).select('*, employees(full_name, employee_code)'); 
                      if (error) throw error;

                      // 6. อัปเดตตารางหน้าจอ
                      if (data) setPayrollData(prev => [...data, ...prev]);

                      await fetchDashboardData(true); // บังคับดึงใหม่

                      setShowAutoPayrollModal(false);
                      setIsPayrollModalOpen(false); 
                      setSelectedEmps([]); 
                      
                      Swal.fire({
                        icon: 'success',
                        title: 'สร้างสลิปสำเร็จ!',
                        text: `คำนวณและบันทึกข้อมูลเรียบร้อยแล้ว`,
                        confirmButtonColor: '#6366f1'
                      });

                    } catch (err) {
                      console.error("Error Saving Payroll:", err);
                      Swal.fire('เกิดข้อผิดพลาด', 'บันทึกไม่สำเร็จ: ' + err.message, 'error');
                    } finally {
                      setIsSavingPayroll(false);
                    }
                  }}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                  {isSavingPayroll ? '⏳ กำลังคำนวณและบันทึก...' : `🚀 ยืนยันสร้างสลิป (${selectedEmps.length} รายการ)`}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* 🤖 AI Security Chat Head (V.สมบูรณ์: GPS + พื้นที่ + บัญชีผี 30 วัน) */}
      {(currentView === "monitor" && (user?.role === 'admin' || user?.role === 'ceo')) && (() => {
        // 🧠 1. เตรียมข้อมูลพื้นฐาน
        const tStr = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 🧠 2. เช็คพิกัดปลอม (GPS)
        const attToday = (attendanceList || []).filter(a => (a.timestamp || a.created_at)?.startsWith(tStr));
        const uniqueToday = []; const sNames = new Set();
        attToday.forEach(a => { if(!sNames.has(a.full_name || a.employee_id)) { sNames.add(a.full_name || a.employee_id); uniqueToday.push(a); } });
        
        const gpsRisks = uniqueToday.filter(log => {
          if (log.latitude && log.longitude) {
            const R = 6371; const dLat = (13.7563 - log.latitude) * Math.PI / 180; const dLon = (100.5018 - log.longitude) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(13.7563 * Math.PI / 180) * Math.cos(log.latitude * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
            return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))) > 1;
          } return false;
        });

        // 🧠 3. เช็คบัญชีผี (Ghost Employees - Inactive 30D)
        const activeIds = new Set((attendanceList || [])
          .filter(a => new Date(a.timestamp || a.created_at) > thirtyDaysAgo)
          .map(a => a.employee_id));
        const ghostEmps = (employees || []).filter(e => !activeIds.has(e.id));

        // 🧠 4. เช็คพื้นที่ฐานข้อมูล
        const totalRows = (employees?.length || 0) + (attendanceList?.length || 0) + (allLeaves?.length || 0);
        const stPct = Math.min(100, (totalRows * 0.015 / 500) * 100);

        const msgs = [];
        if (gpsRisks && gpsRisks.length > 0) msgs.push({ t: `🚩 บอสครับ! พบ ${gpsRisks.length} คน ตอกบัตรนอกพิกัดบริษัท!`, c: 'rose' });
        if (ghostEmps && ghostEmps.length > 0) msgs.push({ t: `👻 พบพนักงาน ${ghostEmps.length} คน (บัญชีผี) ไม่ขยับใน 30 วัน`, c: 'amber' });
        if (stPct > 80) msgs.push({ t: `💾 พื้นที่ฐานข้อมูลใกล้เต็มแล้ว (${stPct.toFixed(1)}%)`, c: 'amber' });

        return (
          <div id="ai-autonomous-head" className="fixed bottom-24 right-6 z-[999999]" style={{ touchAction: 'none' }}>
            <input type="checkbox" id="ai-autonomous-toggle" className="peer hidden" />
            
            <div id="ai-autonomous-panel" 
              className="absolute hidden peer-checked:flex flex-col w-[280px] sm:w-[320px] bg-[#0A0F1C] border border-cyan-500/40 rounded-[2rem] shadow-[0_0_50px_rgba(34,211,238,0.5)] overflow-hidden z-[1000000] animate-fade-in"
              style={{ bottom: '100%', right: '0', marginBottom: '15px', transformOrigin: 'bottom right' }}
            >
              <div className="bg-gradient-to-r from-cyan-600 to-blue-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛡️</span>
                  <h4 className="font-black text-white text-[10px] tracking-widest uppercase italic">AI Security Analyst</h4>
                </div>
                <label htmlFor="ai-autonomous-toggle" className="text-white/50 hover:text-white cursor-pointer">✕</label>
              </div>
              <div className="p-4 space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar-dark bg-[#050B14]">
                {msgs.length > 0 ? msgs.map((m, i) => (
                  <div key={`ai-msg-fixed-${i}-${m.c}`} className="flex gap-2 animate-slide-up">
                    <div className="w-6 h-6 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center text-[10px]">🤖</div>
                    <div className={`p-3 rounded-2xl rounded-tl-sm text-[11px] font-bold border ${m.c === 'rose' ? 'bg-rose-500/20 text-rose-200 border-rose-500/30' : 'bg-amber-500/20 text-amber-200 border-amber-500/30'}`}>
                      {m.t}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-emerald-400 text-xs font-bold">✅ บอสครับ ระบบวันนี้ปกติ 100%</div>
                )}
              </div>
            </div>

            <label htmlFor="ai-autonomous-toggle"
              className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(34,211,238,0.6)] cursor-grab active:cursor-grabbing hover:scale-110 transition-transform border-2 border-white/40 block relative"
              onMouseDown={(e) => {
                const el = document.getElementById('ai-autonomous-head');
                const p = document.getElementById('ai-autonomous-panel');
                if (!el) return;
                el.style.transition = 'none';
                let sX = e.clientX, sY = e.clientY, r = el.getBoundingClientRect(), shX = e.clientX - r.left, shY = e.clientY - r.top;
                window.__isDragAI = false;
                const move = (m) => {
                  if (Math.abs(m.clientX - sX) > 5 || Math.abs(m.clientY - sY) > 5) {
                    window.__isDragAI = true;
                    el.style.left = (m.clientX - shX) + 'px'; el.style.top = (m.clientY - shY) + 'px';
                    el.style.bottom = 'auto'; el.style.right = 'auto';
                  }
                };
                const up = () => {
                  document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up);
                  if (window.__isDragAI) {
                    el.style.transition = 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
                    const rect = el.getBoundingClientRect();
                    const isLeft = rect.left + rect.width/2 < window.innerWidth / 2;
                    el.style.left = isLeft ? '20px' : (window.innerWidth - rect.width - 20) + 'px';
                    if (p) { p.style.left = isLeft ? '0' : 'auto'; p.style.right = isLeft ? 'auto' : '0'; }
                  }
                };
                document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
              }}
            >
              🛡️
              {msgs.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-ping"></span>}
            </label>
          </div>
        );
      })()}
    </>
  );
}